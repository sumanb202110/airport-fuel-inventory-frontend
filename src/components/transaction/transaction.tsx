// import axios from "axios";
import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAircrafts, getAirports, getTransactions, setDeleteTransactionData, setDeleteTransactionFormHidden, setHomeTab, setSelectedTransaction, setToasts, setTransactions, setUpdateTransactionData, setUpdateTransactionFormHidden } from "../../actions";
// import { aircrafts } from "../aircraft/Aircraft";
// import { airports } from "../airport/Airport";
import { ReactComponent as EditBlack } from '../../svgs/edit_black_24dp.svg'
import { ReactComponent as DeleteBlack } from '../../svgs/delete_black_24dp.svg'
import { ReactComponent as FilterListBlack } from '../../svgs/filter_list_black_24dp.svg'
import { ReactComponent as RefreshBlack } from '../../svgs/refresh_black_24dp.svg'

import { state } from "../../App";
import TransactionSideBar from "./TransactionSideBar";
import axios from "axios";


export type transactions = {
    transaction_id: string,
    transaction_date_time: string,
    transaction_type: string,
    airport_id: string,
    aircraft_id: string,
    quantity: number,
    transaction_id_parent: string
}[]
export type transaction = {
    transaction_id?: string,
    transaction_date_time?: string,
    transaction_type?: string,
    airport_id?: string,
    aircraft_id?: string,
    quantity?: number,
    transaction_id_parent?: string
}

