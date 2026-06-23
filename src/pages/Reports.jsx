import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Reports() {

    const navigate = useNavigate();

    const [date, setDate] = useState("");
    const [mobile, setMobile] = useState("");
    const [data, setData] = useState([]);

    const loadReport = async () => {

        if (!date) {

            alert("Please Select Date");
            return;

        }

        const today = new Date().toISOString().split("T")[0];

        if (date > today) {

            alert("Future Date Not Allowed");
            return;

        }

        try {

            const response = await api.get(
                `/api/report/date/${date}`
            );

            setData(response.data.data);

        }
        catch (error) {

            console.log(error);

            alert("Failed To Load Report");

        }

    };

    const downloadExcel = async () => {

        if (!date) {

            alert("Please Select Date");
            return;

        }

        try {

            const response = await api.get(
                `/api/report/export/${date}`,
                {
                    responseType: "blob"
                }
            );

            const url =
                window.URL.createObjectURL(
                    new Blob([response.data])
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                `Pigmy_Report_${date}.xlsx`
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

        }
        catch (error) {

            console.log(error);

            alert("Failed To Download Excel");

        }

    };

    const sendWhatsApp = async () => {

        if (!date) {

            alert("Please Select Date");
            return;

        }

        const mobileRegex = /^[0-9]{10,15}$/;

        if (!mobileRegex.test(mobile)) {

            alert("Enter Valid WhatsApp Number");
            return;

        }

        try {

            const response = await api.post(
                "/api/report/send-whatsapp",
                {
                    date,
                    mobile
                }
            );

            const whatsappUrl =
                `https://wa.me/${mobile}?text=` +
                encodeURIComponent(
                    response.data.message
                );

            window.open(
                whatsappUrl,
                "_blank"
            );

        }
        catch (error) {

            console.log(error);

            alert("Failed To Send Report");

        }

    };

    const totalAmount = data.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    return (

        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="mb-0">
                    Reports
                </h2>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/")}
                >
                    Back
                </button>

            </div>

            <div className="card shadow border-0">

                <div className="card-body">

                    <div className="row g-3">

                        <div className="col-12 col-md-6">

                            <label className="form-label">
                                Select Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                max={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                value={date}
                                onChange={(e) =>
                                    setDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="col-12 col-md-6">

                            <label className="form-label">
                                WhatsApp Number
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="919876543210"
                                value={mobile}
                                onChange={(e) =>
                                    setMobile(
                                        e.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                            />

                        </div>

                    </div>

                    <div className="mt-4 d-flex flex-column flex-md-row gap-2">

                        <button
                            className="btn btn-primary"
                            onClick={loadReport}
                        >
                            Load Report
                        </button>

                        <button
                            className="btn btn-success"
                            onClick={downloadExcel}
                        >
                            Download Excel
                        </button>

                        <button
                            className="btn btn-dark"
                            onClick={sendWhatsApp}
                        >
                            Send To WhatsApp
                        </button>

                    </div>

                </div>

            </div>

            <div className="card shadow border-0 mt-4">

                <div className="card-header bg-white">

                    <div className="row">

                        <div className="col-md-6 col-12">

                            <strong>
                                Total Records :
                            </strong>{" "}
                            {data.length}

                        </div>

                        <div className="col-md-6 col-12 text-md-end">

                            <strong>
                                Total Collection :
                            </strong>{" "}
                            ₹ {totalAmount}

                        </div>

                    </div>

                </div>

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-bordered table-hover">

                            <thead className="table-dark">

                                <tr>

                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Payment Mode</th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    data.length > 0
                                        ?
                                        data.map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <tr
                                                    key={index}
                                                >

                                                    <td>
                                                        {
                                                            item.customer_name
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            item.amount
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            item.payment_mode
                                                        }
                                                    </td>

                                                </tr>

                                            )
                                        )
                                        :
                                        <tr>

                                            <td
                                                colSpan="3"
                                                className="text-center"
                                            >
                                                No Report Data Found
                                            </td>

                                        </tr>
                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}