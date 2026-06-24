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
        500: { stone: "#5d6350", bgAccent: "rgba(93, 99, 80, 0.08)" },
        200: { stone: "#d45d12", bgAccent: "rgba(212, 93, 18, 0.08)" },
        100: { stone: "#755493", bgAccent: "rgba(117, 84, 147, 0.08)" },
        50: { stone: "#0f7e9b", bgAccent: "rgba(15, 126, 155, 0.08)" },
        20: { stone: "#a3aa3a", bgAccent: "rgba(163, 170, 58, 0.08)" },
        10: { stone: "#825d45", bgAccent: "rgba(130, 93, 69, 0.08)" }
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
        <div className="d-flex flex-column min-vh-100 bg-light" style={{ minHeight: "100vh", pb: "80px" }}>
            
            {/* Top Compact Fixed Header Strip */}
            <div className="bg-dark text-white px-3 py-2 sticky-top shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <button className="btn btn-sm btn-outline-light me-2 px-2 py-1" onClick={() => navigate(-1)}>
                            ← Back
                        </button>
                        <div>
                            <h6 className="fw-bold m-0" style={{ fontSize: "0.95rem" }}>Vault Counter</h6>
                            <span className="font-monospace text-white-50" style={{ fontSize: "0.65rem" }}>INR REGISTER</span>
                        </div>
                    </div>
                    <button className="btn btn-danger btn-sm px-2 py-1" style={{ fontSize: "0.75rem" }} onClick={clearAll}>
                        Reset
                    </button>
                </div>
            </div>

            {/* Live Sticky Summary Dashboard Module */}
            <div className="bg-white border-bottom shadow-sm px-3 py-3 text-center">
                <span className="text-muted text-uppercase tracking-wider font-monospace d-block mb-1" style={{ fontSize: "0.7rem", fontWeight: "600" }}>
                    Total Amount ({totalNotes} Pcs)
                </span>
                <h2 className="fw-black text-primary font-monospace m-0" style={{ fontSize: "2rem", letterSpacing: "-0.5px" }}>
                    ₹ {finalGrandTotal.toLocaleString("en-IN")}
                </h2>
            </div>

            {/* Compact Denomination Field Matrix Wrapper */}
            <div className="container px-2 py-3 flex-grow-1" style={{ marginBottom: "75px" }}>
                <div className="card border-0 shadow-sm rounded-3 p-2 bg-white">
                    {Object.keys(counts)
                        .sort((a, b) => b - a)
                        .map((note) => {
                            const rowCalculatedAmount = Number(note) * Number(counts[note] || 0);
                            const currentStyle = noteStyles[note];
                            const hasValue = counts[note] > 0;

                            return (
                                <div 
                                    className="d-flex align-items-center justify-content-between p-2 mb-2 rounded border-start border-3" 
                                    key={note}
                                    style={{ 
                                        backgroundColor: hasValue ? currentStyle.bgAccent : "#f8f9fa",
                                        borderColor: currentStyle.stone,
                                        height: "52px"
                                    }}
                                // Added strict height restrictions to avoid desktop view blow-outs
                                >
                                    {/* Denomination Indicator Pin */}
                                    <div style={{ width: "65px" }}>
                                        <span 
                                            className="badge d-block py-2 fw-bold font-monospace shadow-sm"
                                            style={{ backgroundColor: currentStyle.stone, fontSize: "0.9rem" }}
                                        >
                                            ₹{note}
                                        </span>
                                    </div>

                                    <div className="text-muted small font-monospace px-1">×</div>

                                    {/* Numeric Input Element Wrapper Area */}
                                    <div style={{ width: "100px" }}>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className="form-control form-control-sm text-center fw-bold font-monospace shadow-sm py-2"
                                            placeholder="0"
                                            value={counts[note]}
                                            onChange={(e) => handleInputChange(note, e.target.value)}
                                            style={{ fontSize: "1rem", borderColor: hasValue ? currentStyle.stone : "#ced4da" }}
                                        />
                                    </div>

                                    <div className="text-muted small font-monospace px-1">=</div>

                                    {/* Line Aggregate Output Target */}
                                    <div className="text-end fw-bold text-dark font-monospace flex-grow-1 px-1" style={{ fontSize: "0.95rem" }}>
                                        {rowCalculatedAmount.toLocaleString("en-IN")}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Bottom Screen Native APK Style Action Drawer */}
            <div className="bg-white border-top p-2 fixed-bottom shadow-lg w-100 left-0" style={{ zIndex: "1040" }}>
                <div className="container p-0">
                    <button 
                        className="btn btn-success w-100 py-2.5 fw-bold tracking-wide shadow-sm d-flex align-items-center justify-content-center"
                        disabled={finalGrandTotal === 0}
                        onClick={() => alert(`Saved Vault Ledger Entry: ₹ ${finalGrandTotal.toLocaleString("en-IN")}`)}
                        style={{ fontSize: "1rem", borderRadius: "8px" }}
                    >
                        📥 POST CASH ENTRY TO LEDGER
                    </button>
                </div>
            </div>

        </div>
    );
}