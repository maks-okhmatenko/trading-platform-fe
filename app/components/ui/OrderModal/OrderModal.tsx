import * as React from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import classnames from 'classnames';

import styles from './OrderModal.scss';
import { SIDE_TYPE } from 'containers/App/constants';

// TODO move to constants
type Order = {
  id?: string,
  volume: number,
  price?: number,
  stopLoss?: string,
  takeProfit?: string,
  side: SIDE_TYPE,
  bid: string,
  ask: string,
};

const floatRegex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/g;

const filteredOnChange = (setter, regex) => {
  return (e) => {
    const newValue = e.target.value;
    if (newValue === '' || newValue.match(regex) !== null) {
      setter(newValue);
    }
  };
};

const SwitchableInput: React.FC<any> = (props) => {
  const { title, onChange, value } = props;

  return (
    <>
      <h1>{title}</h1>
      <div className={styles.squareButton} onClick={() => onChange(value === null ? '' : null)}>
        {value === null ? '+' : '-'}
      </div>
      {value !== null ? (
        <input type="text" value={value} onChange={filteredOnChange(onChange, floatRegex)} autoFocus/>
      ) : (
        <></>
      )}
    </>
  );
};

const DigitInput: React.FC<any> = (props) => {
  const { title, value, setValue, delta = 0.01 } = props;

  const decrement = () => {
    setValue((Number(value) - delta).toFixed(2));
  };
  const increment = () => {
    setValue((Number(value) + delta).toFixed(2));
  };

  return (
    <div className={styles.digitInput}>
      <h1>{title}</h1>
      <div className={styles.input}>
        <div className={styles.squareButton} onClick={decrement}>-</div>
        <input type="text" disabled value={value}/>
        <div className={styles.squareButton} onClick={increment}>+</div>
      </div>
    </div>
  );
};

// PropsType
export type PropsType = {
  ask: string,
  bid: string,
  symbol: string,

  isVisible?: boolean,
  showModal?: (arg: boolean) => void,
  onSubmit?: (order: Order) => void,
};

// Component
export const OrderModal: React.FC<PropsType> = (props) => {
  const { isVisible, showModal, symbol, bid, ask, onSubmit } = props;

  // Declarations
  const [orderType, setOrderType] = React.useState('pending');
  const [volume, setVolume] = React.useState(0);
  const [price, setPrice] = React.useState(0);
  const [stopLoss, setStopLoss] = React.useState(null) as [string | null, any];
  const [takeProfit, setTakeProfit] = React.useState(null) as [string | null, any];

  // Handlers
  const handleSubmit = (side) => {
    const newOrder: Order = {
      volume,
      price,
      bid,
      ask,
      side,
    };
    if (onSubmit) {
      onSubmit(newOrder);
    }
  };

  const handleClose = () => showModal && showModal(false);

  // Render
  return (
    <Modal className={styles.modalMain}
      isOpen={isVisible}
      onRequestClose={handleClose}
      contentLabel="OrderModal"
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.row}>
          <h1>{symbol}</h1>
          <div className={styles.squareButton} onClick={handleClose}>x</div>
        </div>
        <div className={styles.row}>
          <select value={orderType} className={styles.dropdown} onChange={(e) => setOrderType(e.target.value)}>
            <option value="pending">Pending Order</option>
            <option value="market">Market</option>
          </select>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.row}>
          <DigitInput title="Volume" value={volume} setValue={setVolume} />
          {orderType !== 'market'
            ? <></>
            : <DigitInput title="Price" value={price} setValue={setPrice} />
          }
        </div>
        <div className={styles.row}>
          <div className={styles.left}>
            <SwitchableInput title="Stop loss" value={stopLoss} onChange={setStopLoss}/>
          </div>
          <div className={styles.right}>
            <SwitchableInput title="Take profit" value={takeProfit} onChange={setTakeProfit}/>
          </div>
        </div>
        <h1>{Number.parseFloat(bid).toFixed(5)} / {Number.parseFloat(ask).toFixed(5)}</h1>
      </div>

      {/* Footer  */}
      <div className={styles.footer}>
        <div className={styles.row}>
          <button className={classnames(styles.button, styles.sell)}
            onClick={() => handleSubmit(SIDE_TYPE.BUY)}
          >SELL</button>
          <button className={classnames(styles.button, styles.buy)}
            onClick={() => handleSubmit(SIDE_TYPE.BUY)}
          >BUY</button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderModal;
