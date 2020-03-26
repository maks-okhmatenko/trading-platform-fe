import * as React from 'react';
import ApexChart from 'react-apexcharts';

class Chart extends React.Component<any> {
  public state = {
    series: [
      {data: []},
    ],
  };

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
          text: `${this.props.chartTimeFrame[0].symbol} - ${this.props.chartTimeFrame[0].frameType}`,
          align: 'left',
        },
        noData: {
          text: 'Loading...',
        },
      }
    );

    return (
      <div>
        {!this.props.chartLoading ? 'loading'
          : (<ApexChart
            options={getOptions()}
            series={this.state.series}
            type="candlestick"
          />)
        }
      </div>
    );
  }
}

export default Chart;
