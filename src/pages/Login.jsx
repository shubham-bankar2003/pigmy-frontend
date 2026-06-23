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
            
            // AUTOFILL LOGIC: Agar backend se response mein OTP aa raha hai, toh auto-fill kar dein
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
            
            // Chhota sa delay taaki user success toast dekh sake
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
        <div className="container">
            {/* ToastContainer ko poore page par toasts render karne ke liye top par rakha hai */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            <div className="row justify-content-center mt-5">
                <div className="col-md-5">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Pigmy Login</h2>

                            <div className="mb-3">
                                <label>Mobile Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    maxLength="10"
                                    disabled={otpSent || loading}
                                    value={mobileNumber}
                                    onChange={(e) =>
                                        setMobileNumber(e.target.value.replace(/\D/g, ""))
                                    }
                                />
                            </div>

                            {!otpSent && (
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={sendOtp}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        "Send OTP"
                                    )}
                                </button>
                            )}

                            {otpSent && (
                                <>
                                    <div className="mt-3">
                                        <label>OTP</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            maxLength="6"
                                            disabled={loading}
                                            value={otp} // Autofill hone par yahan value khud dikh jayegi
                                            onChange={(e) =>
                                                setOtp(e.target.value.replace(/\D/g, ""))
                                            }
                                        />
                                    </div>

                                    <button
                                        className="btn btn-success w-100 mt-3"
                                        onClick={verifyOtp}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Verifying...
                                            </>
                                        ) : (
                                            "Verify OTP"
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}