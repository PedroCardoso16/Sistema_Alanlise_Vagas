import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Search, MapPin, Briefcase, DollarSign, ExternalLink, Filter } from 'lucide-react';

export default function Vagas() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    cidade: '',
    senioridade: '',
    modalidade: ''
  });

  const buscarVagas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vagas', { params: filtros });
      setVagas(response.data);
    } catch (error) {
      console.error("Erro ao carregar vagas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarVagas();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    buscarVagas();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Painel de Vagas de Tecnologia</h1>
          <p className="text-slate-600 mt-1">Consulte e filtre oportunidades do mercado em tempo real.</p>
        </div>

        {/* Formulário de Filtros */}
        <form onSubmit={handleFilterSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Localização</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Ex: Rio de Janeiro, SP" 
                value={filtros.cidade}
                onChange={(e) => setFiltros({...filtros, cidade: e.target.value})}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Senioridade</label>
            <select 
              value={filtros.senioridade}
              onChange={(e) => setFiltros({...filtros, senioridade: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="">Todas</option>
              <option value="Júnior">Júnior</option>
              <option value="Pleno">Pleno</option>
              <option value="Sênior">Sênior</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Modalidade</label>
            <select 
              value={filtros.modalidade}
              onChange={(e) => setFiltros({...filtros, modalidade: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="">Todas</option>
              <option value="Remoto">Remoto</option>
              <option value="Híbrido">Híbrido</option>
              <option value="Presencial">Presencial</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              type="submit" 
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition"
            >
              <Filter className="h-4 w-4" />
              <span>Aplicar Filtros</span>
            </button>
          </div>
        </form>

        {/* Lista de Vagas */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-sky-500 border-t-transparent"></div>
            <p className="mt-2 text-slate-500">Carregando oportunidades...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vagas.map((vaga) => (
              <div key={vaga.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{vaga.titulo || 'Vaga Tech'}</h3>
                    <span className="bg-sky-50 text-sky-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-sky-200">
                      {vaga.modalidade || 'Presencial'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-1">{vaga.empresa || 'Empresa Privada'}</p>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{vaga.localizacao || 'Brasil'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-slate-400" />
                      <span>{vaga.senioridade || 'Nível Indefinido'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                      <span>
                        {vaga.salario_min ? `R$ ${vaga.salario_min} - R$ ${vaga.salario_max}` : 'Faixa Salarial Combinar'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {vaga.data_publicacao ? new Date(vaga.data_publicacao).toLocaleDateString('pt-BR') : 'Recente'}
                  </span>
                  {vaga.url_original && (
                    <a 
                      href={vaga.url_original} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-sky-600 hover:text-sky-700"
                    >
                      <span>Ver Original</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}