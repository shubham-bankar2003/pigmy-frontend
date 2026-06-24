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

    // Consolidated Pagination State
    const [currentPage, setCurrentPage] = useState(1);
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
            setCurrentPage(1); // Reset pagination on fresh load
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
            link.setAttribute("download", `Pigmy_Consolidated_Report_${date}.xlsx`);
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

    // --- CONSOLIDATED CALCULATIONS & AGGREGATION ---
    const cashTotal = data
        .filter(item => item.payment_mode === "Cash")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const onlineTotal = data
        .filter(item => item.payment_mode !== "Cash")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const grandTotal = cashTotal + onlineTotal;

    // Grouping raw data by Customer Name to combine Cash and Online entries into one row
    const groupedData = Object.values(
        data.reduce((acc, item) => {
            const name = item.customer_name;
            const amount = Number(item.amount);
            const isCash = item.payment_mode === "Cash";

            if (!acc[name]) {
                acc[name] = {
                    customer_name: name,
                    cashAmount: 0,
                    onlineAmount: 0,
                    totalAmount: 0
                };
            }

            if (isCash) {
                acc[name].cashAmount += amount;
            } else {
                acc[name].onlineAmount += amount;
            }
            acc[name].totalAmount += amount;

            return acc;
        }, {})
    );

    // Table Pagination Calculations using grouped data
    const totalPages = Math.ceil(groupedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = groupedData.slice(startIndex, startIndex + itemsPerPage);

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
                mobile,
                summary: {
                    cashTotal,
                    onlineTotal,
                    grandTotal,
                    totalRecords: groupedData.length
                }
            });

            let messageText = `*📊 CONSOLIDATED PIGMY REPORT*\n`;
            messageText += `📅 *Date:* ${date}\n`;
            messageText += `------------------------------------------\n\n`;
            
            messageText += `*👤 Customer Breakdown:*\n`;
            groupedData.forEach((item, index) => {
                const cash = item.cashAmount > 0 ? `₹${item.cashAmount}` : "-";
                const online = item.onlineAmount > 0 ? `₹${item.onlineAmount}` : "-";
                messageText += `${index + 1}. *${item.customer_name}*\n   • Cash: ${cash} | Online: ${online} | Total: ₹${item.totalAmount}\n`;
            });

            messageText += `\n------------------------------------------\n`;
            messageText += `💵 *Total Cash:* ₹${cashTotal}\n`;
            messageText += `📱 *Total Online:* ₹${onlineTotal}\n`;
            messageText += `⭐ *GRAND TOTAL:* ₹${grandTotal}\n`;
            messageText += `------------------------------------------\n`;
            messageText += `_Generated automatically via Pigmy System._`;

            const whatsappUrl = `https://wa.me/${mobile}?text=${encodeURIComponent(messageText)}`;

            window.open(whatsappUrl, "_blank");
            toast.success("Redirecting to WhatsApp... Check message format.");
        } catch (error) {
            console.log(error);
            toast.error("Failed To Send Report");
        } finally {
            setLoadingAction("");
        }
    };

    return (
        <div className="container py-4">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Consolidated Reports</h2>
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

            {/* Unified Table Section */}
            <div className="card shadow border-0 mt-4">
                <div className="card-header bg-dark text-white py-3">
                    <h5 className="mb-0">📝 Unified Ledger Table</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Cash Payment</th>
                                    <th>Online Payment</th>
                                    <th className="text-end">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingAction === "load" ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4">
                                            <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
                                        </td>
                                    </tr>
                                ) : paginatedData.length > 0 ? (
                                    paginatedData.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="fw-medium">{item.customer_name}</td>
                                                <td className="text-primary">
                                                    {item.cashAmount > 0 ? `₹ ${item.cashAmount}` : "-"}
                                                </td>
                                                <td className="text-success">
                                                    {item.onlineAmount > 0 ? `₹ ${item.onlineAmount}` : "-"}
                                                </td>
                                                <td className="text-end fw-bold">₹ {item.totalAmount}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-3 text-muted">
                                            No Transaction Records Found. Select a date and click Load Report.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            {groupedData.length > 0 && (
                                <tfoot className="table-dark fw-bold">
                                    <tr>
                                        <td>Summary Totals</td>
                                        <td className="text-info">₹ {cashTotal}</td>
                                        <td className="text-warning">₹ {onlineTotal}</td>
                                        <td className="text-end text-success fs-5">₹ {grandTotal}</td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
                
                {/* Pagination Controls */}
                {groupedData.length > 0 && (
                    <div className="card-footer d-flex justify-content-between align-items-center bg-white border-top-0 py-3">
                        <span className="small text-muted">Page {currentPage} of {totalPages || 1} (Total: {groupedData.length} records)</span>
                        <div className="d-flex gap-1">
                            <button
                                className="btn btn-outline-secondary btn-sm px-3"
                                disabled={currentPage === 1 || loadingAction !== ""}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Prev
                            </button>
                            <button
                                className="btn btn-outline-secondary btn-sm px-3"
                                disabled={currentPage === totalPages || totalPages === 0 || loadingAction !== ""}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}