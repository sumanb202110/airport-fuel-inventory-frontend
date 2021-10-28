import { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setHomeTab, setToasts } from "../../actions";
import { airports } from "../airport/Airport";
import axios from "axios";
import { transactions } from "../transaction/transaction";
import HomeSideBar from "../home_side_bar/HomeSideBar";
import HomePieChart from "../home_pie_chart/HomePieChart";
import HomeLineChart from "../home_line_chart/HomeLineChart";


const Home: FC = (): ReactElement => {
    const [airports, setAirports] = useState<airports>()
    const [transactions, setTransactions] = useState<transactions>()




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

    const getTransactions = () => {
        axios.get<transactions>('http://localhost:4000/api/v1/transactions', { withCredentials: true })
            .then(function (response) {
                setTransactions(response.data)
            })
            .catch(function (error: any) {
                console.log(error)
                dispatch(setToasts(error.response.data.msg,true, 'ERROR'))
            })
    }


    const dispatch = useDispatch()



    useEffect(() => {
        dispatch(setHomeTab('HOME'))
        getAirports();
        getTransactions();

        // eslint-disable-next-line
    }, [])

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap"
        }}>

            <br />
            <div style={{
                width: "55vw"
            }} >

                <HomeLineChart transactions={transactions!} airports={airports!} />

                <HomePieChart airports={airports!} />

            </div>

            <HomeSideBar transactions={transactions!} airports={airports!} />

        </div >
    )
}

export default Home