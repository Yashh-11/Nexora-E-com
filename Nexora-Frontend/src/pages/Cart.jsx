import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../context/user/UserContext";

const Cart = () => {
  const { cart, cartTotal, placeOrder, removeFromCart, updateQuantity } = useContext(UserContext);
  const [placedOrder, setPlacedOrder] = useState(null);

  const delivery = cartTotal > 2000 || cartTotal === 0 ? 0 : 99;
  const grandTotal = cartTotal + delivery;

  const checkout = () => {
    const order = placeOrder();
    setPlacedOrder(order);
  };

  if (placedOrder) {
    return (
      <section className="empty-state">
        <h1>Order placed</h1>
        <p>Your order {placedOrder.id} is now processing.</p>
        <Link className="btn btn-dark" to="/orders">View orders</Link>
      </section>
    );
  }

  return (
    <section className="split-layout">
      <div>
        <span className="eyebrow">Shopping cart</span>
        <h1>Your selected products</h1>
        <div className="cart-list">
          {cart.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.category || "Product"}</p>
                <strong>Rs. {item.price.toLocaleString("en-IN")}</strong>
              </div>
              <div className="quantity-control">
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button className="text-button" type="button" onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </article>
          ))}
        </div>
        {!cart.length && (
          <div className="empty-card">
            <h2>Your cart is empty</h2>
            <p>Add products from the catalog to start checkout.</p>
            <Link className="btn btn-dark" to="/">Shop now</Link>
          </div>
        )}
      </div>

      <aside className="summary-panel">
        <h2>Order summary</h2>
        <div><span>Subtotal</span><strong>Rs. {cartTotal.toLocaleString("en-IN")}</strong></div>
        <div><span>Delivery</span><strong>{delivery ? `Rs. ${delivery}` : "Free"}</strong></div>
        <div className="summary-total"><span>Total</span><strong>Rs. {grandTotal.toLocaleString("en-IN")}</strong></div>
        <button className="btn btn-dark w-100" type="button" disabled={!cart.length} onClick={checkout}>
          Checkout
        </button>
      </aside>
    </section>
  )
}

export default Cart
