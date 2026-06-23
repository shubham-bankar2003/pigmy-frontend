import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
// Import React Select
import Select from "react-select";
// Toast Imports
import { ToastContainer, toast } from "react-toastify";

export default function Collections() {
    const navigate = useNavigate();

    const [id, setId] = useState(0);
    const [customerId, setCustomerId] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("Cash");

    const [customers, setCustomers] = useState([]);
    const [collections, setCollections] = useState([]);

    const [searchText, setSearchText] = useState("");
    const [filterDate, setFilterDate] = useState("");
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Loader States
    const [loadingData, setLoadingData] = useState(false); 
    const [loadingAction, setLoadingAction] = useState(""); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        initLoad();
    }, []);

    const initLoad = async () => {
        setLoadingData(true);
        try {
            await Promise.all([loadCustomers(), loadCollections()]);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoadingData(false);
        }
    };

    const loadCustomers = async () => {
        try {
            const response = await api.get("/api/customer");
            setCustomers(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const loadCollections = async () => {
        try {
            const response = await api.get("/api/collection");
            setCollections(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const clearForm = () => {
        setId(0);
        setCustomerId("");
        setAmount("");
        setPaymentMode("Cash");
    };

    const saveCollection = async () => {
        if (!customerId) {
            toast.warn("Please Select a Customer");
            return;
        }
        if (!amount) {
            toast.warn("Amount is Required");
            return;
        }
        if (Number(amount) <= 0) {
            toast.warn("Amount Must Be Greater Than Zero");
            return;
        }

        setLoadingAction("save");
        try {
            if (id === 0) {
                await api.post("/api/collection", {
                    customer_id: customerId,
                    amount,
                    payment_mode: paymentMode
                });
                toast.success("Collection Added Successfully");
            } else {
                await api.put(`/api/collection/${id}`, {
                    customer_id: customerId,
                    amount,
                    payment_mode: paymentMode
                });
                toast.success("Collection Updated Successfully");
            }
            clearForm();
            await loadCollections();
        } catch (error) {
            console.log(error);
            toast.error("Error Saving Collection");
        } finally {
            setLoadingAction("");
        }
    };

    const editCollection = (collection) => {
        setId(collection.id);
        setCustomerId(collection.customer_id);
        setAmount(collection.amount);
        setPaymentMode(collection.payment_mode);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const deleteCollection = async (collectionId) => {
        setLoadingAction(`delete-${collectionId}`);
        try {
            await api.delete(`/api/collection/${collectionId}`);
            toast.success("Collection Deleted Successfully");
            await loadCollections();
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete collection");
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

    // --- FILTERING & PAGINATION LOGIC ---
    const filteredCollections = collections.filter(item => {
        const searchMatch =
            (item.customer_name && item.customer_name.toLowerCase().includes(searchText.toLowerCase())) ||
            String(item.amount).includes(searchText) ||
            item.id?.toString().includes(searchText.trim()) || 
            (item.customer_mobile && item.customer_mobile.toString().includes(searchText.trim())); 

        const dateMatch =
            filterDate === ""
                ? true
                : item.collection_date && item.collection_date.split("T")[0] === filterDate;

        return searchMatch && dateMatch;
    });

    const totalAmount = filteredCollections.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCollections = filteredCollections.slice(startIndex, startIndex + itemsPerPage);

    // --- TRANSFORM CUSTOMERS FOR SEARCHABLE DROPDOWN ---
    const customerOptions = customers.map(customer => ({
        value: String(customer.id),
        label: `ID: ${customer.id} - ${customer.customer_name}`
    }));

    const selectedCustomerOption = customerOptions.find(opt => opt.value === String(customerId)) || null;

    return (
        <div className="container py-4">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Pigmy Collections</h2>
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
                        {/* Searchable Customer Dropdown */}
                        <div className="col-12 col-md-4">
                            <label className="form-label">Customer</label>
                            <Select
                                options={customerOptions}
                                value={selectedCustomerOption}
                                isLoading={loadingData}
                                isDisabled={loadingAction === "save" || loadingData}
                                onChange={(selectedOption) => setCustomerId(selectedOption ? selectedOption.value : "")}
                                placeholder={loadingData ? "Loading Customers..." : "Select or Search Customer..."}
                                isClearable={true}
                                isSearchable={true}
                                blurInputOnSelect={false} // Prevents mobile browsers from hiding keyboard early
                                classNamePrefix="react-select" // Adds static hook for CSS targeting
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '38px',
                                        borderRadius: '0.375rem',
                                        borderColor: '#dee2e6',
                                        boxShadow: 'none',
                                        '&:hover': { borderColor: '#b1bbc4' }
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        zIndex: 9999 // Guarantees dropdown sits on top of all Bootstrap layers
                                    }),
                                    input: (base) => ({
                                        ...base,
                                        color: 'inherit' // Ensures typing indicator matches color setup
                                    })
                                }}
                            />
                        </div>

                        <div className="col-12 col-md-4">
                            <label className="form-label">Amount</label>
                            <input
                                type="number"
                                className="form-control"
                                disabled={loadingAction === "save"}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <div className="col-12 col-md-4">
                            <label className="form-label">Payment Mode</label>
                            <select
                                className="form-select"
                                value={paymentMode}
                                disabled={loadingAction === "save"}
                                onChange={(e) => setPaymentMode(e.target.value)}
                            >
                                <option value="Cash">Cash</option>
                                <option value="Online">Online</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 d-flex flex-column flex-md-row gap-2">
                        <button 
                            className="btn btn-success" 
                            onClick={saveCollection}
                            disabled={loadingAction !== "" || loadingData}
                        >
                            {loadingAction === "save" ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Saving...
                                </>
                            ) : id === 0 ? (
                                "Save Collection"
                              ) : (
                                "Update Collection"
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

            {/* Filter & List Section */}
            <div className="card shadow border-0 mt-4">
                <div className="card-header bg-white">
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by ID, Name, Mobile or Amount..."
                                value={searchText}
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <input
                                type="date"
                                className="form-control"
                                value={filterDate}
                                onChange={(e) => {
                                    setFilterDate(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-12 col-md-6">
                            <strong>Total Records :</strong> {filteredCollections.length}
                        </div>
                        <div className="col-12 col-md-6 text-md-end">
                            <strong>Total Collection :</strong> ₹ {totalAmount}
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Payment Mode</th>
                                    <th>Date</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingData ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">
                                            <div className="spinner-border text-success" role="status"></div>
                                            <div className="mt-2 text-muted">Loading Collections...</div>
                                        </td>
                                    </tr>
                                ) : paginatedCollections.length > 0 ? (
                                    paginatedCollections.map(collection => (
                                        <tr key={collection.id}>
                                            <td>{collection.id}</td>
                                            <td>
                                                <div>{collection.customer_name}</div>
                                                {collection.customer_mobile && (
                                                    <small className="text-muted d-block">{collection.customer_mobile}</small>
                                                )}
                                            </td>
                                            <td>₹ {collection.amount}</td>
                                            <td>
                                                <span className={`badge ${collection.payment_mode === 'Cash' ? 'bg-outline-primary text-primary border border-primary' : 'bg-outline-success text-success border border-success'} px-2 py-1`}>
                                                    {collection.payment_mode}
                                                </span>
                                            </td>
                                            <td>
                                                {collection.collection_date ? new Date(collection.collection_date).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-warning btn-sm w-100"
                                                    onClick={() => editCollection(collection)}
                                                    disabled={loadingAction !== ""}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm w-100"
                                                    onClick={() => deleteCollection(collection.id)}
                                                    disabled={loadingAction !== ""}
                                                >
                                                    {loadingAction === `delete-${collection.id}` ? (
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
                                        <td colSpan="7" className="text-center py-3">
                                            No Collections Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {filteredCollections.length > 0 && (
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