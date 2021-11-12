import axios from "axios";
import { FC, ReactElement, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAirports, getTransactions, setHomeTab, setToasts } from "../../actions";
import { state } from "../../App";
// import { airports } from "../airport/Airport";
import { transaction} from "../transaction/transaction";

const FuelConsumptionReport: FC = (): ReactElement => {
    // const [airports, setAirports] = useState<airports>()
    // const [transactions, setTransactions] = useState<transactions>()
    const dispatch = useDispatch()

    // retrive transactions data from redux
    const transactions = useSelector((state: state) => { return state.transactions!.data });

    // retrive airports data from redux
    const airports = useSelector((state: state) => { return state.airports!.data });


    const handleAirportToggle = (id: string) => {
        const airportDiv = document.querySelector(`#${id}`) as HTMLDivElement
        if (airportDiv.style.display === "none") {
            airportDiv.style.display = "block"
        } else {
            airportDiv.style.display = "none"
        }
    }

    // // Get airport details
    // const getAirports = () => {
    //     axios.get<airports>('http://localhost:4000/api/v1/airports', { withCredentials: true })
    //         .then(function (response) {
    //             setAirports(response.data)
    //         })
    //         .catch(function (error: any) {
    //             console.log(error)
    //             dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
    //         })
    // }

    // // Get transactions
    // const getTransactions = () => {
    //     axios.get<transactions>('http://localhost:4000/api/v1/transactions', { withCredentials: true })
    //         .then(function (response) {
    //             setTransactions(response.data)
    //         })
    //         .catch(function (error: any) {
    //             console.log(error)
    //             dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
    //         })
    // }

    // Revert transaction 
    const revertTransaction = (revertTransactionData: transaction) => {
        // api call for revert transaction
        axios.post('http://localhost:4000/api/v1/transactions', revertTransactionData, { withCredentials: true })
            .then(function (response: any) {
                console.log(response);
                dispatch(setToasts(response.data.msg, true, 'SUCCESS'))
                dispatch(getTransactions());
            })
            .catch(function (error) {
                console.log(error);
                dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
            });
    }



    // Initial setup
    useEffect(() => {
        dispatch(setHomeTab('FUEL_CONSUMPTION_REPORT'))
        dispatch(getAirports())
        dispatch(getTransactions())

        // eslint-disable-next-line
    }, [])
    return (
        <div>
            <br/>
            <button onClick={()=> { window.print()}} className="btn btn-outline-secondary no-print" style={{ right: "5px", position: "absolute"}}>Print</button>
            <br/>
            <br/>
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
                }).map((airport, airportIndex) => {
                    return (
                        <div key={airport.airport_id.toString()} className="container accordion" style={{backgroundColor: "#eeeeee"}}>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne" onClick={() => handleAirportToggle(`${airport.airport_id}DataContainer`)}>
                                    <button className="btn btn-outline" type="button" style={{width: "100%"}}>
                                    Airport: {airport.airport_name} 
                                    </button>
                                </h2>
                                <div id={`${airport.airport_id}DataContainer`} style={{ display: "none" }}>
                                    <br/>
                                    <div className="row justify-content-around" style={{backgroundColor: "#1a237e", color: "#ffffff"}}>
                                        <div className="col-2">
                                            <strong>
                                                Date/time
                                            </strong>
                                        </div>
                                        <div className="col-2">
                                            <strong>
                                                Type
                                            </strong>
                                        </div>
                                        <div className="col-2">
                                            <strong>
                                                Fuel
                                            </strong>
                                        </div>
                                        <div className="col-2">
                                            <strong>
                                                Aircraft
                                            </strong>
                                        </div>
                                        <div className="col-sm-2">

                                        </div>
                                        {/* <hr /> */}
                                    </div>
                                    {
                                        transactions?.filter((transaction) => transaction.airport_id === airport.airport_id)?.map((transaction, transactionIndex) => {
                                            return (
                                                <div className="row justify-content-around" key={transaction.transaction_id} style={{alignItems: "center", backgroundColor: `${transactionIndex %2 !== 0 ? "#eeeeee":""}`}}>
                                                    <div className="col-2">
                                                        {new Date(transaction.transaction_date_time)
                                                            .toLocaleString("en-US", { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                                    </div>
                                                    <div className="col-2">
                                                        {transaction.transaction_type}
                                                    </div>
                                                    <div className="col-2">
                                                        {transaction.quantity}
                                                    </div>
                                                    <div className="col-2">
                                                        {transaction.aircraft_id === "" ? "---": transaction.aircraft_id}
                                                    </div>
                                                    <div className="col-sm-2">
                                                        <button type="button" onClick={() => {
                                                            revertTransaction({
                                                                transaction_type: `${transaction.transaction_type === 'IN' ? 'OUT' : 'IN'}`,
                                                                airport_id: transaction.airport_id,
                                                                aircraft_id: `${transaction.transaction_type === 'IN' ? 'NA' : ''}`,
                                                                quantity: transaction.quantity,
                                                                transaction_id_parent: transaction.transaction_id
                                                            })
                                                        }} className="btn btn-danger no-print">
                                                            Revert
                                                        </button>
                                                    </div>
                                                </div>

                                            )
                                        })
                                    }
                                    <h4>Fuel Available: {airport.fuel_available}</h4>

                                </div>
                            </div>
                        </div>

                    )
                })
            }

        </div>

    )
}

export default FuelConsumptionReport