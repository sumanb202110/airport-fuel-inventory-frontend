import { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch } from 'react-redux'
import { setHomeTab, setToasts } from "../../actions";
import axios from 'axios'

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
    const [aircrafts, setAircrafts] = useState<aircrafts>()
    const [createAircraftFormHidden, setCreateAircraftFormHidden] = useState<boolean>(true)
    const [createAircraftData, setCreateAircraftData] = useState<aircraft>({
        aircraft_id: "",
        aircraft_no: "",
        airline: ""
    })
    const dispatch = useDispatch()

    const getAircrafts = () => {
        axios.get<aircrafts>('http://localhost:4000/api/v1/aircrafts', { withCredentials: true })
            .then(function (response) {
                setAircrafts(response.data)
            })
            .catch(function (error: any) {
                console.log(error)
            })
    }

    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement
        setCreateAircraftData({ ...createAircraftData, [target.name]: target.value })
    }

    // Submit form
    const handleSubmit = (event: React.FormEvent) => {
        console.log(createAircraftData)

        // api call for create transaction
        axios.post('http://localhost:4000/api/v1/aircrafts', createAircraftData, { withCredentials: true })
            .then(function (response: any) {
                console.log(response);
                dispatch(setToasts(response.data.msg,true, 'SUCCESS'))
                getAircrafts();
            })
            .catch(function (error) {
                console.log(error);
                dispatch(setToasts(error.response.data.msg,true, 'ERROR'))
            });
        event.preventDefault()
    }
    useEffect(() => {
        dispatch(setHomeTab('AIRCRAFT'))
        getAircrafts();

        // eslint-disable-next-line
    }, [])
    return (
        <div>
            <br />
            <button type="submit" onClick={() => { setCreateAircraftFormHidden(false) }} className="btn btn-primary">Create new Aircraft</button>
            <br />
            <div className={`modal ${createAircraftFormHidden ? 'hide' : 'show'}`} style={{ backgroundColor: "#00000063", display: `${createAircraftFormHidden ? 'none' : 'block'}` }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
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
                                            <input onChange={handleChange} name="aircraft_id" type="text" id="aircraft_id" className="form-control" placeholder="Aircraft Id" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="aircraft_no">
                                                Aircraft No
                                            </label>
                                            <input onChange={handleChange} name="aircraft_no" type="text" id="aircraft_no" className="form-control" placeholder="Aircraft No" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-check-label" htmlFor="airline">
                                                Airline
                                            </label>
                                            <input onChange={handleChange} name="airline" type="text" id="airline" className="form-control" placeholder="Airline" />
                                        </div>
                                    </fieldset>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => { setCreateAircraftFormHidden(true) }} className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Submit</button>

                            </div>
                        </form>
                    </div>

                </div>

            </div>
            <br />
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <strong>
                            Aircraft Id
                        </strong>
                    </div>
                    <div className="col-4">
                        <strong>
                            Aircraft No
                        </strong>
                    </div>
                    <div className="col-4">
                        <strong>
                            Airline
                        </strong>
                    </div>
                    <hr />
                </div>
                {
                    aircrafts?.map((aircraft) => {
                        return (
                            <div className="row" key={aircraft.aircraft_id}>
                                <div className="col-4">
                                    {aircraft.aircraft_id}
                                </div>
                                <div className="col-4">
                                    {aircraft.aircraft_no}
                                </div>
                                <div className="col-4">
                                    {aircraft.airline}
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

export default Aircraft