/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import HeaderContainer from 'containers/Header';
import HomePage from 'containers/HomePage/Loadable';
import SidebarContainer from '../Sidebar';

import styles from './app.scss';

const App = () => {
  return (
    <div className={styles.app}>
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
        {/*<Footer />*/}
      </main>
    </div>
  );
};

export default App;
