import dayjs from "dayjs";

// Convert string to uppercase short form
export const slug = (str, len) =>
  (str || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, len)
    .toUpperCase();

// Product SKU: BRD-TIT-YYYYMMDDHHmmss
export const generateProductSku = ({ brand, title }) =>
  `${slug(brand, 3)}-${slug(title, 3)}-${dayjs().format("YYYYMMDDHHmmss")}`;

// Variant SKU: PRODUCTSKU-CLSZST
export const generateVariantSku = (productSku, { color, size, storage }) =>
  `${productSku}-${slug(color, 2)}${slug(size, 2)}${slug(storage, 1)}`;
