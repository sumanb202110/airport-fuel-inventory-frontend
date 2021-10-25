import axios from "axios";
import { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setHomeTab } from "../../actions";
import { airports } from "../airport/Airport";

type transactions = {
    transaction_id: string,
    transaction_date_time: string,
    transaction_type: string,
    airport_id: string,
    aircraft_id: string,
    quantity: string,
    transaction_id_parent: string
}[]

type transaction = {
    transaction_type: string,
    airport_id: string,
    aircraft_id: string,
    quantity: string,
    transaction_id_parent: string
}

const FuelConsumptionReport: FC = (): ReactElement => {
    const [airports, setAirports] = useState<airports>()
    const [transactions, setTransactions] = useState<transactions>()
    const dispatch = useDispatch()

    // Get airport details
    const getAirports = () => {
        axios.get<airports>('http://localhost:4000/api/v1/airports', { withCredentials: true })
            .then(function (response) {
                setAirports(response.data)
            })
            .catch(function (error: any) {
                console.log(error)
            })
    }

    // Get transactions
    const getTransactions = () => {
        axios.get<transactions>('http://localhost:4000/api/v1/transactions', { withCredentials: true })
            .then(function (response) {
                setTransactions(response.data)
            })
            .catch(function (error: any) {
                console.log(error)
            })
    }

    // Revert transaction 
    const revertTransaction = (revertTransactionData: transaction) => {
        // api call for revert transaction
        axios.post('http://localhost:4000/api/v1/transactions', revertTransactionData, { withCredentials: true })
            .then(function (response) {
                console.log(response);
                getTransactions();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        dispatch(setHomeTab('FUEL_CONSUMPTION_REPORT'))
        getAirports()
        getTransactions()

        // eslint-disable-next-line
    }, [])
    return (
        <div>
            {
                airports?.sort(function (a, b) {
                    var nameA = a.airport_name.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.airport_name.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                }).map((airport) => {
                    return (
                        <div key={airport.airport_id.toString()} className="container">
                            <h3>Airport: {airport.airport_name}</h3>
                            <div className="row">
                                <div className="col">
                                    <strong>
                                        Date/time
                                    </strong>
                                </div>
                                <div className="col">
                                    <strong>
                                        Type
                                    </strong>
                                </div>
                                <div className="col">
                                    <strong>
                                        Fuel
                                    </strong>
                                </div>
                                <div className="col">
                                    <strong>
                                        Aircraft
                                    </strong>
                                </div>
                                <div className="col">

                                </div>
                                <hr />
                            </div>
                            {
                                transactions?.filter((transaction) => transaction.airport_id === airport.airport_id)?.map((transaction) => {
                                    return (
                                        <div className="row" key={transaction.transaction_id}>
                                            <div className="col">
                                                {new Date(transaction.transaction_date_time)
                                                    .toLocaleString("en-US", { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                            </div>
                                            <div className="col">
                                                {transaction.transaction_type}
                                            </div>
                                            <div className="col">
                                                {transaction.quantity}
                                            </div>
                                            <div className="col">
                                                {transaction.aircraft_id}
                                            </div>
                                            <div className="col-sm                                                                                                                                                                                                                                      ">
                                                <button type="button" onClick={() => {
                                                    revertTransaction({
                                                        transaction_type: `${transaction.transaction_type === 'IN' ? 'OUT' : 'IN'}`,
                                                        airport_id: transaction.airport_id,
                                                        aircraft_id: '',
                                                        quantity: transaction.quantity,
                                                        transaction_id_parent: transaction.transaction_id
                                                    })
                                                }} className="btn btn-danger">
                                                    Revert
                                                </button>
                                            </div>
                                            <hr />
                                        </div>
                                    )
                                })
                            }
                            <h4>Fuel Available: {airport.fuel_available}</h4>

                        </div>

                    )
                })
            }

        </div>

    )
}

export default FuelConsumptionReport