import './App.css';
import Nav from './components/nav/Nav';
import { useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Aircraft from "../src/components/aircraft/Aircraft";
import Airport from "../src/components/airport/Airport";
import Login from './components/login/Login';
import Transaction from './components/transaction/transaction';
import FuelConsumptionReport from './components/fuel_consumption_report/FuelConsumptionReport';
import Logout from './components/logout/Logout';
import Home from './components/home/Home';
import Toasts from './components/toasts/Toasts';
import Signup from './components/signup/Signup';


export type state = {
  isLogin: boolean,
  user: object,
  homeTab: string,
  toastsMsg: {
    msg: string,
    display: boolean,
    type: string
  }
}

export type response = {
  data: {
    msg: string
  },
  error: {
    data: {
      msg: string
    }
  }
}

function App() {

  const isLogin = useSelector((state: state) => { return state.isLogin });

  return (
    <div className="App">
      <Toasts />
      <Router>
        {
          isLogin ?
            <>
              <Nav />
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/airports">
                  <Airport />
                </Route>
                <Route exact path="/aircrafts">
                  <Aircraft />
                </Route>
                <Route exact path="/transactions">
                  <Transaction />
                </Route>
                <Route exact path="/reports">
                  <FuelConsumptionReport />
                </Route>
                <Route exact path="/logout">
                  <Logout />
                </Route>
              </Switch>
            </>
            :
            <Switch>
              <Route exact path="/">
                <Login />
              </Route>
              <Route exact path="/signup">
                <Signup/>
              </Route>
            </Switch>
        }
      </Router>
    </div>
  );
}

export default App;
