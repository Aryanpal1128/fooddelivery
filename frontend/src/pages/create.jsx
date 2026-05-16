import React, { useState } from 'react';
import { IoEye } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverurl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { ClipLoader } from "react-spinners";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { MdOutlineRestaurant } from "react-icons/md";
import { RiUser3Line } from "react-icons/ri";
import { MdStorefront } from "react-icons/md";
import { FaMotorcycle } from "react-icons/fa";

const Create = () => {
  const [showpassword, setpassword] = useState(false);
  const [role, setrole] = useState("");
  const navigate = useNavigate();
  const [fullname, setfullname] = useState("");
  const [email, setemail] = useState("");
  const [mobile, setmobile] = useState("");
  const [password, setpass] = useState("");
  const [Err, setErr] = useState("");
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handlesignup = async () => {
    if (!role) {
      setErr("Please select a role to join as.");
      return;
    }
    try {
      setLoading(true);
      const result = await axios.post(`${serverurl}/api/auth/create`, { fullname, email, password, mobile, role }, { withCredentials: true });
      dispatch(setUserData(result.data));
      setErr("");
      setfullname("");
      setLoading(false);
    } catch (error) {
      if (error.response) {
        if (error.response.data === "You already have an account") {
          setfullname(""); setemail(""); setmobile(""); setpass("");
        }
        setErr(error.response.data || "Something went wrong");
      } else {
        setErr(error.message);
      }
      setLoading(false);
    }
  };

  const googleauth = async () => {
    try {
      if (!role) { setErr("Please select a role before signing up with Google."); return; }
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const response = await axios.post(`${serverurl}/api/auth/google`, {
        fullname: result.user.displayName, email: result.user.email, role, mobile
      }, { withCredentials: true });
      dispatch(setUserData(response.data));
      setErr("");
    } catch (error) {
      if (error.response) setErr(error.response.data);
      else setErr(error.message);
    }
  };

  const roles = [
    { label: "User", value: "user", icon: <RiUser3Line size={20} />, desc: "Order food" },
    { label: "Owner", value: "Owner", icon: <MdStorefront size={20} />, desc: "Manage restaurant" },
    { label: "Delivery", value: "deliveryboy", icon: <FaMotorcycle size={18} />, desc: "Deliver orders" },
  ];

  return (
    <div className="min-h-screen w-full flex" style={{ background: "#111111" }}>

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0a00 0%, #111111 60%)" }}
      >
        <div className="absolute top-[-80px] left-[-80px] rounded-full opacity-30"
          style={{ width: "300px", height: "300px", background: "radial-gradient(circle, #f97316, transparent)" }} />
        <div className="absolute bottom-[-60px] right-[-60px] rounded-full opacity-20"
          style={{ width: "250px", height: "250px", background: "radial-gradient(circle, #f97316, transparent)" }} />

        <div className="flex items-center gap-2 relative z-10">
          <MdOutlineRestaurant style={{ color: "#f97316", fontSize: "28px" }} />
          <span style={{ color: "#f97316", fontWeight: 800, fontSize: "26px" }}>Foodie</span>
        </div>

        <div className="relative z-10">
          <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "34px", lineHeight: 1.2, marginBottom: "16px" }}>
            Join thousands of<br />
            <span style={{ color: "#f97316" }}>food lovers.</span>
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "15px", lineHeight: 1.7 }}>
            Create your account and start ordering from the best restaurants in your city in minutes.
          </p>
        </div>

        <p style={{ color: "#333", fontSize: "12px", position: "relative", zIndex: 10 }}>© 2025 Foodie · All rights reserved</p>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md animate-fadeInUp py-6">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <MdOutlineRestaurant style={{ color: "#f97316", fontSize: "24px" }} />
            <span style={{ color: "#f97316", fontWeight: 800, fontSize: "22px" }}>Foodie</span>
          </div>

          <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "26px", marginBottom: "6px" }}>Create account</h1>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>Fill in your details to get started</p>

          {/* Role selector */}
          <div className="mb-6">
            <label style={{ color: "#9ca3af", fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "10px" }}>
              I want to join as
            </label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setrole(r.value)}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all duration-200"
                  style={
                    role === r.value
                      ? { background: "rgba(249,115,22,0.15)", border: "1.5px solid #f97316", color: "#f97316" }
                      : { background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#9ca3af" }
                  }
                >
                  {r.icon}
                  <span style={{ fontSize: "12px", fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontSize: "10px", color: role === r.value ? "#f97316" : "#6b7280" }}>{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {Err && (
            <div
              className="px-4 py-3 rounded-xl mb-5 text-sm"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
            >
              {typeof Err === 'string' ? Err : Err.message || "An error occurred"}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handlesignup(); }}>
            {/* Full Name */}
            <div>
              <label style={{ color: "#9ca3af", fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "7px" }}>Full Name</label>
              <input
                id="fullname" type="text" placeholder="John Doe"
                onChange={(e) => setfullname(e.target.value)} value={fullname} required
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#fff", outline: "none" }}
                onFocus={e => e.target.style.borderColor = "#f97316"}
                onBlur={e => e.target.style.borderColor = "#2a2a2a"}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ color: "#9ca3af", fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "7px" }}>Email address</label>
              <input
                id="email" type="email" placeholder="you@example.com"
                onChange={(e) => setemail(e.target.value)} value={email} required
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#fff", outline: "none" }}
                onFocus={e => e.target.style.borderColor = "#f97316"}
                onBlur={e => e.target.style.borderColor = "#2a2a2a"}
              />
            </div>

            {/* Mobile */}
            <div>
              <label style={{ color: "#9ca3af", fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "7px" }}>Mobile number</label>
              <input
                id="mobile" type="number" maxLength={10} placeholder="10-digit number"
                onChange={(e) => setmobile(e.target.value)} value={mobile} required
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#fff", outline: "none" }}
                onFocus={e => e.target.style.borderColor = "#f97316"}
                onBlur={e => e.target.style.borderColor = "#2a2a2a"}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ color: "#9ca3af", fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "7px" }}>Password</label>
              <div className="relative">
                <input
                  id="password" type={showpassword ? "text" : "password"} placeholder="Min 8 characters"
                  onChange={(e) => setpass(e.target.value)} value={password} required
                  className="w-full px-4 py-3 rounded-xl text-sm pr-11"
                  style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#fff", outline: "none" }}
                  onFocus={e => e.target.style.borderColor = "#f97316"}
                  onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#6b7280" }}
                  onClick={() => setpassword(prev => !prev)}
                >
                  {!showpassword ? <IoEye size={17} /> : <FaEyeSlash size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={Loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 mt-2"
              style={{ background: "#f97316", color: "#fff", opacity: Loading ? 0.7 : 1, cursor: Loading ? "not-allowed" : "pointer" }}
            >
              {Loading ? <ClipLoader size={18} color="#fff" /> : "Create Account"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "#2a2a2a" }} />
              <span style={{ color: "#6b7280", fontSize: "12px" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "#2a2a2a" }} />
            </div>

            {/* Google */}
            <button
              type="button" onClick={googleauth}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90"
              style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#fff" }}
            >
              <FcGoogle size={20} />
              Sign up with Google
            </button>

            {/* Sign in link */}
            <p className="text-center" style={{ color: "#6b7280", fontSize: "13px" }}>
              Already have an account?{" "}
              <button type="button" onClick={() => navigate("/signin")} style={{ color: "#f97316", fontWeight: 600 }}>
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
