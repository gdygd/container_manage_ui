import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { TrendTimeRange, TrendDataPoint } from '../types';

interface StatsTrendChartProps {
  containerId: string;
  timeRange: TrendTimeRange;
}

function generateSampleData(timeRange: TrendTimeRange): TrendDataPoint[] {
  const now = new Date();
  const data: TrendDataPoint[] = [];

  let intervalMs: number;
  let dataPoints: number;

  switch (timeRange) {
    case '1h':
      intervalMs = 60 * 1000;
      dataPoints = 60;
      break;
    case '30m':
      intervalMs = 30 * 1000;
      dataPoints = 60;
      break;
    case '10m':
      intervalMs = 10 * 1000;
      dataPoints = 60;
      break;
    case '1m':
      intervalMs = 1000;
      dataPoints = 60;
      break;
  }

  let baseCpu = 5 + Math.random() * 10;
  let baseMemory = 30 + Math.random() * 20;

  for (let i = dataPoints - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * intervalMs);
    const timeStr = time.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    baseCpu += (Math.random() - 0.5) * 4;
    baseCpu = Math.max(0, Math.min(100, baseCpu));

    baseMemory += (Math.random() - 0.5) * 3;
    baseMemory = Math.max(0, Math.min(100, baseMemory));

    data.push({
      time: timeStr,
      cpu: parseFloat(baseCpu.toFixed(2)),
      memory: parseFloat(baseMemory.toFixed(2)),
    });
  }

  return data;
}

export function StatsTrendChart({ containerId, timeRange }: StatsTrendChartProps) {
  const chartData = useMemo(() => {
    return generateSampleData(timeRange);
  }, [containerId, timeRange]);

  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1a1a1a',
      borderColor: '#333',
      textStyle: {
        color: '#fff',
      },
      formatter: (params: Array<{ seriesName: string; value: number; axisValue: string }>) => {
        let result = `<div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>`;
        params.forEach((param) => {
          const color = param.seriesName === 'CPU' ? '#61dafb' : '#22c55e';
          result += `<div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 10px; height: 10px; background: ${color}; border-radius: 2px;"></span>
            <span>${param.seriesName}: ${param.value}%</span>
          </div>`;
        });
        return result;
      },
    },
    legend: {
      data: ['CPU', 'Memory'],
      textStyle: {
        color: '#aaa',
      },
      top: 0,
      right: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '40px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.map((d) => d.time),
      axisLine: {
        lineStyle: {
          color: '#333',
        },
      },
      axisLabel: {
        color: '#888',
        fontSize: 10,
        interval: Math.floor(chartData.length / 6),
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: {
        lineStyle: {
          color: '#333',
        },
      },
      axisLabel: {
        color: '#888',
        formatter: '{value}%',
      },
      splitLine: {
        lineStyle: {
          color: '#333',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: 'CPU',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: chartData.map((d) => d.cpu),
        lineStyle: {
          color: '#61dafb',
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(97, 218, 251, 0.3)' },
              { offset: 1, color: 'rgba(97, 218, 251, 0.05)' },
            ],
          },
        },
      },
      {
        name: 'Memory',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: chartData.map((d) => d.memory),
        lineStyle: {
          color: '#22c55e',
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(34, 197, 94, 0.3)' },
              { offset: 1, color: 'rgba(34, 197, 94, 0.05)' },
            ],
          },
        },
      },
    ],
  }), [chartData]);

  return (
    <div className="trend-chart-container">
      <ReactECharts
        option={option}
        style={{ height: '300px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
      <div className="chart-note">
        * Sample data - Real-time data will be available via API
      </div>
    </div>
  );
}
