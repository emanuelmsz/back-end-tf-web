
---

```markdown
# back-end-empresa-seguranca  
Back-End do sistema de agendamento para empresa de segurança eletrônica  

**Autores**  
*(Adicione os nomes dos integrantes do grupo aqui)*  

---

## **Banco de Dados**  
A criação do banco de dados foi feita via **PostgreSQL** utilizando o serviço [Neon.tech](https://neon.tech).  
A conexão com o back-end foi configurada via:  
- URL do banco em variáveis de ambiente (arquivo `.env`).  
- Biblioteca `pg` para gerenciamento de conexões.  

---

## **Endpoints**  

### **Serviços**  
**[GET] `/servicos`**  
Retorna todos os serviços agendados (público).  

**Exemplo de resposta**:  
```json  
[
  {
    "id": 1,
    "nome_cliente": "João Silva",
    "email_cliente": "joao@email.com",
    "telefone_cliente": "+5511999999999",
    "descricao": "Instalação de câmeras na residência.",
    "data_agendamento": "2024-01-20T10:30:00.000Z",
    "concluido": false
  }
]
```  

---

**[POST] `/servico`**  
Cadastra um novo serviço via formulário (público).  

**Exemplo de corpo**:  
```json  
{
  "nome_cliente": "Maria Souza",
  "email_cliente": "maria@email.com",
  "telefone_cliente": "+5511988888888",
  "descricao": "Manutenção no sistema de alarme."
}
```  

---

**[GET] `/servico/:id`**  
Retorna detalhes de um serviço específico.  
**Exige token de acesso** (apenas administradores).  

**Exemplo de resposta**:  
```json  
{
  "id": 1,
  "nome_cliente": "João Silva",
  "email_cliente": "joao@email.com",
  "telefone_cliente": "+5511999999999",
  "descricao": "Instalação de câmeras na residência.",
  "data_agendamento": "2024-01-20T10:30:00.000Z",
  "data_conclusao": null,
  "concluido": false
}
```  

---

**[PUT] `/servico/:id/concluir`**  
Marca um serviço como concluído.  
**Exige token de acesso**.  

**Exemplo de resposta**:  
```json  
{
  "message": "Serviço marcado como concluído!"
}
```  

---

**[DELETE] `/servico/:id`**  
Remove um serviço do sistema.  
**Exige token de acesso**.  

**Status**: `204 No Content` (sucesso sem conteúdo).  

---

**[GET] `/servicos/filtrar`**  
Filtra serviços por status (`concluido` ou `pendente`).  
**Exige token de acesso**.  

**Parâmetros**:  
- `status` (opcional): `concluido` ou `pendente`.  

**Exemplo de uso**:  
```bash  
GET /servicos/filtrar?status=concluido
```  

---

### **Autenticação**  
**[POST] `/login`**  
Autentica administradores para acesso ao painel.  

**Exemplo de corpo**:  
```json  
{
  "email": "admin@empresa.com",
  "senha": "senhaSegura123"
}
```  

**Exemplo de resposta**:  
```json  
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```  

---

## **Estrutura das Tabelas**  
### Tabela `servico`  
| Campo               | Tipo         | Descrição                     |
|---------------------|--------------|-------------------------------|
| `id`                | SERIAL       | ID único do serviço (PK)      |
| `nome_cliente`      | VARCHAR(100) | Nome do cliente               |
| `email_cliente`     | VARCHAR(100) | Email de contato              |
| `telefone_cliente`  | VARCHAR(20)  | Telefone para WhatsApp        |
| `descricao`         | TEXT         | Detalhes do serviço           |
| `data_agendamento`  | TIMESTAMP    | Data/hora do agendamento      |
| `data_conclusao`    | TIMESTAMP    | Data/hora da conclusão        |
| `concluido`         | BOOLEAN      | Status (`true`/`false`)       |

---

### Tabela `administrador`  
| Campo      | Tipo         | Descrição               |
|------------|--------------|-------------------------|
| `id`       | SERIAL       | ID único do admin       |
| `nome`     | VARCHAR(100) | Nome do administrador   |
| `email`    | VARCHAR(100) | Email de acesso         |
| `senha`    | VARCHAR(255) | Senha (hash)            |

---

## **Instruções de Uso**  
1. Configure as variáveis de ambiente no `.env`:  
   ```env  
   URL_BD="sua-url-de-conexao"  
   JWT_SECRET="sua-chave-secreta"  
   ```  
2. Instale as dependências:  
   ```bash  
   npm install  
   ```  
3. Execute o servidor:  
   ```bash  
   npm start  
   ```  
``` 

---