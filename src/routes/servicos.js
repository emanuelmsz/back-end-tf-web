// routes/servicoRoutes.js
import { Router } from "express";
import verificarAutenticacao from "../middlewares/autenticacao.js";
import {
  deleteServico,
  insertServico,
  selectServicos,
  selectServico,
  updateServicoStatus
} from "../db/index.js";

const router = Router();


// Rota pública: Cadastrar novo serviço (formulário do cliente)
router.post("/servico", async (req, res) => {
  try {
    await insertServico(req.body);
    res.status(201).json({ message: "Serviço agendado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao agendar serviço." });
  }
});

// --- Rotas protegidas (apenas administradores) ---

//Listar todos os serviços (para exibição no site)
router.get("/servicos", verificarAutenticacao, async (req, res) => {
  try {
    const servicos = await selectServicos();
    res.json(servicos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar serviços." });
  }
});

// Detalhes de um serviço específico
router.get("/servico/:id", verificarAutenticacao, async (req, res) => {
  try {
    const servico = await selectServico(req.params.id);
    servico ? res.json(servico) : res.status(404).json({ message: "Serviço não encontrado" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar serviço." });
  }
});

// Atualizar status de conclusão
router.put("/servico/:id/concluir", verificarAutenticacao, async (req, res) => {
  try {
    await updateServicoStatus(req.params.id, true);
    res.json({ message: "Serviço marcado como concluído!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar serviço." });
  }
});

// Excluir serviço
router.delete("/servico/:id", verificarAutenticacao, async (req, res) => {
  try {
    await deleteServico(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir serviço." });
  }
});

// Filtro de serviços por status (opcional)
router.get("/servicos/filtrar", verificarAutenticacao, async (req, res) => {
  try {
    const { status } = req.query;
    const servicos = await selectServicos(status === 'concluido');
    res.json(servicos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao filtrar serviços." });
  }
});

export default router;