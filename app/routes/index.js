const express = require('express');
const router = express.Router();

// Home route
router.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di Demo APM Elastic' });
});

// Route untuk simulasi latency
router.get('/slow', async (req, res) => {
  // Simulasi request yang lambat
  await new Promise(resolve => setTimeout(resolve, 2000));
  res.json({ message: 'Route lambat berhasil dijalankan' });
});

// Route untuk simulasi error
router.get('/error', (req, res) => {
  throw new Error('Ini adalah error yang disengaja untuk testing');
});

// CPU intensive route
router.get('/cpu-intensive', (req, res) => {
  const start = Date.now();
  
  // Operasi CPU-intensive
  let counter = 0;
  for (let i = 0; i < 10000000; i++) {
    counter += i;
  }
  
  const duration = Date.now() - start;
  res.json({ 
    message: 'Operasi CPU intensive selesai', 
    duration: `${duration}ms`,
    result: counter
  });
});

// Memory intensive route
router.get('/memory-intensive', (req, res) => {
  const arr = [];
  // Alokasi memori besar
  for (let i = 0; i < 1000000; i++) {
    arr.push({ index: i, data: 'some data string to take up memory' });
  }
  
  res.json({ 
    message: 'Operasi memory intensive selesai', 
    arrayLength: arr.length 
  });
});

module.exports = router;