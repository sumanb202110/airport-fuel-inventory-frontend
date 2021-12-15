import { FC, ReactElement, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionsReport } from "../../actions";
import { state } from "../../App";




const HomeTodayTransactions: FC = (): ReactElement => {
    const transactionReport = useSelector((state: state) => { return state.transactions?.report });

    const dispatch = useDispatch()

    useEffect(()=>{
        if(transactionReport === null){
            dispatch(getTransactionsReport())
        }
    // eslint-disable-next-line
    },[])

    return (
       <>
       <div className="container-fluid">
           <h5>Today Transactions</h5>
           <div className="row border-bottom" >
                <div className="col"><strong>Type</strong></div>
                <div className="col"><strong>Airport Id</strong></div>
                <div className="col"><strong>Quantity(L)</strong></div>
           </div>
       {
           
           transactionReport?.todayTransactions?.map((report: any)=>{
               return(
            <div className="row border-bottom" key={report.transaction_id} >
                <div className="col">{report.transaction_type}</div>
                <div className="col">{report.airport_id}</div>
                <div className="col">{report.quantity}</div>
           </div>
               ) 
           })
       }
       </div>
       </>
    )
}

export default HomeTodayTransactions