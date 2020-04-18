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
  volume: string,
  price?: string,
  stopLoss?: string,
  takeProfit?: string,
  side: SIDE_TYPE,
  bid: string,
  ask: string,
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

// StateType
export type StateType = {

};

// Component
export const OrderModal: React.FC<PropsType> = (props) => {
  const { isVisible, showModal, symbol, bid, ask, onSubmit } = props;

  // Declarations
  const [volume, setVolume] = React.useState('');
  const [stopLoss, setStopLoss] = React.useState(null) as [string | null, any];
  const [takeProfit, setTakeProfit] = React.useState(null) as [string | null, any];

  // Handlers
  const handleSubmit = (side) => {
    const newOrder: Order = {
      volume,
      bid,
      ask,
      side,
    };
    if (onSubmit) {
      onSubmit(newOrder);
    }
  };

  // Render
  const handleClose = () => showModal && showModal(false);
  return (
    <>
      <Modal
        className={styles.modalMain}
        isOpen={isVisible}
        onRequestClose={() => handleClose}
        contentLabel="OrderModal"
      >
        <div className={classnames(styles.row, styles.header)}>
          <h1>{symbol}</h1>
          <div className={styles.squareButton} onClick={handleClose}>x</div>
        </div>
        <div className={classnames(styles.row, styles.body)}>
          <input type="text" onChange={(e) => setVolume(e.target.value)} />
        </div>
        <div className={classnames(styles.row, styles.body)}>
          {!!stopLoss ? (
            <label className={styles.left}>
              <div className={styles.squareButton} onClick={() => setStopLoss(null)}>-</div>
              <h1>Stop loss</h1>
              <input type="text" onChange={(e) => setStopLoss(e.target.value)} />
            </label>
          ) : (
            <div className={styles.squareButton} onClick={() => setStopLoss('')}>+</div>
          )}
          {!!takeProfit ? (
            <label className={styles.right}>
              <div className={styles.squareButton} onClick={() => setTakeProfit(null)}>-</div>
              <h1>Take profit</h1>
              <input type="text" onChange={(e) => setTakeProfit(e.target.value)} />
            </label>
          ) : (
            <div className={styles.squareButton} onClick={() => setTakeProfit('')}>+</div>
          )}
        </div>
        <div className={classnames(styles.row, styles.body)}>
          <h1>{Number.parseFloat(bid).toFixed(5)} / {Number.parseFloat(ask).toFixed(5)}</h1>
        </div>
        <div className={classnames(styles.row, styles.footer)}>
          <button className={classnames(styles.button, styles.buy)}
            onClick={() => handleSubmit(SIDE_TYPE.BUY)}
          >BUY</button>
          <button className={classnames(styles.button, styles.sell)}
            onClick={() => handleSubmit(SIDE_TYPE.BUY)}
          >SELL</button>
        </div>
      </Modal>
    </>
  );
}

export default OrderModal;
