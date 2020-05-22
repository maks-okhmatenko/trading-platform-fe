import * as React from "react";
import classnames from "classnames";

import styles from "./Alert.scss";

export const Alert = (props) => {
  const {
    title,
    type = "alert",
    className,
  } = props;
  const visible = !!title;

  const classes = classnames(
    styles.main,
    {
      [styles.visible]: visible,
    },
    styles[type],
    className,
  );

  return (
    <div className={styles.container}>
      <div className={classes}>
        <span className={styles.title}>{type}: </span>
        {title}
      </div>
    </div>
  );
};

export default Alert;
