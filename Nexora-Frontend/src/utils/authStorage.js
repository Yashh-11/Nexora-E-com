const ACCOUNTS_KEY = "shop_accounts";
const VERIFICATION_KEY = "shop_email_verification";
const LOCAL_PRODUCTS_KEY = "shop_local_products";

export const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getAccounts = () => readJson(ACCOUNTS_KEY, []);

export const saveAccount = (account) => {
  const accounts = getAccounts();
  const normalizedEmail = account.email.trim().toLowerCase();
  const nextAccount = { ...account, email: normalizedEmail };
  const exists = accounts.some((item) => item.email === normalizedEmail);
  const nextAccounts = exists
    ? accounts.map((item) => (item.email === normalizedEmail ? { ...item, ...nextAccount } : item))
    : [...accounts, nextAccount];

  writeJson(ACCOUNTS_KEY, nextAccounts);
  return nextAccount;
};

export const findAccount = (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  return getAccounts().find((account) => account.email === normalizedEmail);
};

export const markAccountVerified = (email) => {
  const account = findAccount(email);
  if (!account) return null;

  return saveAccount({ ...account, verified: true });
};

export const createVerification = (email) => {
  const verification = {
    email: email.trim().toLowerCase(),
    verified: false,
  };

  writeJson(VERIFICATION_KEY, verification);
  return verification;
};

export const getVerification = () => readJson(VERIFICATION_KEY, null);

export const saveVerification = (verification) => {
  writeJson(VERIFICATION_KEY, verification);
  return verification;
};

export const getLocalProducts = () => readJson(LOCAL_PRODUCTS_KEY, []);

export const saveLocalProduct = (product) => {
  const products = getLocalProducts();
  const id = product._id || product.id || `local-${Date.now()}`;
  const nextProduct = { ...product, _id: id };
  const nextProducts = [
    nextProduct,
    ...products.filter((item) => (item._id || item.id) !== id),
  ];

  writeJson(LOCAL_PRODUCTS_KEY, nextProducts);
  return nextProduct;
};

export const removeLocalProduct = (id) => {
  const nextProducts = getLocalProducts().filter((product) => (product._id || product.id) !== id);
  writeJson(LOCAL_PRODUCTS_KEY, nextProducts);
  return nextProducts;
};

export const updateLocalProductStock = (id, stock) => {
  const products = getLocalProducts();
  const nextProducts = products.map((product) => (
    (product._id || product.id) === id ? { ...product, stock } : product
  ));

  writeJson(LOCAL_PRODUCTS_KEY, nextProducts);
  return nextProducts;
};
