import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApiInstance from "../api/ApiInstance";
import { createVerification, findAccount, saveAccount } from "../utils/authStorage";

const ADMIN_INVITE_CODE = "NEXORA-ADMIN";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    adminCode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const preparedForm = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password.trim(),
    };
    const requestedAdmin = preparedForm.role === "admin";

    if (preparedForm.name.length < 2) {
      toast.error("Please enter your full name.");
      return;
    }

    if (requestedAdmin && preparedForm.adminCode.trim() !== ADMIN_INVITE_CODE) {
      toast.error("Invalid admin invite code.");
      return;
    }

    if (preparedForm.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (findAccount(preparedForm.email)) {
      toast.error("This email is already registered. Please login.");
      return;
    }

    setLoading(true);
    let accountCreated = false;

    try {
      await ApiInstance.post("/user/register", {
        name: preparedForm.name,
        email: preparedForm.email,
        password: preparedForm.password,
        role: preparedForm.role,
      });
      accountCreated = true;
      toast.success("Account created on server.");
    } catch {
      toast.error("Server unavailable. Email verification cannot be sent right now.");
      setLoading(false);
      return;
    }

    saveAccount({
      name: preparedForm.name,
      email: preparedForm.email,
      password: preparedForm.password,
      role: preparedForm.role,
      verified: false,
    });
    createVerification(preparedForm.email);

    if (accountCreated) {
      try {
        await ApiInstance.post("/user/send-verification-otp", {
          email: preparedForm.email,
        });
        toast.success("OTP sent to your registered email.");
      } catch (error) {
        toast.error(error.response?.data?.message || "Account created, but OTP email could not be sent.");
      }
    }

    setLoading(false);
    navigate("/verify-email");
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Create account</span>
        <h1>Start shopping today</h1>
        <label>
          Full name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email address
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Account type
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="user">User - browse, buy, and view orders</option>
            <option value="admin">Admin - manage products and orders</option>
          </select>
        </label>
        {form.role === "admin" && (
          <label>
            Admin invite code
            <input
              name="adminCode"
              value={form.adminCode}
              onChange={handleChange}
              placeholder="NEXORA-ADMIN"
              required
            />
          </label>
        )}
        <button className="btn btn-dark w-100" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
        <p className="auth-switch">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </section>
  )
}

export default Signup
