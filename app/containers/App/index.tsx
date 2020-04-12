import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import HeaderContainer from 'containers/Header';
import HomePage from 'pages/HomePage/Loadable';
import SidebarContainer from '../Sidebar';
import classnames from 'classnames';
import styles from './app.scss';
import themeStyles from './theme.scss';
import Footer from 'components/ui/Footer';

const App = () => {
  const [theme, setTheme] = React.useState('dark');

  const classes = classnames(styles.app, themeStyles[theme]);
  return (
    <div className={classes}>
      <Helmet
        titleTemplate="%s - React.js Boilerplate"
        defaultTitle="React.js Boilerplate"
      >
        <meta name="description" content="A React.js Boilerplate application"/>
      </Helmet>
      <HeaderContainer/>

      <main className={styles.main}>
        <SidebarContainer/>
        <Switch>
          <Route exact path="/" component={HomePage}/>
        </Switch>
      </main>
      <Footer onThemeChange={setTheme} theme={theme}/>
    </div>
  );
};

export default App;
