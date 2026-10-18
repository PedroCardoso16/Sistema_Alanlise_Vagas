const supabase = require('../config/supabaseClient');

exports.obterMetricasDashboard = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('metrica_dashboard')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obterTecnologiasDemandadas = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('v_tecnologias_demandadas')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.obterTendenciasMercado = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tendencia_mercado')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.obterEstatisticasSalariais = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('estatistica_salarial')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};