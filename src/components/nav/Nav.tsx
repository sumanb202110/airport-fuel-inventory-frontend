import { FC, ReactElement } from "react";
import Tabs from "../tabs/Tabs";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { state } from "../../App";




const Home: FC = (): ReactElement => {

// retrive user details data from redux
const userDetails = useSelector((state: state) => { return state.user });

    return (
        <div>
            <nav className="navbar navbar-light" style={{ backgroundColor: "#e3f2fd" }}>
                <div className="container-fluid">
                    <Link to="#" className="navbar-brand">Airport Fuel Inventory</Link>
                    <form className="d-flex">
                        <span style={{alignSelf: "center"}}>{userDetails.email}</span>
                        <span style={{width: "10px"}}></span>
                        <Link to="/logout">
                            <button type="button" className="btn btn-light">Logout</button>
                        </Link>
                    </form>
                </div>
            </nav>
            <Tabs />
        </div>
    )
}

export default Home