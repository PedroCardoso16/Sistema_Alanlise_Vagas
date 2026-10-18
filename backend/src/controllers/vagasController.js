const supabase = require('../config/supabaseClient');

exports.listarVagas = async (req, res) => {
  try {
    const { tecnologia, cidade, senioridade, modalidade, periodo } = req.query;
    let query = supabase.from('vaga').select('*');

    if (cidade) query = query.ilike('localizacao', `%${cidade}%`);
    if (senioridade) query = query.ilike('senioridade', `%${senioridade}%`);
    if (modalidade) query = query.ilike('modalidade', `%${modalidade}%`);

    if (periodo) {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - parseInt(periodo));
      query = query.gte('data_publicacao', dataLimite.toISOString().split('T')[0]);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obterVagaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: vaga, error: vagaError } = await supabase
      .from('vaga')
      .select('*, vaga_skill(skill(nome))')
      .eq('id', id)
      .single();

    if (vagaError) throw vagaError;
    if (!vaga) return res.status(404).json({ error: 'Vaga não encontrada' });

    const { data: estSalarial } = await supabase
      .from('estatistica_salarial')
      .select('*')
      .ilike('senioridade', `%${vaga.senioridade || ''}%`);

    res.json({ vaga, estatistica_salarial_relacionada: estSalarial || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.compararVagas = async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.status(400).json({ error: 'Informe os IDs das vagas para comparação.' });

    const listaIds = ids.split(',').map(id => parseInt(id.trim()));

    const { data, error } = await supabase
      .from('vaga')
      .select('*, vaga_skill(skill(nome))')
      .in('id', listaIds);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listarVagasRecentes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vaga')
      .select('*')
      .order('data_publicacao', { ascending: false })
      .limit(10);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};