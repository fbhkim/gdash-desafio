# GDASH Desafio 2025/02

## Visão Geral
- Pipeline completo: Python → RabbitMQ → Go → NestJS → MongoDB → React.
- Dashboard exibe dados reais e insights simples.
- Exportação CSV e XLSX disponível.

## Como Rodar
- Pré‑requisitos: Docker e Docker Compose instalados.
- Copie `/.env.example` para `/.env` e ajuste variáveis conforme sua cidade e segredos.
- Suba toda a stack com `docker compose up --build`.
- URLs:
  - Frontend (hash router): `http://localhost:5173/#/`
  - Login: `http://localhost:5173/#/login`
  - Usuários: `http://localhost:5173/#/users`
  - Explorar (PokéAPI): `http://localhost:5173/#/explorar`
  - API base: `http://localhost:3000/api`
  - Health da API: `GET http://localhost:3000/api` → `{ ok: true }`
  - RabbitMQ UI: `http://localhost:15672` (guest/guest)
  - MongoDB: `mongodb://localhost:27017/gdash`

### Rodar apenas serviços específicos
- Subir API e Frontend: `docker compose up -d --build api frontend`
- Subir coletor Python: `docker compose up -d --build collector`
- Subir worker Go: `docker compose up -d --build worker`

### Logs úteis
- API: `docker compose logs api --tail 100`
- Frontend: `docker compose logs frontend --tail 100`
- Worker: `docker compose logs worker --tail 100`
- Coletor: `docker compose logs collector --tail 100`

## Serviços
- `API` NestJS em `http://localhost:3000/api`.
- `MongoDB` em `mongodb://localhost:27017/gdash`.
- `RabbitMQ` em `amqp://localhost:5672` e painel `http://localhost:15672`.
- `Frontend` em `http://localhost:5173`.

## Endpoints Principais
- `POST /api/auth/login` retorna JWT.
- `POST /api/weather/logs` ingesta via header `X-Ingest-Token`.
- `GET /api/weather/logs` lista registros.
- `GET /api/weather/export.csv` exporta CSV.
- `GET /api/weather/export.xlsx` exporta XLSX.
- `GET /api/weather/insights` retorna insights.
- `CRUD /api/users` protegido por JWT.
- (Opcional) `GET /api/poke?page=&size=` lista paginada; `GET /api/poke/:name` detalhe.
- Swagger: não incluído nesta implementação (endpoints listados acima).

## Coletor Python
- Busca dados no Open‑Meteo periodicamente e publica em fila.
- Configuração por env: `LATITUDE`, `LONGITUDE`, `LOCATION_NAME`, `COLLECT_INTERVAL_MINUTES`.
- Rodar isolado: `docker compose up -d --build collector`

## Worker Go
- Consome `weather_logs`, envia para `API_URL` com `INGEST_TOKEN`.
- Retry básico via `nack` requeue.
- Rodar isolado: `docker compose up -d --build worker`

## Usuário Padrão
- Criado na inicialização com `DEFAULT_ADMIN_EMAIL` e `DEFAULT_ADMIN_PASSWORD`.
- Padrão: `admin@example.com` / `123456` (ajustável via `.env`).

## Frontend
- Hash router habilitado para acesso direto às rotas: use `#/` nos caminhos.
- Dashboard com cards principais (temperatura, umidade, vento, condição), insights de IA e gráfico de temperatura.
- Páginas:
  - `#/users`: CRUD de usuários com `Dialog`, `Input` e `Toast` (estilo shadcn).
  - `#/explorar`: lista paginada e detalhe via PokéAPI.

## Vídeo
- Link (YouTube não listado): https://youtu.be/PPbGh6kK1uc

## Observações
- Exiba dados e insights no Dashboard.
- Ajuste UI e IA conforme necessário.
- Token de ingestão: defina `INGEST_TOKEN` no `.env` e envie em `X-Ingest-Token` para `POST /api/weather/logs`.
- CORS habilitado na API para facilitar acesso pelo frontend.
- Troubleshooting comum:
  - Frontend em branco nas rotas: use URLs com `#/` (ex.: `http://localhost:5173/#/users`).
  - Sem dados no Dashboard: aguarde o coletor publicar e o worker processar; verifique logs de `collector` e `worker`.
  - Login falha: confirme `DEFAULT_ADMIN_*` no `.env` e reinicie `api`.
## Entrega (Pull Request)
- Crie uma branch com seu nome completo, por exemplo: `joao-silva`.
- Faça o push da branch para o repositório remoto e abra um Pull Request.
- O PR deve conter: backend (NestJS), frontend (Vite), Python (coleta), Go (worker), `docker-compose.yml`, `.env.example`, link do vídeo e este README atualizado.
- Exemplos de comandos:
  - `git checkout -b seu-nome-completo`
  - `git add . && git commit -m "Entrega GDASH 2025/02"`
  - `git push -u origin seu-nome-completo`
