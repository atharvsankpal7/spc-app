import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  VictoryChart, VictoryLine, VictoryScatter,
  VictoryAxis, VictoryTheme, VictoryLabel,
  VictoryLegend
} from 'victory-native';

const { width } = Dimensions.get('window');

export default function ControlChartsScreen() {
  const [data, setData] = useState({
    xBar: [],
    range: [],
    ucl: 0,
    lcl: 0,
    centerLine: 0,
    rUcl: 0,
    rLcl: 0,
    rCenterLine: 0
  });

  // Simulated data for demonstration
  useEffect(() => {
    const generateData = () => {
      const xBarData = Array.from({ length: 25 }, (_, i) => ({
        x: i + 1,
        y: 10 + Math.random() * 2
      }));

      const rangeData = Array.from({ length: 25 }, (_, i) => ({
        x: i + 1,
        y: 1 + Math.random()
      }));

      setData({
        xBar: xBarData,
        range: rangeData,
        ucl: 12,
        lcl: 8,
        centerLine: 10,
        rUcl: 2.5,
        rLcl: 0,
        rCenterLine: 1.25
      });
    };

    generateData();
  }, []);

  const chartTheme = {
    ...VictoryTheme.material,
    chart: {
      ...VictoryTheme.material.chart,
      padding: { top: 40, bottom: 50, left: 50, right: 20 }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Control Charts</Text>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>X-bar Chart</Text>
          <VictoryChart theme={chartTheme} width={width - 40}>
            <VictoryLegend
              x={width / 2 - 100}
              y={0}
              centerTitle
              orientation="horizontal"
              data={[
                { name: "UCL", symbol: { fill: "#FF6B6B" } },
                { name: "Center", symbol: { fill: "#4ECDC4" } },
                { name: "LCL", symbol: { fill: "#FF6B6B" } }
              ]}
            />
            <VictoryAxis
              label="Sample Number"
              style={{
                axisLabel: { padding: 30 }
              }}
            />
            <VictoryAxis
              dependentAxis
              label="Value"
              style={{
                axisLabel: { padding: 40 }
              }}
            />
            <VictoryLine
              data={data.xBar}
              style={{ data: { stroke: "#45B7D1", strokeWidth: 2 } }}
            />
            <VictoryScatter
              data={data.xBar}
              size={4}
              style={{ data: { fill: "#45B7D1" } }}
            />
            <VictoryLine
              y={() => data.ucl}
              style={{ data: { stroke: "#FF6B6B", strokeDasharray: "5,5" } }}
            />
            <VictoryLine
              y={() => data.centerLine}
              style={{ data: { stroke: "#4ECDC4", strokeDasharray: "3,3" } }}
            />
            <VictoryLine
              y={() => data.lcl}
              style={{ data: { stroke: "#FF6B6B", strokeDasharray: "5,5" } }}
            />
          </VictoryChart>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Range Chart</Text>
          <VictoryChart theme={chartTheme} width={width - 40}>
            <VictoryLegend
              x={width / 2 - 100}
              y={0}
              centerTitle
              orientation="horizontal"
              data={[
                { name: "UCL", symbol: { fill: "#FF6B6B" } },
                { name: "Center", symbol: { fill: "#4ECDC4" } },
                { name: "LCL", symbol: { fill: "#FF6B6B" } }
              ]}
            />
            <VictoryAxis
              label="Sample Number"
              style={{
                axisLabel: { padding: 30 }
              }}
            />
            <VictoryAxis
              dependentAxis
              label="Range"
              style={{
                axisLabel: { padding: 40 }
              }}
            />
            <VictoryLine
              data={data.range}
              style={{ data: { stroke: "#45B7D1", strokeWidth: 2 } }}
            />
            <VictoryScatter
              data={data.range}
              size={4}
              style={{ data: { fill: "#45B7D1" } }}
            />
            <VictoryLine
              y={() => data.rUcl}
              style={{ data: { stroke: "#FF6B6B", strokeDasharray: "5,5" } }}
            />
            <VictoryLine
              y={() => data.rCenterLine}
              style={{ data: { stroke: "#4ECDC4", strokeDasharray: "3,3" } }}
            />
            <VictoryLine
              y={() => data.rLcl}
              style={{ data: { stroke: "#FF6B6B", strokeDasharray: "5,5" } }}
            />
          </VictoryChart>
        </View>
      </View>
    </ScrollView>
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
});