# Maré Coral Fitwear

Projeto da loja própria da Maré Coral, criado a partir da base white-label do projeto CCNF. O deploy fica intencionalmente adiado até a validação do catálogo, gateway, frete, dados empresariais e integrações sociais.

## Stack do projeto

- React 19 + TypeScript
- Vite 7
- React Router
- TailwindCSS 4 disponível
- Docker para desenvolvimento no Windows
- Build multi-stage e Nginx para produção
- Backend Rails/PostgreSQL/Redis do Meu Mostruário, isolado pelo tenant `mare-coral`

O frontend visual veio da base CCNF. Catálogo, variantes, estoque cadastrado e pedidos agora usam o backend white-label do Meu Mostruário.

## Limites entre os projetos

- **Maré Coral / Fitness Oceânica:** loja varejista, vitrine, páginas de produto, sacola e checkout.
- **Meu Mostruário:** backend compartilhado multitenant e super admin global. A Maré Coral utiliza somente o tenant isolado `mare-coral` dessa infraestrutura.

O super admin global não é uma tela do site Maré Coral e seu código não pertence a este repositório. A integração entre os projetos acontece exclusivamente pela API do backend compartilhado.

Para a cliente, a Maré Coral funciona como uma loja virtual comum. O termo `catálogo` é usado somente na integração técnica com o backend e não deve aparecer na experiência de compra.

## Portas isoladas

| Ambiente | Endereço | Porta padrão |
|---|---|---:|
| Desenvolvimento | http://localhost:4310 | 4310 |
| Produção local | http://localhost:4312 | 4312 |

O desenvolvimento usa a porta exclusiva da Maré Coral e pode ser acessado pelo computador ou pela rede local. Os nomes de projeto, containers e volumes começam com `marecoral`, evitando colisões com outros projetos.

Na configuração local atual, a prévia Docker está em `http://127.0.0.1:4311`, pois a 4310 já estava ocupada e foi preservada.

No Docker Desktop, os projetos ficam separados por responsabilidade:

- `meumostruario`: backend compartilhado, PostgreSQL e Redis;
- `marecoral`: frontend da loja varejista Maré Coral.

A Maré Coral não cria cópias da API, do banco ou do Redis. O container `marecoral-web` encaminha as operações da loja para o backend compartilhado na porta 8000.

## Rodar no Windows com Docker Desktop

No PowerShell:

```powershell
Copy-Item .env.example .env
docker compose up --build -d
docker compose ps
```

Acesse a porta definida por `MARE_CORAL_WEB_PORT` no `.env`.

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

## Backend compartilhado Meu Mostruário

Para desenvolvimento, o backend deve estar ativo em `http://127.0.0.1:8000`. O Vite e o Nginx encaminham `/api`, `/uploads` e `/rails` para ele; o navegador não precisa abrir outra origem.

Esse endereço é uma API, não uma página para acesso da cliente. Produtos, estoque, pedidos e configurações do tenant são operados separadamente no super admin global do Meu Mostruário.

Variáveis principais:

- `VITE_MOSTRUARIO_TENANT=mare-coral` seleciona o schema isolado;
- `VITE_MOSTRUARIO_CATALOG_TOKEN` autoriza a criação de pedidos;
- `VITE_CHECKOUT_ENABLED=true` habilita o registro do pedido.

O frontend é travado no tenant `mare-coral`. Se a API não confirmar esse tenant, a loja mostra indisponibilidade e não carrega catálogo substituto.

O frontend envia somente IDs e quantidade da variação escolhida. O preço é recuperado pelo backend. O link atual aceita pedidos, registra endereço estruturado e reserva estoque. O pagamento permanece desligado até a configuração do frete e o cadastro das credenciais do gateway próprio no tenant.

## Configurar canais

Copie `.env.example` para `.env` e preencha as URLs reais de Instagram, Facebook, TikTok e WhatsApp. Enquanto elas não estiverem configuradas, o site não envia dados para redes externas.

Nenhuma credencial de pagamento deve entrar em variáveis `VITE_*`. Segredos do gateway pertencem exclusivamente à configuração protegida do tenant no Meu Mostruário.

## Catálogo e redes sociais

Nesta etapa, a vitrine e os feeds ficam limitados às três peças com referência (conjunto, top e legging), nas cores rosa e coral, com frente, costas e detalhe. Os outros registros de preparação não são exibidos. `src/data/launch-policy.json` define esse recorte e registra o frete solicitado. Em 02/09/2026, o admin exclusivo salvou no backend a origem 24340-140 e frete grátis estritamente acima de R$ 200. A tarifa para pedidos menores ou iguais a R$ 200 e o prazo de transporte continuam pendentes, sem valores inventados. `src/data/catalog.json` é somente a fonte provisória dos feeds sociais e nunca aparece como substituto da API na loja. Durante o build, ele gera:

- `/feeds/meta-catalog.csv`
- `/feeds/tiktok-catalog.csv`

Os feeds só devem ser cadastrados nas redes depois do domínio estar publicado em HTTPS e dos dados demonstração terem sido substituídos pelos produtos reais. O plano completo está em [docs/LOJA-E-INTEGRACOES.md](docs/LOJA-E-INTEGRACOES.md).

## Validações

```powershell
npm ci
npm test
npm run lint
npm run build
docker compose config
docker compose -f docker-compose.prod.yml config
```

## Situação da Semana 1

O acompanhamento operacional está em [docs/SEMANA1.md](docs/SEMANA1.md). A aplicação cobre a fundação técnica, vitrine, produto, carrinho, pedido, endereço e reserva de estoque. A regra comercial de frete, gateway, dados empresariais, fotos finais e operação ainda exigem conclusão antes do deploy.

Os requisitos aprovados para marca, família do logo, Coral Real, Coral Ícone, try-on e vídeo estão em [docs/REQUISITOS_VISUAIS.md](docs/REQUISITOS_VISUAIS.md).

A execução dos itens 1–4, os testes e os bloqueios comerciais estão em [docs/EXECUCAO-1-A-4.md](docs/EXECUCAO-1-A-4.md).
