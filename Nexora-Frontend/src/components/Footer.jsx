import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-wrap">
        <div className="footer-brand">
          <Link className="brand" to="/">
            <span className="brand-mark" aria-hidden="true">
              <span className="brand-orbit" />
              <span className="brand-core">N</span>
            </span>
            <span>
              <strong>Nexora</strong>
              <small>Premium marketplace</small>
            </span>
          </Link>
          <p>
            Curated products, secure checkout, and reliable service for modern shoppers.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h2>Shop</h2>
            <Link to="/">Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
          </div>
          <div>
            <h2>Support</h2>
            <span>Secure payments</span>
            <span>Fast dispatch</span>
            <span>Quality checked</span>
          </div>
          <div>
            <h2>Company</h2>
            <span>Customer first</span>
            <span>Trusted sellers</span>
            <span>24h processing</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>Copyright 2026 Nexora. All rights reserved.</span>
        <span>Built for responsive shopping experiences.</span>
      </div>
    </footer>
  );
};

export default Footer;
