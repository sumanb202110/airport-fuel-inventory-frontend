import { FC, ReactElement, useState } from "react";
import Tabs from "../tabs/Tabs";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { state } from "../../App";
import { ReactComponent as AcountCircleBlack } from '../../svgs/account_circle_black_24dp.svg'





const Nav: FC = (): ReactElement => {

    // retrive user details data from redux
    const userDetails = useSelector((state: state) => { return state.user });
    const [isNavCollapseHidden, setIsNavCollapseHidden] = useState(true)

    return (
        <>
        <div>
            <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#e3f2fd" }}>
                <div className="container-fluid">
                    <Link to="#" className="navbar-brand">Airport Fuel Inventory</Link>
                    <button onClick={() => { setIsNavCollapseHidden(!isNavCollapseHidden) }} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav" style={{ display: isNavCollapseHidden ? "none" : "block" }}>
                        <ul className="navbar-nav" style={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "flex-end"
                        }}>

                            <li className="nav-item" style={{ alignSelf: "center" }}>
                                <span className="d-none">
                                    <AcountCircleBlack/>
                                </span>
                                <span style={{ alignSelf: "center" }}>{userDetails.email}</span>
                            </li>
                            <span style={{ width: "10px" }}></span>
                            <li className="nav-item">
                                <Link to="/logout">
                                    <button type="button" className="btn btn-light">Logout</button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div style={{ overflow: "auto" }}>
                <Tabs />
            </div>
            

        </div>
        
        </>
    )
}

export default Nav