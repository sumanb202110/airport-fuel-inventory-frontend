import React, { FC, ReactElement, useEffect, useState } from "react";
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { login, setToasts, setUserDetails } from "../../actions";
import { Link } from "react-router-dom";
import jwt from "jsonwebtoken"


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

    // Email validation function
    const validateEmail = (email: string) => {
        // eslint-disable-next-line
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    // Login form change handler
    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement
        setLoginFormData({ ...loginFormData, [target.name]: target.value })
    }

    // Check email on change
    useEffect(()=>{
        if (!validateEmail(loginFormData.email) && loginFormData.email !== "") {
            dispatch(setToasts("Invalid email", true, 'ERROR'))
        }else{
            dispatch(setToasts("", false, 'SUCCESS'))
        }
    // eslint-disable-next-line
    },[loginFormData.email])

    // Submit form
    const handleSubmit = (event: React.FormEvent) => {
        console.log(loginFormData)

        if (!validateEmail(loginFormData.email)) {
            dispatch(setToasts("Invalid email", true, 'ERROR'))
        } else {
            // api call for login
            axios.post('http://localhost:4000/api/v1/users/login', loginFormData, {})
                .then(function (response: any) {
                    console.log(response);
                    window.localStorage.setItem("token", response.data.token);
                    window.localStorage.setItem("refreshToken", response.data.refreshToken);

                    const email = (jwt.decode(response.data.token) as any).email
                    dispatch(login())
                    dispatch(setUserDetails(email))
                    dispatch(setToasts("Successfully login", true, 'SUCCESS'))
                    window.localStorage.setItem("isLogin", "true");
                })
                .catch(function (error) {
                    console.log(error);
                    dispatch(setToasts(error?.response?.data.msg, true, 'ERROR'))
                });
        }


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
                        <input onChange={handleChange} name="email" type="email" className="form-control" id="staticEmail" />
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
            <Link to="/signup">Don't have account signup now.</Link>
        </div >
    )
}

export default Login