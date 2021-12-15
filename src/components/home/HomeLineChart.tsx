
import { FC, ReactElement, useEffect, useMemo } from "react";
import { Line } from 'react-chartjs-2'
import { useDispatch, useSelector } from "react-redux";
import { setHomeLineGraphData } from "../../actions";
import { state } from "../../App";
import { airports } from "../airport/Airport";
import { transactions } from "../transaction/transaction";


type HomeLineChartProps = {
    airports: airports,
    transactions: transactions
}

const colorHex = ["#ff1744", "#1e88e5", "#64ffda", "#aa00ff", "#cddc39", "#7e57c2", "#81c784", "#0091ea", "#f06292", "#5e35b1", "#eeff41"]


const HomeLineChart: FC<HomeLineChartProps> = (props): ReactElement => {

    const airports = useMemo(() => {
        return props.airports
    }, [props.airports])

    const transactions = useMemo(() => {
        return props.transactions
    }, [props.transactions])


    const dispatch = useDispatch()



    // retrive home line graph data from redux
    const homeLineGraphData = useSelector((state: state) => { return state.homeLineGraphData.lineData });

    const lineGraphData = () => {
        const data = airports?.sort(function (a, b) {
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
        }).map((airport, airportIndex) => {
            let tempQuantity = airport.fuel_available

            if (transactions?.slice(0, 25).find((data) => airport.airport_id === data.airport_id)) {
                return (
                    {
                        label: `${airport.airport_name}`,
                        data: [tempQuantity, ...transactions?.slice(0, 25)
                            ?.map((transaction, transactionIndex) => {
                                if (transaction.airport_id === airport.airport_id) {

                                    if (transaction.transaction_type === 'IN') {
                                        let temp = tempQuantity
                                        tempQuantity = (Number(tempQuantity) - Number(transaction.quantity))
                                        return (Number(temp) - Number(transaction.quantity))
                                    } else if (transaction.transaction_type === 'OUT') {
                                        let temp = tempQuantity
                                        tempQuantity = (Number(tempQuantity) + Number(transaction.quantity))
                                        return (Number(temp) + Number(transaction.quantity))
                                    }

                                }
                                return tempQuantity





                            }).slice(0, 25)]
                        ,
                        fill: false,
                        backgroundColor: colorHex[airportIndex % 11],
                        borderColor: colorHex[airportIndex % 11],
                        // yAxisID: 'y-axis-1',
                    })
            } else {
                return {}
            }
        })

        return data
    }
    const tempData = useMemo(() => {
        return lineGraphData()
    }
        // eslint-disable-next-line
        , [airports, transactions])

    useEffect(() => {
        dispatch(setHomeLineGraphData(tempData))
        // eslint-disable-next-line
    }, [airports, transactions])
    return (

        <Line data={{
            labels: transactions?.map((transaction) => new Date(transaction.transaction_date_time)
                .toLocaleString("en-US", { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
                .toString())
                .slice(0, 25),
            datasets: homeLineGraphData
            ,
        }} options={{
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Report',
                },
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            },

            maintainAspectRatio: false,
            responsive: true


        }} />


    )
}

export default HomeLineChart
