import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DenominationCounter() {
    const navigate = useNavigate();

    // Notes Tracker State
    const [counts, setCounts] = useState({
        500: "",
        200: "",
        100: "",
        50: "",
        20: "",
        10: ""
    });

    // Sanitizes inputs to accept numbers exclusively
    const handleInputChange = (note, val) => {
        const numericValue = val.replace(/\D/g, ""); 
        setCounts(prev => ({
            ...prev,
            [note]: numericValue === "" ? "" : Number(numericValue)
        }));
    };

    // Computes Total Note Count Volume
    const totalNotes = Object.values(counts).reduce((acc, curr) => acc + Number(curr || 0), 0);

    // Computes Cumulative Cash Valuation Summary Matrix
    const finalGrandTotal = Object.keys(counts).reduce((acc, note) => {
        return acc + (Number(note) * Number(counts[note] || 0));
    }, 0);

    return (
        <div className="container py-4" style={{ maxWidth: "700px" }}>
            
            {/* Header Area Navigation Link */}
            <div className="d-flex align-items-center mb-4">
                <button className="btn btn-outline-secondary me-3" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <h2 className="fw-bold m-0">Cash Counter</h2>
            </div>

            {/* Input Form Register Card */}
            <div className="card shadow border-0 p-4 mb-4">
                <h5 className="fw-bold text-muted mb-4 border-bottom pb-2">Enter Note Counts</h5>
                
                {Object.keys(counts)
                    .sort((a, b) => b - a) // Arranges notes from 500 down to 10
                    .map((note) => {
                        const rowCalculatedAmount = Number(note) * Number(counts[note] || 0);
                        return (
                            <div className="row align-items-center mb-3" key={note}>
                                {/* Note Badge Label */}
                                <div className="col-3 col-sm-2 text-end">
                                    <span className="badge bg-dark px-3 py-2 fs-6 w-100">₹ {note}</span>
                                </div>

                                <div className="col-1 text-center font-monospace text-muted">×</div>

                                {/* Count Input Box */}
                                <div className="col-4 col-sm-4">
                                    <input
                                        type="text"
                                        className="form-control text-center fw-bold form-control-lg"
                                        placeholder="0"
                                        value={counts[note]}
                                        onChange={(e) => handleInputChange(note, e.target.value)}
                                    />
                                </div>

                                <div className="col-1 text-center font-monospace text-muted">=</div>

                                {/* Calculated Row Product Amount */}
                                <div className="col-3 col-sm-3 text-end fw-bold text-dark fs-5">
                                    ₹ {rowCalculatedAmount}
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Global Consolidated Total Summary Display Footer Pane */}
            <div className="card shadow border-0 p-4 bg-dark text-white text-center">
                <div className="d-flex justify-content-between text-muted small px-2 mb-2">
                    <span>Total Notes: <strong>{totalNotes}</strong></span>
                    <span>Currency: INR</span>
                </div>
                <hr className="border-secondary mt-0" />
                <span className="small text-uppercase tracking-wider text-secondary d-block mb-1">
                    TOTAL CASH AMOUNT
                </span>
                <h1 className="display-4 fw-bold text-success m-0 font-monospace">
                    ₹ {finalGrandTotal}
                </h1>
            </div>

        </div>
    );
}