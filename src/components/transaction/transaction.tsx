import axios from "axios";
import { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAircrafts, getAirports, getTransactions, setHomeTab, setSelectedTransaction, setToasts } from "../../actions";
// import { aircrafts } from "../aircraft/Aircraft";
// import { airports } from "../airport/Airport";
import { ReactComponent as EditBlack } from '../../svgs/edit_black_24dp.svg'
import { ReactComponent as DeleteBlack } from '../../svgs/delete_black_24dp.svg'
import { ReactComponent as FilterListBlack } from '../../svgs/filter_list_black_24dp.svg'
import { state } from "../../App";
import TransactionSideBar from "../transaction_side_bar/TransactionSideBar";


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
    transaction_type: string,
    airport_id: string,
    aircraft_id: string,
    quantity: number,
    transaction_id_parent?: string
}
// type filterFormData = {
//     filterAirportId?: [],
//     filterAircraftId?: [],
//     filterTransacrtionType?: string
// }

const Transaction: FC = (): ReactElement => {
    // const [transactions, setTransactions] = useState<transactions>()
    // const [aircrafts, setAircrafts] = useState<aircrafts>()
    // const [airports, setAirports] = useState<airports>()
    const [createTransactionFormHidden, setCreateTransactionFormHidden] = useState<boolean>(true)
    const [createTransactionData, setCreateTransactionData] = useState<transaction>({
        transaction_type: "IN",
        airport_id: "",
        aircraft_id: "",
        quantity: 0
    })

    const [updateTransactionFormHidden, setUpdateTransactionFormHidden] = useState<boolean>(true)
    const [updateTransactionData, setUpdateTransactionData] = useState<transaction>({
        transaction_id: "",
        transaction_type: "IN",
        airport_id: "",
        aircraft_id: "",
        quantity: 0
    })

    const [deleteTransactionFormHidden, setDeleteTransactionFormHidden] = useState<boolean>(true)
    const [deleteTransactionData, setDeleteTransactionData] = useState<transaction>({
        transaction_id: "",
        transaction_type: "IN",
        airport_id: "",
        aircraft_id: "",
        quantity: 0
    })

    const [fliterFormHidden, setFilterFormHidden] = useState<boolean>(false)
    const [filterFormData, setFilterFormData] = useState<any>({
        filterAirportId: [],
        filterAircraftId: [],
        filterTransactionType: []
    })


    const [count, setCount] = useState(10)
    const [sortBy, setSortBy] = useState("DATE_HIGH_LOW")


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
        // if(target.name === "filterTransactionType"){
        //     setFilterFormData({...filterFormData, filterTransactionType: target.value})
        // }else{
        let tempData : any = [] 
        document.querySelectorAll(`input[name=${target.name}]`).forEach((data:any)=>{
            if(data.checked){
                tempData.push(data.value)
            }
        })
        setFilterFormData({ ...filterFormData, [target.name]: tempData})
        // }
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

        setUpdateTransactionData({ ...updateTransactionData, [target.name]: target.value })
    }
    const handleUpdateTransactionFormChangeSelect = (event: React.FormEvent<HTMLSelectElement>) => {
        let target = event.target as HTMLSelectElement

        setUpdateTransactionData({ ...updateTransactionData, [target.name]: target.value })
    }

    // Handle change for create transacion
    const handleDeleteTransactionFormChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement

        setDeleteTransactionData({ ...deleteTransactionData, [target.name]: target.value })
    }
    const handleDeleteTransactionFormChangeSelect = (event: React.FormEvent<HTMLSelectElement>) => {
        let target = event.target as HTMLSelectElement

        setDeleteTransactionData({ ...deleteTransactionData, [target.name]: target.value })
    }


    const handleSort = (event: React.FormEvent<HTMLSelectElement>) => {
        let target = event.target as HTMLSelectElement

        setSortBy(target.value)


    }


    const handleLoadMore = () => {
        setCount(count + 10)
        dispatch(getTransactions())
    }

    // Fetch transaction function
    // const getTransactions = () => {
    //     axios.get<transactions>(`http://localhost:4000/api/v1/transactions`, { withCredentials: true })
    //         .then(function (response: any) {
    //             setTransactions(response.data)
    //         })
    //         .catch(function (error: any) {
    //             console.log(error)
    //             dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
    //         })
    // }

    // const getAircrafts = () => {
    //     axios.get<aircrafts>('http://localhost:4000/api/v1/aircrafts', { withCredentials: true })
    //         .then(function (response) {
    //             setAircrafts(response.data)
    //         })
    //         .catch(function (error: any) {
    //             console.log(error)
    //         })
    // }

    // const getAirports = () => {
    //     axios.get<airports>('http://localhost:4000/api/v1/airports', { withCredentials: true })
    //         .then(function (response) {
    //             setAirports(response.data)
    //         })
    //         .catch(function (error: any) {
    //             console.log(error)
    //         })
    // }


    // Submit create transaction form
    const handleCreateTransactionFormSubmit = (event: React.FormEvent) => {
        console.log(createTransactionData)

        // api call for create transaction
        axios.post('http://localhost:4000/api/v1/transactions', createTransactionData, { withCredentials: true })
            .then(function (response: any) {
                console.log(response);
                dispatch(setToasts(response.data.msg, true, 'SUCCESS'))
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
                dispatch(getTransactions());
                dispatch(getAirports());
            })
            .catch(function (error) {
                console.log(error);
                dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
            });
        event.preventDefault();
    }

    // Submit update transaction form
    const handleUpdateTransactionFormSubmit = (event: React.FormEvent) => {
        console.log(updateTransactionData)

        // api call for create transaction
        axios.patch('http://localhost:4000/api/v1/transactions', updateTransactionData, { withCredentials: true })
            .then(function (response: any) {
                console.log(response);
                dispatch(setToasts(response.data.msg, true, 'SUCCESS'))
                setUpdateTransactionFormHidden(true)
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
                dispatch(getTransactions());
                dispatch(getAirports());
            })
            .catch(function (error) {
                console.log(error);
                dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
            });
        event.preventDefault();
    }

    // Submit update transaction form
    const handleDeleteTransaction = (transaction_id: string) => {

        // api call for create transaction
        axios.delete(`http://localhost:4000/api/v1/transactions/${transaction_id}`, { withCredentials: true })
            .then(function (response: any) {
                console.log(response);
                dispatch(setToasts("Transaction deleted successfully.", true, 'SUCCESS'))
                setDeleteTransactionFormHidden(true)
                dispatch(getTransactions());
                dispatch(getAirports());
            })
            .catch(function (error) {
                console.log(error);
                dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
            });
    }

    useEffect(() => {
        if (createTransactionData.transaction_type === 'IN') {
            setCreateTransactionData({ ...createTransactionData, aircraft_id: "" })
        }
        // eslint-disable-next-line
    }, [createTransactionData.transaction_type])

    useEffect(() => {
        dispatch(setHomeTab('TRANSACTION'))

        // getTransactions();
        dispatch(getTransactions())

        dispatch(getAircrafts());

        dispatch(getAirports());

        // eslint-disable-next-line
    }, [])



    useEffect(() => {
        dispatch(getTransactions())
        // eslint-disable-next-line
    }, [count])
    return (
        <div>
            <br />
            <button type="button" onClick={() => { setCreateTransactionFormHidden(false) }} className="btn btn-primary no-print">Create new transaction</button>
            <button onClick={() => { window.print() }} className="btn btn-outline-secondary no-print" style={{ right: "5px", position: "absolute" }}>Print</button>
            <br />
            <br/>
            <button
            className="no-mobie"
            onClick={()=>{setFilterFormHidden(!fliterFormHidden)}}
            style={{
                border: "none"
            }}
            >
                <FilterListBlack/>
            </button>
            <div className="no-mobile"  style={{
                height: "10rem",
                overflow: "hidden",
                display: fliterFormHidden? "none":""
            }}>
                <form style={{
                    backgroundColor: "#eeeeee",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    height: "100%"
                }} >
                    <div>
                    <label><strong>Airport</strong></label>

                    <div style={{
                        height: "100%",
                        overflowY: "scroll"
                    }}>
                        {
                            airports?.map((airport) => {
                                return (
                                    <div className="form-check" key={airport.airport_id.toString()} >
                                        <input name= "filterAirportId" onChange={handleFilterFormChangeRadioButton} className="form-check-input" type="checkbox" value={airport.airport_id.toString()} id={`airportFilterCheckbox${airport.airport_id}`} />
                                        <label className="form-check-label" htmlFor={`airportFilterCheckbox${airport.airport_id}`}>
                                            {airport.airport_name}
                                        </label>
                                    </div>

                                )
                            })
                        }
                    </div>
                    </div>
                    <div>
                    <label><strong>Aircraft</strong></label>
                    <div style={{
                        height: "100%",
                        overflowY: "scroll"
                    }} >
                        {
                            aircrafts?.map((aircraft) => {
                                return (
                                    <div className="form-check" key={aircraft.aircraft_id.toString()}>
                                        <input name= "filterAircraftId" onChange={handleFilterFormChangeRadioButton} className="form-check-input" type="checkbox" value={aircraft.aircraft_id} id={`airportFilterCheckbox${aircraft.aircraft_id}`} />
                                        <label className="form-check-label" htmlFor={`airportFilterCheckbox${aircraft.aircraft_id}`}>
                                            {aircraft.aircraft_no}
                                        </label>
                                    </div>

                                )
                            })
                        }
                    </div>
                    </div>
                    <div>
                        <label><strong>Transaction Type</strong></label>
                        <div className="form-check">
                            <input name= "filterTransactionType" onChange={handleFilterFormChangeRadioButton} className="form-check-input" type="checkbox" value="IN" id={`airportFilterCheckboxIN`} />
                            <label className="form-check-label" htmlFor={`airportFilterCheckboxIN`}>
                                IN
                            </label>
                        </div>
                        <div className="form-check">
                            <input name= "filterTransactionType" onChange={handleFilterFormChangeRadioButton} className="form-check-input" type="checkbox" value="OUT" id={`airportFilterCheckboxOUT`} />
                            <label className="form-check-label" htmlFor={`airportFilterCheckboxOUT`}>
                                OUT
                            </label>
                        </div>
                    </div>
                </form>
            </div>

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
            <div className={`modal ${updateTransactionFormHidden ? 'hide' : 'show'}`} style={{ backgroundColor: "#00000063", display: `${updateTransactionFormHidden ? 'none' : 'block'}` }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleUpdateTransactionFormSubmit}>
                            <div className="modal-header">
                                <button type="button" onClick={() => { setUpdateTransactionFormHidden(true) }} className="close btn btn-light" data-dismiss="modal" aria-hidden="true">&times;</button>

                            </div>
                            <div className="modal-body">
                                <div>

                                    <fieldset >
                                        <legend>Update Transaction</legend>
                                        <div className="mb-3">
                                            <label htmlFor="typeSelect" className="form-label">Type</label>
                                            <select name="transaction_type" value={updateTransactionData.transaction_type} onChange={handleUpdateTransactionFormChangeSelect} id="typeSelect" className="form-select">
                                                <option value="IN" >IN</option>
                                                <option value="OUT" >OUT</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="airportSelect" className="form-label">Airport</label>
                                            <select name="airport_id" value={updateTransactionData.airport_id.toString()} onChange={handleUpdateTransactionFormChangeSelect} id="airportSelect" className="form-select">
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
                                        {updateTransactionData.transaction_type === "IN" ? null :
                                            <div className="mb-3">
                                                <label htmlFor="aircraftSelect" className="form-label">Aircraft</label>
                                                <select name="aircraft_id" value={updateTransactionData.aircraft_id} onChange={handleUpdateTransactionFormChangeSelect} id="aircraftSelect" className="form-select">
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
                                            <input value={updateTransactionData.quantity} onChange={handleUpdateTransactionFormChange} name="quantity" type="number" min={1}
                                                max={
                                                    updateTransactionData.transaction_type === 'IN'
                                                        ? airports?.filter((airport) => airport.airport_id === updateTransactionData.airport_id).map(airport => Number(airport?.fuel_capacity) - Number(airport?.fuel_available))[0]
                                                        : Number(airports?.filter((airport) => airport.airport_id === updateTransactionData.airport_id)[0]?.fuel_available)
                                                }
                                                id="quantityInput" className="form-control" placeholder="Fuel Quantity" />
                                        </div>
                                    </fieldset>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => { setUpdateTransactionFormHidden(true) }} className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Update</button>

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
                                <button type="button" onClick={() => { setDeleteTransactionFormHidden(true) }} className="close btn btn-light" data-dismiss="modal" aria-hidden="true">&times;</button>

                            </div>
                            <div className="modal-body">
                                <div>

                                    <fieldset >
                                        <legend>Delete Transaction</legend>
                                        <div className="mb-3">
                                            <label htmlFor="typeSelect" className="form-label">Type</label>
                                            <select disabled name="transaction_type" onChange={handleDeleteTransactionFormChangeSelect} value={deleteTransactionData.transaction_type} id="typeSelect" className="form-select">
                                                <option value="IN" >IN</option>
                                                <option value="OUT" >OUT</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="airportSelect" className="form-label">Airport</label>
                                            <select disabled name="airport_id" onChange={handleDeleteTransactionFormChangeSelect} value={deleteTransactionData.airport_id.toString()} id="airportSelect" className="form-select">
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
                                        {deleteTransactionData.transaction_type === "IN" ? null :
                                            <div className="mb-3">
                                                <label htmlFor="aircraftSelect" className="form-label">Aircraft</label>
                                                <select disabled name="aircraft_id" onChange={handleDeleteTransactionFormChangeSelect} value={deleteTransactionData.aircraft_id} id="aircraftSelect" className="form-select">
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
                                            <input disabled value={deleteTransactionData.quantity} onChange={handleDeleteTransactionFormChange} name="quantity" type="number" min={1}
                                                max={
                                                    deleteTransactionData.transaction_type === 'IN'
                                                        ? airports?.filter((airport) => airport.airport_id === deleteTransactionData.airport_id).map(airport => Number(airport?.fuel_capacity) - Number(airport?.fuel_available))[0]
                                                        : Number(airports?.filter((airport) => airport.airport_id === deleteTransactionData.airport_id)[0]?.fuel_available)
                                                }
                                                id="quantityInput" className="form-control" placeholder="Fuel Quantity" />
                                        </div>
                                    </fieldset>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => { setDeleteTransactionFormHidden(true) }} className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="submit" onClick={() => { handleDeleteTransaction(deleteTransactionData.transaction_id!) }} className="btn btn-primary">Delete</button>

                            </div>
                        </form>
                    </div>

                </div>

            </div>
            <br />
            <select name="sortBy" onChange={handleSort} id="sortBySelect" className="form-select no-print">
                <option value="DATE_HIGH_LOW">Sort by date high to low</option>
                <option value="DATE_LOW_HIGH">Sort by date low to high</option>
                <option value="QUANTITY_LOW_HIGH">Sort by quantity low to high</option>
                <option value="QUANTITY_HIGH_LOW" >Sort by quantity high to low</option>
            </select>
            <br />
            <div style={{display: "flex"}}>
            <div className="container" >
                <div className="row justify-content-between" style={{
                    backgroundColor: "#1a237e", color: "#ffffff",
                    alignItems: "center"
                }}>
                    <div className="col-md-2">
                        <strong>
                            Transaction Date and Time
                        </strong>
                    </div>
                    <div className="col-md-1">
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
                    <div className="col-2">
                    </div>
                </div>
                {
                    transactions?.filter((transaction)=>{
                        return (
                        (filterFormData.filterAirportId.indexOf(transaction.airport_id) >= 0 || filterFormData.filterAirportId.length ===0)
                        &&
                        (filterFormData.filterAircraftId.indexOf(transaction.aircraft_id) >= 0 || filterFormData.filterAircraftId.length ===0)
                        &&
                        (filterFormData.filterTransactionType.indexOf(transaction.transaction_type) >= 0 || filterFormData.filterTransactionType.length ===0)
                        )

                    })?.sort(function (a, b) {

                        if (sortBy === "QUANTITY_HIGH_LOW") {
                            return b.quantity - a.quantity
                        } else if (sortBy === "QUANTITY_LOW_HIGH") {
                            return a.quantity - b.quantity
                        } else if (sortBy === "DATE_LOW_HIGH") {
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
                    }).slice(0, count).map((transaction, transactionIndex) => {
                        return (
                            <div className="row justify-content-between" key={transaction.transaction_id} onClick={()=>{handleSelectedTransaction(transaction)}} id={`row${transaction.transaction_id}`} style={{
                                backgroundColor: transactionIndex % 2 !== 0 ? "#eeeeee" : "",
                                alignItems: "center",
                                paddingRight: "20px",
                                border: `${selectedTransaction.transaction_id === transaction.transaction_id? 'solid' : 'none'}`
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
                                <div className="col-2">
                                    <button style={
                                        {
                                            backgroundColor: transactionIndex % 2 !== 0 ? "#eeeeee" : "white",
                                            border: "none",
                                            borderRadius: "5px"
                                        }
                                    } onClick={() => {
                                        setUpdateTransactionData(
                                            {
                                                transaction_id: transaction.transaction_id,
                                                transaction_type: transaction.transaction_type,
                                                airport_id: transaction.airport_id,
                                                aircraft_id: transaction.aircraft_id,
                                                quantity: transaction.quantity
                                            }
                                        );
                                        setUpdateTransactionFormHidden(false)
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
                                            setDeleteTransactionData(
                                                {
                                                    transaction_id: transaction.transaction_id,
                                                    transaction_type: transaction.transaction_type,
                                                    airport_id: transaction.airport_id,
                                                    aircraft_id: transaction.aircraft_id,
                                                    quantity: transaction.quantity
                                                }
                                            );
                                            setDeleteTransactionFormHidden(false)
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
            <TransactionSideBar/>
            </div>
           
            <br />
            <br />
        </div>

    )
}

export default Transaction
