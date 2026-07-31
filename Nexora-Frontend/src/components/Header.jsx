import { useContext, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import UserContext from "../context/user/UserContext";

const Header = () => {
  const { cartCount, logout, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  return (
    <header className="site-header">
      <nav className="nav-wrap">
        <Link className="brand" to="/" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-orbit"></span>
            <span className="brand-core">N</span>
          </span>
          <span>
            <strong>Nexora</strong>
            <small>{user.role === "admin" ? "Control studio" : "Curated commerce"}</small>
          </span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${open ? "show" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>Shop</NavLink>
          <NavLink to="/orders" onClick={closeMenu}>Orders</NavLink>
          {user.role === "admin" && (
            <NavLink to="/admin" onClick={closeMenu}>Studio</NavLink>
          )}
          <NavLink to="/profile" onClick={closeMenu}>Profile</NavLink>
          <NavLink className="cart-link" to="/cart" onClick={closeMenu}>
            Cart <span>{cartCount}</span>
          </NavLink>
        </div>

        <div className="nav-actions">
          <span className={`role-pill ${user.role}`}>{user.role}</span>
          {user.isLoggedIn ? (
            <button className="btn btn-ghost" type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/signup" onClick={closeMenu}>Signup</Link>
              <Link className="btn btn-dark" to="/login" onClick={closeMenu}>Login</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
