import axios from "axios";
import { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setHomeTab } from "../../actions";
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


    const dispatch = useDispatch()



    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement
        setCreateTransactionData({ ...createTransactionData, [target.name]: target.value })
    }
    const handleChangeSelect = (event: React.FormEvent<HTMLSelectElement>) => {
        let target = event.target as HTMLSelectElement
        setCreateTransactionData({ ...createTransactionData, [target.name]: target.value })
    }
    const getTransactions = () => {
        axios.get<transactions>('http://localhost:4000/api/v1/transactions', { withCredentials: true })
            .then(function (response) {
                setTransactions(response.data)
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
            .then(function (response) {
                console.log(response);
                getTransactions();
            })
            .catch(function (error) {
                console.log(error);
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

        axios.get<aircrafts>('http://localhost:4000/api/v1/aircrafts', { withCredentials: true })
            .then(function (response) {
                setAircrafts(response.data)
            })
            .catch(function (error: any) {
                console.log(error)
            })
        axios.get<airports>('http://localhost:4000/api/v1/airports', { withCredentials: true })
            .then(function (response) {
                setAirports(response.data)
            })
            .catch(function (error: any) {
                console.log(error)
            })
        // eslint-disable-next-line
    }, [])
    return (
        <div>
            <br />
            <button type="submit" onClick={() => { setCreateTransactionFormHidden(false) }} className="btn btn-primary">Create new transaction</button>
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
                                                <option value="">Select transaction type</option>
                                                <option>IN</option>
                                                <option>OUT</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="airportSelect" className="form-label">Airport</label>
                                            <select name="airport_id" onChange={handleChangeSelect} id="airportSelect" className="form-select">
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
                                                <select name="aircraft_id" onChange={handleChangeSelect} id="aircraftSelect" className="form-select">
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
                                                Quantity
                                            </label>
                                            <input onChange={handleChange} name="quantity" type="number" min={1} id="quantityInput" className="form-control" placeholder="Fuel Quantity" />
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
                            Quantity
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
                    transactions?.map((transaction) => {
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
        </div>

    )
}

export default Transaction