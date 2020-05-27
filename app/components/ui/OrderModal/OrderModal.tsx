import * as React from 'react';
import _set from 'lodash/set';
import _toNumber from 'lodash/toNumber';
import _throttle from 'lodash/throttle';
import classnames from 'classnames';

import { ORDER_CMD_TYPE, ORDER } from 'containers/App/constants';
import CheckBox from './../CheckBox/Checkbox';
import SwitchableInput from './components/SwitchableInput';
import DigitInput from './components/DigitInput';

import styles from './OrderModal.scss';
import Alert from '../Alert/Alert';


// OrderModal PropsType
export type PropsType = {
  ask?: string;
  bid?: string;
  symbol?: string;
  login?: string;
  isOrderLoading?: boolean;
  openOrderError?: string | null;
  isVisible?: boolean;
  handleClose?: () => void;
  onSubmit?: (order: ORDER) => void;
};

// OrderModal Component
export const OrderModal: React.FC<PropsType> = props => {
  const {
    isVisible,
    symbol = '',
    bid = '',
    ask = '',
    login = '',
    isOrderLoading = false,
    openOrderError,
    onSubmit,
    handleClose,
  } = props;

  // Declarations
  const [volume, setVolume] = React.useState('');
  const [priceMarket, setPriceMarket] = React.useState(false);
  const [price, setPrice] = React.useState('');
  const [stopLoss, setStopLoss] = React.useState('') as [string, (obj: any) => void];
  const [takeProfit, setTakeProfit] = React.useState('') as [string, (obj: any) => void];

  // - onDrag vars
  const [point, setPoint] = React.useState(null) as [{ x: number; y: number } | null, (obj: any) => void];
  const [pos, setPos] = React.useState({ x: 100, y: 100 });

  // - dinamic styles
  const customStyles = {
    left: `${pos.x}px`,
    top: `${pos.y}px`,
  };
  const mainWrapperClasses = classnames(styles.mainWrapper, {
    [styles.eventsAll]: point,
    [styles.eventsNone]: !point,
  });

  // Handlers
  const handleSubmit = cmd => {
    const newOrder: ORDER = {
      Login: login,
      Symbol: symbol,
      Volume: volume,
      Cmd: cmd,
      Expiration: '',
      Comment: '',
    };
    if (stopLoss) { _set(newOrder, 'Sl', stopLoss); }
    if (takeProfit) { _set(newOrder, 'Tp', takeProfit); }
    if (cmd === ORDER_CMD_TYPE.BUY
    ||  cmd === ORDER_CMD_TYPE.SELL) { _set(newOrder, 'Price', price); }
    if (onSubmit) { onSubmit(newOrder); }
  };
  const handlePriceSourceSwitch = checked => setPriceMarket(checked);

  // - onDrag handlers
  const onDragStart = ({ nativeEvent: { x, y } }) => {
    setPoint({ x, y });
  };
  const onDragEnd = () => {
    setPoint(null);
  };

  const onDrag = _throttle(({ nativeEvent: e }) => {
    if (!e || !point) {
      return;
    }
    const { x, y } = e;
    setPos({
      x: pos.x + (x - point.x),
      y: pos.y + (y - point.y),
    });
    setPoint({ x, y });
  }, 100);

  // Init
  // - clear on open
  React.useEffect(() => {
    setStopLoss('');
    setTakeProfit('');
    setVolume('');
  }, [symbol]);
  // - set price by market
  const marketPrice = _toNumber(ask).toFixed(5);
  if (!priceMarket && price !== marketPrice && !isOrderLoading) { setPrice(marketPrice); }

  // Render
  return (
    <div className={mainWrapperClasses} onMouseMove={!!point ? onDrag : undefined}>
      {!isVisible ? null : (
        <div className={styles.modalMain} style={customStyles}>
          {!isOrderLoading ? null :
            <div className={styles.loading}>
              <div className={styles.loader}/>
            </div>
          }
          {/* Header */}
          <div
            className={styles.header}
            onMouseUp={onDragEnd}
            onMouseDown={onDragStart}
          >
            <div className={styles.row}>
              <h1>{symbol}</h1>
              <div className={styles.squareButton} onClick={handleClose}>x</div>
            </div>
          </div>

          {/* Body */}
          <div className={styles.body}>
            <Alert {...openOrderError}/>
            {/* - Volume - */}
            <div className={styles.row}>
              <div className={styles.digitInput}>
                <h1>Volume</h1>
                <DigitInput value={volume} setValue={setVolume} autoFocus fixed={2}/>
              </div>
            </div>

            {/* - Price - */}
            <div className={styles.row}>
              <div className={styles.digitInput}>
                <h1>Price</h1>
                <CheckBox
                  defaultValue={priceMarket}
                  onChange={handlePriceSourceSwitch}
                  titleUnchecked="market"
                  titleChecked="custom"
                />
                <DigitInput
                  value={price}
                  setValue={setPrice}
                  disabled={!priceMarket}
                />
              </div>
            </div>

            {/* - Stop loss - */}
            <div className={styles.row}>
              <SwitchableInput
                title="Stop loss"
                value={stopLoss}
                onChange={setStopLoss}
              />
            </div>

            {/* - Take profit - */}
            <div className={styles.row}>
              <SwitchableInput
                title="Take profit"
                value={takeProfit}
                onChange={setTakeProfit}
              />
            </div>

            {/* - Bid/Ask - */}
            <div className={styles.row}>
              <h1>
                {`${Number.parseFloat(bid).toFixed(5)} / ${Number.parseFloat(ask).toFixed(5)}`}
              </h1>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            {/* - SELL/BUY - */}
            <div className={styles.row}>
              <button
                className={classnames(styles.button, styles.sell)}
                onClick={() => handleSubmit(ORDER_CMD_TYPE.SELL)}
              >SELL</button>
              <button
                className={classnames(styles.button, styles.buy)}
                onClick={() => handleSubmit(ORDER_CMD_TYPE.BUY)}
              >BUY</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderModal;
