const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

let statsCache = null;
let lastModified = null;
const CACHE_DURATION = 5 * 60 * 1000;

async function isCacheValid() {
  if (!statsCache || !lastModified) return false;

  try {
    const stats = await fs.stat(DATA_PATH);
    const fileModified = stats.mtime.getTime();

    return fileModified <= lastModified &&
      (Date.now() - lastModified) < CACHE_DURATION;
  } catch (err) {
    return false;
  }
}

async function calculateStats() {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  const items = JSON.parse(raw);

  const stats = {
    total: items.length,
    averagePrice: items.length > 0 ?
      items.reduce((acc, cur) => acc + (cur.price || 0), 0) / items.length : 0,
    priceRange: items.length > 0 ? {
      min: Math.min(...items.map(item => item.price || 0)),
      max: Math.max(...items.map(item => item.price || 0))
    } : { min: 0, max: 0 },
    lastUpdated: new Date().toISOString()
  };

  return stats;
}

router.get('/', async (req, res, next) => {
  try {
    const cacheValid = await isCacheValid();

    if (!cacheValid) {
      statsCache = await calculateStats();
      lastModified = Date.now();
    }

    res.json(statsCache);
  } catch (err) {
    next(err);
  }
});

module.exports = router;