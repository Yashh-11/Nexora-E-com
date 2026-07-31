import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ApiInstance from "../api/ApiInstance";
import UserContext from "../context/user/UserContext";
import { demoProducts } from "../data/demoData";
import { getLocalProducts } from "../utils/authStorage";

const mergeProducts = (...groups) => {
  const seen = new Set();

  return groups.flat().filter((product) => {
    const id = product?._id || product?.id || product?.title;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

const Home = () => {
  const { addToCart, getProductStock, user } = useContext(UserContext);
  const [products, setProducts] = useState(() => mergeProducts(getLocalProducts(), demoProducts));
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    ApiInstance.get("/product/getallproducts", { params: { limit: 24 } })
      .then((res) => {
        const localProducts = getLocalProducts();
        const apiProducts = res.data?.products || [];
        if (isMounted && (apiProducts.length || localProducts.length)) {
          setProducts(mergeProducts(localProducts, apiProducts, demoProducts));
          setNotice("Live products loaded from server.");
        }
      })
      .catch(() => {
        if (isMounted) {
          setProducts(mergeProducts(getLocalProducts(), demoProducts));
          setNotice("Showing saved and demo products until your server has data.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((item) => item.category?.name || item.category || "General"))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const productCategory = product.category?.name || product.category || "General";
        const matchesCategory = category === "All" || productCategory === category;
        const matchesSearch = product.title?.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "low") return Number(a.price) - Number(b.price);
        if (sort === "high") return Number(b.price) - Number(a.price);
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      });
  }, [category, products, search, sort]);

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Nexora marketplace</span>
          <h1>A premium shopping studio for customers and store admins.</h1>
          <p>
            Browse curated products as a customer, or unlock the admin studio to add products,
            manage inventory, and monitor store activity.
          </p>
          <div className="hero-actions">
            <a className="btn btn-dark" href="#products">Explore products</a>
            {user.role === "admin" && <Link className="btn btn-light" to="/admin">Open admin</Link>}
          </div>
          <div className="hero-metrics">
            <span><strong>24h</strong> dispatch</span>
            <span><strong>Role</strong> protected</span>
            <span><strong>Live</strong> catalog</span>
          </div>
        </div>
        <div className="hero-visual product-collage" aria-label="Featured product collection">
          {demoProducts.slice(0, 4).map((product, index) => (
            <img
              className={`collage-item collage-item-${index + 1}`}
              key={product._id}
              src={product.image}
              alt={product.title}
            />
          ))}
          <div className="floating-stat">
            <strong>{products.length}+</strong>
            <span>products ready</span>
          </div>
        </div>
      </section>

      <section className="toolbar-section" id="products">
        <div>
          <span className="eyebrow">Catalog</span>
          <h2>Featured products</h2>
        </div>
        <div className="catalog-tools">
          <input
            type="search"
            placeholder="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
      </section>

      {notice && <p className="notice">{notice}</p>}
      {loading && <p className="notice">Loading product catalog...</p>}

      <section className="product-grid">
        {filteredProducts.map((product) => {
          const id = product._id || product.id;
          const productCategory = product.category?.name || product.category || "General";
          const productStock = getProductStock(product);

          return (
            <article className="product-card" key={id}>
              <Link to={`/product/${id}`} state={{ product }} className="product-image">
                <img src={product.image || demoProducts[0].image} alt={product.title} />
              </Link>
              <div className="product-info">
                <span>{productCategory}</span>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <div className="product-meta">
                  <strong>Rs. {Number(product.price).toLocaleString("en-IN")}</strong>
                  <small>{productStock} in stock</small>
                </div>
                <div className="card-actions">
                  <button className="btn btn-dark" type="button" disabled={productStock <= 0} onClick={() => addToCart(product)}>
                    Add to cart
                  </button>
                  <Link className="btn btn-ghost" to={`/product/${id}`} state={{ product }}>
                    View
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {!filteredProducts.length && (
        <section className="empty-state">
          <h2>No products found</h2>
          <p>Try a different search or category filter.</p>
        </section>
      )}
    </>
  )
}

export default Home
