import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApiInstance from "../api/ApiInstance";
import UserContext from "../context/user/UserContext";
import { createVerification, findAccount } from "../utils/authStorage";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();

    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);
    const account = findAccount(email);
    let loginUser = account;

    try {
      const res = await ApiInstance.post("/user/login", {
        email,
        password,
      });
      loginUser = res.data?.user || account;
      toast.success("Login successful.");
    } catch (error) {
      if (error.response?.status === 403) {
        createVerification(email);
        try {
          await ApiInstance.post("/user/send-verification-otp", { email });
          toast.warning("Please verify your email. A new OTP was sent.");
        } catch (otpError) {
          toast.error(otpError.response?.data?.message || "Please verify your email before login.");
        }
        setLoading(false);
        navigate("/verify-email");
        return;
      }

      if (!account) {
        toast.error("Account not found. Please register first.");
        setLoading(false);
        return;
      }

      if (account.password !== password) {
        toast.error("Incorrect password.");
        setLoading(false);
        return;
      }

      if (!account.verified) {
        createVerification(email);
        try {
          await ApiInstance.post("/user/send-verification-otp", { email });
          toast.warning("Please verify your email. A new OTP was sent.");
        } catch (otpError) {
          toast.error(otpError.response?.data?.message || "Please verify your email before login.");
        }
        setLoading(false);
        navigate("/verify-email");
        return;
      }

      toast.info("Logged in with local account.");
    }

    setUser({
      name: loginUser?.name || email.split("@")[0] || "Shopper",
      email,
      role: (loginUser?.role || "user").toLowerCase(),
    });
    setLoading(false);
    navigate((loginUser?.role || "user").toLowerCase() === "admin" ? "/admin" : "/");
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Welcome back</span>
        <h1>Login to your account</h1>
        <label>
          Email address
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <div className="auth-hint">
          <strong>Role managed automatically</strong>
          <span>Your account permissions decide whether you enter the shop or admin studio.</span>
        </div>
        <button className="btn btn-dark w-100" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="auth-switch">New here? <Link to="/signup">Create an account</Link></p>
      </form>
    </section>
  )
}

export default Login
