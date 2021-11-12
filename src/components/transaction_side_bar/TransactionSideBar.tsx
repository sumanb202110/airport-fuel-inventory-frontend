import { FC, ReactElement } from "react";
import { useSelector } from "react-redux";
import { state } from "../../App";




const TransactionSideBar: FC = (): ReactElement => {

    // retrive selected transaction data from redux
    const selectedTransaction = useSelector((state: state) => { return state.selectedTransaction });

    // retrive airports data from redux
    const airports = useSelector((state: state) => { return state.airports!.data });

    return (
        <>
            {
                selectedTransaction.transaction_id !== undefined ?
                    <div style={{ width: "10%", minWidth: "20%" , alignItems: "center" }} className="no-mobile">
                        <div className="card" style={{ width: "18rem", height: "25rem", position: "fixed" }}>
                            <div className="card-header bg-primary text-white" style={{ display: "flex" }}>
                                <h5 className="card-title">{airports?.filter((airport) => { return airport.airport_id === selectedTransaction.airport_id })[0]?.airport_name}</h5>
                                {
                                    selectedTransaction.transaction_type === "IN" ?
                                        <div style={{ color: "#76ff03", fontSize: "50px", width: "40%" }}>
                                            {selectedTransaction.transaction_type}
                                        </div>
                                        :
                                        <div style={{ color: "#e53935", fontSize: "50px", width: "40%" }}>
                                            {selectedTransaction.transaction_type}
                                        </div>
                                }

                            </div>
                            <div className="card-body">
                                <h6 className="card-subtitle mb-2 tedxt-muted"> {new Date(selectedTransaction.transaction_date_time!)
                                    .toLocaleString("en-US", { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', day: 'numeric',month: 'long', hour: 'numeric', minute: 'numeric' })}
                                </h6>
                                <p className="card-text">Transaction Type: <strong>{selectedTransaction.transaction_type}</strong></p>
                                <p className="card-text">Quantity: <strong>{selectedTransaction.quantity}</strong></p>
                                <p className="card-text">Aircraft Id: <strong>{selectedTransaction.aircraft_id !== "" ? selectedTransaction.aircraft_id : "----"}</strong></p>
                                <p className="card-text">Parent Transaction Id: <strong>{selectedTransaction.transaction_id_parent !== undefined ? selectedTransaction.transaction_id_parent : "----"}</strong></p>
                                <p>{selectedTransaction.transaction_id_parent !== undefined ? "This ia a reverted transaction" : ""}</p>

                            </div>
                        </div>
                    </div>
                    :
                    null
            }
        </>
    )
}

export default TransactionSideBar