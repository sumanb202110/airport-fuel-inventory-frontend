import { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAircrafts, getAirports, getAirportsReport, getTransactions, getTransactionsReport, setHomeTab } from "../../actions";
// import { airports } from "../airport/Airport";
// import axios from "axios";
// import { transactions } from "../transaction/transaction";
import HomeSideBar from "./HomeSideBar";
import HomePieChart from "./HomePieChart";
import HomeLineChart from "./HomeLineChart";
import { ReactComponent as RefreshBlack } from '../../svgs/refresh_black_24dp.svg'

import { state } from "../../App";
import HomeBarChart from "./HomeBarChart";
import HomeReportAirportLTE20 from "./HomeReportAirportLTE20";
import HomeReportAirportGTE80 from "./HomeReportAirportGTE80";


const Home: FC = (): ReactElement => {

    // Transaction reports
    const transactionReport = useSelector((state: state) => { return state.transactions?.report });

    // retrive transactions data from redux
    const transactions = transactionReport?.mostRecent100Transactions

    // Dashboard chart type
    const [dashboardChartType, setDashboardChartType] = useState("REPORT_LINE_CHART")

    // retrive airports data from redux
    const airports = useSelector((state: state) => { return state.airports!.data });

    const dispatch = useDispatch()



    // home refresh button show less
    const [refreshButtonShowLess, setRefreshButtonShowLess] = useState(true)

    // Handle refresh function
    const handleRefresh = () => {
        dispatch(getAirports());
        dispatch(getAircrafts());
        dispatch(getTransactions(100));
        dispatch(getAirportsReport())
        dispatch(getTransactionsReport())
    }



    // Initial setup
    useEffect(() => {
        dispatch(setHomeTab('HOME'))
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%"
            }}>
                <button onClick={handleRefresh}
                    style={{
                        margin: "1px",
                        backgroundColor: "#ffffff",
                        zIndex: 10 as number
                    }}
                    onMouseOver={() => { setRefreshButtonShowLess(false) }}
                    onMouseOut={() => { setRefreshButtonShowLess(true) }} className="btn btn-outline-info" >
                    <RefreshBlack /> {!refreshButtonShowLess ? "Refresh" : ""}
                </button>
            </div>
            <div className="row" style={{
                // display: "flex",
                // flexDirection: "row",
                // flexWrap: "wrap"
            }}>


                <div className="col-md-7" style={{
                    // maxWidth: "60%"
                }} >
                    <div>

                        <div style={{
                            // padding: "10px" 
                        }}>
                            <div className="shadow-lg p-3 mb-4 bg-body rounded" style={{ width: "100%", height: "fit-content" }}>
                                <div className='header'>
                                    <ul className="nav nav-pills nav-fill">
                                        <li className="nav-item" >
                                            <button onClick={() => { setDashboardChartType("REPORT_LINE_CHART") }} className={`nav-link ${dashboardChartType === "REPORT_LINE_CHART" ? 'active' : ''}`} aria-current="page" >Report</button>
                                        </li>
                                        <li className="nav-item" >
                                            <button onClick={() => { setDashboardChartType("COMPARE_BAR_CHART") }} className={`nav-link ${dashboardChartType === "COMPARE_BAR_CHART" ? 'active' : ''}`} > Monthly comparison</button>
                                        </li>
                                        <li className="nav-item" >
                                            <button onClick={() => { setDashboardChartType("AIRPORT_REPORT_LTE20") }} className={`nav-link ${dashboardChartType === "AIRPORT_REPORT_LTE20" ? 'active' : ''}`} > Airports with less fuel available</button>
                                        </li>
                                        <li className="nav-item" >
                                            <button onClick={() => { setDashboardChartType("AIRPORT_REPORT_GTE80") }} className={`nav-link ${dashboardChartType === "AIRPORT_REPORT_GTE80" ? 'active' : ''}`} > Airports with more fuel available</button>
                                        </li>
                                    </ul>
                                    {/* <h1 className='title'>Report</h1> */}
                                    <div className='links'>
                                    </div>
                                </div>
                                <div style={{
                                    maxHeight: "40rem",
                                    minHeight: "20rem"
                                }}>
                                    {
                                        dashboardChartType === "REPORT_LINE_CHART" ?
                                            <div className="chart-container" >
                                                <HomeLineChart airports={airports} transactions={transactions} />
                                            </div>

                                            :
                                            null
                                    }
                                    {
                                        dashboardChartType === "COMPARE_BAR_CHART" ?
                                            <div >
                                                <HomeBarChart />
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        dashboardChartType === "AIRPORT_REPORT_LTE20" ?
                                            <div >
                                                <HomeReportAirportLTE20 />
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        dashboardChartType === "AIRPORT_REPORT_GTE80" ?
                                            <div >
                                                <HomeReportAirportGTE80 />
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        minWidth: "18rem"
                    }}>
                        <HomePieChart />
                    </div>

                </div>
                <div className="col-md-5" style={{
                    // maxWidth: "40%",
                    // minWidth: "18rem"
                }} >
                    <HomeSideBar />
                </div>

            </div >
        </>
    )
}

export default Home