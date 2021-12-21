import { FC, ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDeleteTransactionData, setDeleteTransactionFormHidden, setSelectedTransaction, setUpdateTransactionData, setUpdateTransactionFormHidden } from "../../actions";
import { state } from "../../App";
import { ReactComponent as EditBlack } from '../../svgs/edit_black_24dp.svg'
import { ReactComponent as DeleteBlack } from '../../svgs/delete_black_24dp.svg'




const TransactionSideBar: FC = (): ReactElement => {

    const dispatch = useDispatch()

    // retrive selected transaction data from redux
    const selectedTransactionID = useSelector((state: state) => { return state.selectedTransaction.transaction_id });

    // retrive selected transaction data from redux
    const transactions = useSelector((state: state) => { return state.transactions!.data });

    // Selected transcation details
    const selectedTransaction = transactions?.filter((transaction) => transaction.transaction_id === selectedTransactionID)[0]

    // retrive airports data from redux
    const airports = useSelector((state: state) => { return state.airports!.data });

    return (
        <>
            {
                selectedTransaction?.transaction_id !== undefined ?
                    <div style={{ width: "20%", alignItems: "center", position: "fixed", right: "8rem" }} className="no-mobile">
                        <div className="card" style={{ width: "18rem", height: "25rem", position: "fixed" }}>
                            <div className="card-header bg-primary text-white" style={{ display: "flex" }}>
                                <div>
                                    <button className="btn btn-outline-danger" onClick={()=>{dispatch(setSelectedTransaction({
                                        transaction_id: "",
                                        transaction_date_time: "",
                                        transaction_type: "",
                                        airport_id: "",
                                        aircraft_id: "",
                                        quantity: 0,
                                        transaction_id_parent: ""
                                    }))}}>
                                    X
                                    </button>
                                </div>

                                <h5 className="card-title">{airports?.filter((airport) => { return airport.airport_id === selectedTransaction.airport_id })[0]?.airport_name}</h5>
                                {
                                    selectedTransaction.transaction_type === "IN" ?
                                        <div style={{ color: "#76ff03", fontSize: "2rem", width: "40%" }}>
                                            {selectedTransaction.transaction_type}
                                        </div>
                                        :
                                        <div style={{ color: "#e53935", fontSize: "2rem", width: "40%" }}>
                                            {selectedTransaction.transaction_type}
                                        </div>
                                }

                            </div>
                            <div className="card-body">
                                <h6 className="card-subtitle mb-2 tedxt-muted"> {new Date(selectedTransaction.transaction_date_time!)
                                    .toLocaleString("en-US", { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' })}
                                </h6>
                                <p className="card-text">Transaction Type: <strong>{selectedTransaction.transaction_type}</strong></p>
                                <p className="card-text">Quantity: <strong>{selectedTransaction.quantity} L</strong></p>
                                <p className="card-text">Aircraft Id: <strong>{selectedTransaction.aircraft_id !== "" ? selectedTransaction.aircraft_id : "----"}</strong></p>
                                <p className="card-text">Parent Transaction Id: <strong>{selectedTransaction.transaction_id_parent !== undefined ? selectedTransaction.transaction_id_parent : "----"}</strong></p>
                                <p>{selectedTransaction.transaction_id_parent !== undefined ? "This ia a reverted transaction" : ""}</p>
                                <button
                                    className="btn btn-outline-warning"
                                    onClick={() => {
                                        dispatch(setUpdateTransactionData(
                                            {
                                                transaction_id: selectedTransaction.transaction_id,
                                                transaction_type: selectedTransaction.transaction_type,
                                                airport_id: selectedTransaction.airport_id,
                                                aircraft_id: selectedTransaction.aircraft_id,
                                                quantity: selectedTransaction.quantity
                                            }
                                        ));
                                        dispatch(setUpdateTransactionFormHidden(false))
                                    }}>
                                    <EditBlack /> Edit
                                </button>
                                <span style={{ padding: "5px" }}></span>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => {
                                        dispatch(setDeleteTransactionData(
                                            {
                                                transaction_id: selectedTransaction.transaction_id,
                                                transaction_type: selectedTransaction.transaction_type,
                                                airport_id: selectedTransaction.airport_id,
                                                aircraft_id: selectedTransaction.aircraft_id,
                                                quantity: selectedTransaction.quantity
                                            }
                                        ));
                                        dispatch(setDeleteTransactionFormHidden(false))
                                    }}>
                                    <DeleteBlack /> Delete
                                </button>
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