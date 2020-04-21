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
import _ from 'lodash';
import {
  PriceCoordinate,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates';
import styles from './Chart.scss';
import { candlesLoad } from 'containers/App/constants';
import { symbol } from 'prop-types';

const colors = {
  red: '#DF2323',
  green: '#29C359',
  text: 'white',
  lines: '#888F',
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
  loadMoreHandler: (start, end) => void;
}

// StateType
interface StateType {
  nodeX?: ChartCanvas;
  nodeY?: Chart;
  deltaX: number;
  deltaY: number;
  zoomMulDelta: number;
  isYFlex: boolean;
  resetX: boolean;
}

// Container
class CandleStickStockScaleChart extends React.Component<PropsType, StateType> {
  constructor(props) {
    super(props);
    this.saveXNode = this.saveXNode.bind(this);
    this.saveYNode = this.saveYNode.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.calcXExtents = this.calcXExtents.bind(this);
    this.calcYExtents = this.calcYExtents.bind(this);
    this.calcZoom = this.calcZoom.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleZoom = this.handleZoom.bind(this);

    const zoom = {
      in: () => this.handleZoom(0.75),
      out: () => this.handleZoom(1.25),
      reset: this.handleReset,
    };
    this.props.children({zoom});
    this.state = {
      zoomMulDelta: 1,
      deltaX: 0,
      deltaY: 0,
      isYFlex: true,
      resetX: false,
    };
  }

  private saveXNode(node: ChartCanvas) {
    this.setState({ nodeX: node });
  }


  private saveYNode(node: Chart) {
    this.setState({ nodeY: node });
  }


  private handleDrag(e) {
    console.log(e);
  }

  private handleScroll(e) {
    this.setState({deltaX: e.deltaY > 0 ? -10 : 10});
  }


  public handleReset() {
    this.setState({isYFlex: true, resetX: true});
  }


  public handleZoom(zoom) {
    this.setState({ zoomMulDelta: zoom });
  }


  private calcZoom() {
    const nodeX = this.state.nodeX;
    if (!nodeX) { return null; }

    const { xScale, plotData, xAccessor } = nodeX.state;
    const c = this.state.zoomMulDelta;
    if (c === 1) {
      return xScale.domain();
    }

    const cx = xScale(xAccessor(last(plotData)));
    const newDomain = xScale.range()
          .map(x => cx + (x - cx) * c)
          .map(xScale.invert);
    const delta = newDomain[1] - newDomain[0];
    if (delta > 300 || delta < 10) {
      return xScale.domain();
    }
    this.handleZoom(1);
    return newDomain;
  }


  private calcXExtents() {
    const domainX = this.calcZoom() || [candlesLoad, 0];

    const newDomain = !this.state.resetX
      ? domainX[1] > candlesLoad && this.state.deltaX > 0
        ? domainX
        : [
          domainX[0] + this.state.deltaX,
          domainX[1] + this.state.deltaX,
        ]
      : [candlesLoad, 0];

    if (this.state.resetX) {
      this.setState({resetX: false});
    }

    if (newDomain[1] > candlesLoad) {
      const overDelta = newDomain[1] - candlesLoad;
      newDomain[1] -= overDelta;
      newDomain[0] -= overDelta;
    }

    const nodeX = this.state.nodeX;
    if (!nodeX) { return domainX; }

    const { plotData, xAccessor } = nodeX.state;
    const shiftDelta = xAccessor(first(plotData)) - newDomain[0];
    if (shiftDelta > candlesLoad / 2) {
      const overDelta = shiftDelta - candlesLoad / 2;
      newDomain[1] += overDelta;
      newDomain[0] += overDelta;
    }
    return newDomain;
  }


  private calcYExtents() {
    if (this.state.nodeY) {
      const domainY = this.state.nodeY.context.chartConfig[0].yScale.domain();
      if (this.state.isYFlex) {
        const realDomainY = this.state.nodeY.context.chartConfig[0].realYDomain;
        if (realDomainY[0] !== domainY[0]) {
          this.setState({isYFlex: false});
        }
      } else {
        return domainY;
      }
    }
    return ((d) => [d.high, d.low]);
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
    } = this.props;

    const xScaleProvider = discontinuousTimeScaleProvider
      .inputDateAccessor(d => d.date)
      .initialIndex(Math.ceil(leftShift));

    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      initialData,
    );

    if (this.state && (this.state.deltaX !== 0 || this.state.deltaX === undefined)) {
      this.setState({deltaX: 0});
    }

    const margin = { left: 10, right: 70, top: 20, bottom: 30 };
    const gridHeight = height - margin.top - margin.bottom;
    const gridWidth = width - margin.left - margin.right;

    const showGrid = true;
    const yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeDasharray: 'ShortDash' } : {};
    const xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeDasharray: 'ShortDash' } : {};

    return (
      <div onWheel={this.handleScroll} onDragEnd={this.handleScroll}>
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
          xExtents={this.calcXExtents()}
        >
          <Chart id={1}
            ref={this.saveYNode}
            yExtents={this.calcYExtents()}
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
              ticks={12}
              tickStroke={colors.lines}
              stroke={colors.lines}
              {...xGrid}
              tickPadding={2}
            />
            <YAxis
              axisAt="right"
              orient="right"
              ticks={14}
              fill={colors.text}
              tickStroke={colors.lines}
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
                lineStroke={colors.lines}
                displayFormat={numberFormat}
                strokeDasharray="Solid"
                arrowWidth={7}
                stroke={colors.lines}
                textFill="black"
                fill="red"
              />
            </>
            ) : (<></>)}

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
