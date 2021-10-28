
import { FC, ReactElement } from "react";
import { airports } from "../airport/Airport";
import { transactions } from "../transaction/transaction";

type HomeSideBarProps = {
    airports: airports,
    transactions: transactions
}



const HomeSideBar: FC<HomeSideBarProps> = ({ airports, transactions }): ReactElement => {


    return (
        <div className="shadow-lg p-3 mb-5 bg-body rounded" style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            margin: "15px",
            justifyContent: "center",
            maxWidth: "40%"
        }}>
            {
                airports?.sort(function (a, b) {
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
                }).map((airport) => {
                    return (
                        <div key={airport.airport_id.toString()} className="card shadow p-2 mb-5 bg-body rounded" style={{ marginLeft: "5px" }}>
                            <div className="card-body" style={{ width: "18rem", maxHeight: "16rem", overflowY: "hidden" }}>
                                <label><strong>{airport.airport_name}</strong></label>

                                {
                                    transactions?.filter((transaction) => transaction.airport_id === airport.airport_id)?.slice(-5).map((transaction) => {
                                        return (
                                            <div className="shadow-sm rounded" key={transaction.transaction_id.toString()} style={{ backgroundColor: `${transaction.transaction_type === 'IN' ? '#76ff03' : '#ff8a80'}` }}>
                                                <p><strong>{transaction.transaction_type === 'IN' ? '+' : '-'}</strong>
                                                    &nbsp;&nbsp;
                                                    {`${transaction.quantity} L`}
                                                    &nbsp;&nbsp;
                                                    {new Date(transaction.transaction_date_time)
                                                        .toLocaleString("en-US", { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                                </p>
                                            </div>

                                        )
                                    })
                                }
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default HomeSideBar
