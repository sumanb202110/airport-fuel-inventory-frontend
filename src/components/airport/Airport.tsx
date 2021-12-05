import React, { FC, ReactElement, useEffect, useState } from "react";
// import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getAirports, setHomeTab, setToasts } from "../../actions";
import { ReactComponent as EditBlack } from '../../svgs/edit_black_24dp.svg'
import { ReactComponent as DeleteBlack } from '../../svgs/delete_black_24dp.svg'
import { ReactComponent as RefreshBlack } from '../../svgs/refresh_black_24dp.svg'
import { state } from "../../App";
import { transactions } from "../transaction/transaction";
import axios from "axios";


export type airports = airport[]

export type airport = {
    "airport_id": String,
    "airport_name": String,
    "fuel_capacity": Number,
    "fuel_available": Number,
    "transactions"?: transactions
}

const Airport: FC = (): ReactElement => {
    // const [airports, setAirports] = useState<airports>()
    const [createAirportFormHidden, setCreateAirportFormHidden] = useState<boolean>(true)
    const [createAirportData, setCreateAirportData] = useState<airport>({
        "airport_id": "",
        "airport_name": "",
        "fuel_capacity": 0,
        "fuel_available": 0
    })
    const [createAirportError, setCreateAirportError] = useState("")

    const [updateAirportFormHidden, setUpdateAirportFormHidden] = useState<boolean>(true)
    const [updateAirportData, setUpdateAirportData] = useState<airport>({
        "airport_id": "",
        "airport_name": "",
        "fuel_capacity": 0,
        "fuel_available": 0
    })
    const [updateAirportError, setUpdateAirportError] = useState("")


    const [deleteAirportFormHidden, setDeleteAirportFormHidden] = useState<boolean>(true)
    const [deleteAirportData, setDeleteAirportData] = useState<airport>({
        "airport_id": "",
        "airport_name": "",
        "fuel_capacity": 0,
        "fuel_available": 0
    })

    const [sortBy, setSortBy] = useState("NAME_A_Z")

    // Axios auth config
    const authAxios = axios.create({
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
    })

    const dispatch = useDispatch()

    // retrive airports data from redux
    const airports = useSelector((state: state) => { return state.airports!.data });

    // handle airport sort function
    const handleSort = (event: React.FormEvent<HTMLSelectElement>) => {
        let target = event.target as HTMLSelectElement

        setSortBy(target.value)


    }


    // Get airport function
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


    // Handle create airport form change
    const handleCreateAirportFormChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement
        setCreateAirportData({ ...createAirportData, [target.name]: target.value })
    }

    // Submit form to create airport handle function
    const handleCreateAirportFormSubmit = (event: React.FormEvent) => {
        console.log(createAirportData)

        if (Number(createAirportData.fuel_available) > Number(createAirportData.fuel_capacity)) {
            setCreateAirportError("Fuel available can not be greater then fuel capacity")
        } else if (Number(createAirportData.fuel_available) < 0) {
            setCreateAirportError("Fuel available can not be less then 0")
        } else if (Number(createAirportData.fuel_capacity) < 0) {
            setCreateAirportError("Fuel capacity can not be less then 0")
        } else {
            // api call for create transaction
            authAxios.post('http://localhost:4000/api/v1/airports', createAirportData, {})
                .then(function (response: any) {
                    console.log(response);
                    dispatch(setToasts(response.data.msg, true, 'SUCCESS'))
                    const targetForm = event.target as HTMLFormElement
                    targetForm.reset()
                    setCreateAirportFormHidden(true)
                    dispatch(getAirports());

                })
                .catch(function (error) {
                    console.log(error);
                    dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
                });
        }

        event.preventDefault();
    }

    // Handle update airport form change
    const handleUpdateAirportFormChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement
        setUpdateAirportData({ ...updateAirportData, [target.name]: target.value })
    }

    // Handle delete airport form change
    const handleDeleteAirportFormChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement
        setDeleteAirportData({ ...deleteAirportData, [target.name]: target.value })
    }


    // Submit form to create airport handle function
    const handleUpdateAirportFormSubmit = (event: React.FormEvent) => {
        console.log(updateAirportData)
        if (Number(updateAirportData.fuel_available) > Number(updateAirportData.fuel_capacity)) {
            setUpdateAirportError("Fuel available can not be greater then fuel capacity")
        } else if (Number(updateAirportData.fuel_available) < 0) {
            setUpdateAirportError("Fuel available can not be less then 0")
        } else if (Number(updateAirportData.fuel_capacity) < 0) {
            setUpdateAirportError("Fuel capacity can not be less then 0")
        } else {
            setUpdateAirportError("")
            // api call for create transaction
            authAxios.patch(`http://localhost:4000/api/v1/airports/${updateAirportData.airport_id}`, updateAirportData, { })
                .then(function (response: any) {
                    console.log(response);
                    dispatch(setToasts(response.data.msg, true, 'SUCCESS'))
                    setUpdateAirportFormHidden(true)
                    dispatch(getAirports());
                })
                .catch(function (error) {
                    console.log(error);
                    dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
                });
        }
        event.preventDefault();
    }

    // Handle delete airport
    const handleDeleteAirport = (airport_id: string) => {
        // api call for create transaction
        authAxios.delete(`http://localhost:4000/api/v1/airports/${airport_id}`, {})
            .then(function (response: any) {
                console.log(response);
                dispatch(setToasts("Deleted successfully", true, 'SUCCESS'))
                setDeleteAirportFormHidden(true)
                dispatch(getAirports());
            })
            .catch(function (error) {
                console.log(error);
                dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
            });
    }

    // Handle refresh function
    const handleRefresh = () => {
        dispatch(getAirports());
    }

    // On update form data change
    useEffect(()=>{
        if (Number(updateAirportData.fuel_available) > Number(updateAirportData.fuel_capacity)) {
            setUpdateAirportError("Fuel available can not be greater then fuel capacity")
        } else if (Number(updateAirportData.fuel_available) < 0) {
            setUpdateAirportError("Fuel available can not be less then 0")
        } else if (Number(updateAirportData.fuel_capacity) < 0) {
            setUpdateAirportError("Fuel capacity can not be less then 0")
        } else {
            setUpdateAirportError("")
        }
    },[updateAirportData])

    // On create form data change
    useEffect(()=>{
        if (Number(createAirportData.fuel_available) > Number(createAirportData.fuel_capacity)) {
            setCreateAirportError("Fuel available can not be greater then fuel capacity")
        } else if (Number(createAirportData.fuel_available) < 0) {
            setCreateAirportError("Fuel available can not be less then 0")
        } else if (Number(createAirportData.fuel_capacity) < 0) {
            setCreateAirportError("Fuel capacity can not be less then 0")
        } else {
            setCreateAirportError("")
        }
    },[createAirportData])


    // Initial loading
    useEffect(() => {
        dispatch(setHomeTab('AIRPORT'))
        // dispatch(getAirports());

        // eslint-disable-next-line
    }, [])

    return (
        <div>
            <br />
            <button type="submit" onClick={() => { setCreateAirportFormHidden(false) }} className="btn btn-primary no-print">Create new Airport</button>
            <br />

            <div className={`modal ${createAirportFormHidden ? 'hide' : 'show'}`} style={{ backgroundColor: "#00000063", display: `${createAirportFormHidden ? 'none' : 'block'}` }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleCreateAirportFormSubmit}>
                            <div className="modal-header">
                                <button type="button" onClick={() => { setCreateAirportFormHidden(true) }} className="close btn btn-light" data-dismiss="modal" aria-hidden="true">&times;</button>

                            </div>

                            <div className="modal-body">
                                <div>

                                    <fieldset >
                                        <legend>Create Airport</legend>

                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="airport_id">
                                                Airport Id
                                            </label>
                                            <input onChange={handleCreateAirportFormChange} name="airport_id" type="text" id="airport_id" className="form-control" placeholder="Airport Id" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="airport_name">
                                                Airport Name
                                            </label>
                                            <input onChange={handleCreateAirportFormChange} name="airport_name" type="text" id="airport_name" className="form-control" placeholder="Airport Name" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="fuel_capacity">
                                                Fuel Capacity(L)
                                            </label>
                                            <input onChange={handleCreateAirportFormChange} name="fuel_capacity" type="number" min={0} id="fuel_capacity" className="form-control" placeholder="Fuel Capacity" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="fuel_available">
                                                Fuel Available(L)
                                            </label>
                                            <input onChange={handleCreateAirportFormChange} name="fuel_available" type="number" min={0} id="fuel_available" className="form-control" placeholder="Fuel Available" />
                                        </div>
                                        <span style={{color:"#e53935"}}>
                                            {createAirportError}
                                        </span>
                                    </fieldset>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => { setCreateAirportFormHidden(true) }} className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Submit</button>

                            </div>
                        </form>
                    </div>

                </div>

            </div>
            <div className={`modal ${updateAirportFormHidden ? 'hide' : 'show'}`} style={{ backgroundColor: "#00000063", display: `${updateAirportFormHidden ? 'none' : 'block'}` }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleUpdateAirportFormSubmit}>
                            <div className="modal-header">
                                <button type="button" onClick={() => { setUpdateAirportFormHidden(true) }} className="close btn btn-light" data-dismiss="modal" aria-hidden="true">&times;</button>

                            </div>

                            <div className="modal-body">
                                <div>

                                    <fieldset >
                                        <legend>Update Airport</legend>

                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="airport_id">
                                                Airport Id
                                            </label>
                                            <input disabled onChange={handleUpdateAirportFormChange} value={updateAirportData.airport_id.toString()} name="airport_id" type="text" id="airport_id" className="form-control" placeholder="Airport Id" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="airport_name">
                                                Airport Name
                                            </label>
                                            <input onChange={handleUpdateAirportFormChange} value={updateAirportData.airport_name.toString()} name="airport_name" type="text" id="airport_name" className="form-control" placeholder="Airport Name" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="fuel_capacity">
                                                Fuel Capacity(L)
                                            </label>
                                            <input onChange={handleUpdateAirportFormChange} value={Number(updateAirportData.fuel_capacity)} name="fuel_capacity" type="number" min={0} id="fuel_capacity" className="form-control" placeholder="Fuel Capacity" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="fuel_available">
                                                Fuel Available(L)
                                            </label>
                                            <input onChange={handleUpdateAirportFormChange} value={Number(updateAirportData.fuel_available)} name="fuel_available" type="number" min={0} id="fuel_available" className="form-control" placeholder="Fuel Available" />
                                        </div>
                                        <span style={{color: "#e53935"}}>
                                            {updateAirportError}
                                        </span>
                                    </fieldset>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => { setUpdateAirportFormHidden(true) }} className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Update</button>

                            </div>
                        </form>
                    </div>

                </div>

            </div>
            <div className={`modal ${deleteAirportFormHidden ? 'hide' : 'show'}`} style={{ backgroundColor: "#00000063", display: `${deleteAirportFormHidden ? 'none' : 'block'}` }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form >
                            <div className="modal-header">
                                <button type="button" onClick={() => { setDeleteAirportFormHidden(true) }} className="close btn btn-light" data-dismiss="modal" aria-hidden="true">&times;</button>

                            </div>

                            <div className="modal-body">
                                <div>

                                    <fieldset >
                                        <legend>Delete Airport</legend>

                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="airport_id">
                                                Airport Id
                                            </label>
                                            <input disabled onChange={handleDeleteAirportFormChange} value={deleteAirportData.airport_id.toString()} name="airport_id" type="text" id="airport_id" className="form-control" placeholder="Airport Id" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="airport_name">
                                                Airport Name
                                            </label>
                                            <input disabled onChange={handleDeleteAirportFormChange} value={deleteAirportData.airport_name.toString()} name="airport_name" type="text" id="airport_name" className="form-control" placeholder="Airport Name" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="fuel_capacity">
                                                Fuel Capacity(L)
                                            </label>
                                            <input disabled onChange={handleDeleteAirportFormChange} value={Number(deleteAirportData.fuel_capacity)} name="fuel_capacity" type="number" min={1} id="fuel_capacity" className="form-control" placeholder="Fuel Capacity" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="fuel_available">
                                                Fuel Available(L)
                                            </label>
                                            <input disabled onChange={handleDeleteAirportFormChange} value={Number(deleteAirportData.fuel_available)} name="fuel_available" type="number" min={1} id="fuel_available" className="form-control" placeholder="Fuel Available" />
                                        </div>
                                    </fieldset>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => { setDeleteAirportFormHidden(true) }} className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" onClick={() => { handleDeleteAirport(deleteAirportData.airport_id.toString()) }} className="btn btn-primary">Delete</button>

                            </div>
                        </form>
                    </div>

                </div>

            </div>
            <br />
            <select name="sortBy" onChange={handleSort} id="sortBySelect" className="form-select no-print">
                <option value="NAME_A_Z">Sort by Name A to Z</option>
                <option value="NAME_Z_A">Sort by Name Z to A</option>
                <option value="FUEL_CAPACITY_HIGH_LOW">Sort by capacity high to low</option>
                <option value="FUEL_CAPACITY_LOW_HIGH">Sort by capacity low to high</option>
            </select>
            <div style={{ display: "flex", justifyContent: "flex-end", margin: "5px" }}>
                <button onClick={handleRefresh} className="btn btn-outline-info" >
                    <RefreshBlack /> Refresh
                </button>
            </div>
            <div className="container">
                <div className="row" style={{
                    alignItems: "center",
                    backgroundColor: "#1a237e",
                    color: "#ffffff"
                }}>
                    <div className="col-lg-1 d-none d-lg-block">
                        <strong>
                            Airport Id
                        </strong>
                    </div>
                    <div className="col-lg-3 align-self-center d-none d-lg-block">
                        <strong>
                            Airport Name
                        </strong>
                    </div>
                    <div className="col-4 col-lg-3 align-self-center">
                        <strong>
                            Fuel Capacity (L)
                        </strong>
                    </div>
                    <div className="col-4 col-4 col-lg-3 align-self-center">
                        <strong>
                            Fuel Available (L)
                        </strong>
                    </div>
                    <div className="col-4 col-lg-2">
                    </div>
                </div>
                {
                    airports?.sort(function (a, b) {
                        if (sortBy === "NAME_A_Z") {
                            let nameA = a.airport_name.toUpperCase(); // ignore upper and lowercase
                            let nameB = b.airport_name.toUpperCase(); // ignore upper and lowercase
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }

                            // names must be equal
                            return 0;
                        } else if (sortBy === "NAME_Z_A") {
                            let nameA = a.airport_name.toUpperCase(); // ignore upper and lowercase
                            let nameB = b.airport_name.toUpperCase(); // ignore upper and lowercase
                            if (nameA < nameB) {
                                return 1;
                            }
                            if (nameA > nameB) {
                                return -1;
                            }

                            // names must be equal
                            return 0;
                        } else if (sortBy === "FUEL_CAPACITY_HIGH_LOW") {
                            return Number(b.fuel_capacity) - Number(a.fuel_capacity)
                        } else if (sortBy === "FUEL_CAPACITY_LOW_HIGH") {
                            return Number(a.fuel_capacity) - Number(b.fuel_capacity)
                        } else {
                            let nameA = a.airport_name.toUpperCase(); // ignore upper and lowercase
                            let nameB = b.airport_name.toUpperCase(); // ignore upper and lowercase
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }

                            // names must be equal
                            return 0;
                        }

                    }).map((airport, airportIndex) => {
                        return (
                            <div key={airport.airport_id.toString()} className="row" style={{
                                alignItems: "center",
                                backgroundColor: airportIndex % 2 !== 0 ? "#eeeeee" : ""
                            }}
                                id={`row${airport.airport_id}`}

                                onMouseOver={
                                    () => {
                                        const row = document.querySelector(`#row${airport.airport_id}`) as HTMLDivElement
                                        row.style.backgroundColor = "#76ff03"
                                    }}
                                onMouseOut={
                                    () => {
                                        const row = document.querySelector(`#row${airport.airport_id}`) as HTMLDivElement
                                        row.style.backgroundColor = airportIndex % 2 !== 0 ? "#eeeeee" : ""
                                    }}
                            >
                                <div className="col-lg-1">
                                    {airport.airport_id}
                                </div>
                                <div className="col-lg-3 align-self-center">
                                    {airport.airport_name}
                                </div>
                                <div className="col-4 col-lg-3 align-self-center">
                                    {airport.fuel_capacity}
                                </div>
                                <div className="col-4 col-lg-3 align-self-center">
                                    {airport.fuel_available}
                                </div>
                                <div className="col-4 col-lg-2">
                                    <button style={
                                        {
                                            backgroundColor: airportIndex % 2 !== 0 ? "#eeeeee" : "white",
                                            border: "none",
                                            borderRadius: "5px"
                                        }
                                    } onClick={() => {
                                        setUpdateAirportData(
                                            {
                                                "airport_id": airport.airport_id,
                                                "airport_name": airport.airport_name,
                                                "fuel_capacity": airport.fuel_capacity,
                                                "fuel_available": airport.fuel_available
                                            }
                                        );
                                        setUpdateAirportFormHidden(false)
                                    }}>
                                        <EditBlack />
                                    </button>
                                    <span style={{ padding: "5px" }}></span>
                                    <button
                                        style={
                                            {
                                                backgroundColor: airportIndex % 2 !== 0 ? "#eeeeee" : "white",
                                                border: "none",
                                                borderRadius: "5px"
                                            }
                                        }
                                        onClick={() => {
                                            setDeleteAirportData(
                                                {
                                                    "airport_id": airport.airport_id,
                                                    "airport_name": airport.airport_name,
                                                    "fuel_capacity": airport.fuel_capacity,
                                                    "fuel_available": airport.fuel_available
                                                }
                                            );
                                            setDeleteAirportFormHidden(false)
                                        }}>
                                        <DeleteBlack />
                                    </button>
                                </div>
                            </div>

                        )
                    })
                }
            </div>
        </div>
    )
}

export default Airport