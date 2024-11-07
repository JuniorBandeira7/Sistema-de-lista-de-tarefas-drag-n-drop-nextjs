
# Sistema de Lista de Tarefas

Um sistema simples de gerenciamento de tarefas desenvolvido com Next.js e Postgres.js.

## Funcionalidades

- **CRUD de Tarefas**: Criação, visualização, atualização e exclusão de tarefas.
- **Autenticação**: Autenticação e autorização de usuários usando tokens JWT.
- **Filtragem e Reordenação de Tarefas**: Tarefas podem ser reordenadas no front-end, e as alterações persistem no banco de dados.

## Pré-requisitos

- **Node.js**: versão 18 ou superior
- **PostgreSQL**: configurado com as credenciais de acesso e uma base de dados criada.

## Configuração do Ambiente

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITÓRIO>
   cd <PASTA_DO_PROJETO>
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` com as variáveis de ambiente. O conteúdo deve incluir o seguinte:

   ```env
   DATABASE_URL=postgres://<usuário>:<senha>@<host>:<porta>/<nome_do_banco>
   JWT_SECRET=seuSegredoJWT
   ```

   - Substitua `<usuário>`, `<senha>`, `<host>`, `<porta>`, e `<nome_do_banco>` com as informações do seu banco de dados PostgreSQL.
   - `JWT_SECRET`: Chave secreta usada para gerar e validar os tokens JWT.

## Inicializando a Aplicação

1. Certifique-se de que o PostgreSQL está rodando e que a URL do banco de dados no arquivo `.env` está correta.

2. Execute o comando a seguir para rodar a aplicação em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

