import { FC, ReactElement, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAirports, getTransactions, setHomeTab} from "../../actions";
// import { airports } from "../airport/Airport";
// import axios from "axios";
// import { transactions } from "../transaction/transaction";
import HomeSideBar from "../home_side_bar/HomeSideBar";
import HomePieChart from "../home_pie_chart/HomePieChart";
import HomeLineChart from "../home_line_chart/HomeLineChart";
import { state } from "../../App";


const Home: FC = (): ReactElement => {
    // const [airports, setAirports] = useState<airports>()
    // const [transactions, setTransactions] = useState<transactions>()

    const dispatch = useDispatch()

    // retrive transactions data from redux
    const transactions = useSelector((state: state) => { return state.transactions!.data });

    // retrive airports data from redux
    const airports = useSelector((state: state) => { return state.airports!.data });


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





    // Initial setup
    useEffect(() => {
        dispatch(setHomeTab('HOME'))
        dispatch(getAirports());
        dispatch(getTransactions());

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