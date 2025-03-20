CREATE TABLE servico (
    id SERIAL PRIMARY KEY,
    nome_cliente VARCHAR(100) NOT NULL,
    email_cliente VARCHAR(100) NOT NULL,
    telefone_cliente VARCHAR(20) NOT NULL,
    descricao TEXT NOT NULL,
    data_agendamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP,
    concluido BOOLEAN DEFAULT FALSE
);

-- Índices para otimizar consultas comuns
CREATE INDEX idx_servico_concluido ON servico (concluido);
CREATE INDEX idx_servico_data_agendamento ON servico (data_agendamento);


CREATE TABLE administrador (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- Índice para busca rápida por email (já garantido pelo UNIQUE, mas útil para JOINs)
CREATE INDEX idx_administrador_email ON administrador (email);

-- Função para atualizar data_conclusao
CREATE OR REPLACE FUNCTION atualizar_data_conclusao()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.concluido = TRUE AND OLD.concluido = FALSE THEN
        NEW.data_conclusao = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger vinculado à tabela servico
CREATE TRIGGER trg_servico_conclusao
BEFORE UPDATE ON servico
FOR EACH ROW
EXECUTE FUNCTION atualizar_data_conclusao();