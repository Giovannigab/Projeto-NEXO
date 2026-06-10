const path = require("path");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 3000;
const raizProjeto = path.join(__dirname, "..");

app.use(cors());
app.use(express.json());
app.use(express.static(raizProjeto));

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

app.post("/contato", async (req, res) => {
  const { nome, email, perfil, cidade, duvida } = req.body;

  if (!nome || !perfil || perfil === "sel" || !duvida) {
    return res.status(400).json({
      message: "Preencha todos os campos antes de enviar.",
    });
  }
  const emailExibicao = !email || email.trim() === ""
    ? "Não preenchido"
    : email;

  const cidadeExibicao = !cidade || cidade.trim() === ""
    ? "Não preenchido"
    : cidade;

  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_TO || process.env.MAIL_USER,
      subject: "Nova mensagem de contato do Nexo",
      text:
        `Nome: ${nome}\n` +
        `E-mail: ${emailExibicao}\n` +
        `Perfil: ${perfil}\n` +
        `Cidade: ${cidadeExibicao}\n\n` +
        `Mensagem:\n${duvida}`,
      html: `
        <h2>Nova mensagem de contato do Nexo</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>E-mail:</strong> ${emailExibicao}</p>
        <p><strong>Perfil:</strong> ${perfil}</p>
        <p><strong>Cidade:</strong> ${cidadeExibicao}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${duvida.replace(/\n/g, "<br>")}</p>
      `,
    });

    return res.json({
      message: "Mensagem enviada com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return res.status(500).json({
      message: "Nao foi possivel enviar a mensagem no momento.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
