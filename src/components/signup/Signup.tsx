import React, { FC, ReactElement, useEffect, useState } from "react";
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setToasts } from "../../actions";
import { Link } from "react-router-dom";


type signupFormData = {
    name: "",
    email: string,
    password: string
}



const Signup: FC = (): ReactElement => {
    const [signupFormData, setSignupFormData] = useState<signupFormData>({
        name: "",
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

    // Password check
    const validatePassword = (password: string) => {
        // eslint-disable-next-line
        const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8, 20}$/
        return re.test(password);
    }

    // Signup form handle change
    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        let target = event.target as HTMLInputElement
        setSignupFormData({ ...signupFormData, [target.name]: target.value })
    }

     // Check email on change
     useEffect(()=>{
        if (!validateEmail(signupFormData.email)) {
            dispatch(setToasts("Invalid email", true, 'ERROR'))
        }else{
            dispatch(setToasts("", false, 'SUCCESS'))
        }
    // eslint-disable-next-line
    },[signupFormData.email])

    // Check password onchange
    useEffect(()=>{
        if (!validatePassword(signupFormData.password)) {
            dispatch(setToasts(`Password must be of length 8 to 30 which contains one digit, one uppercase alphabet, one lower case alphabet,
             one special character which includes !@#$%&*()-+=^ and doesn’t contain any white space`, true, 'ERROR'))
        }else{
            dispatch(setToasts("", false, 'SUCCESS'))
        }
    // eslint-disable-next-line
    },[signupFormData.password])

    // Submit form
    const handleSubmit = (event: React.FormEvent) => {
        console.log(signupFormData)

        if (!validateEmail(signupFormData.email)) {
            dispatch(setToasts("Invalid email", true, 'ERROR'))
        }else if (!validatePassword(signupFormData.password)) {
            dispatch(setToasts(`Password must be of length 8 to 30 which contains one digit, one uppercase alphabet, one lower case alphabet,
             one special character which includes !@#$%&*()-+=^ and doesn’t contain any white space`, true, 'ERROR'))
        }else {
            // api call for signup
            axios.post('http://localhost:4000/api/v1/users', signupFormData, { withCredentials: true })
                .then(function (response: any) {
                    console.log(response);
                    dispatch(setToasts(response.data.msg, true, 'SUCCESS'))
                    window.location.assign("/")
                })
                .catch(function (error) {
                    console.log(error);
                    dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
                });
        }


        event.preventDefault();
    }
    return (
        <div style={{ width: "50%", marginLeft: "25%", marginTop: "20%" }}>
            <h1>Airport Fuel Inventory</h1>
            <br />
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-3 row">
                    <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
                    <div className="col-sm-10">
                        <input onChange={handleChange} name="name" type="text" className="form-control" id="inputName" />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                        <input onChange={handleChange} name="email" type="email" className="form-control" id="inputEmail" />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                        <input onChange={handleChange} name="password" type="password" className="form-control" id="inputPassword" />
                    </div>
                    <p style={{fontSize: "10px"}}>Password must be of length 8 to 30 which contains one digit, one uppercase alphabet, one lower case alphabet,
             one special character which includes !@#$%&amp;*()-+=^ and doesn’t contain any white space</p>
                </div>
                <div className="col-auto">
                    <button type="submit" className="btn btn-primary mb-3">Signup</button>
                </div>
            </form >
            <Link to="/">Have an account, login now.</Link>
        </div >
    )
}

export default Signup