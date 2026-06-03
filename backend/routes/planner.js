const express = require('express');
const router = express.Router();
const storeDiscoveryAgent = require('../agents/storeDiscovery');
const mealPlannerAgent = require('../agents/mealPlanner');
const priceFetcherAgent = require('../agents/priceFetcher');
const budgetOptimizerAgent = require('../agents/budgetOptimizer');

// POST /api/discover-stores
// Body: { country: "Luxembourg" }
router.post('/discover-stores', async (req, res) => {
  try {
    const { country } = req.body;
    if (!country) return res.status(400).json({ error: 'Country is required' });

    const stores = await storeDiscoveryAgent.discover(country);
    res.json({ success: true, stores });
  } catch (err) {
    console.error('Store discovery error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/generate-plan
// Body: { country, stores, preferences: { diet, servings, budget, allergies, planType } }
router.post('/generate-plan', async (req, res) => {
  try {
    const { country, stores, preferences } = req.body;
    if (!country || !preferences) {
      return res.status(400).json({ error: 'country and preferences are required' });
    }

    // Agent 3: Generate meal plan and grocery list
    console.log('Running meal planner agent...');
    const plan = await mealPlannerAgent.generate({ country, preferences });

    res.json({ success: true, plan });
  } catch (err) {
    console.error('Plan generation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/fetch-prices
// Body: { country, stores, groceryList: [...items] }
router.post('/fetch-prices', async (req, res) => {
  try {
    const { country, stores, groceryList } = req.body;
    if (!country || !groceryList) {
      return res.status(400).json({ error: 'country and groceryList are required' });
    }

    // Agent 2: Fetch prices from stores
    console.log('Running price fetcher agent...');
    const storesArray = Array.isArray(stores) ? stores : (stores?.stores || []);
    const prices = await priceFetcherAgent.fetch({ country, stores: storesArray, groceryList });

    // Agent 4: Optimize budget
    console.log('Running budget optimizer agent...');
    const optimized = await budgetOptimizerAgent.optimize({ prices, groceryList, stores: storesArray });

    res.json({ success: true, prices, optimized });
  } catch (err) {
    console.error('Price fetch error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
