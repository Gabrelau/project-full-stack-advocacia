# Project Full Stack Advocacia

Aplicacao full stack para visualizacao, pesquisa e analise de dados de agendamentos juridicos.

## Entrega

Este projeto deve ser avaliado a partir do repositorio GitHub:

```txt
https://github.com/Gabrelau/project-full-stack-advocacia
```

As URLs `localhost` citadas neste README sao apenas para executar o back-end e o front-end na maquina do avaliador depois de clonar o repositorio.

## Stack

- Back-end: Node.js + Express
- Front-end: React + Vite
- Base de dados: arquivo JSON mock

## Estrutura

```txt
backend/
  src/
    controllers/
    data/
    middlewares/
    routes/
    services/
    utils/
    app.js
    server.js

frontend/
  src/
    components/
    pages/
    services/
    styles/
    utils/
```

## Backend

### Instalar dependencias

```bash
cd backend
npm install
```

### Executar em desenvolvimento

```bash
npm run dev
```

A API roda localmente por padrao em:

```txt
http://localhost:3333
```

Se a porta estiver ocupada, execute com outra porta:

```powershell
$env:PORT=3334
npm.cmd run dev
```

### Endpoints

- `GET /api/health`: verifica se a API esta online.
- `GET /api/atendimentos`: lista atendimentos com busca, filtros, ordenacao e paginacao.
- `GET /api/atendimentos/options`: retorna opcoes disponiveis para filtros.
- `GET /api/atendimentos/:id`: retorna um atendimento por ID.
- `GET /api/dashboard`: retorna KPIs e dados agregados para graficos.

### Exemplo de listagem

```txt
GET /api/atendimentos?page=1&limit=10&search=marina&status=Valido&realizado=Sim&sortBy=dataAgendamento&order=asc
```

### Parametros de filtro

- `page`: pagina atual.
- `limit`: quantidade por pagina, entre 1 e 100.
- `search`: busca textual por assistido, responsavel, organizacao, servico, local, tipo ou status.
- `status`: filtra por status.
- `tipo`: filtra por tipo de atendimento.
- `realizado`: filtra por `Sim` ou `Nao`.
- `organizacao`: filtra por organizacao.
- `responsavel`: filtra por responsavel pelo agendamento.
- `startDate`: data inicial no formato `YYYY-MM-DD`.
- `endDate`: data final no formato `YYYY-MM-DD`.
- `sortBy`: campo usado para ordenacao.
- `order`: direcao da ordenacao, `asc` ou `desc`.

Campos aceitos em `sortBy`:

```txt
id, dataAgendamento, horaInicio, nomeAssistido, responsavelAgendamento,
organizacao, tipo, status, agendamentoRealizado
```

## Frontend

### Instalar dependencias

```bash
cd frontend
npm install
```

### Executar em desenvolvimento

```bash
npm run dev
```

O front-end sera executado localmente pelo Vite. A URL padrao geralmente e:

```txt
http://localhost:5173
```

No Windows, se o PowerShell bloquear `npm` por politica de execucao, use:

```powershell
npm.cmd install
npm.cmd run dev
```

### Variaveis de ambiente

Crie um arquivo `.env` dentro de `frontend/` quando precisar alterar a URL local da API:

```env
VITE_API_URL=http://localhost:3333/api
```

Existe um arquivo `.env.example` com o modelo esperado.

## Funcionalidades implementadas

- Cards de KPI: total de atendimentos, total concluidos, total cancelados e receita total.
- Grafico de pizza com distribuicao de atendimentos por status.
- Grafico de linha com evolucao mensal do numero de atendimentos.
- Tabela de agendamentos com cliente, data, hora, responsavel, organizacao, status e realizado.
- Busca textual em tempo real.
- Filtros por status, tipo, realizado, organizacao, responsavel e periodo.
- Ordenacao nas colunas da tabela.
- Paginacao com selecao de quantidade por pagina.
- Exportacao CSV da listagem filtrada.
- Exportacao PDF da listagem filtrada.
- Estados de loading e erro nas chamadas de API.
- Layout responsivo para telas a partir de 768px.

## Dependencias utilizadas

- `express`: criacao da API REST.
- `cors`: liberacao de acesso entre front-end e back-end.
- `nodemon`: reinicio automatico do servidor durante desenvolvimento.
- `react` e `react-dom`: construcao da interface.
- `vite`: servidor de desenvolvimento e build do front-end.
- `axios`: consumo da API REST.
- `recharts`: graficos do dashboard.
- `jspdf` e `jspdf-autotable`: exportacao da listagem filtrada em PDF.
- `lucide-react`: icones da interface.

## Decisoes tecnicas

- A base de dados fica em arquivo JSON, conforme exigido pela prova.
- As respostas da API seguem uma estrutura consistente com `success`, `data`, `meta`, `filters`, `sort` ou `error`.
- A busca textual ignora maiusculas, minusculas e acentos.
- A regra de filtro e ordenacao fica no back-end para manter a fonte de verdade centralizada.
- O front-end busca todas as paginas filtradas antes de exportar CSV/PDF, garantindo que os arquivos reflitam os filtros ativos.
- O backend foi organizado em `routes/`, `controllers/`, `services/`, `data/`, `middlewares/` e `utils/`.

## Limitacoes conhecidas e melhorias futuras

- A base fornecida nao possui campo de receita; por isso `receitaTotal` retorna `0`.
- Os campos `servico` e `local` vieram vazios na base atual.
- Uma melhoria futura seria adicionar testes automatizados de API e componentes.
- Outra melhoria seria permitir configuracao visual dos graficos e exportacoes.
