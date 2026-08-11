# Maré Coral Fitwear

Landing page de pré-lançamento da Maré Coral, criada a partir da base white-label do projeto CCNF.

## Stack reaproveitada do CCNF

- React 19 + TypeScript
- Vite 7
- React Router
- TailwindCSS 4 disponível
- Docker para desenvolvimento no Windows
- Build multi-stage e Nginx para produção

Todo o domínio específico de cadastro de visitantes, autenticação e Rails do CCNF foi excluído desta adaptação.

## Portas isoladas

| Ambiente | Endereço | Porta padrão |
|---|---|---:|
| Desenvolvimento | http://localhost:4310 | 4310 |
| Produção local | http://localhost:4312 | 4312 |

As portas ficam vinculadas somente a `127.0.0.1` e não expõem o projeto na rede local. Os nomes de projeto, containers e volumes começam com `marecoral`, evitando colisões com CCNF, Acquamare e MeuMostruario.

## Rodar no Windows com Docker Desktop

No PowerShell:

```powershell
Copy-Item .env.example .env
docker compose up --build -d
docker compose ps
```

Acesse http://localhost:4310.

Para encerrar somente a Maré Coral:

```powershell
docker compose down
```

Não use `docker compose down` fora desta pasta e não inclua `--volumes` sem necessidade.

## Simular produção

```powershell
docker compose -f docker-compose.prod.yml up --build -d
```

Acesse http://localhost:4312. Para encerrar:

```powershell
docker compose -f docker-compose.prod.yml down
```

## Configurar a lista VIP

Preencha `VITE_WHATSAPP_URL` no arquivo `.env`. Enquanto a URL não estiver configurada, o botão aparece como “WhatsApp em configuração” e não envia dados para lugar algum.

## Validações

```powershell
npm ci
npm run lint
npm run build
docker compose config
docker compose -f docker-compose.prod.yml config
```

## Situação da Semana 1

O acompanhamento operacional está em [docs/SEMANA1.md](docs/SEMANA1.md). A aplicação cobre a fundação técnica; domínio, redes sociais, CNPJ, fornecedores e integrações de pagamento exigem ações externas da responsável pelo negócio.
