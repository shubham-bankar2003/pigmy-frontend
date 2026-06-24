import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
// Toast Imports
import { ToastContainer, toast } from "react-toastify";

export default function Reports() {
    const navigate = useNavigate();

    const [date, setDate] = useState("");
    const [mobile, setMobile] = useState("");
    const [data, setData] = useState([]);

    // Pagination States for separate tables
    const [cashPage, setCashPage] = useState(1);
    const [onlinePage, setOnlinePage] = useState(1);
    const itemsPerPage = 10;

    // Loading State for distinct actions
    const [loadingAction, setLoadingAction] = useState(""); // Values: "load", "excel", "whatsapp"

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const loadReport = async () => {
        if (!date) {
            toast.warn("Please Select a Date");
            return;
        }

        const today = new Date().toISOString().split("T")[0];
        if (date > today) {
            toast.warn("Future Dates Are Not Allowed");
            return;
        }

        setLoadingAction("load");
        try {
            const response = await api.get(`/api/report/date/${date}`);
            setData(response.data.data);
            setCashPage(1); // Reset pagination on fresh load
            setOnlinePage(1);
            toast.success("Reports Loaded Successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed To Load Report");
        } finally {
            setLoadingAction("");
        }
    };

    const downloadExcel = async () => {
        if (!date) {
            toast.warn("Please Select a Date");
            return;
        }

        setLoadingAction("excel");
        try {
            const response = await api.get(`/api/report/export/${date}`, {
                responseType: "blob"
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Pigmy_Report_${date}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Excel Downloaded Successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed To Download Excel");
        } finally {
            setLoadingAction("");
        }
    };

    const sendWhatsApp = async () => {
        if (!date) {
            toast.warn("Please Select a Date");
            return;
        }

        const mobileRegex = /^[0-9]{10,15}$/;
        if (!mobileRegex.test(mobile)) {
            toast.warn("Enter a Valid WhatsApp Number");
            return;
        }

        setLoadingAction("whatsapp");
        try {
            const response = await api.post("/api/report/send-whatsapp", {
                date,
                mobile
            });

            const whatsappUrl =
                `https://wa.me/${mobile}?text=` +
                encodeURIComponent(response.data.message);

            window.open(whatsappUrl, "_blank");
            toast.success("Redirecting to WhatsApp...");
        } catch (error) {
            console.log(error);
            toast.error("Failed To Send Report");
        } finally {
            setLoadingAction("");
        }
    };

    // --- DATA SPLITTING & CALCULATIONS ---
    const cashData = data.filter(item => item.payment_mode === "Cash");
    const onlineData = data.filter(item => item.payment_mode !== "Cash");

    const cashTotal = cashData.reduce((sum, item) => sum + Number(item.amount), 0);
    const onlineTotal = onlineData.reduce((sum, item) => sum + Number(item.amount), 0);
    const grandTotal = cashTotal + onlineTotal;

    // Cash Pagination
    const totalCashPages = Math.ceil(cashData.length / itemsPerPage);
    const cashStartIndex = (cashPage - 1) * itemsPerPage;
    const paginatedCashData = cashData.slice(cashStartIndex, cashStartIndex + itemsPerPage);

    // Online Pagination
    const totalOnlinePages = Math.ceil(onlineData.length / itemsPerPage);
    const onlineStartIndex = (onlinePage - 1) * itemsPerPage;
    const paginatedOnlineData = onlineData.slice(onlineStartIndex, onlineStartIndex + itemsPerPage);

    return (
        <div className="container py-4">
            {/* Toast System Global Container */}
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Split Reports</h2>
                <button 
                    className="btn btn-secondary" 
                    onClick={() => navigate("/")}
                    disabled={loadingAction !== ""}
                >
                    Back
                </button>
            </div>

            {/* Input Filters Card */}
            <div className="card shadow border-0">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <label className="form-label">Select Date</label>
                            <input
                                type="date"
                                className="form-control"
                                max={new Date().toISOString().split("T")[0]}
                                value={date}
                                disabled={loadingAction !== ""}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label">WhatsApp Number</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="919876543210"
                                value={mobile}
                                disabled={loadingAction !== ""}
                                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                            />
                        </div>
                    </div>

                    <div className="mt-4 d-flex flex-column flex-md-row gap-2">
                        <button 
                            className="btn btn-primary" 
                            onClick={loadReport}
                            disabled={loadingAction !== ""}
                        >
                            {loadingAction === "load" ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Loading Report...
                                </>
                            ) : (
                                "Load Report"
                            )}
                        </button>
                        
                        <button 
                            className="btn btn-success" 
                            onClick={downloadExcel}
                            disabled={loadingAction !== ""}
                        >
                            {loadingAction === "excel" ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Exporting...
                                </>
                            ) : (
                                "Download Excel"
                            )}
                        </button>

                        <button 
                            className="btn btn-dark" 
                            onClick={sendWhatsApp}
                            disabled={loadingAction !== ""}
                        >
                            {loadingAction === "whatsapp" ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Sending...
                                </>
                            ) : (
                                "Send To WhatsApp"
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Global Aggregations Summary */}
            {data.length > 0 && (
                <div className="card bg-light border-0 shadow-sm mt-4">
                    <div className="card-body py-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div>
                            <span className="text-muted small uppercase fw-bold d-block">Combined Overview</span>
                            <span className="fs-5 fw-bold text-dark">Total Consolidated Entries: {data.length}</span>
                        </div>
                        <div className="text-end">
                            <span className="text-muted small uppercase fw-bold d-block">Grand Aggregate Total</span>
                            <span className="fs-4 fw-black text-primary">₹ {grandTotal}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="row mt-2">
                {/* Cash Collections Segment */}
                <div className="col-12 col-xl-6 mt-3">
                    <div className="card shadow border-0 h-100">
                        <div className="card-header bg-primary text-white py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">💵 Cash Ledger</h5>
                                <div className="text-end">
                                    <span className="d-block small">Records: {cashData.length}</span>
                                    <strong className="fs-6">Subtotal: ₹ {cashTotal}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Customer Name</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingAction === "load" ? (
                                            <tr>
                                                <td colSpan="2" className="text-center py-4">
                                                    <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
                                                </td>
                                            </tr>
                                        ) : paginatedCashData.length > 0 ? (
                                            paginatedCashData.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.customer_name}</td>
                                                    <td className="text-primary fw-medium">₹ {item.amount}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="text-center py-3 text-muted">
                                                    No Cash Transactions Found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {cashData.length > 0 && (
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span className="small text-muted">Page {cashPage} of {totalCashPages || 1}</span>
                                    <div className="d-flex gap-1">
                                        <button
                                            className="btn btn-outline-secondary btn-sm px-2 py-1"
                                            disabled={cashPage === 1 || loadingAction !== ""}
                                            onClick={() => setCashPage(cashPage - 1)}
                                        >
                                            Prev
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary btn-sm px-2 py-1"
                                            disabled={cashPage === totalCashPages || totalCashPages === 0 || loadingAction !== ""}
                                            onClick={() => setCashPage(cashPage + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Online Collections Segment */}
                <div className="col-12 col-xl-6 mt-3">
                    <div className="card shadow border-0 h-100">
                        <div className="card-header bg-success text-white py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">📱 Online Ledger</h5>
                                <div className="text-end">
                                    <span className="d-block small">Records: {onlineData.length}</span>
                                    <strong className="fs-6">Subtotal: ₹ {onlineTotal}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Customer Name</th>
                                            <th>Amount</th>
                                            <th>Method</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingAction === "load" ? (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4">
                                                    <div className="spinner-border text-success spinner-border-sm" role="status"></div>
                                                </td>
                                            </tr>
                                        ) : paginatedOnlineData.length > 0 ? (
                                            paginatedOnlineData.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.customer_name}</td>
                                                    <td className="text-success fw-medium">₹ {item.amount}</td>
                                                    <td>
                                                        <span className="badge bg-outline-success text-success border border-success px-2 py-1">
                                                            {item.payment_mode}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-3 text-muted">
                                                    No Online Transactions Found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {onlineData.length > 0 && (
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span className="small text-muted">Page {onlinePage} of {totalOnlinePages || 1}</span>
                                    <div className="d-flex gap-1">
                                        <button
                                            className="btn btn-outline-secondary btn-sm px-2 py-1"
                                            disabled={onlinePage === 1 || loadingAction !== ""}
                                            onClick={() => setOnlinePage(onlinePage - 1)}
                                        >
                                            Prev
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary btn-sm px-2 py-1"
                                            disabled={onlinePage === totalOnlinePages || totalOnlinePages === 0 || loadingAction !== ""}
                                            onClick={() => setOnlinePage(onlinePage + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}