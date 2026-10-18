const supabase = require('../config/supabaseClient');

exports.registrar = async (req, res) => {
    try {
        const { email, password, nome } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const {data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { nome }
            }
        });

        if (error) throw error;
        res.status(201).json({ message: 'Usuário registrado com sucesso', user: data.user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        res.status(200).json({ message: 'Login realizado com sucesso', user: data.user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};