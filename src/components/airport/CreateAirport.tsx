import axios from "axios";
import { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAirports, setToasts } from "../../actions";
import { airport, airports } from "./Airport";
type props = {
    createAirportFormHidden: any,
    setCreateAirportFormHidden: any,
    airports: airports
}

const CreateAirport: FC<props> = ({createAirportFormHidden, setCreateAirportFormHidden, airports}): ReactElement => {
    const [createAirportData, setCreateAirportData] = useState<airport>({
        "airport_id": "",
        "airport_name": "",
        "fuel_capacity": 0,
        "fuel_available": 0
    })
    const [createAirportError, setCreateAirportError] = useState("")

    // Axios auth config
    const authAxios = axios.create({
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
    })

    const dispatch = useDispatch()

        // On create form data change
        useEffect(() => {
            if (createAirportData.airport_id === "") {
                setCreateAirportError("Airport Id can't be blank.")
            } else if (createAirportData.airport_name === "") {
                setCreateAirportError("Airport name can't be blank")
            } else if (Number(createAirportData.fuel_available) > Number(createAirportData.fuel_capacity)) {
                setCreateAirportError("Fuel available can not be greater then fuel capacity")
            } else if (Number(createAirportData.fuel_available) < 0) {
                setCreateAirportError("Fuel available can not be less then 0")
            } else if (Number(createAirportData.fuel_capacity) < 0) {
                setCreateAirportError("Fuel capacity can not be less then 0")
            } else {
                setCreateAirportError("")
            }
        }, [createAirportData])

    // Handle create airport form change
    const handleCreateAirportFormChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement
        console.log(target.name, target.value);
        setCreateAirportData({ ...createAirportData, [target.name]: target.value })
    }

    // Submit form to create airport handle function
    const handleCreateAirportFormSubmit = (event: React.FormEvent) => {
        console.log(createAirportData)
        if (createAirportData.airport_id === "") {
            setCreateAirportError("Airport Id can't be blank.")
        } else if (createAirportData.airport_name === "") {
            setCreateAirportError("Airport name can't be blank")
        } else if (Number(createAirportData.fuel_available) > Number(createAirportData.fuel_capacity)) {
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
                    if (response.status === 201) {
                        dispatch(setAirports([response.data, ...airports]));
                    }

                })
                .catch(function (error) {
                    console.log(error);
                    dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
                });
        }

        event.preventDefault();
    }

    return (
        <>
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
                                            <input onChange={handleCreateAirportFormChange}  value={createAirportData.airport_id.toString()} name="airport_id" type="text" id="airport_id" className="form-control" placeholder="Airport Id" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="airport_name">
                                                Airport Name
                                            </label>
                                            <input onChange={handleCreateAirportFormChange} value={createAirportData.airport_name.toString()} name="airport_name" type="text" id="airport_name" className="form-control" placeholder="Airport Name" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="fuel_capacity">
                                                Fuel Capacity(L)
                                            </label>
                                            <input value={Number(createAirportData.fuel_capacity)} onChange={handleCreateAirportFormChange} name="fuel_capacity" type="number"  id="fuel_capacity" className="form-control" placeholder="Fuel Capacity" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="fuel_available">
                                                Fuel Available(L)
                                            </label>
                                            <input value={Number(createAirportData.fuel_available)} onChange={handleCreateAirportFormChange} name="fuel_available" type="number" id="fuel_available" className="form-control" placeholder="Fuel Available" />
                                        </div>
                                        <span style={{ color: "#e53935" }}>
                                            {createAirportError}
                                        </span>
                                    </fieldset>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => { setCreateAirportFormHidden(true) }} className="btn btn-default" data-dismiss="modal">Close</button>
                                <button disabled={createAirportError === "" ? false : true} type="submit" className="btn btn-primary">Submit</button>

                            </div>
                        </form>
                    </div>

                </div>

            </div>
        </>
    )
}

export default CreateAirport;