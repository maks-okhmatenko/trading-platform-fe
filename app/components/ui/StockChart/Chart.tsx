import React from 'react';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { ChartCanvas, Chart } from 'react-stockcharts';
import { CandlestickSeries } from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { HoverTooltip, OHLCTooltip } from 'react-stockcharts/lib/tooltip';
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import chartWrapper from './ChartControlWrapper';
import { last, first } from 'react-stockcharts/lib/utils';
import { interpolateNumber } from 'd3-interpolate';
import _ from 'lodash';
import {
  PriceCoordinate,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates';
import styles from './Chart.scss';
import { candlesLoad, candlesShow } from 'containers/App/constants';


const colors = {
  red: '#DF2323',
  green: '#29C359',
  lines: '#888F',
  grid: '#7777',
};
const dateFormat = timeFormat('%Y/%m/%d %H:%M:%S');
const numberFormat = format('.5f');

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

function OHLCDisplayDefault(symbol) {
  return {
    d: `${symbol} Date: `,
    o: ' O: ',
    h: ' H: ',
    l: ' L: ',
    c: ' C: ',
    v: ' Vol: ',
    na: 'n/a',
  };
}

// PropsType
interface PropsType {
  children: any;
  type: string;
  width: number;
  height: number;
  initialData: [];
  leftShift: number;
  ticker: any;
  timeFrame: string;
  showGrid: boolean;
  loadMoreHandler: (start, end) => void;
}

// StateType
interface StateType {
  nodeX?: ChartCanvas;
  nodeY?: Chart;

  additionalDataCount: number;
  xLimiterRight: number;
}

// Container
class CandleStickStockScaleChart extends React.Component<PropsType, StateType> {
  // Constructor
  constructor(props) {
    super(props);

    const zoom = {
      in: () => this.handleZoom(-1),
      out: () => this.handleZoom(1),
      reset: () => this.handleReset(),
    };

    this.props.children({zoom});
    this.state = {
      additionalDataCount: 0,
      xLimiterRight: candlesShow,
    };
  }

  // Handlers
  private saveXNode = (node: ChartCanvas) => {
    this.setState({ nodeX: node });
  }

  private saveYNode = (node: Chart) => {
    this.setState({ nodeY: node });
  }

  private handleReset = () => {
    const {nodeX: node} = this.state;
    if (!node) {
      return;
    }
    this.handleZoom(0);
    node.resetYDomain();
  }

  public handleZoom = (direction) => {
    const {nodeX: node} = this.state;
    const { xScale, plotData, xAccessor } = node.state;
    const { xAxisZoom } = node;
    const zoomOrigin = xScale(xAccessor(last(plotData)));
    const zoomMultiplier = 1.25;
    const c = direction > 0 ? 1 * zoomMultiplier : 1 / zoomMultiplier;

    const [start, end] = xScale.domain();
    const [newStart, newEnd] =
      direction === 0
        ? [0, Math.ceil(candlesLoad) + 3]
        : xScale.range()
          .map(x => zoomOrigin + (x - zoomOrigin) * c)
          .map(xScale.invert);

    const left = interpolateNumber(start, newStart);
    const right = interpolateNumber(end, newEnd);

    const steps = [1].map(i => {
      return [left(i), right(i)];
    });

    node.interval = setInterval(() => {
      xAxisZoom(steps.shift());
      if (steps.length === 0) {
        clearInterval(node.interval);
        delete node.interval;
      }
    }, 10);
  }

  private checkLimit = () => {
    const {nodeX: node} = this.state;
    if (!node) { return; }
    const { plotData, xAccessor } = node.state;

    const leftEdge = Math.ceil(xAccessor(first(plotData)));
    const rightEdge = Math.ceil(xAccessor(last(plotData)));
    if ((rightEdge - leftEdge + 3) < candlesShow) {
      setTimeout(() => {
        this.handleReset();
      }, 100);
    }
    console.log(rightEdge - leftEdge, candlesShow);
  }

  // Render
  public render() {
    const {
      ticker,
      type,
      width,
      height,
      initialData,
      loadMoreHandler,
      leftShift = 0,
      timeFrame = '',
      showGrid = true,
    } = this.props;

    const xScaleProvider = discontinuousTimeScaleProvider
      .inputDateAccessor(d => d.date)
      .initialIndex(Math.ceil(leftShift));

    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      initialData,
    );

    const margin = { left: 10, right: 70, top: 20, bottom: 30 };
    const gridHeight = height - margin.top - margin.bottom;
    const gridWidth = width - margin.left - margin.right;

    const yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeDasharray: 'ShortDash' } : {};
    const xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeDasharray: 'ShortDash' } : {};
    if (-leftShift !== this.state.additionalDataCount) {
      this.setState({ additionalDataCount: -leftShift });
    }
    this.checkLimit();

    return (
      <div className={styles.chartWrapper}>
        <ChartCanvas
          ref={this.saveXNode}
          width={width}
          height={height}
          ratio={1}
          margin={margin}
          type={type}
          seriesName="MainChart"
          data={data}
          xScale={xScale}
          xAccessor={xAccessor}
          displayXAccessor={displayXAccessor}
          onLoadMore={loadMoreHandler}
        >
          <Chart id={1}
            ref={this.saveYNode}
            yExtents={(d) => [d.high, d.low]}
            chartId="main_candles_chart"
          >
            <OHLCTooltip origin={[0, -10]}
              ohlcFormat={numberFormat}
              textFill="tomato"
              fontSize={16}
              displayTexts={OHLCDisplayDefault(timeFrame)}
            />

            <XAxis
              axisAt="bottom"
              orient="bottom"
              fontSize={15}
              ticks={12}
              tickStroke={colors.grid}
              stroke={colors.lines}
              {...xGrid}
              tickPadding={2}
            />
            <YAxis
              axisAt="right"
              orient="right"
              fontSize={15}
              ticks={14}
              tickStroke={colors.grid}
              stroke={colors.lines}
              tickFormat={numberFormat}
              {...yGrid}
            />

            <MouseCoordinateX
              at="bottom"
              orient="bottom"
              displayFormat={dateFormat}
              strokeDasharray="Solid"
            />
            <MouseCoordinateY
              at="right"
              orient="right"
              displayFormat={numberFormat}
              strokeDasharray="Solid"
            />
            <CrossHairCursor stroke={colors.lines} strokeDasharray="Solid"/>

            <CandlestickSeries
              stroke={d => (d.close > d.open ? colors.green : colors.red)}
              wickStroke={d => (d.close > d.open ? colors.green : colors.red)}
              fill={d => (d.close > d.open ? colors.green : colors.red)}
              opacity={1}
            />

            {ticker ? (
            <>
              <PriceCoordinate
                at="right"
                orient="right"
                price={_.toNumber(ticker.Bid)}
                lineStroke={colors.lines}
                displayFormat={numberFormat}
                strokeDasharray="Solid"
                arrowWidth={7}
                stroke={colors.lines}
                textFill="black"
                fill="white"
              />
              <PriceCoordinate
                at="right"
                orient="right"
                price={_.toNumber(ticker.Ask)}
                lineStroke="red"
                displayFormat={numberFormat}
                strokeDasharray="Solid"
                arrowWidth={7}
                stroke={colors.lines}
                textFill="black"
                fill="red"
              />
            </>
            ) : null}

            <HoverTooltip
              classNames={styles.tooltip}
              yAccessor={d => d.date}
              tooltipContent={tooltipContent()}
              fontSize={15}
              bgOpacity={0}
            />
          </Chart>
        </ChartCanvas>
      </div>
    );
  }
}

export default chartWrapper(CandleStickStockScaleChart);
