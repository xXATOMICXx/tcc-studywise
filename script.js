// ===================== ELEMENTOS DA HOME =====================
const cartaoIA = document.getElementById("cartao_IA");
const inicio = document.querySelectorAll(".inicio");
const conteudo = document.getElementById("conteudo");
const cartoes = document.getElementById("cartoes");
const telaGerar = document.getElementById("gerar");
const botaoGerar = document.querySelector(".botao");
const textarea = document.querySelector(".gerar_com_ia textarea");
const cartaoTrilhas = document.querySelector("#cartoes .cartao:first-child");
const cartaoMaterias = document.getElementById("cartao_materias");

// ===================== NAVEGAÇÃO (só roda se os elementos existirem) =====================
if (cartaoIA) {
    cartaoIA.addEventListener("click", () => {
        conteudo.style.display = "none";
        cartoes.style.display = "none";
        telaGerar.style.display = "block";
        cartaoMaterias.style.display = "none";
    });
}

if (cartaoTrilhas) {
    cartaoTrilhas.addEventListener("click", () => {
        conteudo.style.display = "none";
        cartoes.style.display = "none";
        telaGerar.style.display = "none";
        cartaoMaterias.style.display = "flex";
        carregarProgresso();
    });
}

inicio.forEach(item => {
    item.addEventListener("click", () => {
        document.body.style.backgroundColor = "#070c21";
        if (conteudo) conteudo.style.display = "block";
        if (cartoes) cartoes.style.display = "flex";
        if (telaGerar) telaGerar.style.display = "none";
        if (cartaoMaterias) cartaoMaterias.style.display = "none";
    });
});

if (botaoGerar) {
    botaoGerar.addEventListener("click", () => {
        const texto = textarea.value.trim();

        if (texto === "") {
            alert("Digite um conteúdo primeiro para a IA gerar o material.");
            return;
        }

        let resultado = document.getElementById("resultado_ia");

        if (!resultado) {
            resultado = document.createElement("div");
            resultado.id = "resultado_ia";
            telaGerar.appendChild(resultado);
        }

        resultado.innerHTML = `
            <h2>📚 Material gerado pela IA</h2>
            <h3>✅ Resumo</h3>
            <p>O conteúdo enviado foi analisado e organizado em uma explicação mais simples, destacando as ideias principais para facilitar seus estudos.</p>
            <h3>🧠 Quiz</h3>
            <p><strong>1.</strong> Qual é o tema principal do texto?</p>
            <p><strong>2.</strong> Quais informações são mais importantes?</p>
            <p><strong>3.</strong> Como esse assunto pode aparecer em uma prova?</p>
            <h3>🃏 Flashcards</h3>
            <p><strong>Frente:</strong> Qual é a ideia central do conteúdo?</p>
            <p><strong>Verso:</strong> A ideia central é revisar e compreender os pontos principais do tema estudado.</p>
            <p class="aviso_mvp">
                MVP Mágico de Oz: nesta versão, a resposta da IA é simulada para testar a experiência do usuário antes da implementação real.
            </p>
        `;
    });
}

// ===================== PROGRESSO =====================
function carregarProgresso() {
    fetch("http://localhost:3000/api/progresso")
        .then(res => {
            if (!res.ok) throw new Error("Erro na requisição");
            return res.json();
        })
        .then(dados => {
            console.log("Progresso carregado:", dados);
        })
        .catch(erro => console.error("Erro ao carregar progresso:", erro));
}

function atualizarProgresso(materia, porcentagem) {
    fetch("http://localhost:3000/api/progresso", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            materia: materia,
            progresso: porcentagem
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro ao salvar progresso");
        return res.json();
    })
    .then(dados => {
        console.log("Progresso salvo com sucesso:", dados);
    })
    .catch(erro => console.error("Erro ao atualizar progresso:", erro));
}

// ===================== AUTENTICAÇÃO =====================
async function cadastrarUsuario(nome, email, senha) {
    try {
        const resposta = await fetch("http://localhost:3000/api/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, senha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro || "Erro ao cadastrar");
            return null;
        }

        return dados;
    } catch (erro) {
        console.error("Erro no cadastro:", erro);
        alert("Erro de conexão com o servidor");
        return null;
    }
}

async function loginUsuario(email, senha) {
    try {
        const resposta = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            return null;
        }

        localStorage.setItem("token", dados.token);
        localStorage.setItem("usuario", JSON.stringify(dados.usuario));

        return dados;
    } catch (erro) {
        console.error("Erro no login:", erro);
        alert("Erro de conexão com o servidor");
        return null;
    }
}

function usuarioLogado() {
    return localStorage.getItem("token") ? true : false;
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    alert("Você saiu da conta");
}

// ===================== BOTÃO ENTRAR / SAIR (HOME) =====================
function atualizarBotaoAuth() {
    const btnAuth = document.getElementById("btn-auth");
    if (!btnAuth) return;

    if (usuarioLogado()) {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        btnAuth.textContent = `Sair (${usuario.nome})`;
    } else {
        btnAuth.textContent = "Entrar";
    }
}

document.getElementById("btn-auth")?.addEventListener("click", () => {
    if (usuarioLogado()) {
        logout();
        atualizarBotaoAuth();
        window.location.href = "login.html";
    } else {
        window.location.href = "login.html";
    }
});

