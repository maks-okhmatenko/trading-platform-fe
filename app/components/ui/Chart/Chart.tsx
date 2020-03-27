import * as React from 'react';
import ApexChart from 'react-apexcharts';

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

    const getOptions = () => (
      {
        chart: {
          id: 'apexchart-example',
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
        },
        title: {
          text: `${chartsArray.length && chartsArray[0].symbol} - ${chartsArray.length && chartsArray[0].frameType}`,
          align: 'left',
        },
        noData: {
          text: 'Loading...',
        },
      }
    );

    return (
      <div>
        <ApexChart
          options={getOptions()}
          series={this.state.series}
          type="candlestick"
        />
      </div>
    );
  }
}

export default Chart;
