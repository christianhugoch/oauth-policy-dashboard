import MainPage from './components/pages/main/main_page';
import LoginPage from './components/pages/auth_views/login/login_page';
import LoginCallback from './components/pages/auth_views/login/login_callback';
import LogoutPage from './components/pages/auth_views/logout/logout_page';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';


function App() {
  return (
    <Router basename="/policy-dashboard">
      <Switch>
        <Route path='/login'>
          <LoginPage />
        </Route>
        <Route path='/login_callback'>
          <LoginCallback/>
        </Route>
        <Route path="/logout">
          <LogoutPage />
        </Route>
        <Route path='/' >
          <MainPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;