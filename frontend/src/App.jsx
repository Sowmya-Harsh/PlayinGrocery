import React, { useState } from 'react'
import PreferencesForm from './components/PreferencesForm'
import AgentProgress from './components/AgentProgress'
import StoreList from './components/StoreList'
import MealPlan from './components/MealPlan'
import PriceComparison from './components/PriceComparison'
import { discoverStores, generatePlan, fetchPrices } from './utils/api'

const STEPS = { FORM: 'form', RUNNING: 'running', RESULTS: 'results' }

export default function App() {
  const [step, setStep] = useState(STEPS.FORM)
  const [agentStatus, setAgentStatus] = useState({})
  const [error, setError] = useState(null)
  const [results, setResults] = useState({ stores: null, plan: null, optimized: null, country: '' })

  const setAgent = (id, status) => setAgentStatus(prev => ({ ...prev, [id]: status }))

  const handleSubmit = async (form) => {
    setError(null)
    setStep(STEPS.RUNNING)
    setAgentStatus({ stores: 'running', plan: 'idle', prices: 'idle', optimizer: 'idle' })

    try {
      const storeData = await discoverStores(form.country)
      setAgent('stores', 'done'); setAgent('plan', 'running')

      const planData = await generatePlan(form.country, storeData.stores, {
        diet: form.diet, servings: form.servings, budget: form.budget,
        allergies: form.allergies, planType: form.planType
      })
      setAgent('plan', 'done'); setAgent('prices', 'running')

      const priceData = await fetchPrices(form.country, storeData.stores, planData.plan.groceryList)
      setAgent('prices', 'done'); setAgent('optimizer', 'done')

      setResults({ stores: storeData.stores, plan: planData.plan, optimized: priceData.optimized, country: form.country })
      setStep(STEPS.RESULTS)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong')
      const running = Object.entries(agentStatus).find(([,v]) => v === 'running')?.[0]
      if (running) setAgent(running, 'error')
    }
  }

  const reset = () => {
    setStep(STEPS.FORM)
    setAgentStatus({})
    setError(null)
    setResults({ stores: null, plan: null, optimized: null, country: '' })
  }

  return (
    <>
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-icon">🛒</div>
          <div>
            <h1>PlayinGrocery</h1>
            <span>Groceries made easy</span>
          </div>
        </div>
        {step === STEPS.RESULTS && (
          <button className="btn-outline" onClick={reset}>← New plan</button>
        )}
      </header>

      <div className="main">

        {step === STEPS.FORM && (
          <>
            <div className="hero">
              <div className="hero-badge"> AI-powered grocery planning</div>
              <h2>Plan your groceries, anywhere</h2>
              <p>Enter your country and preferences — our AI agents find local stores, build your meal plan, and optimize your budget.</p>
            </div>
            <div className="form-wrap">
              <PreferencesForm onSubmit={handleSubmit} />
            </div>
          </>
        )}

        {step === STEPS.RUNNING && (
          <div style={{ maxWidth: 520, margin: '3rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>Your agents are working...</h2>
              <p style={{ color: 'var(--slate-500)', fontSize: 14 }}>This takes about 15–30 seconds</p>
            </div>
            <div className="card">
              <AgentProgress statuses={agentStatus} />
            </div>
            {error && (
              <div className="error-box">
                {error}
                <br />
                <button onClick={reset} style={{ marginTop: 8, color: 'var(--red)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {step === STEPS.RESULTS && (
          <>
            <div className="country-banner">
              <div>
                <p style={{ opacity: 0.7, fontSize: 13 }}>Plan generated for</p>
                <h2>{results.country}</h2>
                <p>{results.stores?.length} stores found · {results.plan?.planType} plan</p>
              </div>
              <div className="country-banner-emoji">🌍</div>
            </div>

            <div className="results-grid">
              <div className="results-left">
                <StoreList stores={results.stores} />
                <MealPlan plan={results.plan} />
              </div>
              <div className="results-right">
                <PriceComparison optimized={results.optimized} stores={results.stores} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}