const express = require('express');
const router = express.Router();

// Simulasi database
const products = [
  { id: 1, name: 'Laptop', price: 12000000 },
  { id: 2, name: 'Smartphone', price: 5000000 },
  { id: 3, name: 'Tablet', price: 3500000 }
];

// GET all products
router.get('/products', (req, res) => {
  // Simulasi database delay
  setTimeout(() => {
    res.json(products);
  }, 100);
});

// GET product by ID
router.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ error: 'Product tidak ditemukan' });
  }
  
  // Simulasi database delay
  setTimeout(() => {
    res.json(product);
  }, 50);
});

// POST new product
router.post('/products', (req, res) => {
  const { name, price } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Nama dan harga product diperlukan' });
  }
  
  const newProduct = {
    id: products.length + 1,
    name,
    price: parseFloat(price)
  };
  
  products.push(newProduct);
  
  // Simulasi database write delay
  setTimeout(() => {
    res.status(201).json(newProduct);
  }, 150);
});

// DELETE product
router.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Product tidak ditemukan' });
  }
  
  const deletedProduct = products.splice(index, 1)[0];
  
  // Simulasi database delete delay
  setTimeout(() => {
    res.json({
      message: 'Product berhasil dihapus',
      deletedProduct
    });
  }, 120);
});

// Simulation of service dependencies - external API call
router.get('/external-service', async (req, res) => {
  try {
    // Simulate an external API call with random delay and occasional failures
    const delay = Math.floor(Math.random() * 500) + 200; // 200-700ms delay
    
    // 10% chance of failure
    if (Math.random() < 0.1) {
      throw new Error('External service temporarily unavailable');
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    res.json({
      success: true,
      data: {
        timestamp: new Date(),
        responseTime: `${delay}ms`
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;