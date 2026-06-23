import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

export default function Login() {

    const navigate = useNavigate();

    const [mobileNumber, setMobileNumber] = useState("");
    const [otp, setOtp] = useState("");

    const [otpSent, setOtpSent] = useState(false);

    const sendOtp = async () => {

        if (!/^[0-9]{10}$/.test(mobileNumber)) {

            alert("Enter Valid Mobile Number");

            return;

        }

        try {

            const response = await axios.post(
                `${API_URL}/api/auth/send-otp`,
                {
                    mobile_number: mobileNumber
                }
            );

            alert(
                `OTP Sent Successfully\n\nDevelopment OTP : ${response.data.otp}`
            );

            setOtpSent(true);

        }
        catch (error) {

            console.log(error);

            alert("Failed To Send OTP");

        }

    };

    const verifyOtp = async () => {

        if (!otp) {

            alert("Enter OTP");

            return;

        }

        try {

            const response = await axios.post(
                `${API_URL}/api/auth/verify-otp`,
                {
                    mobile_number: mobileNumber,
                    otp: otp
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "userId",
                response.data.userId
            );

            alert("Login Successful");

            navigate("/");

        }
        catch (error) {

            console.log(error);

            alert("Invalid OTP");

        }

    };

    return (

        <div className="container">

            <div className="row justify-content-center mt-5">

                <div className="col-md-5">

                    <div className="card shadow">

                        <div className="card-body">

                            <h2 className="text-center mb-4">
                                Pigmy Login
                            </h2>

                            <div className="mb-3">

                                <label>
                                    Mobile Number
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    maxLength="10"
                                    value={mobileNumber}
                                    onChange={(e) =>
                                        setMobileNumber(
                                            e.target.value.replace(/\D/g, "")
                                        )
                                    }
                                />

                            </div>

                            {
                                !otpSent
                                &&
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={sendOtp}
                                >
                                    Send OTP
                                </button>
                            }

                            {
                                otpSent
                                &&
                                <>
                                    <div className="mt-3">

                                        <label>
                                            OTP
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            maxLength="6"
                                            value={otp}
                                            onChange={(e) =>
                                                setOtp(
                                                    e.target.value.replace(/\D/g, "")
                                                )
                                            }
                                        />

                                    </div>

                                    <button
                                        className="btn btn-success w-100 mt-3"
                                        onClick={verifyOtp}
                                    >
                                        Verify OTP
                                    </button>
                                </>
                            }

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}