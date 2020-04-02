import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { ChartCanvas, Chart } from 'react-stockcharts';
import { CandlestickSeries } from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { HoverTooltip } from 'react-stockcharts/lib/tooltip';
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { last } from 'react-stockcharts/lib/utils';
import {
  EdgeIndicator,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates';
import styles from './Chart.scss';

const colors = {
  red: 'red',
  green: 'greenyellow',
};
const dateFormat = timeFormat('%Y-%m-%d');
const numberFormat = format('.2f');

function tooltipContent() {
  return ({ currentItem, xAccessor }) => {
    return {
      x: dateFormat(xAccessor(currentItem)),
      y: [
        {
          label: 'open',
          value: currentItem.open && numberFormat(currentItem.open),
        },
        {
          label: 'high',
          value: currentItem.high && numberFormat(currentItem.high),
        },
        {
          label: 'low',
          value: currentItem.low && numberFormat(currentItem.low),
        },
        {
          label: 'close',
          value: currentItem.close && numberFormat(currentItem.close),
        },
      ].filter(line => line.value),
    };
  };
}

const handleDownloadMore = (start, end) => {
  console.log(start, end);
};

class CandleStickStockScaleChart extends React.Component<any, any> {
  public render() {
    const { type, width, ratio, chartTimeFrame } = this.props;

    const initialData = transformData(chartTimeFrame);

    if (!initialData.length) {
      return <></>;
    }

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      d => d.date,
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      initialData,
    );

    // TODO scale
    const xExtents = [
      xAccessor(last(data)),
      xAccessor(data[Math.max(0, data.length - 150)]),
    ];

    return (
      <ChartCanvas
        classNames={styles.chart}
        height={900}
        ratio={ratio}
        width={width}
        margin={{ left: 100, right: 50, top: 10, bottom: 30 }}
        type={type}
        seriesName="MSFT"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
        onLoadMore={handleDownloadMore}
      >
        <Chart id={1} yExtents={d => [d.high, d.low]}>
          <CandlestickSeries
            displayFormat={format('.4f')}
            stroke={d => (d.close > d.open ? colors.green : colors.red)}
            wickStroke={d => (d.close > d.open ? colors.green : colors.red)}
            fill={d => (d.close > d.open ? colors.green : colors.red)}
          />
          <XAxis
            axisAt="bottom"
            orient="bottom"
            ticks={5}
            stroke="white"
            fill="white"
            tickStroke="white"
          />
          <YAxis
            axisAt="left"
            orient="left"
            ticks={7}
            fill="white"
            tickStroke="white"
          />

          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={d => d.close}
            fill={d => (d.close > d.open ? colors.green : colors.red)}
            textFill="black"
            displayFormat={format('.4f')}
          />

          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat('%Y-%m-%d')}
          />
          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format('.4f')}
          />
          <CrossHairCursor stroke="white" />

          <HoverTooltip
            classNames={styles.tooltip}
            yAccessor={d => d.date}
            tooltipContent={tooltipContent()}
            fontSize={15}
          />
        </Chart>
      </ChartCanvas>
    );
  }
}

const transformData = initialData => {
  return initialData.map(item => ({
    date: new Date(item.x),
    open: parseFloat(item.y[0]),
    high: parseFloat(item.y[1]),
    low: parseFloat(item.y[2]),
    close: parseFloat(item.y[3]),
    volume: parseFloat(item.y[2]) - parseFloat(item.y[1]),
    split: '',
    dividend: '',
    absoluteChange: '',
    percentChange: '',
  }));
};

export default fitWidth(CandleStickStockScaleChart);
