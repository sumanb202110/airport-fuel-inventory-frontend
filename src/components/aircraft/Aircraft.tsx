import { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getAircrafts, setAircrafts, setHomeTab, setToasts } from "../../actions";
// import axios from 'axios'
import { ReactComponent as EditBlack } from '../../svgs/edit_black_24dp.svg'
import { ReactComponent as DeleteBlack } from '../../svgs/delete_black_24dp.svg'
import { ReactComponent as RefreshBlack } from '../../svgs/refresh_black_24dp.svg'
import { state } from "../../App";
import axios from "axios";

export type aircrafts = {
    aircraft_id: string,
    aircraft_no: string,
    airline: string
}[]

export type aircraft = {
    aircraft_id: string,
    aircraft_no: string,
    airline: string
}

const Aircraft: FC = (): ReactElement => {
    // const [aircrafts, setAircrafts] = useState<aircrafts>()

     // count aircraft view
     const [count, setCount] = useState(10)

    const [createAircraftFormHidden, setCreateAircraftFormHidden] = useState<boolean>(true)
    const [createAircraftData, setCreateAircraftData] = useState<aircraft>({
        aircraft_id: "",
        aircraft_no: "",
        airline: ""
    })
    const [createAircraftError, setCreateAircraftError] = useState("")

    const [updateAircraftFormHidden, setUpdateAircraftFormHidden] = useState<boolean>(true)
    const [updateAircraftData, setUpdateAircraftData] = useState<aircraft>({
        aircraft_id: "",
        aircraft_no: "",
        airline: ""
    })
    const [updateAircraftError, setUpdateAircraftError] = useState("")


    const [deleteAircraftFormHidden, setDeleteAircraftFormHidden] = useState<boolean>(true)
    const [deleteAircraftData, setDeleteAircraftData] = useState<aircraft>({
        aircraft_id: "",
        aircraft_no: "",
        airline: ""
    })

    const dispatch = useDispatch()

    // Axios auth config
    const authAxios = axios.create({
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
    })

    // retrive aircrafts data from redux
    const aircrafts = useSelector((state: state) => { return state.aircrafts!.data });

    

    // handle create aircraft form input change function
    const handleAircraftCreateFormChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement
        setCreateAircraftData({ ...createAircraftData, [target.name]: target.value })
    }


     // Handle load more
     const handleLoadMore = ()=>{
        if(count< aircrafts.length){
            setCount(count+10)
        }
    }


    // Submit form to create aircraft
    const handleAircraftCreateFormSubmit = (event: React.FormEvent) => {
        console.log(createAircraftData)
        if (createAircraftData.aircraft_id === "") {
            setCreateAircraftError("Aircraft id can not be blank")
        } else if (createAircraftData.aircraft_no === "") {
            setCreateAircraftError("Aircraft no can not be blank")
        } else if (createAircraftData.airline === "") {
            setCreateAircraftError("Airline can not be blank")
        } else {
            // api call for create transaction
            authAxios.post('http://localhost:4000/api/v1/aircrafts', createAircraftData, {})
                .then(function (response: any) {
                    console.log(response);
                    dispatch(setToasts(response.data.msg, true, 'SUCCESS'))
                    setCreateAircraftFormHidden(true)
                    const targetForm = event.target as HTMLFormElement
                    targetForm.reset()
                    if(response.status === 201){
                        dispatch(setAircrafts([response.data, ...aircrafts]));
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
                });
        }


        event.preventDefault()
    }

    // handle update aircraft form input change function
    const handleAircraftUpdateFormChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement
        setUpdateAircraftData({ ...updateAircraftData, [target.name]: target.value })
    }

    // Submit form to create aircraft
    const handleAircraftUpdateFormSubmit = (event: React.FormEvent) => {
        console.log(updateAircraftData)
        if (createAircraftData.aircraft_id === "") {
            setUpdateAircraftError("Aircraft id can not be blank")
        } else if (createAircraftData.aircraft_no === "") {
            setUpdateAircraftError("Aircraft no can not be blank")
        } else if (createAircraftData.airline === "") {
            setUpdateAircraftError("Airline can not be blank")
        } else {
            // api call for create transaction
            authAxios.patch('http://localhost:4000/api/v1/aircrafts', updateAircraftData, { })
                .then(function (response: any) {
                    console.log(response);
                    dispatch(setToasts(response.data.msg, true, 'SUCCESS'))
                    setUpdateAircraftFormHidden(true)
                    if (response.status === 200) {
                        dispatch(setAircrafts(aircrafts.map((aircraft) => {
                            if (aircraft.aircraft_id === updateAircraftData?.aircraft_id) {
                                return {
                                    ...aircraft,
                                    aircraft_id: updateAircraftData.aircraft_id,
                                    aircraft_no: updateAircraftData.aircraft_no,
                                    airline: updateAircraftData.airline

                                }
                            } else {
                                return aircraft
                            }
                        })));
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
                });
        }
        event.preventDefault()
    }

    // Submit form to create aircraft
    const handleDeleteAircraft = (event: React.FormEvent, aircraft_id: string) => {

        // api call for delete transaction
        authAxios.delete(`http://localhost:4000/api/v1/aircrafts/${aircraft_id}`, {})
            .then(function (response: any) {
                console.log(response);
                dispatch(setToasts("Aircraft successfully deleted.", true, 'SUCCESS'))
                setDeleteAircraftFormHidden(true)
                if(response.status ===  204){
                    dispatch(setAircrafts(aircrafts.filter((aircraft)=>{
                        if(aircraft.aircraft_id === aircraft_id){
                            return false
                        }else{
                            return true
                        }
                    })));
                }
            })
            .catch(function (error) {
                console.log(error);
                dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
            });
        event.preventDefault()
        
    }

    // Handle refresh function
    const handleRefresh = () => {
        dispatch(getAircrafts());
    }


    // On create form data change
    useEffect(()=>{
        if (createAircraftData.aircraft_id === "") {
            setCreateAircraftError("Aircraft id can not be blank")
        } else if (createAircraftData.aircraft_no === "") {
            setCreateAircraftError("Aircraft no can not be blank")
        } else if (createAircraftData.airline === "") {
            setCreateAircraftError("Airline can not be blank")
        } else {
            setCreateAircraftError("")
        }
    },[createAircraftData])

    // On update form data change
    useEffect(()=>{
        if (updateAircraftData.aircraft_id === "") {
            setUpdateAircraftError("Aircraft id can not be blank")
        } else if (updateAircraftData.aircraft_no === "") {
            setUpdateAircraftError("Aircraft no can not be blank")
        } else if (updateAircraftData.airline === "") {
            setUpdateAircraftError("Airline can not be blank")
        } else {
            setUpdateAircraftError("")
        }
    },[updateAircraftData])

    // Initial data load
    useEffect(() => {
        dispatch(setHomeTab('AIRCRAFT'))
        // dispatch(getAircrafts());

        // eslint-disable-next-line
    }, [])
    return (
        <div>
            <br/>
            <div className={`modal ${createAircraftFormHidden ? 'hide' : 'show'}`} style={{ backgroundColor: "#00000063", display: `${createAircraftFormHidden ? 'none' : 'block'}` }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleAircraftCreateFormSubmit}>
                            <div className="modal-header">
                                <button type="button" onClick={() => { setCreateAircraftFormHidden(true) }} className="close btn btn-light" data-dismiss="modal" aria-hidden="true">&times;</button>

                            </div>
                            <div className="modal-body">
                                <div>

                                    <fieldset >
                                        <legend>Create Aircraft</legend>

                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="aircraft_id">
                                                Aircraft Id
                                            </label>
                                            <input onChange={handleAircraftCreateFormChange} name="aircraft_id" type="text" id="aircraft_id" className="form-control" placeholder="Aircraft Id" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="aircraft_no">
                                                Aircraft No
                                            </label>
                                            <input onChange={handleAircraftCreateFormChange} name="aircraft_no" type="text" id="aircraft_no" className="form-control" placeholder="Aircraft No" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="airline">
                                                Airline
                                            </label>
                                            <input onChange={handleAircraftCreateFormChange} name="airline" type="text" id="airline" className="form-control" placeholder="Airline" />
                                        </div>
                                        <span style={{color: "#e53935"}}>
                                            {createAircraftError}
                                        </span>
                                    </fieldset>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => { setCreateAircraftFormHidden(true) }} className="btn btn-default" data-dismiss="modal">Close</button>
                                <button disabled={createAircraftError === ""? false: true} type="submit" className="btn btn-primary">Submit</button>

                            </div>
                        </form>
                    </div>

                </div>

            </div>
            <div className={`modal ${updateAircraftFormHidden ? 'hide' : 'show'}`} style={{ backgroundColor: "#00000063", display: `${updateAircraftFormHidden ? 'none' : 'block'}` }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleAircraftUpdateFormSubmit}>
                            <div className="modal-header">
                                <button type="button" onClick={() => { setUpdateAircraftFormHidden(true) }} className="close btn btn-light" data-dismiss="modal" aria-hidden="true">&times;</button>

                            </div>
                            <div className="modal-body">
                                <div>

                                    <fieldset >
                                        <legend>Update Aircraft</legend>

                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="aircraft_id">
                                                Aircraft Id
                                            </label>
                                            <input onChange={handleAircraftUpdateFormChange} value={updateAircraftData.aircraft_id} name="aircraft_id" type="text" id="aircraft_id" className="form-control" placeholder="Aircraft Id" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="aircraft_no">
                                                Aircraft No
                                            </label>
                                            <input onChange={handleAircraftUpdateFormChange} value={updateAircraftData.aircraft_no} name="aircraft_no" type="text" id="aircraft_no" className="form-control" placeholder="Aircraft No" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="airline">
                                                Airline
                                            </label>
                                            <input onChange={handleAircraftUpdateFormChange} value={updateAircraftData.airline} name="airline" type="text" id="airline" className="form-control" placeholder="Airline" />
                                        </div>
                                        <span style={{color: "#e53935"}}>
                                            {updateAircraftError}
                                        </span>
                                    </fieldset>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => { setUpdateAircraftFormHidden(true) }} className="btn btn-default" data-dismiss="modal">Close</button>
                                <button disabled={updateAircraftError === ""? false: true} type="submit" className="btn btn-primary">Update</button>

                            </div>
                        </form>
                    </div>

                </div>

            </div>
            <div className={`modal ${deleteAircraftFormHidden ? 'hide' : 'show'}`} style={{ backgroundColor: "#00000063", display: `${deleteAircraftFormHidden ? 'none' : 'block'}` }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" onClick={() => { setDeleteAircraftFormHidden(true) }} className="close btn btn-light" data-dismiss="modal" aria-hidden="true">&times;</button>

                            </div>
                            <div className="modal-body">
                                <div>

                                    <fieldset >
                                        <legend>Delete Aircraft</legend>

                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="aircraft_id">
                                                Aircraft Id
                                            </label>
                                            <input disabled  value={deleteAircraftData.aircraft_id} name="aircraft_id" type="text" id="aircraft_id" className="form-control" placeholder="Aircraft Id" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="aircraft_no">
                                                Aircraft No
                                            </label>
                                            <input disabled value={deleteAircraftData.aircraft_no} name="aircraft_no" type="text" id="aircraft_no" className="form-control" placeholder="Aircraft No" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="airline">
                                                Airline
                                            </label>
                                            <input disabled value={deleteAircraftData.airline} name="airline" type="text" id="airline" className="form-control" placeholder="Airline" />
                                        </div>
                                        <span style={{color: "#e53935"}}>
                                            {updateAircraftError}
                                        </span>
                                    </fieldset>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => { setDeleteAircraftFormHidden(true) }} className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="submit" onClick={(e) => { handleDeleteAircraft(e, deleteAircraftData.aircraft_id.toString()) }} className="btn btn-primary">Delete</button>

                            </div>
                        </form>
                    </div>

                </div>

            </div>
            <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", margin: "5px" }}>
                <button type="submit" onClick={() => { setCreateAircraftFormHidden(false) }} className="btn btn-primary no-print">Create new Aircraft</button>

                <button onClick={handleRefresh} className="btn btn-outline-info" >
                    <RefreshBlack /> Refresh
                </button>
            </div>
                <div className="row" style={{
                    alignItems: "center",
                    backgroundColor: "#1a237e",
                    color: "#ffffff"
                }}>
                    <div className="col-3">
                        <strong>
                            Aircraft Id
                        </strong>
                    </div>
                    <div className="col-3">
                        <strong>
                            Aircraft No
                        </strong>
                    </div>
                    <div className="col-4">
                        <strong>
                            Airline
                        </strong>
                    </div>
                    {/* <hr />  */}
                </div>
                {
                    aircrafts?.slice(0, count).map((aircraft, aircraftIndex) => {
                        return (
                            <div className="row" key={aircraft.aircraft_id} style={{
                                alignItems: "center",
                                backgroundColor: aircraftIndex % 2 !== 0 ? "#eeeeee" : ""
                            }}
                                id={`row${aircraft.aircraft_id}`}
                                onMouseOver={
                                    () => {
                                        const row = document.querySelector(`#row${aircraft.aircraft_id}`) as HTMLDivElement
                                        row.style.backgroundColor = "#76ff03"
                                    }}
                                onMouseOut={
                                    () => {
                                        const row = document.querySelector(`#row${aircraft.aircraft_id}`) as HTMLDivElement
                                        row.style.backgroundColor = aircraftIndex % 2 !== 0 ? "#eeeeee" : ""
                                    }}
                            >
                                <div className="col-3">
                                    {aircraft.aircraft_id}
                                </div>
                                <div className="col-3">
                                    {aircraft.aircraft_no}
                                </div>
                                <div className="col-4">
                                    {aircraft.airline}
                                </div>
                                <div className="col-2">
                                    <button style={
                                        {
                                            backgroundColor: aircraftIndex % 2 !== 0 ? "#eeeeee" : "white",
                                            border: "none",
                                            borderRadius: "5px"
                                        }
                                    } onClick={() => {
                                        setUpdateAircraftData(
                                            {
                                                aircraft_id: aircraft.aircraft_id,
                                                aircraft_no: aircraft.aircraft_no,
                                                airline: aircraft.airline
                                            }
                                        );
                                        setUpdateAircraftFormHidden(false)
                                    }}>
                                        <EditBlack />
                                    </button>
                                    <span style={{ padding: "5px" }}></span>
                                    <button
                                        style={
                                            {
                                                backgroundColor: aircraftIndex % 2 !== 0 ? "#eeeeee" : "white",
                                                border: "none",
                                                borderRadius: "5px"
                                            }
                                        }
                                        onClick={() => {
                                            setDeleteAircraftData(
                                                {
                                                    aircraft_id: aircraft.aircraft_id,
                                                    aircraft_no: aircraft.aircraft_no,
                                                    airline: aircraft.airline
                                                }
                                            );
                                            setDeleteAircraftFormHidden(false)
                                        }}>
                                        <DeleteBlack />
                                    </button>
                                </div>
                                {/* <hr /> */}
                            </div>
                        )
                    })
                }
                 {
                        aircrafts?.length! > count ?
                            <button type="button" style={{ margin: "10px" }} className="btn btn-outline-secondary no-print" onClick={handleLoadMore}>Load More</button>
                            :
                            null

                    }
            </div>
        </div>

    )
}

export default Aircraft