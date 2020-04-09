import React from 'react';
import styles from './icon.scss';

const FavoriteIcon = props => {
  const { color = 'gold', width = '20px', height = '20px', active, onClick } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={styles.favoriteIcon}
      viewBox="-30 -30 582 552"
      width={width}
      height={height}
      stroke={color}
      fill={color}
      fillOpacity={!active ? 0 : 1}

      onClick={onClick}
    >
      <path
        d="m510.644531 185.011719
          c-3.878906-11.933594-15.425781-20.132813-31.683593-22.496094
          l-132.511719-19.257813-59.265625-120.074218
          c-7.269532-14.730469-18.636719-23.183594-31.183594-23.183594
          s-23.914062 8.453125-31.183594 23.1875
          l-59.257812 120.070312-132.515625 19.257813
          c-16.261719 2.363281-27.8125 10.5625-31.6875 22.496094-3.875 11.933593.648437 25.355469 12.414062 36.820312
          l95.890625 93.464844-22.640625 131.980469
          c-2.894531 16.878906 2.039063 26.992187 6.6875 32.507812 5.453125 6.46875 13.40625 10.03125 22.394531
          10.03125 6.761719 0 13.953126-1.980468 21.378907-5.882812
          l118.519531-62.308594 118.527344 62.3125
          c7.421875 3.902344 14.613281 5.878906 21.375 5.878906h.003906
          c8.984375 0 16.941406-3.5625 22.394531-10.03125 4.644531-5.511718 9.582031-15.628906 6.683594-32.507812
          l-22.636719-131.980469 95.886719-93.464844
          c11.761719-11.464843 16.285156-24.886719 12.410156-36.820312zm0 0"
      />
    </svg>
  );
};

export default FavoriteIcon;
