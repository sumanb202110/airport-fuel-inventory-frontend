
import { FC, ReactElement } from "react";
import { useSelector } from "react-redux";
import { state } from "../../App";
import HomeSideBarCard from "./HomeSideBarCard";
import HomeTodayTransactions from "./HomeTodayTransactions";




const HomeSideBar: FC= (): ReactElement => {
    // retrive airports data from redux
    const airports = useSelector((state: state) => { return state.airports!.data });


    // Transaction reports
    const transactionReport = useSelector((state: state) => { return state.transactions?.report });

    return (
        <div style={{
            // padding: "10px"
            }}>
        <div className="shadow-lg p-3 mb-4 bg-body rounded" style={{width: "100%"}}>
                <HomeTodayTransactions/>
        </div>
        <div className="shadow-lg p-3 mb-5 bg-body rounded" style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            // margin: "20px",
            justifyContent: "center",
            // maxWidth: "100%",
            minWidth: "100%"
        }}>
            
            {
                airports?.filter((airport)=>transactionReport?.mostRecent10TransactedAirports.slice(0,6).find((data: any)=> data===airport.airport_id))
                // .sort(function (a, b) {
                //     var nameA = a.airport_name.toUpperCase(); // ignore upper and lowercase
                //     var nameB = b.airport_name.toUpperCase(); // ignore upper and lowercase
                //     if (nameA < nameB) {
                //         return -1;
                //     }
                //     if (nameA > nameB) {
                //         return 1;
                //     }

                //     // names must be equal
                //     return 0;
                // })
                .map((airport) => {
                    return (
                        <HomeSideBarCard airport={airport} key={airport.airport_id.toString()}/>
                    )
                })
            }

        </div>
        </div>
    )
}

export default HomeSideBar
