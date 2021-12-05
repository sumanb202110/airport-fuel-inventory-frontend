import { FC, ReactElement } from "react";
import { useSelector } from 'react-redux'
import { Link } from "react-router-dom";
import { state } from "../../App";


const Tabs: FC = (): ReactElement => {
    const homeTab = useSelector((state: state) => { return state.homeTab });

    return (
        <ul className="nav nav-tabs" style={{minWidth: "max-content"}}>
            <li className="nav-item">
                <Link className={`nav-link ${homeTab === 'HOME' ? 'active' : ''}`} aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
                <Link className={`nav-link ${homeTab === 'AIRPORT' ? 'active' : ''}`} to="airports">Airport</Link>
            </li>
            <li className="nav-item">
                <Link className={`nav-link ${homeTab === 'AIRCRAFT' ? 'active' : ''}`} to="aircrafts">Aircraft</Link>
            </li>
            <li className="nav-item">
                <Link className={`nav-link ${homeTab === 'TRANSACTION' ? 'active' : ''}`} to="transactions">Transaction</Link>
            </li>
            <li className="nav-item">
                <Link className={`nav-link ${homeTab === 'FUEL_CONSUMPTION_REPORT' ? 'active' : ''}`} to="reports">Fuel Consumption Report</Link>
            </li>
        </ul>
    )
}

export default Tabs