import * as React from 'react';
import ApexChart from 'react-apexcharts';
import { EVENT_NAME, FRAME_TYPES, TIME_FRAMES_CONFIG } from '../../../containers/App/constants';

import styles from './Chart.scss';

// Load the img icon and the file
import '!file-loader?name=[name].[ext]!../../../images/timeframes/M1_timeframe_small.png';
import '!file-loader?name=[name].[ext]!../../../images/timeframes/M5_timeframe_small.png';
import '!file-loader?name=[name].[ext]!../../../images/timeframes/M15_timeframe_small.png';
import '!file-loader?name=[name].[ext]!../../../images/timeframes/M30_timeframe_small.png';
import '!file-loader?name=[name].[ext]!../../../images/timeframes/H1_timeframe_small.png';
import '!file-loader?name=[name].[ext]!../../../images/timeframes/H4_timeframe_small.png';
import '!file-loader?name=[name].[ext]!../../../images/timeframes/D1_timeframe_small.png';

class Chart extends React.Component<any> {
  public state = {
    series: [
      {data: []},
    ],
  };

  public componentDidMount(): void {
    const result = this.prepareData(this.props.chartTimeFrame);
    const resultObj = [
      {data: result},
    ];
    this.setState({
      series: resultObj,
    });
  }

  public componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<{}>): void {
    if (prevProps.chartTimeFrame.length !== this.props.chartTimeFrame.length) {
      const result = this.prepareData(this.props.chartTimeFrame);
      const resultObj = [
        {data: result},
      ];
      this.setState({
        series: resultObj,
      });
    }
  }

  public prepareData = (data) => {
    return data.map((dataItem) => {
      return {
        x: new Date(parseInt(dataItem.x, 10) * 1000),
        y: dataItem.y.map(x => parseFloat(x)),
      };
    });
  };

  public render() {
    const chartsArray = this.props.chartTimeFrame;

    const getOptions = () => {
      const buttonFrameTypes = Object.keys(FRAME_TYPES).map((item) => FRAME_TYPES[item]);
      const timeframeButtonSetting = buttonFrameTypes.map((frameType, index) => {
        return {
          icon: `<img src="./${frameType}_timeframe_small.png" width="25">`,
          index: index + 2,
          title: frameType,
          class: 'custom-icon',
          click: (chart, options, e) => {
            this.props.chooseTimeframeChartData(EVENT_NAME.SUBSCRIBE_TIME_FRAME, {
              symbol: this.props.activeSymbolChart,
              frameType: frameType,
              from: TIME_FRAMES_CONFIG[frameType].from,
              to: TIME_FRAMES_CONFIG[frameType].to,
            });
          },
        };
      });

      return {
        chart: {
          id: 'apexchart-example',
          foreColor: '#a6acb3',

          toolbar: {
            tools: {
              download: false,
              selection: false,
              zoom: false,
              zoomin: true,
              zoomout: true,
              // pan: false,
              reset: false,
              customIcons: [
                ...timeframeButtonSetting,
              ],
            },
            autoSelected: 'pan',
          },
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
        },
        tooltip: {
          x: {
            format: 'HH:mm:ss dd MMM',
          },
        },
        title: {
          text: `${chartsArray.length && chartsArray[0].symbol} - ${chartsArray.length && chartsArray[0].frameType}`,
          align: 'left',
        },
        noData: {
          text: 'Loading...',
        },
      };
    };

    return (
      <div className={styles.chartContainer}>
        <ApexChart
          options={getOptions()}
          series={this.state.series}
          type="candlestick"
          height={'100%'}
        />
      </div>
    );
  }
}

export default Chart;
