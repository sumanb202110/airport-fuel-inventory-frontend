
import { FC, ReactElement } from "react";
import { airports } from "../airport/Airport";
import { Pie } from 'react-chartjs-2'


type HomePieChartProps = {
    airports: airports
}



const HomePieChart: FC<HomePieChartProps> = ({ airports }): ReactElement => {


    return (
        <div className="shadow-lg p-3 mb-5 bg-body rounded" style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            minWidth: "21rem",
            // height: "50%",
            margin: "20px",
            // justifyContent: "space-around",
            justifyContent: "center"


        }}>
            {
                airports?.map((airport) => {
                    return (
                        <div key={airport.airport_id.toString()} className="card" style={{ width: "18rem", margin: "5px" }}>
                            <div className="card-body">
                                <div >

                                    <Pie data={{
                                        labels: [
                                            'Available',
                                            'Empty'

                                        ],
                                        datasets: [{
                                            data: [airport.fuel_available, Number(airport.fuel_capacity) - Number(airport.fuel_available)],
                                            backgroundColor: [
                                                '#2979ff',
                                                '#bdbdbd'
                                            ],
                                            hoverBackgroundColor: [
                                                '#66ffa6',
                                                '#d81b60'
                                            ]
                                        }]
                                    }} height={100} width={100} options={{
                                        responsive: true,
                                        maintainAspectRatio: true,
                                        aspectRatio: 2,
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'bottom',
                                                labels: {
                                                    padding: 4,
                                                },
                                            },
                                        },

                                    }} />
                                    <label>{airport.airport_name}</label>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default HomePieChart
