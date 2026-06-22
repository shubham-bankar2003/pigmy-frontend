import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

useEffect(() => {

    loadCustomers();
    loadCollections();

}, []);

const loadCustomers = async () => {

    try {

        const response = await axios.get(
            "http://localhost:5000/api/customer"
        );

        setCustomers(response.data.data);

    } catch (error) {

        console.log(error);

    }

};

const loadCollections = async () => {

    try {

        const response = await axios.get(
            "http://localhost:5000/api/collection"
        );

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

        alert("Please Select Customer");
        return;

    }

    if (!amount) {

        alert("Amount Required");
        return;

    }

    if (Number(amount) <= 0) {

        alert("Amount Must Be Greater Than Zero");
        return;

    }

    try {

        if (id === 0) {

            await axios.post(
                "http://localhost:5000/api/collection",
                {
                    customer_id: customerId,
                    amount,
                    payment_mode: paymentMode
                }
            );

            alert("Collection Added Successfully");

        } else {

            await axios.put(
                `http://localhost:5000/api/collection/${id}`,
                {
                    customer_id: customerId,
                    amount,
                    payment_mode: paymentMode
                }
            );

            alert("Collection Updated Successfully");

        }

        clearForm();
        loadCollections();

    } catch (error) {

        console.log(error);
        alert("Error Saving Collection");

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

const deleteCollection = async (id) => {

    if (!window.confirm("Are You Sure?")) {

        return;

    }

    try {

        await axios.delete(
            `http://localhost:5000/api/collection/${id}`
        );

        alert("Collection Deleted Successfully");

        loadCollections();

    } catch (error) {

        console.log(error);

    }

};

const filteredCollections = collections.filter(item => {

    const searchMatch =
        item.customer_name
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||

        String(item.amount)
            .includes(searchText);

    const dateMatch =
        filterDate === ""
            ? true
            : item.collection_date.split("T")[0] === filterDate;

    return searchMatch && dateMatch;

});

const totalAmount = filteredCollections.reduce(
    (sum, item) => sum + Number(item.amount),
    0
);

return (

    <div className="container py-4">

        <div className="d-flex justify-content-between align-items-center mb-4">

            <h2 className="mb-0">
                Pigmy Collections
            </h2>

            <button
                className="btn btn-secondary"
                onClick={() => navigate('/')}
            >
                Back
            </button>

        </div>

        <div className="card shadow border-0">

            <div className="card-body">

                <div className="row g-3">

                    <div className="col-12 col-md-4">

                        <label className="form-label">
                            Customer
                        </label>

                        <select
                            className="form-select"
                            value={customerId}
                            onChange={(e) =>
                                setCustomerId(e.target.value)
                            }
                        >

                            <option value="">
                                Select Customer
                            </option>

                            {
                                customers.map(customer => (

                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                    >
                                        {customer.customer_name}
                                    </option>

                                ))
                            }

                        </select>

                    </div>

                    <div className="col-12 col-md-4">

                        <label className="form-label">
                            Amount
                        </label>

                        <input
                            type="number"
                            className="form-control"
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value)
                            }
                        />

                    </div>

                    <div className="col-12 col-md-4">

                        <label className="form-label">
                            Payment Mode
                        </label>

                        <select
                            className="form-select"
                            value={paymentMode}
                            onChange={(e) =>
                                setPaymentMode(e.target.value)
                            }
                        >

                            <option value="Cash">
                                Cash
                            </option>

                            <option value="Online">
                                Online
                            </option>

                        </select>

                    </div>

                </div>

                <div className="mt-4 d-flex flex-column flex-md-row gap-2">

                    <button
                        className="btn btn-success"
                        onClick={saveCollection}
                    >
                        {id === 0
                            ? "Save Collection"
                            : "Update Collection"}
                    </button>

                    <button
                        className="btn btn-warning"
                        onClick={clearForm}
                    >
                        Clear
                    </button>

                </div>

            </div>

        </div>

        <div className="card shadow border-0 mt-4">

            <div className="card-header bg-white">

                <div className="row g-3">

                    <div className="col-12 col-md-6">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Customer Or Amount..."
                            value={searchText}
                            onChange={(e) =>
                                setSearchText(e.target.value)
                            }
                        />

                    </div>

                    <div className="col-12 col-md-6">

                        <input
                            type="date"
                            className="form-control"
                            value={filterDate}
                            onChange={(e) =>
                                setFilterDate(e.target.value)
                            }
                        />

                    </div>

                </div>

            </div>

            <div className="card-body">

                <div className="row mb-3">

                    <div className="col-12 col-md-6">

                        <strong>
                            Total Records :
                        </strong>

                        {" "}
                        {filteredCollections.length}

                    </div>

                    <div className="col-12 col-md-6 text-md-end">

                        <strong>
                            Total Collection :
                        </strong>

                        {" "}
                        ₹ {totalAmount}

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

                            {
                                filteredCollections.length > 0
                                    ?
                                    filteredCollections.map(collection => (

                                        <tr key={collection.id}>

                                            <td>{collection.id}</td>

                                            <td>{collection.customer_name}</td>

                                            <td>{collection.amount}</td>

                                            <td>{collection.payment_mode}</td>

                                            <td>
                                                {
                                                    new Date(
                                                        collection.collection_date
                                                    ).toLocaleDateString()
                                                }
                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-warning btn-sm w-100"
                                                    onClick={() =>
                                                        editCollection(collection)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-danger btn-sm w-100"
                                                    onClick={() =>
                                                        deleteCollection(collection.id)
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))
                                    :
                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="text-center"
                                        >
                                            No Collections Found
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
