import React, { FC, ReactElement, useState } from "react";
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { login } from "../../actions";


type loginFormData = {
    email: string,
    password: string
}



const Login: FC = (): ReactElement => {
    const [loginFormData, setLoginFormData] = useState<loginFormData>({
        email: "",
        password: ""
    })

    const dispatch = useDispatch()


    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement
        setLoginFormData({ ...loginFormData, [target.name]: target.value })
    }

    // Submit form
    const handleSubmit = (event: React.FormEvent) => {
        console.log(loginFormData)

        // api call for login
        axios.post('http://localhost:4000/api/v1/users/login', loginFormData, { withCredentials: true })
            .then(function (response) {
                console.log(response);
                dispatch(login())
                window.sessionStorage.setItem("isLogin", "true");
            })
            .catch(function (error) {
                console.log(error);
            });
        event.preventDefault();
    }
    return (
        <div style={{ width: "50%", marginLeft: "25%", marginTop: "20%" }}>
            <h1>Airport Fuel Inventory</h1>
            <br />
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 row">
                    <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                        <input onChange={handleChange} name="email" type="text" className="form-control" id="staticEmail" />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                        <input onChange={handleChange} name="password" type="password" className="form-control" id="inputPassword" />
                    </div>
                </div>
                <div className="col-auto">
                    <button type="submit" className="btn btn-primary mb-3">Login</button>
                </div>
            </form >
        </div >
    )
}

export default Login