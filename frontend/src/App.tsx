import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import './App.css'

type TickerItem = { label: string; change: number }

const TICKER_DATA: TickerItem[] = [
  { label: 'React', change: 18 },
  { label: 'Python', change: 12 },
  { label: 'TypeScript', change: 9 },
  { label: 'AWS', change: 7 },
  { label: 'PHP', change: -4 },
  { label: 'Java', change: 2 },
  { label: 'Docker', change: 15 },
  { label: 'jQuery', change: -11 },
]

const TECH_VOLUME = [
  { tech: 'React', vagas: 412 },
  { tech: 'Python', vagas: 378 },
  { tech: 'SQL', vagas: 351 },
  { tech: 'TypeScript', vagas: 298 },
  { tech: 'AWS', vagas: 244 },
  { tech: 'Docker', vagas: 201 },
]

const RECENT_JOBS = [
  { empresa: 'Nimbus Tech', cargo: 'Dev Backend Pleno', local: 'Remoto', tempo: '2h' },
  { empresa: 'Cardume Digital', cargo: 'Analista de Dados Jr', local: 'Rio de Janeiro, RJ', tempo: '4h' },
  { empresa: 'Rota9', cargo: 'Eng. de Dados Sênior', local: 'Remoto', tempo: '6h' },
  { empresa: 'Vetta Software', cargo: 'Frontend React', local: 'São Paulo, SP', tempo: '9h' },
  { empresa: 'Ponto Norte', cargo: 'Full Stack Pleno', local: 'Remoto', tempo: '1d' },
]

function TickerStrip() {
  const loop = [...TICKER_DATA, ...TICKER_DATA]
  return (
    <div className="ticker" aria-label="Variação de demanda por tecnologia nas últimas 4 semanas">
      <div className="ticker__track">
        {loop.map((item, i) => (
          <span className="ticker__item" key={`${item.label}-${i}`}>
            <span className="ticker__label">{item.label}</span>
            <span className={`ticker__change ${item.change >= 0 ? 'is-up' : 'is-down'}`}>
              {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

type StatCardProps = {
  eyebrow: string
  value: string
  detail: string
}

function StatCard({ eyebrow, value, detail }: StatCardProps) {
  return (
    <div className="stat-card">
      <span className="stat-card__eyebrow">{eyebrow}</span>
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__detail">{detail}</span>
    </div>
  )
}

function TechChart() {
  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3>Tecnologias mais pedidas</h3>
        <span className="chart-card__note">vagas coletadas · últimos 30 dias</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={TECH_VOLUME} layout="vertical" margin={{ left: 8, right: 24 }}>
          <CartesianGrid horizontal={false} stroke="#262B38" />
          <XAxis type="number" stroke="#7C8296" tick={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }} />
          <YAxis
            type="category"
            dataKey="tech"
            stroke="#7C8296"
            tick={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}
            width={90}
          />
          <Tooltip
            cursor={{ fill: 'rgba(245, 166, 35, 0.08)' }}
            contentStyle={{
              background: '#161922',
              border: '1px solid #262B38',
              borderRadius: 8,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
            }}
            labelStyle={{ color: '#E8EAF0' }}
          />
          <Bar dataKey="vagas" fill="#F5A623" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function JobFeed() {
  return (
    <div className="feed-card">
      <div className="feed-card__header">
        <h3>Vagas recentes</h3>
        <span className="feed-card__note">amostra ilustrativa</span>
      </div>
      <ul className="feed-list">
        {RECENT_JOBS.map((job) => (
          <li className="feed-row" key={`${job.empresa}-${job.cargo}`}>
            <span className="feed-row__cargo">{job.cargo}</span>
            <span className="feed-row__empresa">{job.empresa}</span>
            <span className="feed-row__local">{job.local}</span>
            <span className="feed-row__tempo">{job.tempo}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function App() {
  const stats = useMemo(
    () => [
      { eyebrow: 'Vagas monitoradas', value: '1.284', detail: 'coletadas nas últimas 4 semanas' },
      { eyebrow: 'Tecnologia em alta', value: 'React', detail: '+18% de menções' },
      { eyebrow: 'Senioridade mais pedida', value: 'Pleno', detail: '42% das vagas' },
      { eyebrow: 'Modalidade dominante', value: 'Remoto', detail: '61% das vagas' },
    ],
    []
  )

  return (
    <div className="page">
      <TickerStrip />

      <header className="header">
        <div className="header__brand">
          <span className="header__mark">SAV</span>
          <span className="header__name">Sistema de Análise de Vagas</span>
        </div>
        <nav className="header__nav">
          <span className="header__nav-item is-active">Painel</span>
          <span className="header__nav-item">Vagas</span>
          <span className="header__nav-item">Sobre</span>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <span className="hero__eyebrow">Painel de mercado · dados ilustrativos</span>
          <h1 className="hero__title">
            Pra onde o mercado de vagas de TI está apontando agora.
          </h1>
          <p className="hero__subtitle">
            Coleta, cruza e lê o mercado de vagas de tecnologia como um pregão: o que sobe, o
            que cai, e onde entrar.
          </p>
        </section>

        <section className="stats-grid" aria-label="Indicadores gerais">
          {stats.map((stat) => (
            <StatCard key={stat.eyebrow} {...stat} />
          ))}
        </section>

        <section className="board-grid">
          <TechChart />
          <JobFeed />
        </section>
      </main>

      <footer className="footer">
        <span>Sistema de Análise de Vagas — dados ilustrativos, pipeline em construção.</span>
      </footer>
    </div>
  )
}

export default App
