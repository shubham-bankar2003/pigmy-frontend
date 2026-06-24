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

    // Bank Note Color Mapping Meta Configuration
    const noteStyles = {
        500: { stone: "#5d6350", text: "Stone Grey", bgAccent: "rgba(93, 99, 80, 0.12)", border: "#5d6350" },
        200: { stone: "#d45d12", text: "Bright Yellow-Orange", bgAccent: "rgba(212, 93, 18, 0.12)", border: "#d45d12" },
        100: { stone: "#755493", text: "Lavender Blue", bgAccent: "rgba(117, 84, 147, 0.12)", border: "#17a2b8" },
        50: { stone: "#0f7e9b", text: "Fluorescent Blue", bgAccent: "rgba(15, 126, 155, 0.12)", border: "#0f7e9b" },
        20: { stone: "#a3aa3a", text: "Greenish Yellow", bgAccent: "rgba(163, 170, 58, 0.12)", border: "#a3aa3a" },
        10: { stone: "#825d45", text: "Chocolate Brown", bgAccent: "rgba(130, 93, 69, 0.12)", border: "#825d45" }
    };

    const handleInputChange = (note, val) => {
        const numericValue = val.replace(/\D/g, ""); 
        setCounts(prev => ({
            ...prev,
            [note]: numericValue === "" ? "" : Number(numericValue)
        }));
    };

    const clearAll = () => {
        setCounts({ 500: "", 200: "", 100: "", 50: "", 20: "", 10: "" });
    };

    // Computes Aggregated States
    const totalNotes = Object.values(counts).reduce((acc, curr) => acc + Number(curr || 0), 0);
    const finalGrandTotal = Object.keys(counts).reduce((acc, note) => {
        return acc + (Number(note) * Number(counts[note] || 0));
    }, 0);

    return (
        <div className="container py-4">
            
            {/* Top Vault Control Strip */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div className="d-flex align-items-center">
                    <button className="btn btn-light border me-3 shadow-sm px-3" onClick={() => navigate(-1)}>
                        🏦 Back
                    </button>
                    <div>
                        <h2 className="fw-bold m-0 text-dark">Cash Vault Register</h2>
                        <small className="text-muted text-uppercase tracking-wider">Reserve Bank Currency Desk</small>
                    </div>
                </div>
                <button className="btn btn-outline-danger btn-sm px-3 shadow-sm" onClick={clearAll}>
                    🔄 Clear Fields
                </button>
            </div>

            {/* Main Application Matrix viewport */}
            <div className="row g-4">
                
                {/* Note Counters Panel */}
                <div className="col-12 col-lg-7">
                    <div className="card shadow border-0 p-4 bg-white">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold text-dark m-0">Physical Denomination Input</h5>
                            <span className="badge bg-secondary tracking-widest text-uppercase">INR Values Only</span>
                        </div>
                        
                        {Object.keys(counts)
                            .sort((a, b) => b - a)
                            .map((note) => {
                                const rowCalculatedAmount = Number(note) * Number(counts[note] || 0);
                                const currentStyle = noteStyles[note];

                                return (
                                    <div 
                                        className="row align-items-center g-2 p-2 mb-3 rounded-3 border-start border-4" 
                                        key={note}
                                        style={{ 
                                            backgroundColor: counts[note] > 0 ? currentStyle.bgAccent : "#f8f9fa",
                                            borderColor: currentStyle.stone
                                        }}
                                    >
                                        {/* Premium Bank Note Simulator Badge Layout */}
                                        <div className="col-4 col-sm-3">
                                            <div 
                                                className="text-center py-2 fw-bold rounded shadow-sm text-white text-nowrap"
                                                style={{ 
                                                    backgroundColor: currentStyle.stone,
                                                    fontSize: "1.1rem",
                                                    letterSpacing: "1px"
                                                }}
                                            >
                                                ₹ {note}
                                            </div>
                                        </div>

                                        <div className="col-1 text-center font-monospace text-muted fw-bold">×</div>

                                        {/* Controlled Numeric Entry Point Field */}
                                        <div className="col-4 col-sm-4">
                                            <input
                                                type="text"
                                                className="form-control text-center fw-bold form-control-lg border-2 shadow-sm"
                                                style={{ focusColor: currentStyle.stone }}
                                                placeholder="0"
                                                value={counts[note]}
                                                onChange={(e) => handleInputChange(note, e.target.value)}
                                            />
                                        </div>

                                        <div className="col-1 text-center font-monospace text-muted">=</div>

                                        {/* Total Sub value reflection */}
                                        <div className="col-2 col-sm-3 text-end fw-bold text-dark fs-5 font-monospace pr-2">
                                            {rowCalculatedAmount.toLocaleString("en-IN")}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>

                {/* Bank Teller Sticky Total Summary Panel Block */}
                <div className="col-12 col-lg-5">
                    <div className="card shadow border-0 h-100 d-flex flex-column justify-content-between overflow-hidden">
                        
                        {/* Top Summary Branding Header */}
                        <div className="p-4 bg-dark text-white">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="small text-uppercase tracking-wider text-muted">Audit Verification Summary</span>
                                <span className="badge bg-success px-2 py-1">LIVE</span>
                            </div>
                            <hr className="border-secondary my-2" />
                            
                            <div className="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-25">
                                <span className="text-muted">Total counted bundles:</span>
                                <strong className="text-info fs-5 font-monospace">{totalNotes} pcs</strong>
                            </div>
                        </div>

                        {/* Large Core Banking Financial Counter Node Showcase */}
                        <div className="p-5 bg-light text-center border-bottom my-auto">
                            <span className="small text-uppercase text-muted tracking-widest d-block mb-1 fw-bold">
                                Consolidated Balance Value
                            </span>
                            <h1 className="display-3 fw-black text-dark m-0 font-monospace text-truncate">
                                ₹ {finalGrandTotal.toLocaleString("en-IN")}
                            </h1>
                        </div>

                        {/* Interactive Bank-Teller Actions Layer Container */}
                        <div className="p-4 bg-white border-top">
                            <button 
                                className="btn btn-success btn-lg w-100 py-3 font-monospace fw-bold tracking-wide shadow"
                                disabled={finalGrandTotal === 0}
                                onClick={() => alert(`Verified Vault Entry: ₹ ${finalGrandTotal.toLocaleString("en-IN")}`)}
                            >
                                📥 POST TO CASH LEDGER
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}