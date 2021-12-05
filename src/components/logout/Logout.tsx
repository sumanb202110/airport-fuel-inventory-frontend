import { FC, ReactElement, useEffect } from "react";
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { logout, setToasts, setUserDetails } from "../../actions";
import { Link } from "react-router-dom";



const Logout: FC = (): ReactElement => {
    const dispatch = useDispatch()

    // Axios auth config
    const authAxios = axios.create({
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
    })

    // Submit form
    useEffect(() => {
        // api call for login
        authAxios.post('http://localhost:4000/api/v1/users/logout', {refreshToken:  window.localStorage.getItem("refreshToken") })
            .then(function (response: any) {
                console.log(response);
                dispatch(logout())
                dispatch(setToasts(response?.data?.msg,true, 'SUCCESS'))
                window.localStorage.clear()
                dispatch(setUserDetails(""))
                window.location.assign("/")
            })
            .catch(function (error) {
                console.log(error);
                dispatch(setToasts(error?.response?.data?.msg,true, 'ERROR'))
            });
        // eslint-disable-next-line
    }, [])



    return (
        <div>
            <h1>Successfully logout</h1>
            <Link to="/">Login</Link>
        </div>
    )
}

export default Logout