import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DatePickerInput } from '../../components/DatePickerInput';
import { MultiSelect } from '../../components/MultiSelect';
import { ProcessMetrics } from '../../components/ProcessMetrics';
import { ControlCharts } from '../../components/ControlCharts';
import { DistributionChart } from '../../components/DistributionChart';
import { HistogramChart } from '../../components/HistogramChart';
import { fetchShiftData, fetchMaterialList, fetchOperationList, fetchGuageList, fetchInspectionData } from '../../api/spcApi';
import { Search, Filter } from 'lucide-react-native';
import '@babel/runtime/helpers/interopRequireDefault';

interface ShiftData {
  ShiftId: number;
  ShiftName: string;
}

interface MaterialData {
  MaterialCode: string;
  MaterialName: string;
}

interface OperationData {
  OperationCode: string;
  OperationName: string;
}

interface GuageData {
  GuageCode: string;
  GuageName: string;
}

interface InspectionData {
  ActualSpecification: string;
  FromSpecification: string;
  ToSpecification: string;
  ShiftCode: number;
  TrnDate: string;
}

interface ProcessMetricsProps {
  metrics: {
    xBar: number;
    stdDevOverall: number;
    stdDevWithin: number;
    movingRange: number;
    cp: number;
    cpkUpper: number;
    cpkLower: number;
    cpk: number;
    pp: number;
    ppu: number;
    ppl: number;
    ppk: number;
    lsl: string;
    usl: string;
  };
}

