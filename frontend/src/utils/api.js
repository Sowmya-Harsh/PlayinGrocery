import axios from 'axios'

// const api = axios.create({
//   baseURL: '/api',
//   timeout: 60000
// })

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  timeout: 60000
})

export const discoverStores = (country) =>
  api.post('/discover-stores', { country }).then(r => r.data)

export const generatePlan = (country, stores, preferences) =>
  api.post('/generate-plan', { country, stores, preferences }).then(r => r.data)

export const fetchPrices = (country, stores, groceryList) =>
  api.post('/fetch-prices', { country, stores, groceryList }).then(r => r.data)
