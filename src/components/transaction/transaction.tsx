import axios from "axios";
import { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setHomeTab, setToasts } from "../../actions";
import { aircrafts } from "../aircraft/Aircraft";
import { airports } from "../airport/Airport";

export type transactions = {
    transaction_id: string,
    transaction_date_time: string,
    transaction_type: string,
    airport_id: string,
    aircraft_id: string,
    quantity: number,
    transaction_id_parent: string
}[]
type transaction = {
    transaction_type: string,
    airport_id: string,
    aircraft_id: string,
    quantity: number,
}

const Transaction: FC = (): ReactElement => {
    const [transactions, setTransactions] = useState<transactions>()
    const [aircrafts, setAircrafts] = useState<aircrafts>()
    const [airports, setAirports] = useState<airports>()
    const [createTransactionFormHidden, setCreateTransactionFormHidden] = useState<boolean>(true)
    const [createTransactionData, setCreateTransactionData] = useState<transaction>({
        transaction_type: "IN",
        airport_id: "",
        aircraft_id: "",
        quantity: 0
    })
    const [count, setCount] = useState(10)
    const [sortBy, setSortBy] = useState("")


    const dispatch = useDispatch()



    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement

        setCreateTransactionData({ ...createTransactionData, [target.name]: target.value })
    }
    const handleChangeSelect = (event: React.FormEvent<HTMLSelectElement>) => {
        let target = event.target as HTMLSelectElement

        setCreateTransactionData({ ...createTransactionData, [target.name]: target.value })


    }

    const handleSort = (event: React.FormEvent<HTMLSelectElement>) => {
        let target = event.target as HTMLSelectElement

        setSortBy(target.value)


    }


    const handleLoadMore = () => {
        setCount(count + 10)
        getTransactions()
    }

    const getTransactions = () => {
        axios.get<transactions>(`http://localhost:4000/api/v1/transactions`, { withCredentials: true })
            .then(function (response: any) {
                setTransactions(response.data)
            })
            .catch(function (error: any) {
                console.log(error)
                dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
            })
    }

    const getAircrafts = () => {
        axios.get<aircrafts>('http://localhost:4000/api/v1/aircrafts', { withCredentials: true })
            .then(function (response) {
                setAircrafts(response.data)
            })
            .catch(function (error: any) {
                console.log(error)
            })
    }

    const getAirports = () => {
        axios.get<airports>('http://localhost:4000/api/v1/airports', { withCredentials: true })
            .then(function (response) {
                setAirports(response.data)
            })
            .catch(function (error: any) {
                console.log(error)
            })
    }


    // Submit form
    const handleSubmit = (event: React.FormEvent) => {
        console.log(createTransactionData)

        // api call for create transaction
        axios.post('http://localhost:4000/api/v1/transactions', createTransactionData, { withCredentials: true })
            .then(function (response: any) {
                console.log(response);
                dispatch(setToasts(response.data.msg, true, 'SUCCESS'))
                setCreateTransactionFormHidden(true)
                setCreateTransactionData(
                    {
                        transaction_type: "IN",
                        airport_id: "",
                        aircraft_id: "",
                        quantity: 0
                    }
                )
                getTransactions();
                getAirports();
            })
            .catch(function (error) {
                console.log(error);
                dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
            });
        event.preventDefault();
    }

    useEffect(() => {
        if (createTransactionData.transaction_type === 'IN') {
            setCreateTransactionData({ ...createTransactionData, aircraft_id: "" })
        }
        // eslint-disable-next-line
    }, [createTransactionData.transaction_type])
    useEffect(() => {
        dispatch(setHomeTab('TRANSACTION'))

        getTransactions();

        getAircrafts();

        getAirports();

        // eslint-disable-next-line
    }, [])

    

    useEffect(() => {
        getTransactions()
    // eslint-disable-next-line
    }, [count])
    return (
        <div>
            <br />
            <button type="button" onClick={() => { setCreateTransactionFormHidden(false) }} className="btn btn-primary">Create new transaction</button>
            <br />

            <div className={`modal ${createTransactionFormHidden ? 'hide' : 'show'}`} style={{ backgroundColor: "#00000063", display: `${createTransactionFormHidden ? 'none' : 'block'}` }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <button type="button" onClick={() => { setCreateTransactionFormHidden(true) }} className="close btn btn-light" data-dismiss="modal" aria-hidden="true">&times;</button>

                            </div>
                            <div className="modal-body">
                                <div>

                                    <fieldset >
                                        <legend>Create Transaction</legend>
                                        <div className="mb-3">
                                            <label htmlFor="typeSelect" className="form-label">Type</label>
                                            <select name="transaction_type" onChange={handleChangeSelect} id="typeSelect" className="form-select">
                                                <option value={createTransactionData.transaction_type}>Select transaction type</option>
                                                <option value="IN" >IN</option>
                                                <option value="OUT" >OUT</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="airportSelect" className="form-label">Airport</label>
                                            <select name="airport_id" value={createTransactionData.airport_id} onChange={handleChangeSelect} id="airportSelect" className="form-select">
                                                <option value="">Select Airport Name</option>
                                                {
                                                    airports?.map((airport) => {
                                                        return (
                                                            <option value={airport.airport_id.toString()} key={airport.airport_id.toString()}>{airport.airport_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        {createTransactionData.transaction_type === "IN" ? null :
                                            <div className="mb-3">
                                                <label htmlFor="aircraftSelect" className="form-label">Aircraft</label>
                                                <select name="aircraft_id" value={createTransactionData.aircraft_id} onChange={handleChangeSelect} id="aircraftSelect" className="form-select">
                                                    <option value="">Select Aircraft Name</option>
                                                    {
                                                        aircrafts?.map((aircraft) => {
                                                            return (
                                                                <option value={aircraft.aircraft_id} key={aircraft.aircraft_id}>{aircraft.aircraft_id}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        }
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="quantityInput">
                                                Quantity(L)
                                            </label>
                                            <input value={createTransactionData.quantity} onChange={handleChange} name="quantity" type="number" min={1}
                                                max={
                                                    createTransactionData.transaction_type === 'IN'
                                                        ? airports?.filter((airport) => airport.airport_id === createTransactionData.airport_id).map(airport => Number(airport?.fuel_capacity) - Number(airport?.fuel_available))[0]
                                                        : Number(airports?.filter((airport) => airport.airport_id === createTransactionData.airport_id)[0]?.fuel_available)
                                                }
                                                id="quantityInput" className="form-control" placeholder="Fuel Quantity" />
                                        </div>
                                    </fieldset>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => { setCreateTransactionFormHidden(true) }} className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Submit</button>

                            </div>
                        </form>
                    </div>

                </div>

            </div>
            <br />
            <select name="sortBy" onChange={handleSort} id="sortBySelect" className="form-select">
                <option value="DATE_HIGH_LOW">Sort by date high to low</option>
                <option value="DATE_LOW_HIGH">Sort by date low to high</option>
                <option value="QUANTITY_LOW_HIGH">Sort by quantity low to high</option>
                <option value="QUANTITY_HIGH_LOW" >Sort by quantity high to low</option>
            </select>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <strong>
                            Transaction Date and Time
                        </strong>
                    </div>
                    <div className="col">
                        <strong>
                            Transaction type
                        </strong>
                    </div>
                    <div className="col">
                        <strong>
                            Quantity(L)
                        </strong>
                    </div>
                    <div className="col">
                        <strong>
                            Airport Id
                        </strong>
                    </div>
                    <div className="col">
                        <strong>
                            Aircraft Id
                        </strong>
                    </div>
                    <div className="col">
                        <strong>
                            Transaction Id of parent
                        </strong>
                    </div>
                    <hr />
                </div>
                {
                    transactions?.sort(function (a, b) {

                        if (sortBy === "QUANTITY_HIGH_LOW") {
                            return b.quantity - a.quantity
                        } else if (sortBy === "QUANTITY_LOW_HIGH") {
                            return a.quantity - b.quantity
                        }else if (sortBy === "DATE_LOW_HIGH") {
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
                    }).slice(0, count).map((transaction) => {
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
                                    {transaction.airport_id}
                                </div>
                                <div className="col">
                                    {transaction.aircraft_id}
                                </div>
                                <div className="col">
                                    {transaction.transaction_id_parent}
                                </div>
                                <hr />
                            </div>
                        )
                    })
                }
            </div>
            {
                transactions?.length! > count ?
                    <button type="button" className="btn btn-outline-secondary" onClick={handleLoadMore}>Load More</button>
                    :
                    null

            }
            <br />
            <br />
        </div>

    )
}

export default Transaction