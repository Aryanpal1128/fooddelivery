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

const Signin = () => {
  const [showpassword, setpassword] = useState(false);
  const navigate = useNavigate();
  const [Err, setErr] = useState("");
  const [email, setemail] = useState("");
  const [password, setpass] = useState("");
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handlesignin = async () => {
    try {
      setLoading(true);
      const result = await axios.post(`${serverurl}/api/auth/signin`, { email, password }, { withCredentials: true });
      dispatch(setUserData(result.data));
      setErr("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setErr(error.response.data || "Something went wrong");
      } else {
        setErr(error.message);
      }
    }
  };

  const googleauth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const response = await axios.post(`${serverurl}/api/auth/google`, { email: result.user.email }, { withCredentials: true });
      dispatch(setUserData(response.data));
    } catch (error) {
      if (error.response) setErr(error.response.data);
      else setErr(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden" style={{ minHeight: '100vh' }}>
      
      {/* ── LEFT BRANDING PANEL ── */}
      <div 
        className="hidden md:flex flex-col justify-center items-center p-[60px_48px] relative transition-colors"
        style={{ 
          background: '#1a1208', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '60px 48px' 
        }}
      >
        <div className="flex flex-col items-center">
          <i className="ti ti-tools-kitchen-2" style={{ fontSize: '56px', color: '#e8650a' }}></i>
          <h1 style={{ fontSize: '42px', fontWeight: '600', color: '#f0ece6', marginTop: '16px' }}>Foodie</h1>
          <p style={{ fontSize: '15px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
            Your favourite food, delivered fast
          </p>
        </div>

        {/* Features */}
        <div className="mt-8">
          {[
            { icon: "ti ti-clock", text: "Delivered in 20 minutes" },
            { icon: "ti ti-star", text: "50+ top rated restaurants" },
            { icon: "ti ti-shield", text: "Safe & secure payments" }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '28px' }}>
              <div style={{ 
                width: '44px', height: '44px', borderRadius: '50%', background: '#2a1a08', 
                border: '0.5px solid #3a2810', display: 'flex', alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <i className={`${item.icon}`} style={{ color: '#e8650a', fontSize: '20px' }}></i>
              </div>
              <span style={{ fontSize: '14px', color: '#777' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div 
        className="bg-[#f5f0eb] dark:bg-[#0f0e0c] transition-colors"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '40px 24px'
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          
          <h2 className="text-[#1a1a1a] dark:text-[#f0ece6]" style={{ fontSize: '32px', fontWeight: '600', marginBottom: '8px' }}>
            Welcome back
          </h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '36px' }}>
            Sign in to your Foodie account
          </p>

          {/* Error Message */}
          {Err && (
            <div className="mb-6 p-3 rounded-[10px] bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-500 text-[13px]">
              {typeof Err === 'string' ? Err : "Authentication failed."}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handlesignin(); }}>
            
            {/* Email */}
            <div className="mb-4">
              <label style={{ fontSize: '13px', color: '#aaa', marginBottom: '8px', display: 'block' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="Enter your email"
                className="bg-white dark:bg-[#1c1a17] text-[#1a1a1a] dark:text-[#f0ece6] transition-colors"
                style={{
                  width: '100%',
                  height: '50px',
                  border: '0.5px solid #2a2825',
                  borderRadius: '10px',
                  padding: '0 16px',
                  fontSize: '14px',
                  outline: 'none',
                  marginBottom: '20px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Password Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', color: '#aaa', display: 'block' }}>
                Password
              </label>
              <span 
                onClick={() => navigate('/forgotpassword')}
                style={{ fontSize: '13px', color: '#e8650a', cursor: 'pointer' }}
              >
                Forgot password?
              </span>
            </div>

            <div className="relative mb-[20px]">
              <input
                type={showpassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setpass(e.target.value)}
                placeholder="Enter your password"
                className="bg-white dark:bg-[#1c1a17] text-[#1a1a1a] dark:text-[#f0ece6] transition-colors"
                style={{
                  width: '100%',
                  height: '50px',
                  border: '0.5px solid #2a2825',
                  borderRadius: '10px',
                  padding: '0 16px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setpassword(!showpassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#e8650a] transition-colors"
              >
                {showpassword ? <FaEyeSlash size={18} /> : <IoEye size={18} />}
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={Loading}
              style={{
                width: '100%',
                height: '50px',
                background: '#e8650a',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '8px',
                marginBottom: '20px'
              }}
            >
              {Loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0 16px' }}>
            <div style={{ flex: 1, height: '0.5px', background: '#1e1c19' }}></div>
            <span style={{ fontSize: '13px', color: '#444' }}>or</span>
            <div style={{ flex: 1, height: '0.5px', background: '#1e1c19' }}></div>
          </div>

          {/* Google Button */}
          <button
            onClick={googleauth}
            style={{
              width: '100%',
              height: '50px',
              background: '#1c1a17',
              border: '0.5px solid #2a2825',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#ddd',
              cursor: 'pointer',
              marginBottom: '24px'
            }}
          >
            <FcGoogle size={20} />
            Sign in with Google
          </button>

          {/* Footer */}
          <div style={{ textAlign: 'center', fontSize: '14px', color: '#555', marginTop: '8px' }}>
            Don't have an account?{" "}
            <span 
              onClick={() => navigate("/signup")}
              style={{ color: '#e8650a', fontWeight: '500', cursor: 'pointer' }}
            >
              Sign up
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Signin;
