const API_URL = "http://localhost:3001";

const btnEntrar = document.getElementById("btnEntrar");

btnEntrar.addEventListener("click", fazerLogin);

async function fazerLogin() {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  if (!email || !senha) {
    alert("Preencha o email e a senha.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        senha,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Email ou senha inválidos.");
    }

    // Salva o token
    localStorage.setItem("token", data.token);

    // Salva os dados do usuário (opcional)
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    alert("Login realizado com sucesso!");

    // Redireciona
    window.location.href = "dashboard.html";

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}