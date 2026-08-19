const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: ProcessingInstruction.env.EMAIL_USER,
        pass: ProcessingInstruction.env.EMAIL_PASS
    }
});

async function enviarCodigoVerificacao(email, codigo) {
    await transformer.sendMail({
        from: `"StudyWise" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Seu código de verificação - StudyWise",
        html:`
            <h2>Confirme seu email</h2>
            <p>Use este código para ativar sua conta no StudyWise</p>
            <h1 style="letter-spacing: 6px; color: #8B5CF6;">${codigo}</h1>
            <p>O código expirará em 15 minutos.</p>
            <p>Se você não criou essa conta, ignore este email</p>
        `
    });
}

module.exports = {enviarCodigoVerificado};