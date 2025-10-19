// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  getProducts,
  searchProducts,
  getStats
} = require("../controllers/productController");

// GET all products (with filter + pagination)
router.get("/", getProducts);

// Search products
router.get("/search", searchProducts);

// Product statistics
router.get("/stats", getStats);

module.exports = router;
