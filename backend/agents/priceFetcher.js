const Groq = require('groq-sdk');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 1800 });
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function fetch({ country, stores, groceryList }) {
  stores = Array.isArray(stores) ? stores : (stores?.stores || []);

  const cacheKey = `prices_${country}_${stores.map(s=>s.name).join('_')}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const allItems = groceryList.flatMap(cat =>
    cat.items.map(item => ({ name: item.name, quantity: item.quantity }))
  );

  const prompt = `You are a grocery price estimation agent for ${country}.

Estimate realistic prices for these grocery items at these stores: ${stores.map(s => s.name).join(', ')}.

Items:
${allItems.map(i => `- ${i.name} (${i.quantity})`).join('\n')}

Return ONLY valid JSON, no markdown:
{
  "prices": {
    "Item name": {
      "StoreName1": 2.50,
      "StoreName2": 1.99
    }
  },
  "note": "Prices are estimates based on typical ${country} grocery store pricing",
  "fetchedAt": "${new Date().toISOString()}"
}

Use realistic local prices in the local currency. Budget stores (Aldi, Lidl) should be 20-30% cheaper than premium stores.`;

  const result = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 4096
  });

  const text = result.choices[0].message.content;
  const clean = text.replace(/```json|```/g, '').trim();
  const data = JSON.parse(clean);

  cache.set(cacheKey, data);
  return data;
}

module.exports = { fetch };