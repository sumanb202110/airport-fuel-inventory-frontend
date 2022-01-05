import { FC, ReactElement, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAirportsReport } from "../../actions";
import { state } from "../../App";




const HomeReportAirportLTE20: FC = (): ReactElement => {
    const airportsReport = useSelector((state: state) => { return state.airports!.report});
    const dispatch = useDispatch()

    useEffect(()=>{
        if(airportsReport === null){
            dispatch(getAirportsReport())
        }
    // eslint-disable-next-line
    },[])

    return (
       <>
       <div className="container-fluid">
           <h5>Airports with less fuel available</h5>
           <div className="row border-bottom" >
                <div className="col"><strong>Airport Id</strong></div>
                <div className="col"><strong>Airport Name</strong></div>
                <div className="col"><strong>Fuel available(%)</strong></div>
           </div>
       {
           
           airportsReport?.airportLTE20?.slice(0,5).map((report: any)=>{
               return(
            <div className="row border-bottom" key={report.airport_id} style={{backgroundColor: `${report.available_percentage <10 ?'#ff8a80' : ''}`}}>
                <div className="col">{report.airport_id}</div>
                <div className="col">{report.airport_name}</div>
                <div className="col">{report.available_percentage}%</div>
           </div>
               ) 
           })
       }
       </div>
       </>
    )
}

export default HomeReportAirportLTE20