import { useState } from "react";
import { toast } from "react-toastify";
import ApiInstance from "../../api/ApiInstance";
import { updateLocalProductStock } from "../../utils/authStorage";
import UserContext from "./UserContext";

const readStored = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeStored = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const defaultUser = {
  name: "Guest Shopper",
  email: "",
  role: "user",
  isLoggedIn: false,
};

const STOCK_KEY = "shop_product_stock";

const isServerProductId = (id) => /^[a-f\d]{24}$/i.test(id);

const UserContextProvider = ({ children }) => {
  const [user, setUserState] = useState(() => readStored("shop_user", defaultUser));
  const [cart, setCartState] = useState(() => readStored("shop_cart", []));
  const [orders, setOrdersState] = useState(() => readStored("shop_orders", []));
  const [stockLevels, setStockLevelsState] = useState(() => readStored(STOCK_KEY, {}));

  const setUser = (nextUser) => {
    const preparedUser = { ...defaultUser, ...nextUser, isLoggedIn: true };
    setUserState(preparedUser);
    writeStored("shop_user", preparedUser);
  };

  const updateUser = (updates) => {
    const preparedUser = { ...user, ...updates };
    setUserState(preparedUser);
    writeStored("shop_user", preparedUser);
  };

  const logout = () => {
    setUserState(defaultUser);
    writeStored("shop_user", defaultUser);
    toast.info("You have been logged out.");
  };

  const setCart = (nextCart) => {
    setCartState(nextCart);
    writeStored("shop_cart", nextCart);
  };

  const setStockLevels = (nextStockLevels) => {
    setStockLevelsState(nextStockLevels);
    writeStored(STOCK_KEY, nextStockLevels);
  };

  const getProductStock = (product) => {
    const id = product?._id || product?.id;
    if (id && stockLevels[id] !== undefined) return stockLevels[id];
    return Number(product?.stock ?? 10);
  };

  const addToCart = (product) => {
    const id = product._id || product.id;
    const availableStock = getProductStock(product);
    const currentQuantity = cart.find((item) => item.id === id)?.quantity || 0;

    if (currentQuantity >= availableStock) {
      toast.error("Selected quantity is not available in stock.");
      return;
    }

    const nextCart = cart.some((item) => item.id === id)
      ? cart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [
          ...cart,
          {
            id,
            title: product.title,
            price: Number(product.price) || 0,
            image: product.image,
            category: product.category,
            stock: availableStock,
            quantity: 1,
          },
    ];
    setCart(nextCart);
    toast.success(`${product.title} added to cart.`);
  };

  const updateQuantity = (id, quantity) => {
    const nextCart = cart
      .map((item) => {
        if (item.id !== id) return item;

        const maxStock = getProductStock(item);
        return { ...item, quantity: Math.min(maxStock, Math.max(1, quantity)) };
      })
      .filter((item) => item.quantity > 0);
    setCart(nextCart);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    toast.info("Item removed from cart.");
  };

  const clearCart = () => setCart([]);

  const placeOrder = () => {
    if (!cart.length) return null;

    const order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customer: user.name || "Guest Shopper",
      email: user.email,
      date: new Date().toISOString().slice(0, 10),
      status: "Processing",
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      items: cart.reduce((sum, item) => sum + item.quantity, 0),
      products: cart,
    };

    const nextOrders = [order, ...orders];
    const nextStockLevels = cart.reduce((levels, item) => {
      const currentStock = getProductStock(item);
      const nextStock = Math.max(0, currentStock - item.quantity);
      return { ...levels, [item.id]: nextStock };
    }, stockLevels);

    setOrdersState(nextOrders);
    writeStored("shop_orders", nextOrders);
    setStockLevels(nextStockLevels);
    cart.forEach((item) => {
      const nextStock = nextStockLevels[item.id];
      updateLocalProductStock(item.id, nextStock);

      if (isServerProductId(item.id)) {
        ApiInstance.patch(`/product/update-product/${item.id}`, { stock: nextStock }).catch(() => {
          toast.error(`Could not update stock for ${item.title}.`);
        });
      }
    });
    clearCart();
    toast.success(`Order ${order.id} placed successfully.`);
    return order;
  };

  const updateOrderStatus = (id, status) => {
    const nextOrders = orders.map((order) => (
      order.id === id ? { ...order, status } : order
    ));

    setOrdersState(nextOrders);
    writeStored("shop_orders", nextOrders);
    toast.success(`Order ${id} moved to ${status}.`);
  };

  const value = {
    user,
    cart,
    orders,
    setUser,
    updateUser,
    logout,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    updateOrderStatus,
    getProductStock,
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    cartTotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
