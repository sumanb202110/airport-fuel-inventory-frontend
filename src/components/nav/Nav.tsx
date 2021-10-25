import { FC, ReactElement } from "react";
import Tabs from "../tabs/Tabs";
import { Link } from "react-router-dom";




const Home: FC = (): ReactElement => {


    return (
        <div>
            <nav className="navbar navbar-light" style={{ backgroundColor: "#e3f2fd" }}>
                <div className="container-fluid">
                    <Link to="#" className="navbar-brand">Airport Fuel Inventory</Link>
                    <form className="d-flex">
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