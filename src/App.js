import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { PAGES } from './utils/constants';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Bookings from './components/Bookings';
import Drivers from './components/Drivers';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import SidebarComponent from './components/SidebarComponent';
import { Header, Icon } from 'semantic-ui-react';

function App() {
  const [ visible, setVisible ] = useState(false)

  const handleSideBar = () => {
    setVisible(!visible)
  }

  const getHeaderTitle = () => {
    switch(window.location.pathname){
      case PAGES.DASHBOARD: return 'Dashboard'
      case PAGES.BOOKINGS: return 'Manage Bookings'
      case PAGES.DRIVER: return 'Manage Drivers'
      default: return ''
    }
  }

  const renderHeader = () => {
    return (
        <div className="headerfd">
            <Icon name="content" size="large" color="red" onClick={handleSideBar} className="hamb"></Icon>
            <Header as='h2' className="headertitle">
                {getHeaderTitle()}
            </Header>
        </div>
    )
  }

  return (
    <div className="App">
      <Router>
      <AuthProvider>
        <Switch>
          <Route path={PAGES.LOGIN} component={Login} />
            <SidebarComponent
              visible={visible} 
              handleSideBar={handleSideBar}
            >
              {renderHeader()}
              <PrivateRoute exact path={PAGES.DASHBOARD} component={Dashboard} />
              <PrivateRoute exact path={PAGES.BOOKINGS} component={Bookings} />
              <PrivateRoute exact path={PAGES.DRIVER} component={Drivers} />
            </SidebarComponent>
        </Switch>
      </AuthProvider>
      </Router>


    </div>
  );
}

export default App;
