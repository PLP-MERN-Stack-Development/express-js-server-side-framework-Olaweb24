// server.js - Starter Express server for Week 2 assignment

// Import required modules
const dotenv = require('dotenv');
const { NotFoundError, ValidationError } = require("./errors/customErrors");
const errorHandler = require("./middleware/errorHandler");
const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require("./routes/productRoutes");
const { v4: uuidv4 } = require('uuid');
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
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

// Root route

app.use("/api/products", productRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// GET /api/products/:id - Get a specific product

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Product can't be found" });
  }
  res.json(product);
});

// POST /api/products - Create a new product

app.post("/api/products", (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  // Validate input
  if (!name || !price || !category) {
    return res.status(400).json({ message: "Name, price, and category are required" });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price,
    category,
    inStock: inStock ?? true, // default to true if not provided
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - Update a product

app.put("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
  return next(new NotFoundError("Product not found"));
}


  const { name, description, price, category, inStock } = req.body;
  
  // Update fields if provided
  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;
  if (category) product.category = category;
  if (inStock !== undefined) product.inStock = inStock;

  res.json(product);
});

// DELETE /api/products/:id - Delete a product

app.delete("/api/products/:id", (req, res) => {
  const productIndex = products.findIndex((p) => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deleted = products.splice(productIndex, 1);
  res.json({ message: "Product deleted", deleted });
});

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// TODO: Implement custom middleware for:
// - Request logging

const logger = (req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
};

// - Authentication

const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const validKey = "mySecretkey123"; 

  if (apiKey !== validKey) {
    return res.status(401).json({ message: "Unauthorized: Invalid or missing API key" });
  }
  next();
};


// - Error handling

const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  // For POST: ensure required fields
  if (req.method === "POST") {
   if (!name || !price || !category) {
  return next(new ValidationError("Name, price, and category are required"));
}

  }

  // For PUT
  if (price && typeof price !== "number") {
    return res.status(400).json({ message: "Price must be a number" });
  }
  if (inStock !== undefined && typeof inStock !== "boolean") {
    return res.status(400).json({ message: "inStock must be a boolean" });
  }

  next();
};


// Start the server
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 