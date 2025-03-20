import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import roteadorServico from "./routes/servicos.js";
import roteadorLogin from "./routes/login.js";

dotenv.config();

const app = express();
const port = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(roteadorServico);
app.use(roteadorLogin);


app.get("/", (req, res) => {
  res.json({
    message: "BACKEND p/trabalho final: github.com/emanuelmsz/back-end-tf-web",
  });
});

app.listen(port, () => {
  console.log(`Serviço escutando na porta:  ${port}`);
});

//teste