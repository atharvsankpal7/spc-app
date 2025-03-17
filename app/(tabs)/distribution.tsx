import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  VictoryChart, VictoryArea, VictoryAxis,
  VictoryTheme, VictoryLine, VictoryLabel,
  VictoryScatter
} from 'victory-native';

const { width } = Dimensions.get('window');

function normalDistribution(x: number, mean: number, stdDev: number) {
  const variance = stdDev * stdDev;
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
         Math.exp(-((x - mean) * (x - mean)) / (2 * variance));
}

export default function DistributionScreen() {
  const [distributionData, setDistributionData] = useState({
    data: [],
    mean: 10,
    stdDev: 1,
    target: 10,
    actualData: []
  });

  useEffect(() => {
    const generateDistributionData = () => {
      const mean = 10;
      const stdDev = 1;
      const target = 10;
      
      // Generate normal distribution curve
      const points = Array.from({ length: 100 }, (_, i) => {
        const x = mean - 4 * stdDev + (i * 8 * stdDev) / 99;
        return {
          x,
          y: normalDistribution(x, mean, stdDev)
        };
      });

      // Generate actual data points for scatter plot
      const actualPoints = Array.from({ length: 30 }, () => ({
        x: mean + (Math.random() - 0.5) * 4 * stdDev,
        y: Math.random() * 0.2
      }));

      setDistributionData({
        data: points,
        mean,
        stdDev,
        target,
        actualData: actualPoints
      });
    };

    generateDistributionData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Distribution Analysis</Text>

        <View style={styles.statsContainer}>
          <StatBox
            label="Mean"
            value={distributionData.mean.toFixed(2)}
          />
          <StatBox
            label="Std Dev"
            value={distributionData.stdDev.toFixed(2)}
          />
          <StatBox
            label="Target"
            value={distributionData.target.toFixed(2)}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Process Distribution</Text>
          <VictoryChart
            theme={VictoryTheme.material}
            width={width - 40}
            domain={{ y: [0, 0.5] }}
          >
            <VictoryAxis
              label="Measurement"
              style={{
                axisLabel: { padding: 35 }
              }}
            />
            <VictoryAxis
              dependentAxis
              label="Frequency"
              style={{
                axisLabel: { padding: 45 }
              }}
            />
            <VictoryArea
              data={distributionData.data}
              style={{
                data: {
                  fill: "rgba(69, 183, 209, 0.2)",
                  stroke: "#45B7D1",
                  strokeWidth: 2
                }
              }}
            />
            <VictoryLine
              x={() => distributionData.target}
              style={{
                data: { stroke: "#FF6B6B", strokeDasharray: "5,5" }
              }}
            />
            <VictoryScatter
              data={distributionData.actualData}
              size={3}
              style={{
                data: { fill: "#34495E" }
              }}
            />
          </VictoryChart>
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#45B7D1' }]} />
            <Text style={styles.legendText}>Distribution Curve</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FF6B6B' }]} />
            <Text style={styles.legendText}>Target</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#34495E' }]} />
            <Text style={styles.legendText}>Actual Data Points</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function StatBox({ label, value }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#34495E',
    textAlign: 'center',
  },
  legendContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#34495E',
  },
});