const Transaction: FC = (): ReactElement => {
    // Ref to detect initial renderer
    const initialRender = useRef(true)

    const filterAirportSearchInput = useRef<HTMLInputElement>(null)
    const filterAircraftSearchInput = useRef<HTMLInputElement>(null)


    const [createTransactionFormHidden, setCreateTransactionFormHidden] = useState<boolean>(true)
    const [createTransactionData, setCreateTransactionData] = useState<transaction>({
        transaction_type: "IN",
        airport_id: "",
        aircraft_id: "",
        quantity: 0
    })
    const [createTransactionError, setCreateTransactionError] = useState("")



    // retrive update transaction data from redux
    const updateTransactionData = useSelector((state: state) => { return state.updateTransaction?.updateTransactionData });

    // retrive update transaction form hidden from redux
    const updateTransactionFormHidden = useSelector((state: state) => { return state.updateTransaction?.updateTransactionFormHidden });
    const [updateTransactionError, setUpdateTransactionError] = useState("")



    // retrive delete transaction data from redux
    const deleteTransactionData = useSelector((state: state) => { return state.deleteTransaction?.deleteTransactionData });

    // retrive delete transaction form hidden from redux
    const deleteTransactionFormHidden = useSelector((state: state) => { return state.deleteTransaction?.deleteTransactionFormHidden });



    const [fliterFormHidden, setFilterFormHidden] = useState<boolean>(false)
    const [filterFormData, setFilterFormData] = useState<any>({
        filterAirportId: [],
        filterAircraftId: [],
        filterTransactionType: []
    })
    const [filterSearchAirportName, setFilterSearchAirportName] = useState("")
    const [filterSearchAircraftNo, setFilterSearchAircraftNo] = useState("")
    const [filterByTab, setFilterByTab] = useState("AIRPORT")


    const [count, setCount] = useState(10)
    const [sortBy, setSortBy] = useState("DATE_HIGH_LOW")


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

    // retrive aircrafts data from redux
    const aircrafts = useSelector((state: state) => { return state.aircrafts!.data });

    // retrive selected transaction data from redux
    const selectedTransaction = useSelector((state: state) => { return state.selectedTransaction });

    // Filter form change handler
    const handleFilterFormChangeRadioButton = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement

        let tempData: any = []
        document.querySelectorAll(`input[name=${target.name}]`).forEach((data: any) => {
            if (data.checked) {
                tempData.push(data.value)
            }
        })
        setFilterFormData({ ...filterFormData, [target.name]: tempData })
    }

    const handleFilterAirportSearchChange = () => {
        setFilterSearchAirportName(filterAirportSearchInput.current?.value!)
    }

    const handleFilterAircraftSearchChange = () => {
        setFilterSearchAircraftNo(filterAircraftSearchInput.current?.value!)
    }

    // Handle selected transaction
    const handleSelectedTransaction = (transaction: transaction) => {
        dispatch(setSelectedTransaction(transaction))
    }



    // Handle change for create transacion
    const handleCreateTransactionFormChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement

        setCreateTransactionData({ ...createTransactionData, [target.name]: target.value })
    }
    const handleCreateTransactionFormChangeSelect = (event: React.FormEvent<HTMLSelectElement>) => {
        let target = event.target as HTMLSelectElement

        setCreateTransactionData({ ...createTransactionData, [target.name]: target.value })
    }

    // Handle change for create transacion
    const handleUpdateTransactionFormChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement

        dispatch(setUpdateTransactionData({ ...updateTransactionData, [target.name]: target.value }))
    }
    const handleUpdateTransactionFormChangeSelect = (event: React.FormEvent<HTMLSelectElement>) => {
        let target = event.target as HTMLSelectElement

        dispatch(setUpdateTransactionData({ ...updateTransactionData, [target.name]: target.value }))
    }

    // Handle change for create transacion
    const handleDeleteTransactionFormChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement

        dispatch(setDeleteTransactionData({ ...deleteTransactionData, [target.name]: target.value }))
    }
    const handleDeleteTransactionFormChangeSelect = (event: React.FormEvent<HTMLSelectElement>) => {
        let target = event.target as HTMLSelectElement

        dispatch(setDeleteTransactionData({ ...deleteTransactionData, [target.name]: target.value }))
    }


    const handleSort = (event: React.FormEvent<HTMLSelectElement>) => {
        let target = event.target as HTMLSelectElement

        setSortBy(target.value)


    }


    const handleLoadMore = () => {
        setCount(count + 10)
        // dispatch(getTransactions(count > transactions.length ? count + transactions.length : 100, sortBy))
    }




    // Submit create transaction form
    const handleCreateTransactionFormSubmit = (event: React.FormEvent) => {
        console.log(createTransactionData)
        if (createTransactionData.quantity! > 0) {
            if (createTransactionData.transaction_type === "IN" && Number(airports.filter((airport) => createTransactionData.airport_id === airport.airport_id)[0].fuel_available)
                + Number(createTransactionData.quantity) > Number(airports.filter((airport) => createTransactionData.airport_id === airport.airport_id)[0].fuel_capacity)) {
                setCreateTransactionError("Can not add more then capacity")
            }
            else if (createTransactionData.transaction_type === "OUT" && Number(airports.filter((airport) => createTransactionData.airport_id === airport.airport_id)[0].fuel_available)
                - Number(createTransactionData.quantity) < 0) {
                setCreateTransactionError("Can not take more then available")
            }
            else {
                // api call for create transaction
                authAxios.post('http://localhost:4000/api/v1/transactions', createTransactionData, {})
                    .then(function (response: any) {
                        console.log(response);
                        dispatch(setToasts(response?.data?.msg, true, 'SUCCESS'))
                        setCreateTransactionFormHidden(true)
                        const targetForm = event.target as HTMLFormElement
                        targetForm.reset()
                        setCreateTransactionData(
                            {
                                transaction_type: "IN",
                                airport_id: "",
                                aircraft_id: "",
                                quantity: 0
                            }
                        )
                        if (response.status === 201) {
                            dispatch(setTransactions([response.data, ...transactions]));
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
                    });
            }

        } else {
            setCreateTransactionError("Quantity can not be less then zero")
        }


        event.preventDefault();
    }

    // Submit update transaction form
    const handleUpdateTransactionFormSubmit = (event: React.FormEvent) => {
        console.log(updateTransactionData)

        if (updateTransactionData?.quantity! > 0) {
            if (updateTransactionData?.transaction_type === "IN" && Number(airports.filter((airport) => updateTransactionData.airport_id === airport.airport_id)[0].fuel_available)
                + Number(updateTransactionData.quantity) > Number(airports.filter((airport) => updateTransactionData.airport_id === airport.airport_id)[0].fuel_capacity)) {
                setUpdateTransactionError("Can not add more then capacity")
            }

            else if (updateTransactionData?.transaction_type === "OUT" && Number(airports.filter((airport) => updateTransactionData.airport_id === airport.airport_id)[0].fuel_available)
                - Number(updateTransactionData.quantity) < 0) {
                setUpdateTransactionError("Can not take more then available")
            }
            else {
                // api call for create transaction
                authAxios.patch(`http://localhost:4000/api/v1/transactions/${updateTransactionData?.transaction_id}`, updateTransactionData, {})
                    .then(function (response: any) {
                        console.log(response);
                        dispatch(setToasts(response.data.msg, true, 'SUCCESS'))
                        dispatch(setUpdateTransactionFormHidden(true))
                        const targetForm = event.target as HTMLFormElement
                        targetForm.reset()
                        setUpdateTransactionData(
                            {
                                transaction_type: "IN",
                                airport_id: "",
                                aircraft_id: "",
                                quantity: 0
                            }
                        )
                        if (response.status === 200) {
                            dispatch(setTransactions(transactions.map((transaction) => {
                                if (transaction.transaction_id === updateTransactionData?.transaction_id) {
                                    return {
                                        ...transaction,
                                        transaction_type: updateTransactionData.transaction_type!,
                                        airport_id: updateTransactionData.airport_id,
                                        aircraft_id: updateTransactionData.aircraft_id,
                                        quantity: updateTransactionData.quantity

                                    }
                                } else {
                                    return transaction
                                }
                            })));
                        }


                    })
                    .catch(function (error) {
                        console.log(error);
                        dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
                    });
            }

        } else {
            setUpdateTransactionError("Quantity can not be less then zero")
        }
        event.preventDefault();
    }

    // Submit update transaction form
    const handleDeleteTransaction = (event: React.FormEvent, transaction_id: string) => {

        // api call for create transaction
        authAxios.delete(`http://localhost:4000/api/v1/transactions/${transaction_id}`, {})
            .then(function (response: any) {
                console.log(response);
                dispatch(setToasts("Transaction deleted successfully.", true, 'SUCCESS'))
                dispatch(setDeleteTransactionFormHidden(true))
                if (response.status === 204) {
                    dispatch(setTransactions(transactions.filter((transaction) => {
                        if (transaction.transaction_id !== transaction_id) {
                            return true
                        } else {
                            return false
                        }
                    })));
                }

            })
            .catch(function (error) {
                console.log(error);
                dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
            });
        event.preventDefault();

    }

    // Handle refresh function
    const handleRefresh = () => {
        dispatch(getAirports());
        dispatch(getAircrafts());
        dispatch(getTransactions(count > transactions.length ? count + transactions.length : 100,
            sortBy,
            filterFormData.filterAirportId,
            filterFormData.filterAircraftId,
            filterFormData.filterTransactionType
        ));
    }

    // On create form data change
    useEffect(() => {
        if (createTransactionData.quantity! > 0) {
            if (createTransactionData.transaction_type === "IN" && Number(airports.filter((airport) => createTransactionData.airport_id === airport.airport_id)[0].fuel_available)
                + Number(createTransactionData.quantity) > Number(airports.filter((airport) => createTransactionData.airport_id === airport.airport_id)[0].fuel_capacity)) {
                setCreateTransactionError("Can not add more then capacity")
            }
            else if (createTransactionData.transaction_type === "OUT" && Number(airports.filter((airport) => createTransactionData.airport_id === airport.airport_id)[0].fuel_available)
                - Number(createTransactionData.quantity) < 0) {
                setCreateTransactionError("Can not take more then available")
            }
            else {
                setCreateTransactionError("")
            }
        } else {
            setCreateTransactionError("Quantity can not be less then zero")
        }
        // eslint-disable-next-line
    }, [createTransactionData])

    // On update form data change
    useEffect(() => {
        if (updateTransactionData?.quantity! > 0) {
            if (updateTransactionData?.transaction_type === "IN" && Number(airports.filter((airport) => updateTransactionData.airport_id === airport.airport_id)[0].fuel_available)
                + Number(updateTransactionData.quantity) > Number(airports.filter((airport) => updateTransactionData.airport_id === airport.airport_id)[0].fuel_capacity)) {
                setUpdateTransactionError("Can not add more then capacity")
            }

            else if (updateTransactionData?.transaction_type === "OUT" && Number(airports.filter((airport) => updateTransactionData.airport_id === airport.airport_id)[0].fuel_available)
                - Number(updateTransactionData.quantity) < 0) {
                setUpdateTransactionError("Can not take more then available")
            }
            else {
                setCreateTransactionError("")
            }
        } else {
            setCreateTransactionError("Quantity can not be less then zero")
        }
        // eslint-disable-next-line
    }, [updateTransactionData])

    useEffect(() => {
        if (createTransactionData.transaction_type === 'IN') {
            setCreateTransactionData({ ...createTransactionData, aircraft_id: "" })
        }
        // eslint-disable-next-line
    }, [createTransactionData.transaction_type])

    // On sort and filter change
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false
        } else {
            dispatch(getTransactions(count > transactions?.length ? count + transactions?.length : 100,
                sortBy,
                filterFormData.filterAirportId,
                filterFormData.filterAircraftId,
                filterFormData.filterTransactionType
            ));
        }

        // eslint-disable-next-line
    }, [filterFormData, sortBy, count])


    useEffect(() => {
        dispatch(setHomeTab('TRANSACTION'))
        // eslint-disable-next-line
    }, [])




    return (
        <div>
            <br />
            <div className={`modal ${createTransactionFormHidden ? 'hide' : 'show'}`} style={{ backgroundColor: "#00000063", display: `${createTransactionFormHidden ? 'none' : 'block'}` }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleCreateTransactionFormSubmit}>
                            <div className="modal-header">
                                <button type="button" onClick={() => { setCreateTransactionFormHidden(true) }} className="close btn btn-light" data-dismiss="modal" aria-hidden="true">&times;</button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <fieldset >
                                        <legend>Create Transaction</legend>
                                        <div className="mb-3">
                                            <label htmlFor="typeSelect" className="form-label">Type</label>
                                            <select name="transaction_type" onChange={handleCreateTransactionFormChangeSelect} id="typeSelect" className="form-select">
                                                <option value={createTransactionData.transaction_type}>Select transaction type</option>
                                                <option value="IN" >IN</option>
                                                <option value="OUT" >OUT</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="airportSelect" className="form-label">Airport</label>
                                            <select name="airport_id" value={createTransactionData.airport_id} onChange={handleCreateTransactionFormChangeSelect} id="airportSelect" className="form-select">
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
                                                <select name="aircraft_id" value={createTransactionData.aircraft_id} onChange={handleCreateTransactionFormChangeSelect} id="aircraftSelect" className="form-select">
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
                                            <input value={createTransactionData.quantity} onChange={handleCreateTransactionFormChange} name="quantity" type="number" min={1}
                                                max={
                                                    createTransactionData.transaction_type === 'IN'
                                                        ? airports?.filter((airport) => airport.airport_id === createTransactionData.airport_id).map(airport => Number(airport?.fuel_capacity) - Number(airport?.fuel_available))[0]
                                                        : Number(airports?.filter((airport) => airport.airport_id === createTransactionData.airport_id)[0]?.fuel_available)
                                                }
                                                id="quantityInput" className="form-control" placeholder="Fuel Quantity" />
                                        </div>
                                        <span style={{ color: "#e53935" }}>
                                            {createTransactionError}
                                        </span>
                                    </fieldset>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => { setCreateTransactionFormHidden(true) }} className="btn btn-default" data-dismiss="modal">Close</button>
                                <button disabled={createTransactionError === "" ? false : true} type="submit" className="btn btn-primary">Submit</button>

                            </div>
                        </form>
                    </div>

                </div>

            </div>
            <div className={`modal ${updateTransactionFormHidden ? 'hide' : 'show'}`} style={{ backgroundColor: "#00000063", display: `${updateTransactionFormHidden ? 'none' : 'block'}` }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleUpdateTransactionFormSubmit}>
                            <div className="modal-header">
                                <button type="button" onClick={() => { dispatch(setUpdateTransactionFormHidden(true)) }} className="close btn btn-light" data-dismiss="modal" aria-hidden="true">&times;</button>

                            </div>
                            <div className="modal-body">
                                <div>

                                    <fieldset >
                                        <legend>Update Transaction</legend>
                                        <div className="mb-3">
                                            <label htmlFor="typeSelect" className="form-label">Type</label>
                                            <select name="transaction_type" value={updateTransactionData?.transaction_type} onChange={handleUpdateTransactionFormChangeSelect} id="typeSelect" className="form-select">
                                                <option value="IN" >IN</option>
                                                <option value="OUT" >OUT</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="airportSelect" className="form-label">Airport</label>
                                            <select name="airport_id" value={updateTransactionData?.airport_id.toString()} onChange={handleUpdateTransactionFormChangeSelect} id="airportSelect" className="form-select">
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
                                        {updateTransactionData?.transaction_type === "IN" ? null :
                                            <div className="mb-3">
                                                <label htmlFor="aircraftSelect" className="form-label">Aircraft</label>
                                                <select name="aircraft_id" value={updateTransactionData?.aircraft_id} onChange={handleUpdateTransactionFormChangeSelect} id="aircraftSelect" className="form-select">
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
                                            <input value={updateTransactionData?.quantity} onChange={handleUpdateTransactionFormChange} name="quantity" type="number" min={1}
                                                max={
                                                    updateTransactionData?.transaction_type === 'IN'
                                                        ? airports?.filter((airport) => airport.airport_id === updateTransactionData.airport_id).map(airport => Number(airport?.fuel_capacity) - Number(airport?.fuel_available))[0]
                                                        : Number(airports?.filter((airport) => airport.airport_id === updateTransactionData?.airport_id)[0]?.fuel_available)
                                                }
                                                id="quantityInput" className="form-control" placeholder="Fuel Quantity" />
                                        </div>
                                        <span style={{ color: "#e53935" }}>
                                            {updateTransactionError}
                                        </span>
                                    </fieldset>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => { dispatch(setUpdateTransactionFormHidden(true)) }} className="btn btn-default" data-dismiss="modal">Close</button>
                                <button disabled={updateTransactionError === "" ? false : true} type="submit" className="btn btn-primary">Update</button>

                            </div>
                        </form>
                    </div>

                </div>

            </div>
            <div className={`modal ${deleteTransactionFormHidden ? 'hide' : 'show'}`} style={{ backgroundColor: "#00000063", display: `${deleteTransactionFormHidden ? 'none' : 'block'}` }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form >
                            <div className="modal-header">
                                <button type="button" onClick={() => { dispatch(setDeleteTransactionFormHidden(true)) }} className="close btn btn-light" data-dismiss="modal" aria-hidden="true">&times;</button>

                            </div>
                            <div className="modal-body">
                                <div>

                                    <fieldset >
                                        <legend>Delete Transaction</legend>
                                        <div className="mb-3">
                                            <label htmlFor="typeSelect" className="form-label">Type</label>
                                            <select disabled name="transaction_type" onChange={handleDeleteTransactionFormChangeSelect} value={deleteTransactionData?.transaction_type} id="typeSelect" className="form-select">
                                                <option value="IN" >IN</option>
                                                <option value="OUT" >OUT</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="airportSelect" className="form-label">Airport</label>
                                            <select disabled name="airport_id" onChange={handleDeleteTransactionFormChangeSelect} value={deleteTransactionData?.airport_id.toString()} id="airportSelect" className="form-select">
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
                                        {deleteTransactionData?.transaction_type === "IN" ? null :
                                            <div className="mb-3">
                                                <label htmlFor="aircraftSelect" className="form-label">Aircraft</label>
                                                <select disabled name="aircraft_id" onChange={handleDeleteTransactionFormChangeSelect} value={deleteTransactionData?.aircraft_id} id="aircraftSelect" className="form-select">
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
                                            <input disabled value={deleteTransactionData?.quantity} onChange={handleDeleteTransactionFormChange} name="quantity" type="number" min={1}
                                                max={
                                                    deleteTransactionData?.transaction_type === 'IN'
                                                        ? airports?.filter((airport) => airport.airport_id === deleteTransactionData?.airport_id).map(airport => Number(airport?.fuel_capacity) - Number(airport?.fuel_available))[0]
                                                        : Number(airports?.find((airport) => airport.airport_id === deleteTransactionData?.airport_id)?.fuel_available)
                                                }
                                                id="quantityInput" className="form-control" placeholder="Fuel Quantity" />
                                        </div>
                                    </fieldset>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => { dispatch(setDeleteTransactionFormHidden(true)) }} className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="submit" onClick={(e) => { handleDeleteTransaction(e, deleteTransactionData?.transaction_id!) }} className="btn btn-primary">Delete</button>

                            </div>
                        </form>
                    </div>

                </div>

            </div>


            <div className="container-fluid" style={{}}>

                <div className="row">

                    <div className="col-md-2 no-mobile">
                        <div style={{
                            position: "fixed",
                            width: "14%"
                        }}>
                            <button
                                className="no-mobie"
                                onClick={() => { setFilterFormHidden(!fliterFormHidden) }}
                                style={{
                                    border: "none"
                                }}
                            >
                                <div className="no-print">
                                    <FilterListBlack />
                                </div>
                            </button>
                            <div style={{
                                backgroundColor: "#b0bec5",
                                display: "flex",
                                flexDirection: "column",
                                textAlign: "center",
                                alignItems: "center",
                                padding: "5px"
                            }}>
                                {
                                    filterFormData.filterAirportId.length === 0 ?
                                        null :
                                        <label>Airports</label>
                                }
                                {filterFormData.filterAirportId.map((airportId: string) => {
                                    return <div key={airportId} style={{
                                        backgroundColor: "#f5f5f5",
                                        width: "100%",
                                        margin: "5px",
                                        borderRadius: "10px",
                                        padding: "10px",
                                        display: "flex"

                                    }}>
                                        <div style={{
                                            width: "100%",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            display: "inline-block"
                                        }}>{
                                                airports.find((airport) => {
                                                    return airportId === airport.airport_id
                                                })?.airport_name
                                            }</div>
                                        <button onClick={() => {
                                            setFilterFormData({
                                                ...filterFormData,
                                                filterAirportId: filterFormData.filterAirportId.filter((data: any) => data !== airportId)
                                            })
                                        }} style={{
                                            display: "inline",
                                            border: "none",
                                            backgroundColor: "#f5f5f5"
                                        }}>
                                            X
                                        </button>
                                    </div>
                                })}
                                {
                                    filterFormData.filterAircraftId.length === 0 ?
                                        null :
                                        <label>Aircrafts</label>
                                }

                                {filterFormData.filterAircraftId.map((aircraftId: string) => {
                                    return <div key={aircraftId} style={{
                                        backgroundColor: "#f5f5f5",
                                        width: "100%",
                                        margin: "5px",
                                        borderRadius: "10px",
                                        padding: "10px",
                                        display: "flex"
                                    }}>
                                        <div style={{
                                            width: "100%",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            display: "inline-block"
                                        }}>
                                            {
                                                aircrafts.find((aircraft) => {
                                                    return aircraftId === aircraft.aircraft_id
                                                })?.aircraft_no
                                            }
                                        </div>
                                        <button onClick={() => {
                                            setFilterFormData({
                                                ...filterFormData,
                                                filterAircraftId: filterFormData.filterAircraftId.filter((data: any) => data !== aircraftId)
                                            })
                                        }} style={{
                                            display: "inline",
                                            border: "none",
                                            backgroundColor: "#f5f5f5"
                                        }}>
                                            X
                                        </button>
                                    </div>
                                })}

                                {
                                    filterFormData.filterTransactionType.length === 0 ?
                                        null :
                                        <label>Transaction Type</label>
                                }
                                {filterFormData.filterTransactionType.map((transactionType: string) => {
                                    return <div key={transactionType} style={{
                                        backgroundColor: "#f5f5f5",
                                        width: "100%",
                                        margin: "5px",
                                        borderRadius: "10px",
                                        padding: "10px",
                                        display: "flex"
                                    }}>
                                        <div style={{
                                            width: "100%",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            display: "inline-block"
                                        }}>
                                            {transactionType}
                                        </div>
                                        <button onClick={() => {
                                            setFilterFormData({
                                                ...filterFormData,
                                                filterTransactionType: filterFormData.filterTransactionType.filter((data: any) => data !== transactionType)
                                            })
                                        }} style={{
                                            display: "inline",
                                            border: "none",
                                            backgroundColor: "#f5f5f5"
                                        }}>
                                            X
                                        </button>
                                    </div>
                                })}

                            </div>
                            <div className="no-mobile no-print" style={{
                                height: "100%",
                                width: "100%",
                                overflow: "auto",
                                // wordWrap: "break-word",
                                display: fliterFormHidden ? "none" : ""
                            }}>
                                <form style={{
                                    backgroundColor: "#b0bec5",
                                    // display: "flex",
                                    // flexDirection: "column",
                                    justifyContent: "space-around",
                                    height: "50vh",
                                    width: "100%",
                                    padding: "5px"
                                }} >

                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%"
                                    }}>
                                        <div onClick={() => { filterByTab === "AIRPORT" ? setFilterByTab("") : setFilterByTab("AIRPORT") }}
                                            style={{
                                                backgroundColor: filterByTab === "AIRPORT" ? "#f5f5f5" : "",
                                                borderStyle: "solid",
                                                borderWidth: "0px 0px 2px 0px"
                                            }}
                                        >
                                            <label><strong>Airport</strong></label>
                                        </div>
                                        <div style={{
                                            display: filterByTab === "AIRPORT" ? "block" : "none",
                                            width: "100%"
                                        }}>
                                            <input type="text" onChange={handleFilterAirportSearchChange} ref={filterAirportSearchInput} style={{ width: "100%" }} placeholder="Search airport" />
                                        </div>
                                        <div style={{
                                            width: "100%",
                                            height: "100%",
                                            overflow: "auto",
                                            display: filterByTab === "AIRPORT" ? "flex" : "none",
                                            flexDirection: "column",
                                            backgroundColor: filterByTab === "AIRPORT" ? "#f5f5f5" : ""
                                        }}>

                                            <div className="container-fluid g-0" style={{
                                                height: "100%",
                                                width: "100%",
                                                display: filterByTab === "AIRPORT" ? "flex" : "none",
                                                flexDirection: "column"
                                                // wordWrap: "break-word"
                                            }}>
                                                {
                                                    airports?.filter((airport) => {
                                                        return airport.airport_name.toUpperCase().includes(filterSearchAirportName.toUpperCase())
                                                    }).map((airport) => {
                                                        return (
                                                            <div className="row align-self-center" key={airport.airport_id.toString()} style={{
                                                                width: "100%",
                                                                justifyContent: "center",
                                                                borderStyle: "groove",
                                                                borderWidth: "2px 0px 2px 0px"
                                                            }}>
                                                                <input name="filterAirportId"
                                                                    checked={filterFormData.filterAirportId.find((data: any) => data === airport.airport_id)}
                                                                    onChange={handleFilterFormChangeRadioButton} className="col-2 align-self-center" type="checkbox" value={airport.airport_id.toString()} id={`airportFilterCheckbox${airport.airport_id}`} />
                                                                <label className="col-10" htmlFor={`airportFilterCheckbox${airport.airport_id}`}>
                                                                    {airport.airport_name}
                                                                </label>
                                                            </div>

                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div onClick={() => { filterByTab === "AIRCRAFT" ? setFilterByTab("") : setFilterByTab("AIRCRAFT") }}
                                            style={{
                                                backgroundColor: filterByTab === "AIRCRAFT" ? "#f5f5f5" : "",
                                                borderStyle: "solid",
                                                borderWidth: "0px 0px 2px 0px"
                                            }}
                                        >
                                            <label><strong>Aircraft</strong></label>
                                            <div style={{
                                                display: filterByTab === "AIRCRAFT" ? "block" : "none",
                                                width: "100%"
                                            }}>
                                                <input type="text" onChange={handleFilterAircraftSearchChange} ref={filterAircraftSearchInput} style={{ width: "100%" }} placeholder="Search aircraft" />
                                            </div>
                                        </div>

                                        <div style={{
                                            width: "100%",
                                            height: "100%",
                                            overflowX: "auto",
                                            display: filterByTab === "AIRCRAFT" ? "flex" : "none",
                                            flexDirection: "column",
                                            backgroundColor: filterByTab === "AIRCRAFT" ? "#f5f5f5" : ""
                                        }}
                                        >

                                            <div style={{
                                                height: "100vh",
                                                width: "fit-content",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                display: filterByTab === "AIRCRAFT" ? "flex" : "none"
                                            }} >
                                                {
                                                    aircrafts?.filter((aircraft) => {
                                                        return aircraft.aircraft_no.toUpperCase().includes(filterSearchAircraftNo.toUpperCase())
                                                    }).map((aircraft) => {
                                                        return (
                                                            <div className="form-check" key={aircraft.aircraft_id.toString()} style={{ margin: "5px" }}>
                                                                <input name="filterAircraftId"
                                                                    checked={filterFormData.filterAircraftId.find((data: any) => data === aircraft.aircraft_id)}
                                                                    onChange={handleFilterFormChangeRadioButton} className="form-check-input" type="checkbox" value={aircraft.aircraft_id} id={`airportFilterCheckbox${aircraft.aircraft_id}`} />
                                                                <label className="form-check-label" htmlFor={`airportFilterCheckbox${aircraft.aircraft_id}`}>
                                                                    {aircraft.aircraft_no}
                                                                </label>
                                                            </div>

                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div onClick={() => { filterByTab === "TRANSACTION_TYPE" ? setFilterByTab("") : setFilterByTab("TRANSACTION_TYPE") }}
                                            style={{
                                                backgroundColor: filterByTab === "TRANSACTION_TYPE" ? "#f5f5f5" : "",
                                                borderStyle: "solid",
                                                borderWidth: "0px 0px 2px 0px"
                                            }}
                                        >
                                            <label><strong>Transaction Type</strong></label>
                                        </div>
                                        <div style={{
                                            display: filterByTab === "TRANSACTION_TYPE" ? "flex" : "none",
                                            width: "100%",
                                            height: "100%",
                                            backgroundColor: filterByTab === "TRANSACTION_TYPE" ? "#f5f5f5" : "",
                                            padding: "5px",
                                            flexDirection: "column"
                                        }}>
                                            <div className="form-check" style={{ width: "fit-content" }}>
                                                <input name="filterTransactionType"
                                                    checked={filterFormData.filterTransactionType.find((data: any) => data === "IN")}
                                                    onChange={handleFilterFormChangeRadioButton} className="form-check-input" type="checkbox" value="IN" id={`airportFilterCheckboxIN`} />
                                                <label className="form-check-label" htmlFor={`airportFilterCheckboxIN`}>
                                                    IN
                                                </label>
                                            </div>
                                            <div className="form-check" style={{ width: "fit-content" }}>
                                                <input name="filterTransactionType"
                                                    checked={filterFormData.filterTransactionType.find((data: any) => data === "OUT")}
                                                    onChange={handleFilterFormChangeRadioButton} className="form-check-input" type="checkbox" value="OUT" id={`airportFilterCheckboxOUT`} />
                                                <label className="form-check-label" htmlFor={`airportFilterCheckboxOUT`}>
                                                    OUT
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-10 container-fluid">
                        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", margin: "5px" }}>
                            <button type="button" onClick={() => { setCreateTransactionFormHidden(false) }} className="btn btn-primary no-print">Create new transaction</button>
                            <span style={{ display: "flex" }}>
                                <select name="sortBy" onChange={handleSort} style={{ maxWidth: "15rem" }} id="sortBySelect" className="form-select no-print">
                                    <option value="DATE_HIGH_LOW">Sort by date high to low</option>
                                    <option value="DATE_LOW_HIGH">Sort by date low to high</option>
                                    <option value="QUANTITY_LOW_HIGH">Sort by quantity low to high</option>
                                    <option value="QUANTITY_HIGH_LOW" >Sort by quantity high to low</option>
                                </select>
                                <span style={{ width: "10px" }}></span>
                                <button onClick={() => { window.print() }} className="btn btn-outline-secondary no-print" style={{ right: "5px" }}>Print</button>
                                <span style={{ width: "10px" }}></span>
                                <button onClick={handleRefresh} className="btn btn-outline-info no-print" >
                                    <RefreshBlack /> Refresh
                                </button>
                            </span>
                        </div>
                        <div className="row">
                            <div className="col container" style={{ maxWidth: "100%", minWidth: "80%" }} >
                                <div className="row justify-content-between" style={{
                                    backgroundColor: "#1a237e", color: "#ffffff",
                                    alignItems: "center"
                                }}>
                                    <div className="col-md-2 d-none d-lg-block">
                                        <strong>
                                            Transaction Date and Time
                                        </strong>
                                    </div>
                                    <div className="col-md-1 d-none d-lg-block">
                                        <strong>
                                            Transaction type
                                        </strong>
                                    </div>
                                    <div className="col-2">
                                        <strong>
                                            Quantity (L)
                                        </strong>
                                    </div>
                                    <div className="col-1">
                                        <strong>
                                            Airport Id
                                        </strong>
                                    </div>
                                    <div className="col-2">
                                        <strong>
                                            Aircraft Id
                                        </strong>
                                    </div>
                                    <div className="col-2">
                                        <strong>
                                            Transaction Id of parent
                                        </strong>
                                    </div>
                                    <div className="col-2 no-print">
                                    </div>
                                </div>
                                {
                                    transactions

                                        ?.slice(0, count).map((transaction, transactionIndex) => {
                                            return (
                                                <div className="row justify-content-between" key={transaction.transaction_id} onClick={() => { handleSelectedTransaction(transaction) }} id={`row${transaction.transaction_id}`} style={{
                                                    backgroundColor: transactionIndex % 2 !== 0 ? "#eeeeee" : "",
                                                    alignItems: "center",
                                                    paddingRight: "20px",
                                                    border: `${selectedTransaction.transaction_id === transaction.transaction_id ? 'solid' : 'none'}`
                                                }}
                                                    onMouseOver={
                                                        () => {
                                                            const row = document.querySelector(`#row${transaction.transaction_id}`) as HTMLDivElement
                                                            row.style.backgroundColor = "#76ff03"
                                                        }}
                                                    onMouseOut={
                                                        () => {
                                                            const row = document.querySelector(`#row${transaction.transaction_id}`) as HTMLDivElement
                                                            row.style.backgroundColor = transactionIndex % 2 !== 0 ? "#eeeeee" : ""
                                                        }}>
                                                    <div className="col-sm-2">
                                                        {new Date(transaction.transaction_date_time)
                                                            .toLocaleString("en-US", { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                                    </div>
                                                    <div className="col-sm-1">
                                                        {transaction.transaction_type}
                                                    </div>
                                                    <div className="col-2">
                                                        {transaction.quantity}
                                                    </div>
                                                    <div className="col-1">
                                                        {transaction.airport_id}
                                                    </div>
                                                    <div className="col-2">
                                                        {transaction.aircraft_id === "" ? "---" : transaction.aircraft_id}
                                                    </div>
                                                    <div className="col-2">
                                                        {transaction.transaction_id_parent === undefined ? "---" : transaction.transaction_id_parent}
                                                    </div>
                                                    <div className="col-2 no-print">
                                                        <button style={
                                                            {
                                                                backgroundColor: transactionIndex % 2 !== 0 ? "#eeeeee" : "white",
                                                                border: "none",
                                                                borderRadius: "5px"
                                                            }
                                                        } onClick={() => {
                                                            dispatch(setUpdateTransactionData(
                                                                {
                                                                    transaction_id: transaction.transaction_id,
                                                                    transaction_type: transaction.transaction_type,
                                                                    airport_id: transaction.airport_id,
                                                                    aircraft_id: transaction.aircraft_id,
                                                                    quantity: transaction.quantity
                                                                }
                                                            ));
                                                            dispatch(setUpdateTransactionFormHidden(false))
                                                        }}>
                                                            <EditBlack />
                                                        </button>
                                                        <span style={{ padding: "5px" }}></span>
                                                        <button
                                                            style={
                                                                {
                                                                    backgroundColor: transactionIndex % 2 !== 0 ? "#eeeeee" : "white",
                                                                    border: "none",
                                                                    borderRadius: "5px"
                                                                }
                                                            }
                                                            onClick={() => {
                                                                dispatch(setDeleteTransactionData(
                                                                    {
                                                                        transaction_id: transaction.transaction_id,
                                                                        transaction_type: transaction.transaction_type,
                                                                        airport_id: transaction.airport_id,
                                                                        aircraft_id: transaction.aircraft_id,
                                                                        quantity: transaction.quantity
                                                                    }
                                                                ));
                                                                dispatch(setDeleteTransactionFormHidden(false))
                                                            }}>
                                                            <DeleteBlack />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                }

                                {
                                    transactions?.length! > count ?
                                        <button type="button" style={{ margin: "10px" }} className="btn btn-outline-secondary no-print" onClick={handleLoadMore}>Load More</button>
                                        :
                                        null

                                }

                            </div>
                            {/* <div className="col" style={{ maxWidth: "20%"}}> */}
                            <TransactionSideBar />
                            {/* </div> */}
                        </div>
                    </div>

                </div>
            </div>
            <br />
            <br />
        </div>

    )
}

export default Transaction
