module.exports = (db) => {
  // One User has one Seller record (store info)
  db.user.hasOne(db.sellerProfile, {
    foreignKey: "userId",
    as: "sellerInfo",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Seller belongs to one User
  db.sellerProfile.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 🔹 Category ↔ Subcategory (Self-referencing)
  db.category.hasMany(db.category, {
    foreignKey: "parentId",
    as: "subcategories",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  db.category.belongsTo(db.category, {
    foreignKey: "parentId",
    as: "parentCategory",
  });

  // 🔹 Category ↔ Product
  db.category.hasMany(db.product, {
    foreignKey: "categoryId",
    as: "products",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  db.product.belongsTo(db.category, {
    foreignKey: "categoryId",
    as: "category",
  });
  db.mainCategory.hasMany(db.product, {
    foreignKey: "mainCategoryId",
    as: "products",
    constraints: false,

    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  db.product.belongsTo(db.mainCategory, {
    foreignKey: "mainCategoryId",
    constraints: false,

    as: "mainCategory",
  });
  db.subCategory.hasMany(db.product, {
    foreignKey: "subCategoryId",
    as: "products",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  db.product.belongsTo(db.subCategory, {
    foreignKey: "subCategoryId",
    as: "subCategory",
    constraints: false,
  });

  // 🔹 Seller (User) ↔ Product
  db.user.hasMany(db.product, {
    foreignKey: "sellerId",
    as: "sellerProducts",
    onDelete: "SET NULL", // ⚠️ safer
    onUpdate: "CASCADE",
  });
  db.product.belongsTo(db.user, {
    foreignKey: "sellerId",
    as: "seller",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // 🔹 Admin (User) ↔ Product
  db.user.hasMany(db.product, {
    foreignKey: "adminId",
    as: "adminProducts",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  db.product.belongsTo(db.user, {
    foreignKey: "adminId",
    as: "admin",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // 🔹 Product ↔ Variant
  db.product.hasMany(db.variant, {
    foreignKey: "productId",
    as: "variants",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.variant.belongsTo(db.product, {
    foreignKey: "productId",
    as: "product",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 🔹 Wishlist
  db.wishlist.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.wishlist.belongsTo(db.product, {
    foreignKey: "productId",
    as: "product",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.user.hasMany(db.wishlist, {
    foreignKey: "userId",
    as: "wishlists",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.product.hasMany(db.wishlist, {
    foreignKey: "productId",
    as: "wishlistedBy",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 🔹 Cart
  db.cart.belongsTo(db.product, {
    foreignKey: "productId",
    as: "cartProduct",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.cart.belongsTo(db.variant, {
    foreignKey: "variantId",
    as: "variant",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.product.hasMany(db.cart, {
    foreignKey: "productId",
    as: "carts",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.variant.hasMany(db.cart, {
    foreignKey: "variantId",
    as: "carts",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 🔹 Review
  db.review.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.review.belongsTo(db.product, {
    foreignKey: "productId",
    as: "product",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.user.hasMany(db.review, {
    foreignKey: "userId",
    as: "reviews",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.product.hasMany(db.review, {
    foreignKey: "productId",
    as: "reviews",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 🔹 Inventory
  db.inventory.belongsTo(db.product, {
    foreignKey: "productId",
    as: "product",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.inventory.belongsTo(db.variant, {
    foreignKey: "variantId",
    as: "variant",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.inventory.belongsTo(db.user, {
    foreignKey: "sellerId",
    as: "seller",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.product.hasMany(db.inventory, {
    foreignKey: "productId",
    as: "inventories",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.variant.hasMany(db.inventory, {
    foreignKey: "variantId",
    as: "inventories",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.user.hasMany(db.inventory, {
    foreignKey: "sellerId",
    as: "inventories",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 🔹 Address ↔ User
  db.address.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.user.hasMany(db.address, {
    foreignKey: "userId",
    as: "addresses",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 🔹 User ↔ Order
  db.user.hasMany(db.order, {
    foreignKey: "userId",
    as: "orders",
    onDelete: "SET NULL", //  don't delete orders
    onUpdate: "CASCADE",
  });
  db.order.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // 🔹 Address ↔ Order
  db.address.hasMany(db.order, {
    foreignKey: "shippingAddressId",
    as: "orders",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.order.belongsTo(db.address, {
    foreignKey: "shippingAddressId",
    as: "shippingAddress",
    onDelete: "SET NULL",
  });

  // 🔹 Order ↔ OrderItem
  db.order.hasMany(db.orderitem, {
    foreignKey: "orderId",
    as: "items",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.orderitem.belongsTo(db.order, {
    foreignKey: "orderId",
    as: "order",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 🔹 Product ↔ OrderItem
  db.product.hasMany(db.orderitem, {
    foreignKey: "productId",
    as: "orderItems",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.orderitem.belongsTo(db.product, {
    foreignKey: "productId",
    as: "product",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 🔹 Variant ↔ OrderItem
  db.orderitem.belongsTo(db.product, {
    foreignKey: "productId",
    as: "orderedProduct", // ✅ changed alias
    onDelete: "SET NULL", // ⚠️ safer
    onUpdate: "CASCADE",
  });
  db.orderitem.belongsTo(db.variant, {
    foreignKey: "variantId",
    as: "variant",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // 1. User - SupportTicket (One-to-Many)
  db.user.hasMany(db.supportTicket, {
    foreignKey: "userId",
    as: "supportTickets",
    onDelete: "SET NULL", // don't delete tickets if user is deleted
    onUpdate: "CASCADE",
  });

  db.supportTicket.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // 2. SupportTicket - SupportTicketReply (One-to-Many)
  db.supportTicket.hasMany(db.supportTicketReply, {
    foreignKey: "ticketId",
    as: "replies",
    onDelete: "CASCADE", // delete replies if ticket is deleted
    onUpdate: "CASCADE",
  });

  db.supportTicketReply.belongsTo(db.supportTicket, {
    foreignKey: "ticketId",
    as: "ticket",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  db.user.hasMany(db.suborder, {
    foreignKey: "sellerId",
    as: "payments",
  });

  db.suborder.belongsTo(db.user, {
    foreignKey: "sellerId",
    as: "seller",
  });

  // Order - SubOrder
  db.order.hasMany(db.suborder, {
    foreignKey: "orderId",
    as: "suborders",
    onDelete: "CASCADE",
  });
  db.suborder.belongsTo(db.order, {
    foreignKey: "orderId",
    as: "order",
  });

  // SubOrder - OrderItem
  db.suborder.hasMany(db.orderitem, {
    foreignKey: "subOrderId",
    as: "items",
    onDelete: "CASCADE",
  });
  db.orderitem.belongsTo(db.suborder, {
    foreignKey: "subOrderId",
    as: "suborder",
  });
  // In your association file or model setup

  db.user.hasMany(db.customerRating, {
    foreignKey: "userId",
    as: "ratings", // user.ratings
  });

  db.customerRating.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user", // customerRating.user
  });

  // MainCategory → Category
  db.mainCategory.hasMany(db.category, {
    foreignKey: "mainCategoryId",
    as: "categories", // mainCategory.categories
  });

  db.category.belongsTo(db.mainCategory, {
    foreignKey: "mainCategoryId",
    as: "mainCategory", // category.mainCategory
  });

  // Category → SubCategory
  db.category.hasMany(db.subCategory, {
    foreignKey: "categoryId",
    as: "subCategories", // category.subCategories
  });

  db.subCategory.belongsTo(db.category, {
    foreignKey: "categoryId",
    as: "category", // subCategory.category
  });

  // Product ↔ OrderCustomisation
  db.product.hasMany(db.orderCustomisation, {
    foreignKey: "productId",
    as: "customisations",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  db.orderCustomisation.belongsTo(db.product, {
    foreignKey: "productId",
    as: "product",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Order ↔ OrderCustomisation
  db.order.hasMany(db.orderCustomisation, {
    foreignKey: "orderId",
    as: "customisations",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  db.orderCustomisation.belongsTo(db.order, {
    foreignKey: "orderId",
    as: "order",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  // OrderItem ↔ OrderCustomisation
  db.orderitem.hasMany(db.orderCustomisation, {
    foreignKey: "productId",
    sourceKey: "productId",
    as: "customisations",
  });
  db.orderCustomisation.belongsTo(db.orderitem, {
    foreignKey: "productId",
    targetKey: "productId",
    as: "orderItem",
  });
  db.faq.belongsTo(db.product, {
    foreignKey: "productId",
    as: "product",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  db.faq.belongsTo(db.variant, {
    foreignKey: "variantId",
    as: "variant",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  // One cashbackRule has many cashbacks
  db.cashbackRule.hasMany(db.cashback, {
    foreignKey: "cashbackRuleId",
    as: "cashbacks",
  });

  // Each cashback belongs to one cashbackRule
  db.cashback.belongsTo(db.cashbackRule, {
    foreignKey: "cashbackRuleId",
    as: "cashbackRule",
  });
};
