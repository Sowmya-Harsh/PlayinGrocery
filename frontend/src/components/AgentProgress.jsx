import React from 'react'

const AGENTS = [
  { id:'stores',    label:'Store discovery agent',   desc:'Finding grocery stores in your country' },
  { id:'plan',      label:'Meal planner agent',       desc:'Building your grocery & meal plan' },
  { id:'prices',    label:'Price fetcher agent',      desc:'Searching prices across stores' },
  { id:'optimizer', label:'Budget optimizer agent',   desc:'Finding the cheapest basket' }
]

export default function AgentProgress({ statuses }) {
  return (
    <div className="agent-list">
      {AGENTS.map(agent => {
        const status = statuses[agent.id] || 'idle'
        return (
          <div key={agent.id} className={`agent-row ${status}`}>
            <div className="agent-dot">
              {status === 'done'    && <span style={{color:'white',fontSize:14}}>✓</span>}
              {status === 'running' && <span className="spinner"></span>}
              {status === 'error'   && <span style={{color:'white',fontSize:14}}>✕</span>}
              {status === 'idle'    && <span style={{width:8,height:8,borderRadius:'50%',background:'var(--slate-400)',display:'block'}}></span>}
            </div>
            <div className="agent-info">
              <div className="agent-name">{agent.label}</div>
              <div className="agent-desc">{agent.desc}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}