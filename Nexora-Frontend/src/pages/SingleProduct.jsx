import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ApiInstance from "../api/ApiInstance";
import UserContext from "../context/user/UserContext";
import { demoProducts } from "../data/demoData";

const SingleProduct = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const { addToCart, getProductStock } = useContext(UserContext);
  const [product, setProduct] = useState(state?.product || null);

  useEffect(() => {
    if (product) return;

    const fallback = demoProducts.find((item) => item._id === id);
    ApiInstance.get(`/product/getoneproduct/${id}`)
      .then((res) => setProduct(res.data?.product || fallback || demoProducts[0]))
      .catch(() => setProduct(fallback || demoProducts[0]));
  }, [id, product]);

  if (!product) {
    return <section className="empty-state"><h2>Loading product...</h2></section>;
  }

  const productCategory = product.category?.name || product.category || "General";
  const productStock = getProductStock(product);

  return (
    <section className="product-detail">
      <div className="detail-image">
        <img src={product.image || demoProducts[0].image} alt={product.title} />
      </div>
      <div className="detail-copy">
        <span className="eyebrow">{productCategory}</span>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <div className="detail-price">Rs. {Number(product.price).toLocaleString("en-IN")}</div>
        <div className="detail-badges">
          <span>Free delivery</span>
          <span>{productStock} in stock</span>
          <span>Secure checkout</span>
        </div>
        <div className="hero-actions">
          <button className="btn btn-dark" type="button" disabled={productStock <= 0} onClick={() => addToCart(product)}>
            Add to cart
          </button>
          <Link className="btn btn-light" to="/cart">Go to cart</Link>
        </div>
      </div>
    </section>
  )
}

export default SingleProduct
