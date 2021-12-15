import { FC, ReactElement} from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { state } from "../../App";




const Sidebar: FC = (): ReactElement => {
    const homeTab = useSelector((state: state) => { return state.homeTab });

    return (
        <>
        <div className="col d-none d-md-block" style={{
            // position: "absolute",
            // backgroundColor: "gray",
            // height: "100vh",
            // width: "12rem"
        }}>
             <ul className="nav flex-column align-self-center">
            <li className="nav-item align-self-start">
                <Link className={`nav-link ${homeTab === 'HOME' ? 'active' : ''}`} aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item align-self-start">
                <Link className={`nav-link ${homeTab === 'AIRPORT' ? 'active' : ''}`} to="airports">Airport</Link>
            </li>
            <li className="nav-item align-self-start">
                <Link className={`nav-link ${homeTab === 'AIRCRAFT' ? 'active' : ''}`} to="aircrafts">Aircraft</Link>
            </li>
            <li className="nav-item align-self-start">
                <Link className={`nav-link ${homeTab === 'TRANSACTION' ? 'active' : ''}`} to="transactions">Transaction</Link>
            </li>
            <li className="nav-item align-self-start">
                <Link className={`nav-link ${homeTab === 'FUEL_CONSUMPTION_REPORT' ? 'active' : ''}`} to="reports">Fuel Consumption Report</Link>
            </li>
        </ul>

        {/* <ul className="nav flex-column">
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Active</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Link</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Link</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link disabled">Disabled</a>
                </li>
            </ul> */}
        </div>
        </>
    )
}

export default Sidebar