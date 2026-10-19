import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Briefcase, TrendingUp, DollarSign, Award } from 'lucide-react';

export default function Dashboard() {
  const [metricas, setMetricas] = useState(null);
  const [techs, setTechs] = useState([]);
  const [tendencias, setTendencias] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [resM, resT, resTend] = await Promise.all([
          api.get('/dashboard/metricas'),
          api.get('/dashboard/tecnologias-demandadas'),
          api.get('/dashboard/tendencias')
        ]);

        if (resM.data.length > 0) setMetricas(resM.data[0]);
        setTechs(resT.data);
        setTendencias(resTend.data);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard Analítico de Mercado</h1>

        {/* Indicadores Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Total de Vagas</p>
              <h3 className="text-2xl font-bold text-slate-800">{metricas?.total_vagas || 0}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Salário Médio</p>
              <h3 className="text-2xl font-bold text-slate-800">R$ {metricas?.salario_medio || '0'}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">% Trabalho Remoto</p>
              <h3 className="text-2xl font-bold text-slate-800">{metricas?.percentual_remoto || 0}%</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Tecnologia Top</p>
              <h3 className="text-2xl font-bold text-slate-800">{metricas?.skill_top || 'N/A'}</h3>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Tecnologias Mais Demandadas (UC06)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={techs.slice(0, 7)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="tecnologia" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_vagas" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Tendência Histórica de Vagas (UC07)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tendencias}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="periodo" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total_vagas" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}