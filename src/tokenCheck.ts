import axios from 'axios';
import jwt from 'jsonwebtoken';
import {Dispatch, Middleware, MiddlewareAPI } from 'redux'


    // Axios auth config
    const authAxios = axios.create({
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
    })

export function tokenCheck() {
    const tokenCheckMiddleware: Middleware =
      ({ getState }: MiddlewareAPI) =>
      (next: Dispatch) =>
      action => {
  
        const token = window.localStorage.getItem("token");
  
        const remainingTime = (jwt.decode(token as string  )as any)?.exp*1000 - Date.now()

        if(remainingTime<=0){
            authAxios.post('http://localhost:4000/api/v1/users/logout', {refreshToken:  window.localStorage.getItem("refreshToken") })
            .then(function (response: any) {
                window.localStorage.clear()
                window.location.assign("/")
            })
            .catch(function (error) {
                console.log(error);
            });
        }
  
        if(remainingTime<60*60*1000){
            // api call for refresh
            authAxios.post('http://localhost:4000/api/v1/users/refresh', {refreshToken:  window.localStorage.getItem("refreshToken") })
            .then(function (response: any) {
                window.localStorage.setItem("token", response.data.token);
                window.localStorage.setItem("refreshToken", response.data.refreshToken);

            })
            .catch(function (error) {
                console.log(error);
            });

        }
        
  
  
        
  
        const returnValue = next(action)
        return returnValue
      }
  
    return tokenCheckMiddleware
  }
  