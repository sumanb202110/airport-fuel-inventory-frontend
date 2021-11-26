import { FC, ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { state } from "../../App";





const Toasts: FC = (): ReactElement => {
    const [displayToasts, setDisplayToasts] = useState(false)

    const toastsMsg = useSelector((state: state) => { return state.toastsMsg });
    useEffect(() => {
        if (toastsMsg.display) {
            setDisplayToasts(true)
        } else {
            setDisplayToasts(false)
        }

        setTimeout(() => {
            setDisplayToasts(false)
            window.sessionStorage.setItem("TOASTS_MSG", "");
            window.sessionStorage.setItem("TOASTS_DISPLAY", "FALSE");
            window.sessionStorage.setItem("TOASTS_TYPE", "");
        }, 10000)
    }, [toastsMsg])

    return (
        <div aria-live="polite" aria-atomic="true" style={{ position: "fixed", minHeight: "200px", zIndex: 1100 }}>
            <div className="toast"
                style={
                    {
                        position: "fixed",
                        top: 50,
                        right: 10,
                        display: `${displayToasts ? "block" : "none"}`,
                        borderColor: `${toastsMsg.type !== "ERROR" ? "greenyellow" : "red"}`
                    }
                }>
                <div className="toast-header">
                    <button type="button" onClick={() => { setDisplayToasts(false) }} className="ml-2 mb-1 close btn btn-light" data-dismiss="toast" aria-label="Close">
                        <span aria-hidden="true">&times; </span>
                    </button>
                    <strong className="mr-auto">{toastsMsg.type !== "ERROR" ? "Success" : "Error"}</strong>

                </div>
                <div className="toast-body">
                    {toastsMsg.msg}
                </div>
            </div>
        </div>
    )
}

export default Toasts