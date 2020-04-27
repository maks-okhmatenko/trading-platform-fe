import * as React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import styles from './OrderModal.scss';
import { SIDE_TYPE, ORDER } from 'containers/App/constants';
import CheckBox from './../CheckBox';


const floatRegex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/g;

const filter = (value, regex) => {
  const newValue = value && value.split(' ').join('');
  if (newValue && newValue.match(regex) !== null) {
    return _.toNumber(newValue).toFixed(5);
  } else {
    return (0).toFixed(5);
  }
};

// SwitchableInput Component
const SwitchableInput: React.FC<any> = props => {
  const { title, onChange, value } = props;
  const [visible, setVisible] = React.useState(false);
  return (
    <div className={styles.digitInput}>
      <label className={styles.switcherLable}>
        <h1>{title}</h1>
        <CheckBox
          defaultValue={visible}
          onChange={checked => setVisible(checked)}
        />
      </label>
      {!visible ? null : (
        <DigitInput value={value} setValue={onChange} autoFocus />
      )}
    </div>
  );
};

// DigitalInput Component
const DigitInput: React.FC<any> = props => {
  const { value, setValue, delta = 0.01, disabled, autoFocus } = props;

  const decrement = () => {
    setValue((Number(value) - delta).toFixed(5));
  };
  const increment = () => {
    setValue((Number(value) + delta).toFixed(5));
  };
  const onCommit = () => {
    setValue(filter(value, floatRegex));
  };

  return (
    <div className={styles.input}>
      {disabled ? null : (
        <div className={styles.squareButton} onClick={decrement}>-</div>
      )}
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={onCommit}
        autoFocus={autoFocus}
        disabled={disabled}
      />
      {disabled ? null : (
        <div className={styles.squareButton} onClick={increment}>+</div>
      )}
    </div>
  );
};

// OrderModal PropsType
export type PropsType = {
  ask?: string;
  bid?: string;
  symbol?: string;

  isVisible?: boolean;
  handleClose?: () => void;
  onSubmit?: (order: ORDER) => void;
};

// OrderModal Component
export const OrderModal: React.FC<PropsType> = props => {
  const {
    isVisible,
    handleClose,
    symbol = '',
    bid = '',
    ask = '',
    onSubmit,
  } = props;

  // Declarations
  const [volume, setVolume] = React.useState('');
  const [priceMarket, setPriceMarket] = React.useState(false);
  const [price, setPrice] = React.useState('');
  const [stopLoss, setStopLoss] = React.useState('') as [string, any];
  const [takeProfit, setTakeProfit] = React.useState('') as [string, any];

  // - onDrag vars
  const [point, setPoint] = React.useState(null) as [{ x: number; y: number } | null, any];
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
  const handleSubmit = side => {
    const newOrder: ORDER = {
      Login: 'default',
      Symbol: symbol,
      Volume: volume,
      Price: price,
      Cmd: side,
    };
    if (stopLoss) { _.set(newOrder, 'Sl', stopLoss); }
    if (takeProfit) { _.set(newOrder, 'Tp', takeProfit); }
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

  const onDrag = _.throttle(({ nativeEvent: e }) => {
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
  if (!priceMarket && price !== bid) { setPrice(bid); }

  // Render
  return (
    <div className={mainWrapperClasses} onMouseMove={!!point ? onDrag : undefined}>
      {!isVisible ? null : (
        <div className={styles.modalMain} style={customStyles}>
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
            {/* - Volume - */}
            <div className={styles.row}>
              <div className={styles.digitInput}>
                <h1>Volume</h1>
                <DigitInput value={volume} setValue={setVolume} autoFocus />
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
                onClick={() => handleSubmit(SIDE_TYPE.SELL)}
              >SELL</button>
              <button
                className={classnames(styles.button, styles.buy)}
                onClick={() => handleSubmit(SIDE_TYPE.BUY)}
              >BUY</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderModal;
