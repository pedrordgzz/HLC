import { useState, useEffect } from 'react'
import { logsService, blocklistService } from '../services/api'

const RESULT_CONFIG = {
  success:            { label: 'Éxito',                   cls: 'badge-success' },
  blocked_disposable: { label: 'Desechable',              cls: 'badge-danger'  },
  blocked_format:     { label: 'Formato inválido',        cls: 'badge-warning' },
  blocked_mx:         { label: 'Sin registros MX',        cls: 'badge-warning' },
  blocked_domain:     { label: 'Dominio no permitido',    cls: 'badge-danger'  },
  blocked_custom:     { label: 'Bloqueado (custom)',      cls: 'badge-danger'  },
  blocked_global:     { label: 'Bloqueado (global)',      cls: 'badge-danger'  },
  blocked_premium:    { label: 'Tel. premium',            cls: 'badge-danger'  },
  duplicate:          { label: 'Duplicado',               cls: 'badge-info'    },
}

function Badge({ result }) {
  const cfg = RESULT_CONFIG[result] || { label: result, cls: 'badge-secondary' }
  return <span className={`log-badge ${cfg.cls}`}>{cfg.label}</span>
}

function StatCard({ title, value, subtitle, accent }) {
  return (
    <div className="stat-card" style={accent ? { borderColor: 'var(--accent-primary)' } : {}}>
      <div className="stat-value" style={accent ? { color: 'var(--accent-primary)' } : {}}>{value}</div>
      <div className="stat-title">{title}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  )
}

function BarChart({ byResult }) {
  const entries = Object.entries(byResult).sort((a, b) => b[1] - a[1])
  const maxVal = entries.length > 0 ? entries[0][1] : 1

  const colors = {
    success:            '#4ade80',
    blocked_disposable: '#f87171',
    blocked_format:     '#fbbf24',
    blocked_mx:         '#fb923c',
    blocked_domain:     '#f87171',
    blocked_custom:     '#ef4444',
    blocked_global:     '#dc2626',
    blocked_premium:    '#f87171',
    duplicate:          '#60a5fa',
  }

  return (
    <div className="chart-container">
      {entries.map(([result, count]) => (
        <div key={result} className="chart-row">
          <div className="chart-label">
            {RESULT_CONFIG[result]?.label || result}
          </div>
          <div className="chart-bar-wrap">
            <div
              className="chart-bar"
              style={{
                width: `${Math.max((count / maxVal) * 100, 2)}%`,
                background: colors[result] || '#94a3b8',
              }}
            />
          </div>
          <div className="chart-count">{count}</div>
        </div>
      ))}
      {entries.length === 0 && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
          Sin datos todavía. Prueba a registrar algunos correos.
        </p>
      )}
    </div>
  )
}

