import React, { useState } from 'react'

const DIETS = ['Balanced','Vegetarian','Vegan','Low-carb','Mediterranean','High-protein','Gluten-free']
const BUDGETS = ['Under €30','€30–€60','€60–€100','€100–€150','€150+']

export default function PreferencesForm({ onSubmit }) {
  const [form, setForm] = useState({ country:'', diet:'Balanced', servings:2, budget:'€30–€60', allergies:'', planType:'weekly' })
  const [loading, setLoading] = useState(false)
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.country.trim()) return alert('Please enter a country')
    setLoading(true)
    await onSubmit(form)
    setLoading(false)
  }

  return (
    <div className="card">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Tell us about you</h2>
        <p style={{ fontSize: 13, color: 'var(--slate-500)' }}>We'll find stores near you and build your perfect grocery plan</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Your country</label>
          <input type="text" placeholder="e.g. Luxembourg, France, Germany..." value={form.country} onChange={e=>set('country',e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Plan duration</label>
          <div className="toggle-group">
            {['weekly','monthly'].map(t=>(
              <button key={t} type="button" className={`toggle-btn${form.planType===t?' active':''}`} onClick={()=>set('planType',t)}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Diet type</label>
          <select value={form.diet} onChange={e=>set('diet',e.target.value)}>
            {DIETS.map(d=><option key={d}>{d}</option>)}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Servings</label>
            <input type="number" min={1} max={10} value={form.servings} onChange={e=>set('servings',parseInt(e.target.value))} />
          </div>
          <div className="form-group">
            <label className="form-label">Weekly budget</label>
            <select value={form.budget} onChange={e=>set('budget',e.target.value)}>
              {BUDGETS.map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Allergies / avoid <span>(optional)</span></label>
          <input type="text" placeholder="e.g. nuts, gluten, dairy..." value={form.allergies} onChange={e=>set('allergies',e.target.value)} />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <><span className="spinner"></span> Finding stores...</> : '→ Find stores & build plan'}
        </button>
      </form>
    </div>
  )
}