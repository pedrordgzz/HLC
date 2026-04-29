import { useState, useEffect } from 'react'
import { logsService } from '../services/api'

const RESULT_CONFIG = {
  success:            { label: 'Éxito',                   cls: 'badge-success' },
  blocked_disposable: { label: 'Desechable',              cls: 'badge-danger'  },
  blocked_format:     { label: 'Formato inválido',        cls: 'badge-warning' },
  blocked_mx:         { label: 'Sin registros MX',        cls: 'badge-warning' },
  blocked_domain:     { label: 'Dominio no permitido',    cls: 'badge-danger'  },
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

function Dashboard() {
  const [fullStats, setFullStats]   = useState(null)
  const [listaStats, setListaStats] = useState(null)
  const [fullLogs, setFullLogs]     = useState([])
  const [listaLogs, setListaLogs]   = useState([])
  const [activeTab, setActiveTab]   = useState('full')
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchData = async () => {
    const [fs, ls, fl, ll] = await Promise.all([
      logsService.getStats('full'),
      logsService.getStats('lista'),
      logsService.getLogs('full'),
      logsService.getLogs('lista'),
    ])
    setFullStats(fs)
    setListaStats(ls)
    setFullLogs(fl)
    setListaLogs(ll)
    setLastUpdate(new Date().toLocaleTimeString('es-ES'))
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const currentStats = activeTab === 'full' ? fullStats : listaStats
  const currentLogs  = activeTab === 'full' ? fullLogs  : listaLogs

  const filteredLogs = currentLogs.filter(log =>
    log.email?.toLowerCase().includes(search.toLowerCase()) ||
    log.result?.toLowerCase().includes(search.toLowerCase()) ||
    log.ip?.includes(search)
  )

  if (loading) {
    return (
      <div className="auth-wrapper">
        <p style={{ color: 'var(--text-muted)' }}>Cargando panel de control...</p>
      </div>
    )
  }

  return (
    <main className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>

      {/* Cabecera */}
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

      {/* Tarjetas de estadísticas */}
      {currentStats && (
        <div className="stats-grid">
          <StatCard title="Total Intentos"     value={currentStats.total}        subtitle="desde el inicio" />
          <StatCard title="Registros Exitosos" value={currentStats.success}       accent />
          <StatCard title="Correos Bloqueados" value={currentStats.blocked}       subtitle="spam o inválidos" />
          <StatCard title="Tasa de Éxito"      value={`${currentStats.success_rate}%`} subtitle={`${currentStats.duplicates} duplicados`} />
        </div>
      )}

      {/* Gráfica de distribución */}
      {currentStats && (
        <div className="dashboard-section">
          <h2 className="section-title">Distribución de Resultados</h2>
          <BarChart byResult={currentStats.by_result || {}} />
        </div>
      )}

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
            placeholder="Buscar por email, IP o resultado..."
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
                <th>Email</th>
                <th>IP</th>
                <th>Resultado</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    {search ? 'Sin resultados para esa búsqueda.' : 'Sin registros todavía. Prueba a enviar algún formulario.'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{log.id}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{log.email}</td>
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
