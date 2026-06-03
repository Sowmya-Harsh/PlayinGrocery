import React from 'react'

const PRICE_BADGE = { budget:'badge-green', mid:'badge-blue', premium:'badge-purple' }
const TYPE_ICON = { supermarket:'🏪', discount:'💰', hypermarket:'🏬', convenience:'🏮' }

export default function StoreList({ stores }) {
  if (!stores?.length) return null
  return (
    <div className="card">
      <div className="card-title">
        <div className="card-title-icon" style={{background:'var(--blue-light)'}}>🏪</div>
        Stores in your area
        <span className="badge badge-blue" style={{marginLeft:'auto'}}>{stores.length} found</span>
      </div>
      <div className="store-grid">
        {stores.map((store,i) => (
          <div key={i} className="store-card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
              <div className="store-name">{store.name}</div>
              <span style={{fontSize:16}}>{TYPE_ICON[store.type]||'🏪'}</span>
            </div>
            <div className="store-tags">
              <span className={`badge ${PRICE_BADGE[store.priceLevel]||'badge-blue'}`}>{store.priceLevel}</span>
              {store.hasOnlineShop && <span className="badge" style={{background:'var(--slate-100)',color:'var(--slate-600)'}}>online</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}