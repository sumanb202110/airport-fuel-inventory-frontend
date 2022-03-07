import { FC, ReactElement } from "react";
import { airport} from "../airport/Airport";

type HomeSideBarCardProps = {
    airport: airport
}
const HomeSideBarCard: FC<HomeSideBarCardProps> = (props): ReactElement => {
    const airport = props.airport;
    

    return (
       <>
       <div className="card shadow p-2 mb-5 bg-body rounded" style={{ marginLeft: "5px" }}>
                            <div className="card-body" style={{ width: "100%", maxWidth: "18rem", maxHeight: "16rem", overflowY: "hidden" }}>
                                <label><strong>{airport.airport_name}</strong></label>

                                {
                                    airport.transactions?.length!>0?
                                    airport.transactions?.map((transaction) => {
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
                                    :
                                    <p>
                                        No transaction available
                                    </p>
                                }
                            </div>
                        </div>
       </> 
    )
}

export default HomeSideBarCard