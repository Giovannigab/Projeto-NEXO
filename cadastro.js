const API_URL = "http://localhost:3001";

const formPrestador = document.getElementById("form-prestador");

formPrestador.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome-responsavel").value;
  const email = document.getElementById("email-prestador").value;
  const senha = document.getElementById("senha-prestador").value;
  const confirmarSenha = document.getElementById(
    "confirmar-senha-prestador"
  ).value;

  // categoria ainda não existe na tabela Prestador, então por enquanto
  // ela fica só no formulário e não é enviada pra API
  const categoria = document.getElementById("categoria").value;

  // campos que existem de fato no model Prestador
  const descricao = document.getElementById("descricao-prestador").value;
  const precoHora = parseFloat(
    document.getElementById("preco-hora").value
  );
  const experiencia = parseInt(
    document.getElementById("experiencia").value,
    10
  );

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem.");
    return;
  }

  if (isNaN(precoHora) || precoHora < 0) {
    alert("Informe um preço por hora válido.");
    return;
  }

  if (isNaN(experiencia) || experiencia < 0) {
    alert("Informe um número válido de anos de experiência.");
    return;
  }

  try {
    // =========================
    // 1) REGISTRO
    // =========================
    const respostaRegistro = await fetch(
      `${API_URL}/user/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          role: "PRESTADOR",
        }),
      }
    );

    const dadosRegistro = await respostaRegistro.json();

    if (!respostaRegistro.ok) {
      throw new Error(
        dadosRegistro.message || "Erro ao cadastrar usuário."
      );
    }

    console.log("Usuário criado.");

    // =========================
    // 2) LOGIN
    // =========================
    const respostaLogin = await fetch(
      `${API_URL}/user/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      }
    );

    const dadosLogin = await respostaLogin.json();

    if (!respostaLogin.ok) {
      throw new Error(
        dadosLogin.message || "Erro ao fazer login."
      );
    }

    const token = dadosLogin.token;

    // opcional
    localStorage.setItem("token", token);

    console.log("Login realizado.");

    // =========================
    // 3) CRIAR PRESTADOR
    // =========================
    const respostaPrestador = await fetch(
      `${API_URL}/prestador/perfil`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          descricao,
          precoHora,
          experiencia,
        }),
      }
    );

    const dadosPrestador =
      await respostaPrestador.json();

    if (!respostaPrestador.ok) {
      throw new Error(
        dadosPrestador.message ||
          "Erro ao criar perfil de prestador."
      );
    }

    console.log("Prestador criado.");
    alert("Cadastro realizado com sucesso!");

    window.location.href = "dashboard.html";

  } catch (erro) {
    console.error(erro);
    alert(erro.message);
  }
});