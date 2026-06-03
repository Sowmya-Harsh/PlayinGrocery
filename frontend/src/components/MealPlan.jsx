import React, { useState } from 'react'

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const CAT_COLORS = {
  'Produce':'var(--green)','Proteins':'var(--red)','Dairy & Eggs':'var(--amber)',
  'Grains & Pasta':'var(--amber)','Pantry':'var(--slate-500)','Frozen':'var(--blue)','Beverages':'var(--purple)'
}
const CAT_BG = {
  'Produce':'var(--green-light)','Proteins':'var(--red-light)','Dairy & Eggs':'var(--amber-light)',
  'Grains & Pasta':'var(--amber-light)','Pantry':'var(--slate-100)','Frozen':'var(--blue-light)','Beverages':'var(--purple-light)'
}

export default function MealPlan({ plan }) {
  const [view, setView] = useState('meals')
  const [checked, setChecked] = useState({})

  if (!plan) return null

  const toggle = k => setChecked(p=>({...p,[k]:!p[k]}))
  const allItems = (plan.groceryList||[]).flatMap(c=>c.items)
  const checkedCount = Object.values(checked).filter(Boolean).length
  const meals = (plan.meals||[]).slice(0,7)

  return (
    <div className="card">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:15,fontWeight:600}}>Your {plan.planType} plan</span>
            {plan.isStudentMode && <span className="badge badge-amber">student mode</span>}
          </div>
          <div style={{fontSize:12,color:'var(--slate-400)',marginTop:2}}>
            {plan.estimatedWeeklyBudget}/week · {plan.servings} serving(s)
          </div>
        </div>
        <div className="tabs" style={{marginBottom:0,width:'auto'}}>
          {['meals','grocery','prep'].map(v=>(
            <button key={v} className={`tab${view===v?' active':''}`} onClick={()=>setView(v)} style={{padding:'6px 10px',fontSize:12}}>
              {v.charAt(0).toUpperCase()+v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {view==='meals' && (
        <>
          <div className="meal-grid">
            {meals.map((meal,i)=>(
              <div key={i}>
                <div className="meal-day-label">{DAYS[i]}</div>
                <div className="meal-card">
                  <div className="meal-slot-label">Breakfast</div>
                  <div className="meal-slot-value">{meal.breakfast}</div>
                  <div className="meal-slot-label">Lunch</div>
                  <div className="meal-slot-value">{meal.lunch}</div>
                  <div className="meal-slot-label">Dinner</div>
                  <div className="meal-slot-value">{meal.dinner}</div>
                  <div className="meal-footer">
                    <span>{meal.kcal} kcal</span>
                    {meal.cookTime && <span>{meal.cookTime}m</span>}
                  </div>
                  {meal.batchCookTip && <div className="batch-tip">♻ {meal.batchCookTip}</div>}
                </div>
              </div>
            ))}
          </div>
          {plan.planType==='monthly' && (
            <p style={{fontSize:12,color:'var(--slate-400)',textAlign:'center',marginTop:12}}>Showing week 1 of 4</p>
          )}
        </>
      )}

      {view==='grocery' && (
        <>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--slate-500)',marginBottom:8}}>
            <span>{checkedCount} of {allItems.length} items checked</span>
            <button onClick={()=>setChecked({})} style={{background:'none',border:'none',cursor:'pointer',color:'var(--slate-400)',fontSize:12}}>Clear all</button>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{width:`${allItems.length>0?(checkedCount/allItems.length)*100:0}%`}}/>
          </div>
          {(plan.groceryList||[]).map((cat,ci)=>(
            <div key={ci}>
              <div className="grocery-category-label" style={{color:CAT_COLORS[cat.category]||'var(--slate-500)'}}>
                <span style={{background:CAT_BG[cat.category]||'var(--slate-100)',padding:'2px 10px',borderRadius:20}}>
                  {cat.category}
                </span>
              </div>
              {cat.items.map((item,ii)=>{
                const key=`${ci}-${ii}`
                return (
                  <label key={ii} className={`grocery-item${checked[key]?' checked':''}`}>
                    <input type="checkbox" checked={!!checked[key]} onChange={()=>toggle(key)} />
                    <span className="grocery-item-name">{item.name}</span>
                    <span className="grocery-item-qty">{item.quantity}</span>
                    <span className="grocery-item-price">{item.estimatedPrice?`€${item.estimatedPrice.toFixed(2)}`:''}</span>
                  </label>
                )
              })}
              {cat.items.filter(i=>i.bulkBuyTip).map((item,j)=>(
                <div key={j} className="bulk-tip">💡 <span><strong>{item.name}:</strong> {item.bulkBuyTip}</span></div>
              ))}
            </div>
          ))}
        </>
      )}

      {view==='prep' && (
        <>
          {plan.mealPrepPlan ? (
            <div className="prep-card">
              <div className="prep-header">
                <span className="prep-title">☀️ Sunday prep tasks</span>
                <span className="prep-time">{plan.mealPrepPlan.estimatedPrepTime}</span>
              </div>
              {(plan.mealPrepPlan.sundayPrepTasks||[]).map((task,i)=>(
                <div key={i} className="prep-item"><span>•</span>{task}</div>
              ))}
            </div>
          ) : (
            <p style={{fontSize:13,color:'var(--slate-400)',textAlign:'center',padding:'1rem 0'}}>
              Use a lower budget to activate student mode with meal prep tips.
            </p>
          )}
          {plan.cheapProteinTips?.length>0 && (
            <>
              <div style={{fontWeight:600,fontSize:13,marginBottom:8,color:'var(--slate-700)'}}>⚡ Cheap protein sources</div>
              {plan.cheapProteinTips.map((tip,i)=>(
                <div key={i} className="tip-item"><span className="tip-dot">⚡</span>{tip}</div>
              ))}
            </>
          )}
        </>
      )}

      {plan.tips?.length>0 && (
        <div style={{marginTop:'1rem',paddingTop:'1rem',borderTop:'1px solid var(--slate-100)'}}>
          <div style={{fontSize:12,fontWeight:600,color:'var(--slate-400)',marginBottom:6}}>Shopping tips</div>
          {plan.tips.map((tip,i)=>(
            <div key={i} className="tip-item"><span className="tip-dot">•</span>{tip}</div>
          ))}
        </div>
      )}
    </div>
  )
}