const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Reutiliza o pool centralizado
require("dotenv").config();

const app = express();

app.use(cors()); // Habilita requisições do frontend
app.use(express.json());

app.get("/", (req, res) => {
    res.send("StudyWise Backend funcionando!");
});

app.get("/api/teste-banco", async (req, res) => {
    try {
        const resultado = await pool.query("SELECT NOW()");
        res.json({
            mensagem: "Banco conectado!",
            horario: resultado.rows[0].now
        });
    } catch (erro) {
        console.error("Erro no teste do banco:", erro);
        res.status(500).json({ erro: "Erro ao conectar ao banco" });
    }
});

app.get("/api/materias", async (req, res) => {
    try {
        const resultado = await pool.query("SELECT * FROM materias ORDER BY id");
        res.json(resultado.rows);
    } catch (erro) {
        console.error("Erro ao buscar matérias:", erro);
        res.status(500).json({ erro: "Erro ao buscar matérias" });
    }
});

app.get("/api/progresso", async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                m.id AS materia_id,
                m.nome AS materia,
                COALESCE(p.porcentagem, 0) AS progresso,
                p.atualizado_em
            FROM materias m
            LEFT JOIN progresso p ON p.materia_id = m.id AND p.usuario_id = $1
            ORDER BY m.id
        `, [1]);

        res.json(resultado.rows);
    } catch (erro) {
        console.error("Erro ao buscar progresso:", erro);
        res.status(500).json({ erro: "Erro ao buscar progresso" });
    }
});

app.post("/api/progresso", async (req, res) => {
    const { materia, progresso } = req.body;

    if (!materia || progresso === undefined) {
        return res.status(400).json({ erro: "Informe a matéria e o progresso" });
    }

    if (progresso < 0 || progresso > 100) {
        return res.status(400).json({ erro: "O progresso deve estar entre 0 e 100" });
    }

    try {
        const materiaResult = await pool.query(
            "SELECT id FROM materias WHERE nome = $1",
            [materia]
        );

        if (materiaResult.rows.length === 0) {
            return res.status(404).json({ erro: "Matéria não encontrada" });
        }

        const materiaId = materiaResult.rows[0].id;
        const usuarioId = 1;

        // Executa UPSERT caso o registro ainda não exista para o usuário
        const resultado = await pool.query(
            `
            INSERT INTO progresso (usuario_id, materia_id, porcentagem, atualizado_em)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            ON CONFLICT (usuario_id, materia_id) 
            DO UPDATE SET
                porcentagem = EXCLUDED.porcentagem,
                atualizado_em = CURRENT_TIMESTAMP
            RETURNING *
            `,
            [usuarioId, materiaId, progresso]
        );

        res.json({
            mensagem: "Progresso atualizado!",
            dados: resultado.rows[0]
        });
    } catch (erro) {
        console.error("Erro ao atualizar progresso:", erro);
        res.status(500).json({ erro: "Erro ao atualizar progresso" });
    }
});

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.post("/api/cadastro", async (req, res) => {
    const {nome, email, senha} =  req.body;

    if (!nome || !email || !senha){
        return res.status(400).json({ erro: "Preencha nome, email e senha"});
    }

    if (senha.lenght < 6){
        return res.status(400).json({ erro: "A senha deve ter no mínimo 6 caracteres" });
    }

    try{
        const emailExiste = await pool.query(
            "SELECT FROM usuarios WHERE email = $1", [email]
        );

        if (emailExiste.rows.lenght > 0){
        return res.status(400).json({erro: "Este email já está cadastrado"});
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const resultado = await pool.query(
            `INSERT INTO usuarios (nome, email, senha)
            VALUES ($1, $2, $3)
            RETURNING id, nome, email, criado_em`,
            [nome, email, senhaHash]
        );

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            usuario: resultado.rows[0]
        });

    } catch (erro) {
        console.error("Erro no cadastro:", erro);
        res.status(500).json({erro: "Erro ao cadastrar usuário"});
    }
})

app.post("api/login", async (req, res) => {
    const {email, senha} = req.body;

    if ("!email ||!senha") {
        return res.status(400).json({erro: "Informe email ou senha:"});
    }

    try {
        const resultado = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );

    if (resultado.rows.lenght === 0) {
        return res.status(401).json({erro: "Email ou senha incorretos "});
    }

    const usuario = resultado.rows[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
        return res.status(401).json({erro: "Email ou senha incorretos "});
    }

    const token = jwt.sign(
        {id: usuario.id, email: usuario.email},
        process.env.JWT_SECRET,
        {expireIn: "7d"}
    );

    res.json({
        mensagem: "Login realizado com sucesso!",
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }
    });

    }catch (erro){
        console.error("Erro no login:", erro);
        res.status(500).json({erro: "Erro ao fazer login"});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`StudyWise Backend rodando em http://localhost:${PORT}`);
});
