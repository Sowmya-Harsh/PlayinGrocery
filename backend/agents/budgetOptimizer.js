const Groq = require('groq-sdk');
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function optimize({ prices, groceryList, stores }) {

  const storesArray = Array.isArray(stores) ? stores : (stores?.stores || []);
  const storeNames = storesArray.map(s => s.name);
  const budgetStores = storesArray.filter(s => s.priceLevel === 'budget').map(s => s.name);
  const allItems = (groceryList || []).flatMap(c => c.items || []);
  const estimatedTotal = allItems.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);

  const prompt = `You are a student budget optimizer. Your job is to help someone spend as little as possible on groceries without sacrificing nutrition.

Available stores in their area: ${storeNames.join(', ')}
Budget-friendly stores: ${budgetStores.length > 0 ? budgetStores.join(', ') : 'find the cheapest options'}
Estimated grocery total: €${estimatedTotal.toFixed(2)}

Price data available:
${JSON.stringify(prices?.prices || {}, null, 2)}

Grocery list summary (${allItems.length} items):
${allItems.map(i => `- ${i.name}: ${i.quantity} (~€${i.estimatedPrice || '?'})`).join('\n')}

Return ONLY valid JSON, no markdown:
{
  "bestSingleStore": {
    "store": "store name",
    "reason": "short reason why",
    "estimatedTotal": 0.00
  },
  "smartSplit": [
    {
      "store": "store name",
      "buyHere": ["item1", "item2"],
      "reason": "cheapest for these",
      "subtotal": 0.00
    }
  ],
  "totalSmartSplit": 0.00,
  "savings": 0.00,
  "savingsPercent": 0,
  "storeRankings": [
    {
      "store": "store name",
      "estimatedTotal": 0.00,
      "priceLevel": "budget",
      "bestFor": "what to buy here"
    }
  ],
  "studentHacks": [
    {
      "hack": "Short tip title",
      "detail": "One sentence explanation with specific savings",
      "estimatedSaving": "€X/week"
    }
  ],
  "bulkBuyRecommendations": [
    {
      "item": "item name",
      "tip": "buy X amount instead of Y — saves Z",
      "saving": "€X"
    }
  ],
  "avoidWastetips": [
    "Use leftover rice from Tuesday for fried rice on Thursday",
    "Freeze bread before it goes stale"
  ],
  "topTips": [
    "Specific actionable tip 1",
    "Specific actionable tip 2",
    "Specific actionable tip 3"
  ]
}

Focus on practical student advice. Be specific with savings amounts. Always recommend budget stores (Aldi, Lidl or equivalents) first. If the user has a higher budget, still show them how to save — just frame it as smart spending rather than survival mode.`;

  const result = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 4096
  });
  const text = result.choices[0].message.content;
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

module.exports = { optimize };