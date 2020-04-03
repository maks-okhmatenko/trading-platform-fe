import React from 'react';
import styles from './Chart.scss';
const { useEffect, useRef, useState } = React;
import {
  FRAME_TYPES,
  TIME_FRAMES_CONFIG,
  getTimestamp,
} from 'containers/App/constants';
import classnames from 'classnames';
// Load the img icon and the file
// import '!file-loader?name=[name].[ext]!../../../images/timeframes/M1_timeframe_small.png';
// import '!file-loader?name=[name].[ext]!../../../images/timeframes/M5_timeframe_small.png';
// import '!file-loader?name=[name].[ext]!../../../images/timeframes/M15_timeframe_small.png';
// import '!file-loader?name=[name].[ext]!../../../images/timeframes/M30_timeframe_small.png';
// import '!file-loader?name=[name].[ext]!../../../images/timeframes/H1_timeframe_small.png';
// import '!file-loader?name=[name].[ext]!../../../images/timeframes/H4_timeframe_small.png';
// import '!file-loader?name=[name].[ext]!../../../images/timeframes/D1_timeframe_small.png';

class ChartControlPanel extends React.Component<any, any> {

  private timeFrameChangeHandler(frameType) {
    return () => {
      this.props.chooseTimeframeChartData({
        symbol: this.props.activeSymbolChart,
        frameType: frameType,
        from: getTimestamp.subtract(
          TIME_FRAMES_CONFIG[frameType].from,
        ),
        to: getTimestamp.add(
          TIME_FRAMES_CONFIG[frameType].to,
        ),
      });
    };
  }

  public render() {
    const buttonFrameTypes = Object.keys(FRAME_TYPES).map(
      item => FRAME_TYPES[item],
    );

    const timeframeButtonSetting = buttonFrameTypes.map((frameType, index) => {
      const classes = classnames(
        styles.timeFrameButton,
        frameType === this.props.activeTimeFrame ? styles.active : '',
      );
      return (
        <div
          className={classes}
          onClick={this.timeFrameChangeHandler(frameType)}
          // src={`./${frameType}_timeframe_small.png`}
          key={index}
          // width="35"
        >{frameType}</div>
      );
    });

    return (
      <div className={styles.controller}>
        <h2>{this.props.activeSymbolChart}</h2>
        <div className={styles.buttonContainer}>
          {timeframeButtonSetting}
        </div>
      </div>
    );
  }
}

const flexWrapper = WrappedComponent => {
  return props => {
    const componentRef = useRef(null);
    const { width, height } = useResize(componentRef, props);
    // data = useLoadMore()
    return (
      <>
      <ChartControlPanel {...props}/>
        <div className={styles.flexContainer}>
            <div ref={componentRef}>
              {width > 300 && height > 300 ? (
                <WrappedComponent
                  {...props}
                  width={width}
                  height={height}
                  onLoadMore={useLoadMore}
                />
                ) : (
                  <></>
                )
              }
            </div>
          </div>
    </>
    );
  };
};

const useLoadMore = (additional) => {
  const [data, setData] = useState([]);
  console.log(additional);
};

const useResize = (ref, props) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(ref.current && ref.current.clientWidth);
    setHeight(ref.current && ref.current.clientHeight);
  }, [props]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(ref.current && ref.current.clientWidth);
      setHeight(ref.current && ref.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return { width, height };
};

export default flexWrapper;
