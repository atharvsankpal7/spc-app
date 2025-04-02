import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { VictoryChart, VictoryLine, VictoryScatter, VictoryAxis, VictoryLabel } from 'victory-native';

interface ControlChartsProps {
  xBarData: { x: number; y: number }[];
  rangeData: { x: number; y: number }[];
  limits: {
    xBarUcl: number;
    xBarLcl: number;
    xBarMean: number;
    rangeUcl: number;
    rangeLcl: number;
    rangeMean: number;
  };
}

export function ControlCharts({ xBarData, rangeData, limits }: ControlChartsProps) {
  // Calculate width based on number of data points
  const chartWidth = Math.max(350, xBarData.length * 50); // Minimum 350px or 50px per point

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.sampleSize}>Sample Size: 1</Text>
          <Text style={styles.formula}>
            XBar Chart UCL = X̄ + (A2 × R̄) LCL = X̄ - (A2 × R̄)
          </Text>
        </View>

        <View style={styles.limitsContainer}>
          <View style={[styles.limitBox, styles.uclBox]}>
            <Text style={styles.limitLabel}>UCL</Text>
            <Text style={styles.limitValue}>{limits.xBarUcl.toFixed(3)}</Text>
          </View>
          <View style={[styles.limitBox, styles.meanBox]}>
            <Text style={styles.limitLabel}>X̄ (Mean)</Text>
            <Text style={styles.limitValue}>{limits.xBarMean.toFixed(3)}</Text>
          </View>
          <View style={[styles.limitBox, styles.lclBox]}>
            <Text style={styles.limitLabel}>LCL</Text>
            <Text style={styles.limitValue}>{limits.xBarLcl.toFixed(3)}</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={{ width: chartWidth }}>
            <VictoryChart
              padding={{ top: 40, bottom: 50, left: 50, right: 20 }}
              height={250}
              width={chartWidth}
            >
              <VictoryAxis
                tickFormat={(t) => `G${t}`}
                style={{
                  grid: { stroke: '#E5E7EB', strokeDasharray: '5,5' },
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  grid: { stroke: '#E5E7EB', strokeDasharray: '5,5' },
                }}
              />
              <VictoryLine
                data={xBarData}
                style={{ data: { stroke: '#3B82F6', strokeWidth: 2 } }}
              />
              <VictoryScatter
                data={xBarData}
                size={5}
                style={{ data: { fill: '#3B82F6' } }}
              />
              <VictoryLine
                y={() => limits.xBarUcl}
                style={{ data: { stroke: '#EF4444', strokeDasharray: '5,5' } }}
              />
              <VictoryLine
                y={() => limits.xBarMean}
                style={{ data: { stroke: '#8B5CF6', strokeWidth: 2 } }}
              />
              <VictoryLine
                y={() => limits.xBarLcl}
                style={{ data: { stroke: '#EF4444', strokeDasharray: '5,5' } }}
              />
            </VictoryChart>
          </View>
        </ScrollView>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.sampleSize}>Sample Size: 2</Text>
        </View>

        <View style={styles.limitsContainer}>
          <View style={[styles.limitBox, styles.uclBox]}>
            <Text style={styles.limitLabel}>UCL</Text>
            <Text style={styles.limitValue}>{limits.rangeUcl.toFixed(3)}</Text>
          </View>
          <View style={[styles.limitBox, styles.meanBox]}>
            <Text style={styles.limitLabel}>R̄ (Mean)</Text>
            <Text style={styles.limitValue}>{limits.rangeMean.toFixed(3)}</Text>
          </View>
          <View style={[styles.limitBox, styles.lclBox]}>
            <Text style={styles.limitLabel}>LCL</Text>
            <Text style={styles.limitValue}>{limits.rangeLcl.toFixed(3)}</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={{ width: chartWidth }}>
            <VictoryChart
              padding={{ top: 40, bottom: 50, left: 50, right: 20 }}
              height={250}
              width={chartWidth}
            >
              <VictoryAxis
                tickFormat={(t) => `G${t}`}
                style={{
                  grid: { stroke: '#E5E7EB', strokeDasharray: '5,5' },
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  grid: { stroke: '#E5E7EB', strokeDasharray: '5,5' },
                }}
              />
              <VictoryLine
                data={rangeData}
                style={{ data: { stroke: '#3B82F6', strokeWidth: 2 } }}
              />
              <VictoryScatter
                data={rangeData}
                size={5}
                style={{ data: { fill: '#3B82F6' } }}
              />
              <VictoryLine
                y={() => limits.rangeUcl}
                style={{ data: { stroke: '#EF4444', strokeDasharray: '5,5' } }}
              />
              <VictoryLine
                y={() => limits.rangeMean}
                style={{ data: { stroke: '#8B5CF6', strokeWidth: 2 } }}
              />
              <VictoryLine
                y={() => limits.rangeLcl}
                style={{ data: { stroke: '#EF4444', strokeDasharray: '5,5' } }}
              />
            </VictoryChart>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  chartContainer: {
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
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sampleSize: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  formula: {
    fontSize: 12,
    color: '#6B7280',
  },
  limitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  limitBox: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  uclBox: {
    backgroundColor: '#FEE2E2',
  },
  meanBox: {
    backgroundColor: '#E0E7FF',
  },
  lclBox: {
    backgroundColor: '#FEE2E2',
  },
  limitLabel: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },
  limitValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});