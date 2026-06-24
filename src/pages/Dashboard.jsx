import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Toast Imports
import { ToastContainer, toast } from "react-toastify";

export default function Dashboard() {
    const navigate = useNavigate();
    
    // Loader State for Logout Action
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logout = () => {
        setIsLoggingOut(true);
        
        // Remove items from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        // Toast notify and delayed redirect for rich UX feedback
        toast.info("Logging out smoothly...", { autoClose: 1000 });
        
        setTimeout(() => {
            navigate("/login");
        }, 1200);
    };

    return (
        <div className="container py-4">
            {/* Global Toast Notification Container */}
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Top Bar / Logout Section */}
            <div className="d-flex justify-content-end mb-3">
                <button
                    className="btn btn-danger"
                    onClick={logout}
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Logging out...
                        </>
                    ) : (
                        "Logout"
                    )}
                </button>
            </div>

            {/* Branding Header Section */}
            <div className="text-center mb-5">
                <h1 className="fw-bold display-6">
                    Pigmy Collection System
                </h1>
                <p className="text-muted">
                    Manage Customers, Collections and Reports
                </p>
            </div>

            {/* Grid Layout Cards */}
            <div className="row justify-content-center g-4">
                
                {/* Customers Card */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow border-0 h-100 text-center">
                        <div className="card-body d-flex flex-column">
                            <h3 className="mb-3">Customers</h3>
                            <p className="text-muted flex-grow-1">
                                Add, Update and Delete Customers
                            </p>
                            <button
                                className="btn btn-primary w-100"
                                disabled={isLoggingOut}
                                onClick={() => navigate('/customers')}
                            >
                                Open Customers
                            </button>
                        </div>
                    </div>
                </div>

                {/* Collections Card */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow border-0 h-100 text-center">
                        <div className="card-body d-flex flex-column">
                            <h3 className="mb-3">Collections</h3>
                            <p className="text-muted flex-grow-1">
                                Manage Daily Pigmy Collections
                            </p>
                            <button
                                className="btn btn-success w-100"
                                disabled={isLoggingOut}
                                onClick={() => navigate('/collections')}
                            >
                                Open Collections
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reports Card */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow border-0 h-100 text-center">
                        <div className="card-body d-flex flex-column">
                            <h3 className="mb-3">Reports</h3>
                            <p className="text-muted flex-grow-1">
                                View, Export and Share Collection Reports
                            </p>
                            <button
                                className="btn btn-dark w-100"
                                disabled={isLoggingOut}
                                onClick={() => navigate('/reports')}
                            >
                                Open Reports
                            </button>
                        </div>
                    </div>
                </div>

                {/* Currency Denominations Card */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow border-0 h-100 text-center">
                        <div className="card-body d-flex flex-column">
                            <h3 className="mb-3">Denominations</h3>
                            <p className="text-muted flex-grow-1">
                                Count and Verify Physical Notes Breakdown
                            </p>
                            <button
                                className="btn btn-info text-white w-100"
                                disabled={isLoggingOut}
                                onClick={() => navigate('/denominations')}
                            >
                                Open Counter
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}