atualizarBotaoAuth();

// ===================== LÓGICA DA TELA DE LOGIN =====================
const botaoLogin = document.getElementById("botao-login");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");
const mensagemErro = document.getElementById("mensagem-erro");

if (botaoLogin) {
    botaoLogin.addEventListener("click", async () => {
        const email = inputEmail.value.trim();
        const senha = inputSenha.value.trim();

        if (mensagemErro) mensagemErro.style.display = "none";

        if (!email || !senha) {
            if (mensagemErro) {
                mensagemErro.textContent = "Preencha email e senha";
                mensagemErro.style.display = "block";
            }
            return;
        }

        botaoLogin.textContent = "Entrando...";
        botaoLogin.disabled = true;

        const resultado = await loginUsuario(email, senha);

        botaoLogin.textContent = "Entrar";
        botaoLogin.disabled = false;

        if (resultado) {
            window.location.href = "index.html";
        } else {
            if (mensagemErro) {
                mensagemErro.textContent = "Email ou senha incorretos";
                mensagemErro.style.display = "block";
            }
        }
    });

    inputSenha?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") botaoLogin.click();
    });
}

// ===================== LÓGICA DA TELA DE CADASTRO =====================
const botaoCadastro = document.getElementById("botao-cadastro");
const inputNome = document.getElementById("nome");
const inputConfirmar = document.getElementById("confirmar-senha");
const mensagemSucesso = document.getElementById("mensagem-sucesso");

if (botaoCadastro) {
    botaoCadastro.addEventListener("click", async () => {
        const nome = inputNome.value.trim();
        const email = inputEmail.value.trim();
        const senha = inputSenha.value.trim();
        const confirmar = inputConfirmar.value.trim();

        if (mensagemErro) mensagemErro.style.display = "none";
        if (mensagemSucesso) mensagemSucesso.style.display = "none";

        if (!nome || !email || !senha || !confirmar) {
            if (mensagemErro) {
                mensagemErro.textContent = "Preencha todos os campos";
                mensagemErro.style.display = "block";
            }
            return;
        }

        if (senha.length < 6) {
            if (mensagemErro) {
                mensagemErro.textContent = "A senha deve ter no mínimo 6 caracteres";
                mensagemErro.style.display = "block";
            }
            return;
        }

        if (senha !== confirmar) {
            if (mensagemErro) {
                mensagemErro.textContent = "As senhas não coincidem";
                mensagemErro.style.display = "block";
            }
            return;
        }

        botaoCadastro.textContent = "Cadastrando...";
        botaoCadastro.disabled = true;

        const resultado = await cadastrarUsuario(nome, email, senha);

        botaoCadastro.textContent = "Cadastrar";
        botaoCadastro.disabled = false;

        if (resultado) {
            localStorage.setItem("email_pendente", email);
            
            if (mensagemSucesso) {
                mensagemSucesso.textContent = "Cadastro realizado! Enviamos um código para seu email.";
                mensagemSucesso.style.display = "block";
            }

            setTimeout(() => {
                window.location.href = "verificar.html";
            }, 1200);
        } else {
            if (mensagemErro) {
                mensagemErro.textContent = "Erro ao cadastrar. Tente outro email.";
                mensagemErro.style.display = "block";
            }
        }
    });

    inputConfirmar?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") botaoCadastro.click();
    });
}

// ===================== LÓGICA DA TELA DE VERIFICAÇÃO =====================
const botaoVerificar = document.getElementById("botao-verificar");
const inputCodigo = document.getElementById("codigo");

if (botaoVerificar) {
    const emailPendente = localStorage.getItem("email_pendente");

    if (!emailPendente && mensagemErro) {
        mensagemErro.textContent = "Nenhum email pendente de verificação.";
        mensagemErro.style.display = "block";
    }

    botaoVerificar.addEventListener("click", async () => {
        const codigo = inputCodigo.value.trim();

        if (mensagemErro) mensagemErro.style.display = "none";
        if (mensagemSucesso) mensagemSucesso.style.display = "none";

        if (!codigo || codigo.length !== 6) {
            if (mensagemErro) {
                mensagemErro.textContent = "Digite o código de 6 dígitos";
                mensagemErro.style.display = "block";
            }
            return;
        }

        botaoVerificar.textContent = "Verificando...";
        botaoVerificar.disabled = true;

        try {
            const res = await fetch("http://localhost:3000/api/verificar-codigo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: emailPendente,
                    codigo: codigo
                })
            });

            const dados = await res.json();

            if (!res.ok) {
                if (mensagemErro) {
                    mensagemErro.textContent = dados.erro || "Código inválido";
                    mensagemErro.style.display = "block";
                }
            } else {
                localStorage.removeItem("email_pendente");

                if (mensagemSucesso) {
                    mensagemSucesso.textContent = dados.mensagem;
                    mensagemSucesso.style.display = "block";
                }

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1500);
            }
        } catch (e) {
            if (mensagemErro) {
                mensagemErro.textContent = "Erro de conexão com o servidor";
                mensagemErro.style.display = "block";
            }
        }

        botaoVerificar.textContent = "Verificar";
        botaoVerificar.disabled = false;
    });
}