export default function AnalysisScreen() {
  const [selectedShifts, setSelectedShifts] = useState<number[]>([]);
  const [material, setMaterial] = useState('');
  const [operation, setOperation] = useState('');
  const [gauge, setGauge] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distributionBins, setDistributionBins] = useState(5);

  const [shifts, setShifts] = useState<ShiftData[]>([]);
  const [materials, setMaterials] = useState<MaterialData[]>([]);
  const [operations, setOperations] = useState<OperationData[]>([]);
  const [gauges, setGauges] = useState<GuageData[]>([]);

  const [analysisData, setAnalysisData] = useState<{
    metrics: any;
    controlCharts: {
      xBarData: any[];
      rangeData: any[];
      limits: any;
    };
    distribution: {
      data: any[];
      stats: any;
    };
  } | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const shiftData = await fetchShiftData();
      setShifts(shiftData.data);
    } catch (error) {
      setError('Error loading shift data');
      console.error('Error loading initial data:', error);
    }
  };

  useEffect(() => {
    if (startDate && endDate && selectedShifts.length > 0) {
      loadMaterials();
    }
  }, [startDate, endDate, selectedShifts]);

  const loadMaterials = async () => {
    try {
      const materialData = await fetchMaterialList(startDate, endDate, selectedShifts);
      setMaterials(materialData);
    } catch (error) {
      setError('Error loading materials');
      console.error('Error loading materials:', error);
    }
  };

  useEffect(() => {
    if (material && selectedShifts.length > 0) {
      loadOperations();
    }
  }, [material, selectedShifts]);

  const loadOperations = async () => {
    try {
      const operationData = await fetchOperationList(startDate, endDate, material, selectedShifts);
      setOperations(operationData);
    } catch (error) {
      setError('Error loading operations');
      console.error('Error loading operations:', error);
    }
  };

  useEffect(() => {
    if (operation && selectedShifts.length > 0) {
      loadGauges();
    }
  }, [operation, selectedShifts]);

  const loadGauges = async () => {
    try {
      const gaugeData = await fetchGuageList(startDate, endDate, material, operation, selectedShifts);
      setGauges(gaugeData);
    } catch (error) {
      setError('Error loading gauges');
      console.error('Error loading gauges:', error);
    }
  };

  const calculateAnalysisData = (inspectionData: InspectionData[]) => {
    if (!inspectionData.length) return null;

    const specifications = inspectionData.map(d => parseFloat(d.ActualSpecification));
    const mean = specifications.reduce((a, b) => a + b, 0) / specifications.length;
    const stdDev = Math.sqrt(
      specifications.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (specifications.length - 1)
    );

    // Calculate control chart data
    const xBarData = specifications.map((spec, i) => ({ x: i + 1, y: spec }));
    const rangeData = specifications.slice(1).map((spec, i) => ({
      x: i + 1,
      y: Math.abs(spec - specifications[i])
    }));

    const rangeMean = rangeData.reduce((a, b) => a + b.y, 0) / rangeData.length;
    const xBarUcl = mean + (2.66 * rangeMean);
    const xBarLcl = mean - (2.66 * rangeMean);
    const rangeUcl = 3.267 * rangeMean;
    const rangeLcl = 0;

    // Calculate process capability indices
    const usl = parseFloat(inspectionData[0].ToSpecification);
    const lsl = parseFloat(inspectionData[0].FromSpecification);
    const cp = (usl - lsl) / (6 * stdDev);
    const cpu = (usl - mean) / (3 * stdDev);
    const cpl = (mean - lsl) / (3 * stdDev);
    const cpk = Math.min(cpu, cpl);

    return {
      metrics: {
        xBar: mean.toFixed(2),
        stdDevOverall: stdDev.toFixed(2),
        stdDevWithin: stdDev.toFixed(2),
        movingRange: rangeMean.toFixed(2),
        cp: cp.toFixed(2),
        cpkUpper: cpu.toFixed(2),
        cpkLower: cpl.toFixed(2),
        cpk: cpk.toFixed(2),
        pp: cp.toFixed(2),
        ppu: cpu.toFixed(2),
        ppl: cpl.toFixed(2),
        ppk: cpk.toFixed(2),
        lsl: lsl.toFixed(2),
        usl: usl.toFixed(2)
      },
      controlCharts: {
        xBarData,
        rangeData,
        limits: {
          xBarUcl: xBarUcl.toFixed(2),
          xBarLcl: xBarLcl.toFixed(2),
          xBarMean: mean.toFixed(2),
          rangeUcl: rangeUcl.toFixed(2),
          rangeLcl: rangeLcl.toFixed(2),
          rangeMean: rangeMean.toFixed(2)
        }
      },
      distribution: {
        data: calculateDistributionData(specifications, distributionBins),
        stats: {
          mean: mean.toFixed(2),
          stdDev: stdDev.toFixed(2),
          target: ((usl + lsl) / 2).toFixed(2)
        }
      }
    };
  };

  const calculateDistributionData = (specifications: number[], bins: number) => {
    const min = Math.min(...specifications);
    const max = Math.max(...specifications);
    const binWidth = (max - min) / bins;
    
    const binCounts = new Array(bins).fill(0);
    specifications.forEach(spec => {
      const binIndex = Math.min(
        Math.floor((spec - min) / binWidth),
        bins - 1
      );
      binCounts[binIndex]++;
    });

    return binCounts.map((count, i) => ({
      x: min + (i * binWidth) + (binWidth / 2),
      y: count
    }));
  };

  const handleAnalyze = async () => {
    if (!selectedShifts.length || !material || !operation || !gauge) {
      setError('Please select all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const inspectionData = await fetchInspectionData(
        startDate,
        endDate,
        material,
        operation,
        gauge,
        selectedShifts
      );

      const filteredData = inspectionData.filter((data: { ShiftCode: number; }) => 
        selectedShifts.includes(data.ShiftCode)
      );

      const analysis = calculateAnalysisData(filteredData);
      setAnalysisData(analysis);
    } catch (error) {
      setError('Error analyzing data');
      console.error('Error analyzing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshDistribution = () => {
    if (analysisData) {
      const newBins = distributionBins === 5 ? 10 : 5;
      setDistributionBins(newBins);
      setAnalysisData({
        ...analysisData,
        distribution: {
          ...analysisData.distribution,
          data: calculateDistributionData(
            analysisData.controlCharts.xBarData.map(d => d.y),
            newBins
          )
        }
      });
    }
  };

  const handleShiftSelection = (values: (string | number)[]) => {
    setSelectedShifts(values.map(v => Number(v)));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>SPC Analysis</Text>
          <Text style={styles.subtitle}>Statistical Process Control</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Filter size={20} color="#4B5563" />
            <Text style={styles.cardTitle}>Analysis Parameters</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.sectionTitle}>Date Range</Text>
            <DatePickerInput
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
            />
            <DatePickerInput
              label="End Date"
              value={endDate}
              onChange={setEndDate}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.sectionTitle}>Process Details</Text>
            <MultiSelect
              label="Shifts"
              options={shifts.map(s => ({ value: s.ShiftId, label: s.ShiftName }))}
              selectedValues={selectedShifts}
              onSelectionChange={handleShiftSelection}
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Material</Text>
              <Picker
                selectedValue={material}
                onValueChange={setMaterial}
                style={styles.picker}
              >
                <Picker.Item label="Select Material" value="" />
                {materials.map((m) => (
                  <Picker.Item 
                    key={m.MaterialCode} 
                    label={m.MaterialName} 
                    value={m.MaterialCode} 
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Operation</Text>
              <Picker
                selectedValue={operation}
                onValueChange={setOperation}
                style={styles.picker}
                enabled={!!material}
              >
                <Picker.Item label="Select Operation" value="" />
                {operations.map((o) => (
                  <Picker.Item 
                    key={o.OperationCode} 
                    label={o.OperationName} 
                    value={o.OperationCode} 
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Gauge</Text>
              <Picker
                selectedValue={gauge}
                onValueChange={setGauge}
                style={styles.picker}
                enabled={!!operation}
              >
                <Picker.Item label="Select Gauge" value="" />
                {gauges.map((g) => (
                  <Picker.Item 
                    key={g.GuageCode} 
                    label={g.GuageName} 
                    value={g.GuageCode} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.analyzeButton,
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled
            ]}
            onPress={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Search size={20} color="#fff" />
                <Text style={styles.buttonText}>Analyze Data</Text>
              </>
            )}
          </Pressable>
        </View>

        {analysisData && (
          <>
            <ProcessMetrics metrics={analysisData.metrics} />
            <ControlCharts {...analysisData.controlCharts} />
            <HistogramChart 
              data={analysisData.distribution.data}
              lsl={parseFloat(analysisData.metrics.lsl)}
              usl={parseFloat(analysisData.metrics.usl)}
              target={parseFloat(analysisData.distribution.stats.target)}
            />
            <DistributionChart
              {...analysisData.distribution}
              bins={distributionBins}
              onBinsChange={setDistributionBins}
              onRefresh={handleRefreshDistribution}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 48,
  },
  analyzeButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: '#1D4ED8',
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
});