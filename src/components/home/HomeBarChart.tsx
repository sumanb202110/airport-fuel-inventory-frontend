import { FC, ReactElement, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionsReport } from "../../actions";
import { state } from "../../App";


const HomeBarChart: FC = (): ReactElement => {

    const dispatch = useDispatch()

    const transactionReport = useSelector((state: state) => { return state.transactions?.report });


    useEffect(() => {
        console.log(transactionReport)
        if(transactionReport === null){
            dispatch(getTransactionsReport())
        }
        // eslint-disable-next-line
    }, [])


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Monthly comparison',
            },
        },
    };
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const labels = transactionReport?.yearMonthReport.map((report: any)=>{
        return `${months[report.month-1]} ${report.year}`
    }).filter((value: any, index: any, self: any) => {
        return self.indexOf(value) === index;
      })


    const data = {
        labels,
        datasets: [
            {
                label: 'IN',
                data: transactionReport?.yearMonthReport.filter((report: any) => 
                    report.transaction_type === "IN"
                ).map((report: any)=>{return report.totalQuantity}),
                backgroundColor: '#304ffe88',
            },
            {
                label: 'OUT',
                data: transactionReport?.yearMonthReport.filter((report: any) => 
                report.transaction_type === "OUT"
            ).map((report: any)=>{return report.totalQuantity}),
                backgroundColor: '#f4433688'
            },
        ],
    };
    return (
        <Bar options={options} data={data} />
    )
}

export default HomeBarChart