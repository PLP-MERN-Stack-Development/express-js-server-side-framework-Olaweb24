// controllers/productController.js
const products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Get all products (with filter + pagination)
exports.getProducts = (req, res) => {
  let filtered = products;

  // Filter by category
  if (req.query.category) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginated = filtered.slice(startIndex, endIndex);

  res.json({
    page,
    totalProducts: filtered.length,
    products: paginated,
  });
};

// Search products by name
exports.searchProducts = (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: "Please provide a name to search" });
  }

  const results = products.filter((p) =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );

  res.json(results);
};

// Get stats
exports.getStats = (req, res) => {
  const stats = {};
  products.forEach((product) => {
    stats[product.category] = (stats[product.category] || 0) + 1;
  });

  res.json({ totalProducts: products.length, stats });
};
