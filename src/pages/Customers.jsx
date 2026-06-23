import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Customers() {

const navigate = useNavigate();

const [id, setId] = useState(0);
const [customerName, setCustomerName] = useState("");
const [mobileNumber, setMobileNumber] = useState("");
const [customers, setCustomers] = useState([]);
const [searchText, setSearchText] = useState("");

useEffect(() => {

    const token =
        localStorage.getItem("token");

    if (!token) {

        navigate("/login");
        return;

    }

    loadCustomers();

}, []);

const loadCustomers = async () => {

    try {

        const response =
            await api.get(
                "/api/customer"
            );

        setCustomers(
            response.data.data
        );

    }
    catch (error) {

        console.log(error);

    }

};

const clearForm = () => {

    setId(0);
    setCustomerName("");
    setMobileNumber("");

};

const saveCustomer = async () => {

    if (
        customerName.trim() === ""
    ) {

        alert(
            "Customer Name Required"
        );

        return;

    }

    if (
        customerName.length < 3
    ) {

        alert(
            "Customer Name Must Be At Least 3 Characters"
        );

        return;

    }

    const mobileRegex =
        /^[0-9]{10}$/;

    if (
        !mobileRegex.test(
            mobileNumber
        )
    ) {

        alert(
            "Enter Valid Mobile Number"
        );

        return;

    }

    try {

        if (id === 0) {

            await api.post(
                "/api/customer",
                {
                    customer_name:
                        customerName,
                    mobile_number:
                        mobileNumber
                }
            );

            alert(
                "Customer Added Successfully"
            );

        }
        else {

            await api.put(
                `/api/customer/${id}`,
                {
                    customer_name:
                        customerName,
                    mobile_number:
                        mobileNumber
                }
            );

            alert(
                "Customer Updated Successfully"
            );

        }

        clearForm();

        loadCustomers();

    }
    catch (error) {

        console.log(error);

        alert(
            "Error Saving Customer"
        );

    }

};

const editCustomer =
    (customer) => {

        setId(
            customer.id
        );

        setCustomerName(
            customer.customer_name
        );

        setMobileNumber(
            customer.mobile_number
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };

const deleteCustomer =
    async (id) => {

        if (
            !window.confirm(
                "Are You Sure?"
            )
        ) {

            return;

        }

        try {

            await api.delete(
                `/api/customer/${id}`
            );

            alert(
                "Customer Deleted Successfully"
            );

            loadCustomers();

        }
        catch (error) {

            console.log(error);

            alert(
                "Delete Failed"
            );

        }

    };

const filteredCustomers =
    customers.filter(
        customer =>

            customer.customer_name
                .toLowerCase()
                .includes(
                    searchText.toLowerCase()
                )

            ||

            customer.mobile_number
                .includes(
                    searchText
                )
    );

return (

    <div className="container py-4">

        <div className="d-flex justify-content-between align-items-center mb-4">

            <h2 className="mb-0">
                Customer Management
            </h2>

            <div className="d-flex gap-2">

                <button
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate('/')
                    }
                >
                    Back
                </button>

                <button
                    className="btn btn-danger"
                    onClick={() => {

                        localStorage.removeItem(
                            "token"
                        );

                        localStorage.removeItem(
                            "userId"
                        );

                        navigate(
                            "/login"
                        );

                    }}
                >
                    Logout
                </button>

            </div>

        </div>

        <div className="card shadow border-0">

            <div className="card-body">

                <div className="row g-3">

                    <div className="col-12 col-md-6">

                        <label className="form-label">
                            Customer Name
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={customerName}
                            onChange={(e) =>
                                setCustomerName(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="col-12 col-md-6">

                        <label className="form-label">
                            Mobile Number
                        </label>

                        <input
                            type="text"
                            maxLength="10"
                            className="form-control"
                            value={mobileNumber}
                            onChange={(e) =>
                                setMobileNumber(
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
                        onClick={
                            saveCustomer
                        }
                    >
                        {
                            id === 0
                                ? "Save Customer"
                                : "Update Customer"
                        }
                    </button>

                    <button
                        className="btn btn-warning"
                        onClick={
                            clearForm
                        }
                    >
                        Clear
                    </button>

                </div>

            </div>

        </div>

        <div className="card shadow border-0 mt-4">

            <div className="card-header bg-white">

                <div className="row g-3 align-items-center">

                    <div className="col-12 col-md-6">

                        <h5 className="mb-0">
                            Customer List
                        </h5>

                    </div>

                    <div className="col-12 col-md-6">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            value={searchText}
                            onChange={(e) =>
                                setSearchText(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>

            </div>

            <div className="card-body">

                <div className="mb-3">

                    <strong>
                        Total Customers :
                    </strong>

                    {" "}

                    {
                        filteredCustomers.length
                    }

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

                            {
                                filteredCustomers.length > 0

                                    ?

                                    filteredCustomers.map(
                                        customer => (

                                            <tr
                                                key={
                                                    customer.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        customer.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        customer.customer_name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        customer.mobile_number
                                                    }
                                                </td>

                                                <td>

                                                    <button
                                                        className="btn btn-warning btn-sm w-100"
                                                        onClick={() =>
                                                            editCustomer(
                                                                customer
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                </td>

                                                <td>

                                                    <button
                                                        className="btn btn-danger btn-sm w-100"
                                                        onClick={() =>
                                                            deleteCustomer(
                                                                customer.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                    :

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center"
                                        >
                                            No Customers Found
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
