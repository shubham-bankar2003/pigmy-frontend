import { useNavigate } from "react-router-dom";

export default function Dashboard() {

const navigate = useNavigate();

const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    navigate("/login");

};

return (

    <div className="container py-4">

        <div className="d-flex justify-content-end mb-3">

            <button
                className="btn btn-danger"
                onClick={logout}
            >
                Logout
            </button>

        </div>

        <div className="text-center mb-5">

            <h1 className="fw-bold display-6">
                Pigmy Collection System
            </h1>

            <p className="text-muted">
                Manage Customers, Collections and Reports
            </p>

        </div>

        <div className="row justify-content-center g-4">

            <div className="col-12 col-sm-12 col-md-6 col-lg-4">

                <div className="card shadow border-0 h-100">

                    <div className="card-body text-center d-flex flex-column">

                        <h3 className="mb-3">
                            Customers
                        </h3>

                        <p className="text-muted flex-grow-1">
                            Add, Update and Delete Customers
                        </p>

                        <button
                            className="btn btn-primary w-100"
                            onClick={() =>
                                navigate('/customers')
                            }
                        >
                            Open Customers
                        </button>

                    </div>

                </div>

            </div>

            <div className="col-12 col-sm-12 col-md-6 col-lg-4">

                <div className="card shadow border-0 h-100">

                    <div className="card-body text-center d-flex flex-column">

                        <h3 className="mb-3">
                            Collections
                        </h3>

                        <p className="text-muted flex-grow-1">
                            Manage Daily Pigmy Collections
                        </p>

                        <button
                            className="btn btn-success w-100"
                            onClick={() =>
                                navigate('/collections')
                            }
                        >
                            Open Collections
                        </button>

                    </div>

                </div>

            </div>

            <div className="col-12 col-sm-12 col-md-6 col-lg-4">

                <div className="card shadow border-0 h-100">

                    <div className="card-body text-center d-flex flex-column">

                        <h3 className="mb-3">
                            Reports
                        </h3>

                        <p className="text-muted flex-grow-1">
                            View, Export and Share Collection Reports
                        </p>

                        <button
                            className="btn btn-dark w-100"
                            onClick={() =>
                                navigate('/reports')
                            }
                        >
                            Open Reports
                        </button>

                    </div>

                </div>

            </div>

        </div>

    </div>

);

}
