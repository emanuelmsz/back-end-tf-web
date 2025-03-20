import pkg from "pg";
import { allowedNodeEnvironmentFlags } from "process";
const { Pool } = pkg;

// Configuração da conexão
async function connect() {
  const pool = new Pool({
    connectionString: process.env.URL_BD,
  });
  return pool.connect();
}


async function selectServicos(concluido) {
  const client = await connect();
  try {
    let query = "SELECT * FROM servico";
    const params = [];
    
    // Adiciona WHERE apenas se "concluido" for booleano
    if (concluido !== undefined) {
      query += " WHERE concluido = $1";
      params.push(concluido);
    }
    
    query += " ORDER BY data_agendamento DESC";
    const res = await client.query(query, params);
    return res.rows;
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    throw error;
  } finally {
    client.release();
  }
}


// ---- OPERAÇÕES PARA A TABELA "SERVICO" ----
/*
async function selectServicos() {
  const client = await connect();
  try {
    const query = `SELECT   * FROM servico ORDER BY data_agendamento DESC`;
    const res = await client.query(query);
    return res.rows;
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    throw error;
  } finally {
    client.release(); // Libera a conexão de volta para o pool
  }
}

async function selectServicos(concluido) {
  const client = await connect();
  try {
    const query = `SELECT * FROM servico WHERE concluido = $1 ORDER BY data_agendamento DESC`;
    const res = await client.query(query, [concluido]);
    return res.rows;
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    throw error;
  } finally {
    client.release(); // Libera a conexão de volta para o pool
  }
}
*/

async function selectServico(id) {
  const client = await connect();
  try {
    const query = "SELECT * FROM servico WHERE id = $1";
    const res = await client.query(query, [id]);
    return res.rows[0]; // Retorna o serviço completo ou undefined
  } catch (error) {
    console.error("Erro ao buscar serviço:", error);
    throw error;
  } finally {
    client.release();
  }
}

async function insertServico(data) {
    const client = await connect();
    const query = `INSERT INTO servico (nome_cliente, email_cliente, telefone_cliente, descricao) VALUES ($1, $2, $3, $4)`;
    const values = [
      data.nome_cliente,
      data.email_cliente,
      data.telefone_cliente,
      data.descricao
    ];
    await client.query(query, values);
    client.release();
}

async function updateServicoStatus(id, concluido) {
  const client = await connect();
  try {
    const query = `
      UPDATE servico 
      SET 
        concluido = $1,
        data_conclusao = CASE 
          WHEN $1 = TRUE THEN CURRENT_TIMESTAMP 
          ELSE NULL 
        END
      WHERE id = $2
    `;
    await client.query(query, [concluido, id]);
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    throw error;
  } finally {
    client.release();
  }
}

async function deleteServico(id) {
  const client = await connect();
  try {
    const query = "DELETE FROM servico WHERE id = $1";
    await client.query(query, [id]);
  } catch (error) {
    console.error("Erro ao excluir serviço:", error);
    throw error;
  } finally {
    client.release();
  }
}

// ---- Operações para a tabela ADMINISTRADOR ----
async function selectAdministradores() {
  const client = await connect();
  const res = await client.query("SELECT * FROM administrador");
  client.release();
  return res.rows;
}

async function insertAdministrador(data) {
  const client = await connect();
  const query = "INSERT INTO administrador (nome, email, senha) VALUES ($1, $2, $3)";
  const values = [data.nome, data.email, data.senha];
  await client.query(query, values);
  client.release();
}

async function deleteAdministrador(id) {
  const client = await connect();
  const query = "DELETE FROM administrador WHERE id = $1";
  await client.query(query, [id]);
  client.release();
}

async function autenticarAdministrador(email, senha) {
  const client = await connect();
  const query = "SELECT * FROM administrador WHERE email = $1 AND senha = $2";
  const res = await client.query(query, [email, senha]);
  client.release();
  return res.rows[0];
}


export {
  selectServicos,
  selectServico,
  insertServico,
  updateServicoStatus,
  deleteServico,
  selectAdministradores,
  insertAdministrador,
  deleteAdministrador,
  autenticarAdministrador
};