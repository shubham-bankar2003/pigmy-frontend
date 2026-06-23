import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
// Toast Imports
import { ToastContainer, toast } from "react-toastify";

export default function Customers() {
    const navigate = useNavigate();

    const [id, setId] = useState(0);
    const [customerName, setCustomerName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [customers, setCustomers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Loader States
    const [loadingData, setLoadingData] = useState(false); // Table loading ke liye
    const [loadingAction, setLoadingAction] = useState(""); // Values: "save", "delete-{id}", "logout"
    const itemsPerPage = 10;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setLoadingData(true);
        try {
            const response = await api.get("/api/customer");
            setCustomers(response.data.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load customer data");
        } finally {
            setLoadingData(false);
        }
    };

    const clearForm = () => {
        setId(0);
        setCustomerName("");
        setMobileNumber("");
    };

    const saveCustomer = async () => {
        if (customerName.trim() === "") {
            toast.warn("Customer Name Required");
            return;
        }
        if (customerName.length < 3) {
            toast.warn("Customer Name Must Be At Least 3 Characters");
            return;
        }

        // OPTIONAL MOBILE VALIDATION: Agar text dala hai tabhi regex check hoga
        if (mobileNumber && mobileNumber.trim() !== "") {
            const mobileRegex = /^[0-9]{10}$/;
            if (!mobileRegex.test(mobileNumber)) {
                toast.warn("Enter Valid 10-Digit Mobile Number");
                return;
            }
        }

        setLoadingAction("save");
        try {
            // Agar khali hai toh empty string ki jagah backend pe null bhejenge
            const payload = {
                customer_name: customerName.trim(),
                mobile_number: mobileNumber && mobileNumber.trim() !== "" ? mobileNumber.trim() : null
            };

            if (id === 0) {
                await api.post("/api/customer", payload);
                toast.success("Customer Added Successfully");
            } else {
                await api.put(`/api/customer/${id}`, payload);
                toast.success("Customer Updated Successfully");
            }
            clearForm();
            loadCustomers();
        } catch (error) {
            console.log(error);
            toast.error("Error Saving Customer");
        } finally {
            setLoadingAction("");
        }
    };

    const editCustomer = (customer) => {
        setId(customer.id);
        setCustomerName(customer.customer_name);
        setMobileNumber(customer.mobile_number || ""); // DB se null aane par crash na ho isliye fallback empty string
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const deleteCustomer = async (customerId) => {
        setLoadingAction(`delete-${customerId}`);
        try {
            await api.delete(`/api/customer/${customerId}`);
            toast.success("Customer Deleted Successfully");
            loadCustomers();
        } catch (error) {
            console.log(error);
            toast.error("Delete Failed");
        } finally {
            setLoadingAction("");
        }
    };

    const logout = () => {
        setLoadingAction("logout");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    };

    // --- PAGINATION & FILTERING LOGIC ---
    // Added customer.id string filtering to search by Name, Mobile, or ID
    const filteredCustomers = customers.filter(
        customer =>
            customer.customer_name?.toLowerCase().includes(searchText.toLowerCase()) ||
            (customer.mobile_number && customer.mobile_number.includes(searchText)) ||
            customer.id?.toString().includes(searchText.trim())
    );

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="container py-4">
            {/* Global Toast Container */}
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Customer Management</h2>
                <div className="d-flex gap-2">
                    <button 
                        className="btn btn-secondary" 
                        onClick={() => navigate('/')}
                        disabled={loadingAction !== ""}
                    >
                        Back
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={logout}
                        disabled={loadingAction !== ""}
                    >
                        {loadingAction === "logout" ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Logging out...
                            </>
                        ) : (
                            "Logout"
                        )}
                    </button>
                </div>
            </div>

            {/* Form Section */}
            <div className="card shadow border-0">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <label className="form-label">Customer Name</label>
                            <input
                                type="text"
                                className="form-control"
                                disabled={loadingAction === "save"}
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label">Mobile Number</label>
                            <input
                                type="text"
                                maxLength="10"
                                className="form-control"
                                disabled={loadingAction === "save"}
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                            />
                        </div>
                    </div>
                    <div className="mt-4 d-flex flex-column flex-md-row gap-2">
                        <button 
                            className="btn btn-primary" 
                            onClick={saveCustomer}
                            disabled={loadingAction !== ""}
                        >
                            {loadingAction === "save" ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Saving...
                                </>
                            ) : id === 0 ? (
                                "Save Customer"
                            ) : (
                                "Update Customer"
                            )}
                        </button>
                        <button 
                            className="btn btn-warning" 
                            onClick={clearForm}
                            disabled={loadingAction !== ""}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="card shadow border-0 mt-4">
                <div className="card-header bg-white">
                    <div className="row g-3 align-items-center">
                        <div className="col-12 col-md-6">
                            <h5 className="mb-0">Customer List</h5>
                        </div>
                        <div className="col-12 col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by Name, Mobile or ID..."
                                value={searchText}
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <div className="mb-3">
                        <strong>Total Customers :</strong> {filteredCustomers.length}
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Mobile</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingData ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status"></div>
                                            <div className="mt-2 text-muted">Fetching Customers...</div>
                                        </td>
                                    </tr>
                                ) : paginatedCustomers.length > 0 ? (
                                    paginatedCustomers.map(customer => (
                                        <tr key={customer.id}>
                                            <td>{customer.id}</td>
                                            <td>{customer.customer_name}</td>
                                            <td>{customer.mobile_number || <span className="text-muted">N/A</span>}</td>
                                            <td>
                                                <button
                                                    className="btn btn-warning btn-sm w-100"
                                                    onClick={() => editCustomer(customer)}
                                                    disabled={loadingAction !== ""}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm w-100"
                                                    onClick={() => deleteCustomer(customer.id)}
                                                    disabled={loadingAction !== ""}
                                                >
                                                    {loadingAction === `delete-${customer.id}` ? (
                                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                                    ) : (
                                                        "Delete"
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-3">
                                            No Customers Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination UI Controls */}
                    {filteredCustomers.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                Page {currentPage} of {totalPages || 1}
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-secondary btn-sm"
                                    disabled={currentPage === 1 || loadingAction !== ""}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    Previous
                                </button>
                                <button
                                    className="btn btn-secondary btn-sm"
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
        </div>
    );
}