import { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAircrafts, getAirports, getTransactions, setHomeTab } from "../../actions";
// import { airports } from "../airport/Airport";
// import axios from "axios";
// import { transactions } from "../transaction/transaction";
import HomeSideBar from "../home_side_bar/HomeSideBar";
import HomePieChart from "../home_pie_chart/HomePieChart";
import HomeLineChart from "../home_line_chart/HomeLineChart";
import { ReactComponent as RefreshBlack } from '../../svgs/refresh_black_24dp.svg'
import { state } from "../../App";


const Home: FC = (): ReactElement => {
    // const [airports, setAirports] = useState<airports>()
    // const [transactions, setTransactions] = useState<transactions>()

    const dispatch = useDispatch()

    // retrive transactions data from redux
    const transactions = useSelector((state: state) => { return state.transactions!.data });

    // retrive airports data from redux
    const airports = useSelector((state: state) => { return state.airports!.data });

    // home refresh button show less
    const [refreshButtonShowLess, setRefreshButtonShowLess] = useState(true)


    // Get airports function
    // const getAirports = () => {
    //     axios.get<airports>('http://localhost:4000/api/v1/airports', { withCredentials: true })
    //         .then(function (response) {
    //             setAirports(response.data)
    //         })
    //         .catch(function (error: any) {
    //             console.log(error)
    //             dispatch(setToasts(error.response.data.msg,true, 'ERROR'))
    //         })
    // }

    // Get transactions function
    // const getTransactions = () => {
    //     axios.get<transactions>('http://localhost:4000/api/v1/transactions', { withCredentials: true })
    //         .then(function (response) {
    //             setTransactions(response.data)
    //         })
    //         .catch(function (error: any) {
    //             console.log(error)
    //             dispatch(setToasts(error.response.data.msg,true, 'ERROR'))
    //         })
    // }

    // Handle refresh function
    const handleRefresh = () => {
        dispatch(getAirports());
        dispatch(getAircrafts());
        dispatch(getTransactions(100));
    }



    // Initial setup
    useEffect(() => {
        dispatch(setHomeTab('HOME'))
        // dispatch(getAirports());
        // dispatch(getTransactions());

        // eslint-disable-next-line
    }, [])

    return (
        <>
        <br/>
            <div style={{ 
                display: "flex",
                justifyContent: "flex-end",
                position: "fixed",
                width: "100%",
                zIndex: 10 as number
                    }}>
                <button onClick={handleRefresh}
                style={{
                margin: "5px",
                backgroundColor: "#ffffff"
                }}
                 onMouseOver={()=>{setRefreshButtonShowLess(false)}}
                  onMouseOut={()=>{setRefreshButtonShowLess(true)}} className="btn btn-outline-info" >
                    <RefreshBlack /> {!refreshButtonShowLess?"Refresh":""}
                </button>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap"
            }}>


                <br />
                <div style={{
                    maxWidth: "60%"
                }} >

                    <HomeLineChart transactions={transactions!} airports={airports!} />

                    <HomePieChart airports={airports!} />

                </div>
                <div style={{
                    maxWidth: "40%",
                    minWidth: "20rem"
                }} >
                    <HomeSideBar />
                </div>

            </div >
        </>
    )
}

export default Home