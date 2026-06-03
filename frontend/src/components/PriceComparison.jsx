import React from 'react'

export default function PriceComparison({ optimized }) {
  if (!optimized) return null
  const { bestSingleStore, smartSplit, totalSmartSplit, savings, savingsPercent, storeRankings, studentHacks, bulkBuyRecommendations, avoidWasteTips, topTips } = optimized

  return (
    <>
      {/* Best store */}
      <div className="card">
        <div className="card-title">
          <div className="card-title-icon" style={{background:'var(--blue-light)'}}>💰</div>
          Budget breakdown
        </div>

        {bestSingleStore && (
          <div className="budget-highlight">
            <div>
              <div className="budget-highlight-label">Best single store</div>
              <div className="budget-highlight-store">{bestSingleStore.store}</div>
              <div className="budget-highlight-reason">{bestSingleStore.reason}</div>
            </div>
            <div className="budget-highlight-amount">
              <span>Est. total</span>
              <strong>€{bestSingleStore.estimatedTotal?.toFixed(2)}</strong>
            </div>
          </div>
        )}

        {smartSplit?.length>0 && (
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <span style={{fontSize:13,fontWeight:600,color:'var(--slate-700)'}}>Smart store split</span>
              {savings>0 && <span className="badge badge-green">Save €{savings?.toFixed(2)} ({savingsPercent}%)</span>}
            </div>
            {smartSplit.map((s,i)=>(
              <div key={i} className="split-row">
                <div className="split-row-header">
                  <span className="split-store">{s.store}</span>
                  <span className="split-amount">€{s.subtotal?.toFixed(2)}</span>
                </div>
                <div className="split-reason">{s.reason}</div>
                {s.buyHere?.length>0 && (
                  <div className="split-tags">
                    {s.buyHere.slice(0,4).map((item,j)=><span key={j} className="split-tag">{item}</span>)}
                    {s.buyHere.length>4 && <span style={{fontSize:11,color:'var(--slate-400)'}}>+{s.buyHere.length-4} more</span>}
                  </div>
                )}
              </div>
            ))}
            {totalSmartSplit>0 && (
              <div style={{display:'flex',justifyContent:'space-between',paddingTop:12,borderTop:'1px solid var(--slate-100)',marginTop:8}}>
                <span style={{fontSize:13,fontWeight:500,color:'var(--slate-600)'}}>Total (smart split)</span>
                <span style={{fontSize:15,fontWeight:700}}>€{totalSmartSplit?.toFixed(2)}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Student hacks */}
      {studentHacks?.length>0 && (
        <div className="card">
          <div className="card-title">
            <div className="card-title-icon" style={{background:'var(--amber-light)'}}>🎓</div>
            Student money hacks
          </div>
          {studentHacks.map((hack,i)=>(
            <div key={i} className="hack-row">
              <div className="hack-num">{i+1}</div>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                  <span className="hack-title">{hack.hack}</span>
                  {hack.estimatedSaving && <span className="badge badge-green">{hack.estimatedSaving}</span>}
                </div>
                <div className="hack-detail">{hack.detail}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bulk buy */}
      {bulkBuyRecommendations?.length>0 && (
        <div className="card">
          <div className="card-title">
            <div className="card-title-icon" style={{background:'var(--green-light)'}}>📦</div>
            Buy in bulk & save
          </div>
          {bulkBuyRecommendations.map((rec,i)=>(
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'8px 0',borderBottom:'1px solid var(--slate-100)'}}>
              <span style={{fontSize:16}}>📦</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500,color:'var(--slate-800)'}}>{rec.item}</div>
                <div style={{fontSize:12,color:'var(--slate-400)'}}>{rec.tip}</div>
              </div>
              {rec.saving && <span style={{fontSize:12,fontWeight:600,color:'var(--green)',flexShrink:0}}>{rec.saving}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Avoid waste */}
      {avoidWasteTips?.length>0 && (
        <div className="card">
          <div className="card-title">
            <div className="card-title-icon" style={{background:'var(--blue-light)'}}>♻️</div>
            Avoid food waste
          </div>
          {avoidWasteTips.map((tip,i)=>(
            <div key={i} className="tip-item"><span style={{color:'var(--blue)',fontWeight:700}}>↻</span>{tip}</div>
          ))}
        </div>
      )}

      {/* Store rankings */}
      {storeRankings?.length>0 && (
        <div className="card">
          <div className="card-title">
            <div className="card-title-icon" style={{background:'var(--slate-100)'}}>🏆</div>
            Store price ranking
          </div>
          {storeRankings.map((store,i)=>(
            <div key={i} className="rank-row">
              <div className={`rank-num${i===0?' top':''}`}>{i+1}</div>
              <div className="rank-info">
                <div className="rank-store">{store.store}</div>
                <div className="rank-best">{store.bestFor}</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span className="rank-price">€{store.estimatedTotal?.toFixed(2)}</span>
                {i===0 && <span className="badge badge-green">cheapest</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      {topTips?.length>0 && (
        <div className="card">
          <div className="card-title">
            <div className="card-title-icon" style={{background:'var(--green-light)'}}>💡</div>
            Quick tips
          </div>
          {topTips.map((tip,i)=>(
            <div key={i} className="tip-item"><span className="tip-dot">✓</span>{tip}</div>
          ))}
        </div>
      )}
    </>
  )
}