function BlocklistManager() {
  const [domains, setDomains] = useState([])
  const [newDomain, setNewDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const refresh = async () => {
    setLoading(true)
    const list = await blocklistService.list()
    setDomains(Array.isArray(list) ? list : [])
    setLoading(false)
  }

  useEffect(() => { refresh() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newDomain.trim()) return
    const result = await blocklistService.add(newDomain.trim())
    setMessage(result.message || (result.success ? 'Añadido' : 'Error'))
    setNewDomain('')
    await refresh()
    setTimeout(() => setMessage(null), 3000)
  }

  const handleRemove = async (domain) => {
    if (!confirm(`¿Eliminar el dominio "${domain}" de la lista negra?`)) return
    const result = await blocklistService.remove(domain)
    setMessage(result.message || 'Eliminado')
    await refresh()
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="dashboard-section">
      <h2 className="section-title">
        Gestión de Blocklist Global
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.7rem' }}>
          (inteligencia colectiva — se sincroniza con los microservicios cliente)
        </span>
      </h2>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="ejemplo: dominio-malicioso.com"
          value={newDomain}
          onChange={e => setNewDomain(e.target.value)}
          className="form-control"
          style={{ flex: 1, minWidth: '220px' }}
        />
        <button type="submit" className="btn btn-primary">Añadir dominio</button>
        <button type="button" className="btn btn-outline" onClick={refresh}>Recargar</button>
      </form>

      {message && (
        <p style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', marginBottom: '0.6rem' }}>{message}</p>
      )}

      <div className="logs-table-wrap">
        <table className="logs-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Dominio</th>
              <th style={{ textAlign: 'right' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>Cargando...</td></tr>
            ) : domains.length === 0 ? (
              <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>La lista negra está vacía.</td></tr>
            ) : (
              domains.map((d, i) => (
                <tr key={d}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{i + 1}</td>
                  <td style={{ fontFamily: 'monospace' }}>{d}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleRemove(d)}
                      className="btn btn-outline"
                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem' }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Dashboard() {
  const [fullStats, setFullStats]   = useState(null)
  const [listaStats, setListaStats] = useState(null)
  const [fullLogs, setFullLogs]     = useState([])
  const [listaLogs, setListaLogs]   = useState([])
  const [activeTab, setActiveTab]   = useState('full')
  const [activeType, setActiveType] = useState('all')  // all | email | phone
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchData = async () => {
    const type = activeType === 'all' ? null : activeType
    const [fs, ls, fl, ll] = await Promise.all([
      logsService.getStats('full', type),
      logsService.getStats('lista', type),
      logsService.getLogs('full', 200, type),
      logsService.getLogs('lista', 200, type),
    ])
    setFullStats(fs)
    setListaStats(ls)
    setFullLogs(Array.isArray(fl) ? fl : [])
    setListaLogs(Array.isArray(ll) ? ll : [])
    setLastUpdate(new Date().toLocaleTimeString('es-ES'))
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType])

  const currentStats = activeTab === 'full' ? fullStats : listaStats
  const currentLogs  = activeTab === 'full' ? fullLogs  : listaLogs

  const filteredLogs = currentLogs.filter(log => {
    const target = log.target || log.email || ''
    return (
      target.toLowerCase().includes(search.toLowerCase()) ||
      log.result?.toLowerCase().includes(search.toLowerCase()) ||
      log.ip?.includes(search)
    )
  })

  if (loading) {
    return (
      <div className="auth-wrapper">
        <p style={{ color: 'var(--text-muted)' }}>Cargando panel de control...</p>
      </div>
    )
  }

  const typeLabel = activeType === 'phone' ? 'Teléfonos' : activeType === 'email' ? 'Correos' : 'Total'

  return (
    <main className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>

      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Panel de Control</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Monitorización de intentos de validación en tiempo real
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <button className="btn btn-outline" onClick={fetchData} style={{ fontSize: '0.9rem' }}>
            Actualizar
          </button>
          {lastUpdate && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
              Última actualización: {lastUpdate}
            </p>
          )}
        </div>
      </div>

      {/* Selector de servicio */}
      <div className="tab-group">
        <button
          className={`tab-btn ${activeTab === 'full' ? 'active' : ''}`}
          onClick={() => setActiveTab('full')}
        >
          Validación Completa (MX + Disposable)
        </button>
        <button
          className={`tab-btn ${activeTab === 'lista' ? 'active' : ''}`}
          onClick={() => setActiveTab('lista')}
        >
          Lista Cerrada (Dominios)
        </button>
      </div>

      {/* Selector de tipo: email / phone / all */}
      <div className="tab-group" style={{ marginTop: '0.5rem' }}>
        <button
          className={`tab-btn ${activeType === 'all' ? 'active' : ''}`}
          onClick={() => setActiveType('all')}
        >
          Todo
        </button>
        <button
          className={`tab-btn ${activeType === 'email' ? 'active' : ''}`}
          onClick={() => setActiveType('email')}
        >
          Solo Correos
        </button>
        <button
          className={`tab-btn ${activeType === 'phone' ? 'active' : ''}`}
          onClick={() => setActiveType('phone')}
        >
          Solo Teléfonos
        </button>
      </div>

      {/* Tarjetas de estadísticas */}
      {currentStats && (
        <div className="stats-grid">
          <StatCard title={`${typeLabel} validados`} value={currentStats.total}        subtitle="desde el inicio" />
          <StatCard title="Registros Exitosos"        value={currentStats.success}      accent />
          <StatCard title="Bloqueados"                value={currentStats.blocked}      subtitle="spam, inválidos, premium" />
          <StatCard title="Tasa de Éxito"             value={`${currentStats.success_rate}%`} subtitle={`${currentStats.duplicates} duplicados`} />
        </div>
      )}

      {/* Gráfica de distribución */}
      {currentStats && (
        <div className="dashboard-section">
          <h2 className="section-title">Distribución de Resultados — {typeLabel}</h2>
          <BarChart byResult={currentStats.by_result || {}} />
        </div>
      )}

      {/* Gestión de blocklist (solo en pestaña Validación Completa) */}
      {activeTab === 'full' && <BlocklistManager />}

      {/* Tabla de logs */}
      <div className="dashboard-section">
        <div className="logs-header">
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Registro de Intentos
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.7rem' }}>
              ({filteredLogs.length} entradas)
            </span>
          </h2>
          <input
            type="text"
            placeholder="Buscar por email/teléfono, IP o resultado..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-control"
            style={{ maxWidth: '320px' }}
          />
        </div>

        <div className="logs-table-wrap">
          <table className="logs-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Timestamp</th>
                <th>Tipo</th>
                <th>Objetivo</th>
                <th>IP</th>
                <th>Resultado</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    {search ? 'Sin resultados para esa búsqueda.' : 'Sin registros todavía. Prueba a enviar algún formulario.'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{log.id}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                    <td>
                      <span className={`log-badge ${log.validation_type === 'phone' ? 'badge-info' : 'badge-secondary'}`}>
                        {log.validation_type === 'phone' ? 'Teléfono' : 'Email'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{log.target || log.email}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{log.ip || '—'}</td>
                    <td><Badge result={log.result} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.message}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  )
}

export default Dashboard
