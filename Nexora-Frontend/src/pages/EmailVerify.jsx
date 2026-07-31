import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ApiInstance from "../api/ApiInstance";
import UserContext from "../context/user/UserContext";
import {
  getVerification,
  markAccountVerified,
  saveVerification,
} from "../utils/authStorage";

const EmailVerify = () => {
  const { setUser } = useContext(UserContext);
  const storedVerification = useMemo(() => {
    try {
      return getVerification();
    } catch {
      return null;
    }
  }, []);

  const [code, setCode] = useState("");
  const [verification, setVerification] = useState(storedVerification);
  const [verified, setVerified] = useState(Boolean(storedVerification?.verified));
  const [loading, setLoading] = useState(false);

  const resendCode = async () => {
    if (!verification?.email) {
      toast.error("Create an account first so an OTP can be sent.");
      return;
    }

    setLoading(true);
    try {
      await ApiInstance.post("/user/send-verification-otp", {
        email: verification.email,
      });
      setVerified(false);
      setCode("");
      toast.success("A new OTP was sent to your registered email.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send OTP email.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verification?.email) {
      toast.error("Create an account first so an OTP can be verified.");
      return;
    }

    if (code.trim().length !== 6) {
      toast.error("Enter the six digit OTP from your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await ApiInstance.post("/user/verify-email-otp", {
        email: verification.email,
        otp: code.trim(),
      });

      const nextVerification = { ...verification, verified: true };
      saveVerification(nextVerification);
      const verifiedAccount = markAccountVerified(verification.email);
      const verifiedUser = res.data?.user || verifiedAccount;

      if (verifiedUser) {
        setUser({
          name: verifiedUser.name,
          email: verifiedUser.email,
          role: verifiedUser.role,
        });
      }

      setVerification(nextVerification);
      setVerified(true);
      toast.success("Email verified successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="eyebrow">Email verification</span>
        <h1>{verified ? "Email verified" : "Check your inbox"}</h1>
        <p>
          {verified
            ? "Your account is ready. You can continue to the store."
            : `Enter the six digit code for ${verification?.email || "your account"}.`}
        </p>
        {!verified ? (
          <>
            <input
              inputMode="numeric"
              maxLength="6"
              placeholder="000000"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
            <button className="btn btn-dark w-100" type="button" onClick={verifyCode} disabled={loading}>
              {loading ? "Checking OTP..." : "Verify email"}
            </button>
            <button className="btn btn-ghost w-100" type="button" onClick={resendCode} disabled={loading}>
              Resend OTP
            </button>
          </>
        ) : (
          <Link className="btn btn-dark w-100" to="/">Continue shopping</Link>
        )}
      </div>
    </section>
  )
}

export default EmailVerify
