import { useContext } from "react";
import UserContext from "../context/user/UserContext";

const Order = () => {
  const { orders, updateOrderStatus, user } = useContext(UserContext);
  const statuses = ["Processing", "Packed", "Shipped", "Delivered", "Cancelled"];
  const visibleOrders = orders;

  return (
    <section>
      <div className="page-heading">
        <span className="eyebrow">{user.role === "admin" ? "Operations" : "Purchase history"}</span>
        <h1>{user.role === "admin" ? "All orders" : "My orders"}</h1>
        <p>
          {user.role === "admin"
            ? "Track order status, customer names, item counts, and revenue."
            : "Review your recent purchases and checkout status."}
        </p>
      </div>

      <div className="table-card">
        <div className="table-row table-head">
          <span>Order</span>
          <span>Customer</span>
          <span>Date</span>
          <span>Status</span>
          <span>Total</span>
        </div>
        {visibleOrders.map((order) => {
          return (
            <div className="table-row" key={order.id}>
              <strong>{order.id}</strong>
              <span>{order.customer || user.name}</span>
              <span>{order.date}</span>
              {user.role === "admin" ? (
                <select
                  className="status-select"
                  value={order.status}
                  onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              ) : (
                <span className="status-pill">{order.status}</span>
              )}
              <strong>Rs. {Number(order.total).toLocaleString("en-IN")}</strong>
            </div>
          );
        })}
      </div>

      {!visibleOrders.length && (
        <section className="empty-state">
          <h2>No orders yet</h2>
          <p>Your completed checkout orders will appear here.</p>
        </section>
      )}
    </section>
  )
}

export default Order
