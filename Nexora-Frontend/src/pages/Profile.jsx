import { useContext, useState } from "react";
import { toast } from "react-toastify";
import ApiInstance from "../api/ApiInstance";
import UserContext from "../context/user/UserContext";
import { demoProducts } from "../data/demoData";
import { getLocalProducts, removeLocalProduct, saveLocalProduct } from "../utils/authStorage";

const emptyProduct = {
  title: "",
  price: "",
  category: "",
  image: "",
  description: "",
};

const Profile = ({ mode = "profile" }) => {
  const { orders, updateUser, user } = useContext(UserContext);
  const isAdmin = user.role === "admin" && mode === "admin";
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
  });
  const [productForm, setProductForm] = useState(emptyProduct);
  const [adminProducts, setAdminProducts] = useState(() => [
    ...getLocalProducts(),
    ...demoProducts,
  ]);

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    updateUser({ ...profileForm, role: user.role });
    toast.success("Profile updated successfully.");
  };

  const handleProductChange = (event) => {
    setProductForm({ ...productForm, [event.target.name]: event.target.value });
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();

    if (!isAdmin) {
      toast.error("Only admins can add products.");
      return;
    }

    const product = {
      ...productForm,
      price: Number(productForm.price),
      _id: `local-${Date.now()}`,
      rating: 4.6,
      stock: 10,
    };

    try {
      const res = await ApiInstance.post("/product/create", product);
      const savedProduct = res.data?.product || { ...product, _id: res.data?.id || product._id };
      saveLocalProduct(savedProduct);
      setAdminProducts([
        savedProduct,
        ...adminProducts.filter((item) => (item._id || item.id) !== savedProduct._id),
      ]);
      toast.success(res.data?.message || "Product added.");
    } catch {
      saveLocalProduct(product);
      setAdminProducts([product, ...adminProducts]);
      toast.info("Product added locally. Start the server to save in MongoDB.");
    }

    setProductForm(emptyProduct);
  };

  const deleteProduct = async (id) => {
    if (!isAdmin) {
      toast.error("Only admins can delete products.");
      return;
    }

    try {
      await ApiInstance.delete(`/product/delete-product/${id}`);
      toast.success("Product deleted.");
    } catch {
      toast.info("Product removed locally.");
    }

    removeLocalProduct(id);
    setAdminProducts(adminProducts.filter((product) => (product._id || product.id) !== id));
  };

  const adminRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

  return (
    <section>
      <div className="page-heading">
        <span className="eyebrow">{isAdmin ? "Admin studio" : "Customer account"}</span>
        <h1>{isAdmin ? "Manage the Nexora store" : "Profile settings"}</h1>
        <p>
          {isAdmin
            ? "Admins can create products, remove inventory, and review store performance."
            : "Update your account details and review your shopping access."}
        </p>
      </div>

      <section className="dashboard-grid">
        <article className="metric-card">
          <span>{isAdmin ? "Total orders" : "Your orders"}</span>
          <strong>{orders.length}</strong>
        </article>
        <article className="metric-card">
          <span>{isAdmin ? "Revenue" : "Access"}</span>
          <strong>{isAdmin ? `Rs. ${adminRevenue.toLocaleString("en-IN")}` : "Read only"}</strong>
        </article>
        <article className="metric-card">
          <span>Role</span>
          <strong>{user.role}</strong>
        </article>
      </section>

      <section className="split-layout align-start">
        <form className="panel-form" onSubmit={handleProfileSubmit}>
          <h2>Profile</h2>
          <label>
            Name
            <input
              value={profileForm.name}
              onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={profileForm.email}
              onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })}
            />
          </label>
          <label>
            Role
            <input value={user.role} readOnly />
          </label>
          <p className="helper-text">
            Role changes are locked. Admin access is granted only through an invite code during registration.
          </p>
          <button className="btn btn-dark" type="submit">Save profile</button>
        </form>

        {isAdmin ? (
          <form className="panel-form admin-form" onSubmit={handleProductSubmit}>
            <h2>Add product</h2>
            <label>
              Product title
              <input name="title" value={productForm.title} onChange={handleProductChange} required />
            </label>
            <label>
              Price
              <input name="price" type="number" value={productForm.price} onChange={handleProductChange} required />
            </label>
            <label>
              Category
              <input name="category" value={productForm.category} onChange={handleProductChange} required />
            </label>
            <label>
              Image URL
              <input name="image" value={productForm.image} onChange={handleProductChange} />
            </label>
            <label>
              Description
              <textarea name="description" value={productForm.description} onChange={handleProductChange} required />
            </label>
            <button className="btn btn-dark" type="submit">Add product</button>
          </form>
        ) : (
          <aside className="permission-panel">
            <span className="eyebrow">Account access</span>
            <h2>{user.role === "admin" ? "Admin profile" : "Shopping access"}</h2>
            <p>
              {user.role === "admin"
                ? "Use Studio from the navbar when you want inventory and store controls. This page stays focused on your account."
                : "Your role can browse products, add items to cart, checkout, and view orders. Product creation, editing, and deletion are reserved for admins."}
            </p>
          </aside>
        )}
      </section>

      {isAdmin && (
        <section className="admin-products">
          <div className="page-heading compact">
            <span className="eyebrow">Inventory</span>
            <h2>Product management</h2>
          </div>
          <div className="table-card">
            <div className="table-row table-head product-row">
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Action</span>
            </div>
            {adminProducts.map((product) => (
              <div className="table-row product-row" key={product._id}>
                <strong>{product.title}</strong>
                <span>{product.category?.name || product.category || "General"}</span>
                <span>Rs. {Number(product.price).toLocaleString("en-IN")}</span>
                <span>{product.stock || 10}</span>
                <button className="text-button" type="button" onClick={() => deleteProduct(product._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}

export default Profile
