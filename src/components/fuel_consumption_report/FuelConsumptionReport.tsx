// import axios from "axios";
import { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAircrafts, getAirports, getTransactions, setHomeTab, setToasts } from "../../actions";
import { state } from "../../App";
// import { airports } from "../airport/Airport";
import { transaction } from "../transaction/transaction";
import { ReactComponent as RefreshBlack } from '../../svgs/refresh_black_24dp.svg'
import { ReactComponent as ExpandLessBlack } from '../../svgs/expand_less_black_24dp.svg'
import { ReactComponent as ExpandMoreBlack } from '../../svgs/expand_more_black_24dp.svg'
import { ReactComponent as ExpandLessWhite } from '../../svgs/expand_less_white_24dp.svg'
import { ReactComponent as ExpandMoreWhite } from '../../svgs/expand_more_white_24dp.svg'
import axios from "axios";



type airportHideStatus = {
    airport_id: string,
    status: boolean
}[]

type sortType = 'DATE_ASC' | 'DATE_DESC' | 'QUANTITY_ASC' | 'QUANTITY_DESC'

type sortBy = {
    airport_id: string,
    sort_type: sortType
}[]

const FuelConsumptionReport: FC = (): ReactElement => {
    // const [airports, setAirports] = useState<airports>()
    // const [transactions, setTransactions] = useState<transactions>()
    const [airportHideStatus, setAirportHideStatus] = useState<airportHideStatus>()
    const [sortBy, setSortBy] = useState<sortBy>()

    // Axios auth config
    const authAxios = axios.create({
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
    })

    const dispatch = useDispatch()

    // retrive transactions data from redux
    const transactions = useSelector((state: state) => { return state.transactions!.data });

    // retrive airports data from redux
    const airports = useSelector((state: state) => { return state.airports!.data });


    const handleAirportToggle = (id: string) => {
        // const airportDiv = document.querySelector(`#${id}`) as HTMLDivElement
        // if (airportDiv.style.display === "none") {
        //     airportDiv.style.display = "block"
        // } else {
        //     airportDiv.style.display = "none"
        // }

        const tempAirportHideStatus = airportHideStatus?.map((data) => {
            if (data.airport_id === id) {
                return {
                    airport_id: data.airport_id,
                    status: !data.status
                }
            } else {
                return {
                    airport_id: data.airport_id,
                    status: data.status
                }
            }

        }) as airportHideStatus

        setAirportHideStatus(tempAirportHideStatus)
    }

    const handleChangeSortBy = (airportId: string, sortType: sortType) => {
        const tempSortBy = sortBy?.map((data) => {
            if (data.airport_id === airportId) {
                return {
                    airport_id: data.airport_id,
                    sort_type: sortType
                }
            } else {
                return {
                    airport_id: data.airport_id,
                    sort_type: data.sort_type
                }
            }

        }) as sortBy

        setSortBy(tempSortBy)
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
        authAxios.post('http://localhost:4000/api/v1/transactions', revertTransactionData, {})
            .then(function (response: any) {
                console.log(response);
                dispatch(setToasts(response.data.msg, true, 'SUCCESS'))
                dispatch(getTransactions(100));
            })
            .catch(function (error) {
                console.log(error);
                dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
            });
    }

    // Handle refresh function
    const handleRefresh = () => {
        dispatch(getAirports());
        dispatch(getAircrafts());
        dispatch(getTransactions(100));
    }

   
    // Initial setup
    useEffect(() => {
        dispatch(setHomeTab('FUEL_CONSUMPTION_REPORT'))
        // dispatch(getAirports())
        // dispatch(getTransactions())
        const firstToShow = airports?.findIndex((airport)=>{
            return airport.transactions?.length! >0
        })
        const tempAirportHideStatus = airports?.map((airport, index) => {
            return {
                airport_id: airport.airport_id,
                status: index ===  firstToShow ? true : false
            }
        }) as airportHideStatus

        setAirportHideStatus(tempAirportHideStatus)

        const tempSortBy = airports?.map((data) => {
            return {
                airport_id: data.airport_id,
                sort_type: 'DATE_ASC'
            }

        }) as sortBy

        setSortBy(tempSortBy)

        // eslint-disable-next-line
    }, [airports])

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <button onClick={handleRefresh} className="btn btn-outline-info no-print" style={{ margin: "10px"}} >
                    <RefreshBlack /> Refresh
                </button>
                <button onClick={() => { window.print() }} className="btn btn-outline-secondary no-print" style={{ right: "5px", margin: "10px"}}>
                    Print
                </button>
            </div>
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
                        <div key={airport.airport_id.toString()} className={`container accordion ${airportHideStatus?.filter((a) => a.airport_id === airport.airport_id)[0].status ? "" : "no-print" }`} style={{ backgroundColor: "#eeeeee" }}>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne" onClick={() => handleAirportToggle(`${airport.airport_id}`)}>
                                    <button className="btn btn-outline" type="button" style={{ width: "100%" }}>
                                        Airport: {airport.airport_name}
                                    </button>
                                    {
                                        airportHideStatus?.filter((a) => a.airport_id === airport.airport_id)[0].status ?
                                            <ExpandLessBlack />
                                            :
                                            <ExpandMoreBlack />
                                    }
                                </h2>
                               
                                <div id={`${airport.airport_id}DataContainer`} style={{ display: airportHideStatus?.filter((a) => a.airport_id === airport.airport_id)[0].status ? "block" : "none" }}>
                                    <br />
                                    {
                                    airport.transactions?.length! >0?
                                    <>
                                    <div className="row justify-content-around" style={{ backgroundColor: "#1a237e", color: "#ffffff" }}>
                                        <div className="col-2">
                                            <strong>
                                                Date/time
                                                {
                                                    sortBy?.filter((data) => data.airport_id === airport.airport_id)[0].sort_type === 'DATE_DESC' ?
                                                        <span onClick={() => { handleChangeSortBy(airport.airport_id.toString(), 'DATE_ASC') }}>
                                                            <ExpandLessWhite />
                                                        </span>
                                                        :
                                                        <span onClick={() => { handleChangeSortBy(airport.airport_id.toString(), 'DATE_DESC') }}>
                                                            <ExpandMoreWhite />
                                                        </span>
                                                }


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
                                                {
                                                    sortBy?.filter((data) => data.airport_id === airport.airport_id)[0].sort_type === 'QUANTITY_DESC' ?
                                                        <span onClick={() => { handleChangeSortBy(airport.airport_id.toString(), 'QUANTITY_ASC') }}>
                                                            <ExpandLessWhite />
                                                        </span>
                                                        :
                                                        <span onClick={() => { handleChangeSortBy(airport.airport_id.toString(), 'QUANTITY_DESC') }}>
                                                            <ExpandMoreWhite />
                                                        </span>
                                                }
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
                                        transactions?.filter((transaction) => transaction.airport_id === airport.airport_id)?.sort(function (a, b) {
                                            const currentSortBy = sortBy?.filter((data) => data.airport_id === airport.airport_id)[0]
                                            if (currentSortBy?.sort_type === 'QUANTITY_ASC') {
                                                return b.quantity - a.quantity
                                            } else if (currentSortBy?.sort_type === 'QUANTITY_DESC') {
                                                return a.quantity - b.quantity
                                            } else if (currentSortBy?.sort_type === 'DATE_ASC') {
                                                let dateA = a.transaction_date_time.toUpperCase(); // ignore upper and lowercase
                                                let dateB = b.transaction_date_time.toUpperCase(); // ignore upper and lowercase
                                                if (dateA < dateB) {
                                                    return -1;
                                                }
                                                if (dateA > dateB) {
                                                    return 1;
                                                }

                                                // names must be equal
                                                return 0;
                                            } else if (currentSortBy?.sort_type === 'DATE_DESC') {
                                                let dateA = a.transaction_date_time.toUpperCase(); // ignore upper and lowercase
                                                let dateB = b.transaction_date_time.toUpperCase(); // ignore upper and lowercase
                                                if (dateA < dateB) {
                                                    return 1;
                                                }
                                                if (dateA > dateB) {
                                                    return -1;
                                                }

                                                // names must be equal
                                                return 0;
                                            }
                                            else {
                                                let dateA = a.transaction_date_time.toUpperCase(); // ignore upper and lowercase
                                                let dateB = b.transaction_date_time.toUpperCase(); // ignore upper and lowercase
                                                if (dateA < dateB) {
                                                    return 1;
                                                }
                                                if (dateA > dateB) {
                                                    return -1;
                                                }

                                                // names must be equal
                                                return 0;
                                            }
                                        }).map((transaction, transactionIndex) => {
                                            return (
                                                <div className="row justify-content-around" key={transaction.transaction_id} style={{ alignItems: "center", backgroundColor: `${transactionIndex % 2 !== 0 ? "#eeeeee" : ""}` }}>
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
                                                        {transaction.aircraft_id === "" ? "---" : transaction.aircraft_id}
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
                                    <p>Fuel Available: {airport.fuel_available}</p>
                                    </>
                                    :
                                    <p>No data available</p>
                                }
                                    

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