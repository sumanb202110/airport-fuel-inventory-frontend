import { FC, ReactElement, useEffect, useState } from "react";
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setHomeTab, setToasts } from "../../actions";


export type airports = {
    "airport_id": String,
    "airport_name": String,
    "fuel_capacity": Number,
    "fuel_available": Number
}[]

export type airport = {
    "airport_id": String,
    "airport_name": String,
    "fuel_capacity": Number,
    "fuel_available": Number
}

const Airport: FC = (): ReactElement => {
    const [airports, setAirports] = useState<airports>()
    const [createAirportFormHidden, setCreateAirportFormHidden] = useState<boolean>(true)
    const [createAirportData, setCreateAirportData] = useState<airport>({
        "airport_id": "",
        "airport_name": "",
        "fuel_capacity": 0,
        "fuel_available": 0
    })
    const dispatch = useDispatch()

    const getAirports = () => {
        axios.get<airports>('http://localhost:4000/api/v1/airports', { withCredentials: true })
            .then(function (response) {
                setAirports(response.data)
            })
            .catch(function (error: any) {
                console.log(error)
                dispatch(setToasts(error.response.data.msg,true, 'ERROR'))
            })
    }


    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement
        setCreateAirportData({ ...createAirportData, [target.name]: target.value })
    }

    // Submit form
    const handleSubmit = (event: React.FormEvent) => {
        console.log(createAirportData)

        // api call for create transaction
        axios.post('http://localhost:4000/api/v1/airports', createAirportData, { withCredentials: true })
            .then(function (response: any) {
                console.log(response);
                dispatch(setToasts(response.data.msg,true, 'SUCCESS'))
                getAirports();
            })
            .catch(function (error) {
                console.log(error);
                dispatch(setToasts(error.response.data.msg,true, 'ERROR'))
            });
        event.preventDefault();
    }

    useEffect(() => {
        dispatch(setHomeTab('AIRPORT'))
        getAirports();

        // eslint-disable-next-line
    }, [])

    return (
        <div>
            <br />
            <button type="submit" onClick={() => { setCreateAirportFormHidden(false) }} className="btn btn-primary">Create new Airport</button>
            <br />
            <div className={`modal ${createAirportFormHidden ? 'hide' : 'show'}`} style={{ backgroundColor: "#00000063", display: `${createAirportFormHidden ? 'none' : 'block'}` }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
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
                                            <input onChange={handleChange} name="airport_id" type="text" id="airport_id" className="form-control" placeholder="Airport Id" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="airport_name">
                                                Airport Name
                                            </label>
                                            <input onChange={handleChange} name="airport_name" type="text" id="airport_name" className="form-control" placeholder="Airport Name" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="fuel_capacity">
                                                Fuel Capacity(L)
                                            </label>
                                            <input onChange={handleChange} name="fuel_capacity" type="number" min={1} id="fuel_capacity" className="form-control" placeholder="Fuel Capacity" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="fuel_available">
                                                Fuel Available(L)
                                            </label>
                                            <input onChange={handleChange} name="fuel_available" type="number" min={1} id="fuel_available" className="form-control" placeholder="Fuel Available" />
                                        </div>
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
            <br />
            <div className="container">
                <div className="row">
                    <div className="col">
                        <strong>
                            Airport Id
                        </strong>
                    </div>
                    <div className="col">
                        <strong>
                            Airport Name
                        </strong>
                    </div>
                    <div className="col">
                        <strong>
                            Fuel Capacity(L)
                        </strong>
                    </div>
                    <div className="col">
                        <strong>
                            Fuel Available(L)
                        </strong>
                    </div>
                    <hr />
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
                    }).map((airport) => {
                        return (
                            <div key={airport.airport_id.toString()} className="row">
                                <div className="col">
                                    {airport.airport_id}
                                </div>
                                <div className="col">
                                    {airport.airport_name}
                                </div>
                                <div className="col">
                                    {airport.fuel_capacity}
                                </div>
                                <div className="col">
                                    {airport.fuel_available}
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

export default Airport