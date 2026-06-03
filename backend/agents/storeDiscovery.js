const Groq = require('groq-sdk');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600 }); // cache 1 hour

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function discover(country) {
  const cacheKey = `stores_${country.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`Cache hit for stores in ${country}`);
    return cached;
  }

  const prompt = `You are a store discovery agent. Your task is to list the major grocery/supermarket chains available in ${country}.

Return ONLY a valid JSON object, no markdown, no explanation. Format:
{
  "country": "${country}",
  "stores": [
    {
      "name": "Store Name",
      "website": "https://www.storewebsite.com",
      "type": "supermarket" | "discount" | "hypermarket" | "convenience",
      "priceLevel": "budget" | "mid" | "premium",
      "hasOnlineShop": true | false,
      "searchUrl": "https://www.storewebsite.com/search?q="
    }
  ],
  "currency": "EUR",
  "currencySymbol": "€"
}

Include only real, well-known chains that genuinely operate in ${country}. List 4-8 stores maximum.`;

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

module.exports = { discover };
