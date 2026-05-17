import React, { useState } from 'react';
import axios from 'axios';
import { serverurl } from '../App';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";
import { MdOutlineRestaurant } from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlesendotp = async () => {
    setLoading(true); setError("");
    try {
      await axios.post(`${serverurl}/api/auth/sendingotp`, { email }, { withCredentials: true });
      localStorage.setItem("resetEmail", email);
      setStep(2);
    } catch (err) {
      setError(err.response?.data || err.message);
    }
    setLoading(false);
  };

  const handleverify = async () => {
    setLoading(true); setError("");
    try {
      await axios.post(`${serverurl}/api/auth/verifyotp`, { email, otp }, { withCredentials: true });
      setStep(3);
    } catch (err) {
      setError(err.response?.data || err.message);
    }
    setLoading(false);
  };

  const handleresetpassword = async () => {
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true); setError("");
    try {
      await axios.post(`${serverurl}/api/auth/resetpassword`, { email, newpassword: password }, { withCredentials: true });
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data || err.message);
    }
    setLoading(false);
  };

  const steps = ["Enter Email", "Verify OTP", "New Password"];

  const inputStyle = {
    background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#fff",
    outline: "none", width: "100%", padding: "12px 16px", borderRadius: "12px", fontSize: "14px"
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#111111" }}>
      <div className="w-full max-w-md animate-fadeInUp">

        {/* Back + Logo */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/signin")}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "#9ca3af" }}
          >
            <IoChevronBack size={18} />
            Back to sign in
          </button>
          <div className="flex items-center gap-2">
            <MdOutlineRestaurant style={{ color: "#f97316", fontSize: "22px" }} />
            <span style={{ color: "#f97316", fontWeight: 800, fontSize: "18px" }}>Foodie</span>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
        >
          <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "24px", marginBottom: "6px" }}>Forgot Password</h1>
          <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "24px" }}>
            {step === 1 && "Enter your email and we'll send you a one-time code."}
            {step === 2 && `We sent an OTP to ${email}. Check your inbox.`}
            {step === 3 && "Set your new password below."}
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-7">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div
                  className="flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0"
                  style={{
                    width: "24px", height: "24px",
                    background: i + 1 <= step ? "#f97316" : "#2a2a2a",
                    color: i + 1 <= step ? "#fff" : "#6b7280",
                    transition: "all 0.3s",
                  }}
                >
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                {i < 2 && (
                  <div
                    className="flex-1 h-px"
                    style={{ background: i + 1 < step ? "#f97316" : "#2a2a2a", transition: "all 0.3s" }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div
              className="px-4 py-3 rounded-xl mb-5 text-sm"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
            >
              {error}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label style={{ color: "#9ca3af", fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "8px" }}>Email address</label>
                <input
                  id="email" type="email" placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)} value={email}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#f97316"}
                  onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                />
              </div>
              <button
                onClick={handlesendotp} disabled={Loading}
                className="w-full py-3 rounded-xl font-semibold text-sm"
                style={{ background: "#f97316", color: "#fff", opacity: Loading ? 0.7 : 1 }}
              >
                {Loading ? <ClipLoader size={18} color="#fff" /> : "Send OTP"}
              </button>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <label style={{ color: "#9ca3af", fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "8px" }}>One-Time Password</label>
                <input
                  id="otp" type="text" placeholder="Enter 6-digit OTP"
                  onChange={(e) => setOtp(e.target.value)} value={otp}
                  style={{ ...inputStyle, letterSpacing: "4px", textAlign: "center", fontSize: "20px" }}
                  onFocus={e => e.target.style.borderColor = "#f97316"}
                  onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                />
              </div>
              <button
                onClick={handleverify} disabled={Loading}
                className="w-full py-3 rounded-xl font-semibold text-sm"
                style={{ background: "#f97316", color: "#fff", opacity: Loading ? 0.7 : 1 }}
              >
                {Loading ? <ClipLoader size={18} color="#fff" /> : "Verify OTP"}
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full py-2 rounded-xl text-sm"
                style={{ color: "#9ca3af" }}
              >
                ← Change email
              </button>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <label style={{ color: "#9ca3af", fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "8px" }}>New Password</label>
                <input
                  id="password" type="password" placeholder="Min 8 characters"
                  onChange={(e) => setPassword(e.target.value)} value={password}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#f97316"}
                  onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                />
              </div>
              <div>
                <label style={{ color: "#9ca3af", fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "8px" }}>Confirm Password</label>
                <input
                  id="confirm" type="password" placeholder="Re-enter password"
                  onChange={(e) => setConfirm(e.target.value)} value={confirm}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#f97316"}
                  onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                />
              </div>
              <button
                onClick={handleresetpassword} disabled={Loading}
                className="w-full py-3 rounded-xl font-semibold text-sm"
                style={{ background: "#f97316", color: "#fff", opacity: Loading ? 0.7 : 1 }}
              >
                {Loading ? <ClipLoader size={18} color="#fff" /> : "Reset Password"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
