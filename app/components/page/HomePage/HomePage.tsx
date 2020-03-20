import * as React from 'react';
import CurrencyWidget from '../../ui/CurrencyWidget';

const HomePage = (props) => {

  return (
    <div>
     <CurrencyWidget {...props} />
    </div>
  );
};

export default HomePage;
