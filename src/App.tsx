import './App.css';
import Nav from './components/nav/Nav';
import { useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Aircraft, { aircrafts } from "../src/components/aircraft/Aircraft";
import Airport, { airports } from "../src/components/airport/Airport";
import Login from './components/login/Login';
import Transaction, { transaction, transactions } from './components/transaction/transaction';
import FuelConsumptionReport from './components/fuel_consumption_report/FuelConsumptionReport';
import Logout from './components/logout/Logout';
import Home from './components/home/Home';
import Toasts from './components/toasts/Toasts';
import Signup from './components/signup/Signup';
import { useEffect, useState } from 'react';


export type state = {
  isLogin: boolean,
  user: {
    email: string
  },
  homeTab: string,
  transactions?:{
    data: transactions
  },
  selectedTransaction: transaction,
  updateTransaction?: {
    updateTransactionFormHidden: false,
    updateTransactionData: {
        transaction_id: string,
        transaction_type?: string,
        airport_id: string,
        aircraft_id: string,
        quantity: number
    }
  },
  deleteTransaction?: {
    deleteTransactionFormHidden: false,
    deleteTransactionData: {
        transaction_id: string,
        transaction_type?: string,
        airport_id: string,
        aircraft_id: string,
        quantity: number
    }
  },
  airports?:{
    data: airports
  },
  aircrafts?:{
    data: aircrafts
  },
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
    // eslint-disable-next-line
  }, [])

  const isLogin = useSelector((state: state) => { return state.isLogin });

  return (
    <div className="App">
      {
        isLoading ?
          <div style = {{marginTop: "40vh"}}>
            <div className="spinner-grow text-primary" role="status">
              <span className="sr-only"></span>
            </div>
            <div className="spinner-grow text-secondary" role="status">
              <span className="sr-only"></span>
            </div>
            <div className="spinner-grow text-success" role="status">
              <span className="sr-only"></span>
            </div>
            <div className="spinner-grow text-danger" role="status">
              <span className="sr-only"></span>
            </div>
            <div className="spinner-grow text-warning" role="status">
              <span className="sr-only"></span>
            </div>
            <div className="spinner-grow text-info" role="status">
              <span className="sr-only"></span>
            </div>
            <div className="spinner-grow text-dark" role="status">
              <span className="sr-only"></span>
            </div>
            <div>Loading.....</div>
          </div>
          :
          <>
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
                      <Signup />
                    </Route>
                  </Switch>
              }
            </Router>
          </>

      }


    </div>
  );
}

export default App;
