
import { FC, ReactElement } from "react";
import { airports } from "../airport/Airport";
import { Line } from 'react-chartjs-2'
import { transactions } from "../transaction/transaction";


type HomeLineChartProps = {
    airports: airports,
    transactions: transactions
}

const colorHex = ["#ff1744", "#1e88e5", "#64ffda", "#aa00ff", "#cddc39", "#7e57c2", "#81c784"]


const HomeLineChart: FC<HomeLineChartProps> = ({ airports, transactions }): ReactElement => {

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
            return (
                {
                    label: `${airport.airport_name}`,
                    data: transactions
                        ?.sort(function (a, b) {
                            var nameA = a.transaction_date_time.toUpperCase(); // ignore upper and lowercase
                            var nameB = b.transaction_date_time.toUpperCase(); // ignore upper and lowercase
                            if (nameA > nameB) {
                                return -1;
                            }
                            if (nameA < nameB) {
                                return 1;
                            }

                            // names must be equal
                            return 0;
                        })
                        ?.map((transaction, transactionIndex) => {
                            // if((transaction.airport_id === airport.airport_id))
                            // {
                            //     console.log(transaction.airport_id,transaction.transaction_date_time)
                            // }
                            if ((transaction.airport_id === airport.airport_id) && (transaction.transaction_type === 'IN')) {
                                tempQuantity = (Number(tempQuantity) - Number(transaction.quantity))

                            } if ((transaction.airport_id === airport.airport_id) && (transaction.transaction_type === 'OUT')) {
                                tempQuantity = (Number(tempQuantity) + Number(transaction.quantity))
                            }
                            return tempQuantity

                        }).slice(0, 25)
                    ,
                    fill: false,
                    backgroundColor: colorHex[airportIndex],
                    borderColor: colorHex[airportIndex],
                    // yAxisID: 'y-axis-1',
                })
        })

        return data
    }

    return (
        <div className="shadow-lg p-3 mb-5 bg-body rounded" style={{ margin: "20px" }}>
            <div className='header'>
                <h1 className='title'>Report</h1>
                <div className='links'>

                </div>
            </div >
            <div style={{ width: "100%" }}>
                <Line data={{
                    labels: transactions?.map((transaction) => new Date(transaction.transaction_date_time)
                        .toLocaleString("en-US", { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
                        .toString())
                        .slice(0, 25),
                    datasets: lineGraphData()!
                    ,
                }} options={{
                    responsive: true,

                }} />
            </div>
        </div>
    )
}

export default HomeLineChart
