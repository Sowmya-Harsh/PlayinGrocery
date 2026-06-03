const Groq = require('groq-sdk');
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generate({ country, preferences }) {
  const { diet, servings, budget, allergies, planType } = preferences;
  const days = planType === 'monthly' ? 30 : 7;
  // Detect if this is a tight budget to trigger student mode
  const budgetValue = parseBudget(budget);
  const isStudentBudget = budgetValue < 80;

  const studentRules = isStudentBudget ? `
STUDENT BUDGET RULES (budget is tight — apply all of these):
- Max 5 ingredients per meal
- Max 30 minutes cooking time per meal
- Reuse ingredients across multiple meals to avoid waste (e.g. if you buy a cabbage on Monday, use it again Wednesday)
- Prioritize cheap proteins: eggs, canned tuna, canned chickpeas, lentils, chicken thighs, frozen fish
- Suggest batch cooking: if a meal can be doubled and eaten next day, note it
- No fancy or hard-to-find ingredients
- Breakfast should be under 5 minutes (oats, toast, yogurt, eggs)
- At least 2 vegetarian dinners per week to cut costs
- Prefer seasonal vegetables which are cheaper
` : `
GENERAL RULES:
- Keep meals practical and not overly complex
- Balance nutrition across the week
- Mix proteins: meat, fish, legumes, eggs
- Include some quick meals (under 30 min) for busy days
`;

  const prompt = `You are a smart meal planner for ${country}. The user has a ${budget} weekly budget for ${servings} person(s).

${studentRules}

Diet: ${diet}
Allergies/avoid: ${allergies || 'none'}
Plan duration: ${days} days
Servings: ${servings}

Return ONLY valid JSON, no markdown, no explanation:

{
  "planType": "${planType}",
  "days": ${days},
  "servings": ${servings},
  "isStudentMode": ${isStudentBudget},
  "estimatedWeeklyBudget": "€X - €Y",
  "estimatedWeeklyCost": 0.00,
  "meals": [
    {
      "day": 1,
      "breakfast": "meal name",
      "lunch": "meal name",
      "dinner": "meal name",
      "kcal": 2000,
      "cookTime": 20,
      "batchCookTip": "optional tip like: make double, eat tomorrow"
    }
  ],
  "groceryList": [
    {
      "category": "Produce",
      "items": [
        {
          "name": "Chicken thighs",
          "quantity": "1 kg",
          "estimatedPrice": 4.50,
          "usedInMeals": ["Monday dinner", "Wednesday lunch"],
          "bulkBuyTip": "buy 2kg — freeze half, save 30%",
          "essential": true
        }
      ]
    }
  ],
  "mealPrepPlan": {
    "sundayPrepTasks": [
      "Cook a big pot of rice — use across 3 meals",
      "Hard boil 6 eggs — ready for breakfast and lunch",
      "Chop all vegetables at once to save time"
    ],
    "estimatedPrepTime": "45 minutes"
  },
  "cheapProteinTips": [
    "Eggs are the cheapest complete protein — aim for 1-2 per day",
    "Canned tuna costs €0.80 and has 25g protein"
  ],
  "tips": [
    "Shop at Aldi or Lidl for 30-40% cheaper produce",
    "Buy frozen vegetables — same nutrition, half the price",
    "Check store markdowns after 6pm for discounted meat"
  ]
}

Categories must be one of: Produce, Proteins, Dairy & Eggs, Grains & Pasta, Pantry, Frozen, Beverages.
Keep grocery item names simple and generic (not brand-specific).
For monthly plans, return 30 days of meals but multiply grocery quantities by ~4.`;

  const result = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 4096
  });
  const text = result.choices[0].message.content;
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

function parseBudget(budgetStr) {
  // Extract the lower bound number from strings like "€30–€60" or "Under €30"
  const match = budgetStr.match(/\d+/);
  return match ? parseInt(match[0]) : 100;
}

module.exports = { generate };