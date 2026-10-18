const supabase = require('../config/supabaseClient');


exports.receberDadosColetados = async (req, res) => {
  try {
    const { vagas } = req.body; 

    if (!vagas || !Array.isArray(vagas) || vagas.length === 0) {
      return res.status(400).json({ mensagem: 'Forneça uma lista de vagas válida.' });
    }

    const { data, error } = await supabase.from('vaga').insert(vagas).select();

    if (error) throw error;

    res.status(201).json({
      mensagem: 'Dados de vagas recebidos e salvos com sucesso!',
      total_inserido: data.length
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};