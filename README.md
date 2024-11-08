
# Raizen Test

Este é um projeto full-stack que permite pesquisar informações sobre filmes e registrar cada busca. Ele foi desenvolvido usando Python para o backend (Flask) e Next.js com ShadCN e Tailwind para o frontend. O MongoDB é utilizado para armazenar o histórico das buscas, e o projeto é executado em containers Docker.

## Estrutura do Projeto

```
/raizen-test
├── frontend               # Código do frontend em Next.js
│   ├── Dockerfile
│   ├── package.json
│   └── src
├── backend                # Código do backend em Flask
│   ├── Dockerfile
│   ├── app.py             # Arquivo principal do backend
│   ├── init_db.py         # Script para popular o banco de dados com os filmes
│   ├── sincroniza_filmes.py # Script para sincronizar filmes da API externa
│   └── requirements.txt
└── docker-compose.yml     # Configuração do Docker Compose para todo o projeto
```

## Requisitos

- Docker
- Docker Compose
- Conta na API [The One API](https://the-one-api.dev) para acessar os dados dos filmes. Obtenha um token gratuito ao registrar-se.

## Configuração

1. Clone este repositório:

   ```bash
   git clone <URL-do-repositório>
   cd raizen-test
   ```

2. Obtenha um token da API "The One API" e substitua `SEU_TOKEN_DE_API` no `docker-compose.yml` pelo seu token pessoal.

3. Verifique o arquivo `docker-compose.yml` na raiz do projeto e configure-o conforme necessário. O arquivo já está configurado para definir os serviços `frontend`, `backend` e `mongodb`.

## Instruções de Instalação e Execução

### 1. Configuração e Execução com Docker

#### Build e Start dos Containers

Na pasta raiz (`raizen-test`), execute o comando abaixo para criar e iniciar todos os containers:

```bash
docker-compose up -d --build
```

Esse comando fará o seguinte:

- Inicializar o MongoDB com as credenciais especificadas.
- Configurar o backend para esperar até que o MongoDB esteja acessível e, em seguida, sincronizar os filmes com o banco de dados ao iniciar.
- Iniciar o frontend e backend expostos nas portas `3000` e `5000`, respectivamente.

### 2. Serviços Disponíveis

- **Frontend**: Disponível em `http://localhost:3000`
- **Backend**: Disponível em `http://localhost:5000`
- **MongoDB**: Disponível na porta `27017`

### Testando a Aplicação

1. **Pesquisar Filmes**: Acesse `http://localhost:3000`, onde você poderá inserir o nome de um usuário e o nome de um filme para buscar informações sobre o filme. Os resultados são obtidos a partir de uma API externa e registrados no banco de dados MongoDB.
2. **Visualizar Histórico**: Clique em "Ver Histórico de Pesquisas" no frontend para ver o histórico de buscas registradas no MongoDB.

## Scripts e Comandos

- **Popular o Banco de Dados com Filmes**: Esse processo ocorre automaticamente quando o backend é iniciado. O script `init_db.py` chama a função `sincronizar_filmes()` para sincronizar os dados dos filmes com o MongoDB.
- **Sincronização Manual (Opcional)**: Se necessário, você pode rodar o script `init_db.py` manualmente para repopular o banco de dados:

  ```bash
  docker-compose exec backend python3 init_db.py
  ```

## Detalhes Técnicos

### Backend

O backend usa Flask para gerenciar as requisições da API e `flask-cors` para permitir o acesso de origens diferentes (configurado para aceitar requisições do frontend). Os principais endpoints são:

- `GET /api/buscar_filme`: Busca informações sobre um filme e registra a consulta no MongoDB.
- `GET /api/historico`: Recupera o histórico de buscas anteriores armazenado no MongoDB.

### Frontend

O frontend usa Next.js com Tailwind e ShadCN para construir uma interface de busca e histórico de pesquisas. As principais funcionalidades incluem:

- **Pesquisa de Filmes**: Um formulário que permite ao usuário buscar por filmes e exibir os resultados.
- **Exibição de Histórico**: Uma tabela que exibe o histórico de buscas realizadas.

### MongoDB

MongoDB é utilizado para armazenar o histórico das pesquisas realizadas. A estrutura do documento inclui:

- `userName`: Nome do usuário que realizou a busca.
- `searchTerm`: Nome do filme pesquisado.
- `timestamp`: Data e hora da pesquisa.
- `resultsCount`: Quantidade de resultados encontrados.

## Solução de Problemas

### Erro de Porta em Uso

Se ocorrer um erro de "Ports are not available" ao iniciar o Docker, certifique-se de que as portas `3000` e `5000` não estão em uso por outros processos. Você pode alterar as portas no `docker-compose.yml`, se necessário.

### Verificando Logs

Para ver os logs dos containers em execução, use:

```bash
docker-compose logs -f
```

## Desenvolvimento e Testes Locais

Se desejar desenvolver ou testar o projeto localmente, sem Docker, você pode instalar as dependências manualmente.

1. **Backend**:

   ```bash
   cd backend
   pip install -r requirements.txt
   python3 init_db.py  # Popula o banco de dados
   python3 app.py      # Inicia o servidor Flask
   ```

2. **Frontend**:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Acesse o frontend em `http://localhost:3000` e o backend em `http://localhost:5000` para testes.
