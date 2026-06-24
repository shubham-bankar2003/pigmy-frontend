import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
// Toast imports
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
    const navigate = useNavigate();

    const [mobileNumber, setMobileNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const sendOtp = async () => {
        if (!/^[0-9]{10}$/.test(mobileNumber)) {
            toast.warn("Enter a valid 10-digit mobile number");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/auth/send-otp`,
                { mobile_number: mobileNumber }
            );

            toast.success("OTP Sent Successfully!");
            
            if (response.data && response.data.otp) {
                setOtp(response.data.otp.toString()); 
                toast.info(`Autofilled Dev OTP: ${response.data.otp}`);
            }

            setOtpSent(true);
        } catch (error) {
            console.log(error);
            toast.error("Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!otp) {
            toast.warn("Please enter the OTP");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/auth/verify-otp`,
                {
                    mobile_number: mobileNumber,
                    otp: otp
                }
            );

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.userId);

            toast.success("Login Successful! Redirecting...");
            
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error) {
            console.log(error);
            toast.error("Invalid OTP. Please check again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-lightpx-3" 
            style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}
        >
            {/* Notification Center Layer */}
            <ToastContainer position="top-center" autoClose={2500} hideProgressBar={true} />

            <div className="w-100" style={{ maxWidth: "420px" }}>
                {/* Mobile App View Frame Card Container */}
                <div className="card border-0 shadow-lg overflow-hidden rounded-4 bg-white">
                    
                    {/* Native App Top Visual Header Accent Block */}
                    <div 
                        className="text-center p-4 text-white d-flex flex-column align-items-center justify-content-center"
                        style={{ 
                            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                            borderBottomLeftRadius: "1.5rem",
                            borderBottomRightRadius: "1.5rem"
                        }}
                    >
                        <div 
                            className="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center mb-2"
                            style={{ width: "60px", height: "60px", fontSize: "1.8rem" }}
                        >
                            🐷
                        </div>
                        <h3 className="fw-bold m-0 tracking-wide">Pigmy Collection</h3>
                        <small className="text-white-50 text-uppercase tracking-wider font-monospace" style={{ fontSize: "0.75rem" }}>
                            Secure Agent Gateway
                        </small>
                    </div>

                    <div className="card-body p-4 pt-4">
                        
                        {/* Mobile Field Entry: Mobile Number */}
                        <div className="mb-4">
                            <label className="form-label fw-bold text-secondary small text-uppercase tracking-wider">
                                Registered Mobile Number
                            </label>
                            <div className="input-group input-group-lg border-2">
                                <span className="input-group-text bg-light border-end-0 text-muted fs-6 fw-bold">+91</span>
                                <input
                                    type="text"
                                    className="form-control bg-light border-start-0 fw-bold tracking-wide"
                                    placeholder="Enter 10 digits"
                                    inputMode="numeric"
                                    maxLength="10"
                                    disabled={otpSent || loading}
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                                    style={{ fontSize: "1.1rem" }}
                                />
                            </div>
                        </div>

                        {/* Logic Action Switch Button Viewport */}
                        {!otpSent && (
                            <button
                                className="btn btn-primary btn-lg w-100 py-3 fw-bold rounded-3 shadow-sm transition-all"
                                style={{ background: "#1e3c72", border: "none" }}
                                onClick={sendOtp}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="d-flex align-items-center justify-content-center">
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Sending OTP...
                                    </div>
                                ) : (
                                    "Request Secure OTP →"
                                )}
                            </button>
                        )}

                        {/* Secondary Viewport Condition Layer Hook: OTP Verification Verification field block */}
                        {otpSent && (
                            <div className="animate-fade-in">
                                <div className="mb-4 p-3 bg-light rounded-3 border border-warning border-opacity-50 text-center">
                                    <small className="text-muted d-block">OTP sent to reference number:</small>
                                    <strong className="text-dark">+91 ******{mobileNumber.slice(-4)}</strong>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold text-secondary small text-uppercase tracking-wider">
                                        Enter 6-Digit Verification Token
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg bg-light text-center fw-black tracking-widest border-2"
                                        placeholder="· · · · · ·"
                                        inputMode="numeric"
                                        maxLength="6"
                                        disabled={loading}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                        style={{ fontSize: "1.5rem", letterSpacing: "0.5rem" }}
                                    />
                                </div>

                                <button
                                    className="btn btn-success btn-lg w-100 py-3 fw-bold rounded-3 shadow"
                                    onClick={verifyOtp}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Verifying Secure Token...
                                        </div>
                                    ) : (
                                        "Verify & Access Dashboard ✔"
                                    )}
                                </button>
                                
                                <div className="text-center mt-3">
                                    <button 
                                        className="btn btn-link btn-sm text-decoration-none text-muted p-0" 
                                        onClick={() => { setOtpSent(false); setOtp(""); }}
                                        disabled={loading}
                                    >
                                        ← Change Mobile Number
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Secure footer branding details block layer */}
                <div className="text-center mt-4 text-muted small">
                    <p className="m-0">🔒 End-to-End Encrypted Node Connection</p>
                    <span className="font-monospace text-uppercase" style={{ fontSize: "0.65rem" }}>Ver. 2026.2.14</span>
                </div>
            </div>
        </div>
    );
}