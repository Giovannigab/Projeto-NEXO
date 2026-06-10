const form = document.getElementById("contato-form");
const statusMessage = document.getElementById("form-status");

if (form && statusMessage) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

	//Coleta de dados do formulário
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const submitButton = form.querySelector('button[type="submit"]');

	//Desativando botão de envio
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";
    statusMessage.textContent = "";
    statusMessage.className = "form-status";

    //Tentativa de envio da mensagem
    try {
      const response = await fetch("http://localhost:3000/contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const responseText = await response.text();
      const result = responseText ? JSON.parse(responseText) : {};

	  //Erro de conexão ao servidor
      if (!response.ok) {
        throw new Error(result.message || "Não foi possivel enviar a mensagem.");
      }

      //Tentativa sucedida
      form.reset();
      statusMessage.textContent = result.message;
      statusMessage.classList.add("success");
      //Tentativa fracassada
    } catch (error) {
      statusMessage.textContent = error.message || "Erro ao enviar a mensagem.";
      statusMessage.classList.add("error");
      //Resetando o botão de envio
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar Mensagem";
    }
  });
}
