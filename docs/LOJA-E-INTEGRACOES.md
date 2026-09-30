# Loja própria e integrações sociais

## Decisões aprovadas

- domínio próprio; deploy somente depois da conclusão e validação do projeto;
- loja própria, sem plataforma de e-commerce terceirizada;
- gateway de pagamento próprio, conectado somente pelo servidor;
- não criar peças inexistentes para completar uma quantidade: nesta etapa, somente conjunto, top e legging das referências, nas cores rosa e coral;
- três fotos por peça e cor: frente, costas e detalhe;
- CEP de origem aprovado: `24340-140`; frete grátis em compras **acima de R$ 200,00**, não incluindo R$ 200,00;
- tarifa para pedidos até R$ 200,00 ainda depende do estudo dos Correios; não atribuir valor fictício;
- postagem em até 2 dias úteis e envio para todo o Brasil;
- atendimento e compra pelo site, Instagram e WhatsApp oficial;
- reaproveitamento das páginas existentes no Instagram e Facebook;
- CNPJ, CNAE e dados fiscais entram antes da abertura real das vendas.

## Limites entre os projetos

- **Maré Coral / Fitness Oceânica:** loja varejista, vitrine, páginas de produto, sacola e checkout.
- **Meu Mostruário:** backend compartilhado white-label multitenant e super admin global usado para operar o tenant `mare-coral`.

O super admin global permanece no projeto Meu Mostruário. Ele não é parte do site Maré Coral, não é publicado por este repositório e não deve aparecer como uma área da loja para a cliente.

Na experiência da cliente, a Maré Coral deve se comportar e se comunicar como uma loja virtual comum. `Catálogo` é apenas o nome técnico da estrutura usada pelo backend compartilhado.

## Arquitetura da primeira versão

1. O backend Meu Mostruário é a fonte de verdade para produtos, preços publicados, variantes e estoque cadastrado do tenant `mare-coral`.
2. O carrinho persiste apenas no dispositivo da cliente até o pedido ser criado.
3. O navegador usa o proxy de mesma origem e envia o pedido ao endpoint varejista exclusivo da Maré Coral.
4. O navegador não envia preço, desconto nem total; o backend cria o snapshot financeiro.
5. O endereço de entrega é registrado em campos estruturados dentro do pedido e fica disponível ao super admin global do backend.
6. O gateway próprio e os webhooks já possuem pontos de integração no backend. Na verificação de 02/09/2026, o tenant estava sem URL da API, chave e segredo do callback; o callback apontava para localhost. Nenhuma cobrança foi criada.
7. `src/data/catalog.json` é somente fallback de desenvolvimento e fonte provisória dos feeds sociais.
8. Nenhuma chave, segredo, custo ou margem é enviada ao front-end.

### Integração local validada em 26/08/2026

- backend em `http://127.0.0.1:8000`;
- frontend Docker em `http://127.0.0.1:4311`, sem conflito com a 4310 ocupada;
- tenant e schema `mare-coral` provisionados;
- 8 produtos, imagens de preparação, cores, tamanhos e estoque cadastrados;
- catálogo de pedido com 8 itens e pagamento desligado;
- pedido técnico criado pelo proxy com preço definido no servidor e cancelado após o teste.

### Etapa 3 — catálogo integrado

- o site carrega somente produtos publicados do tenant `mare-coral`;
- quando existe um link de pedido configurado, a vitrine fica limitada aos produtos desse catálogo;
- cores, tamanhos, fotos, preços por variante e estoque vêm do Meu Mostruário;
- combinações sem estoque ficam indisponíveis e a sacola limita a quantidade ao saldo cadastrado;
- produtos removidos, despublicados ou esgotados deixam de ser compráveis após a sincronização;
- `npm run validate:catalog` confere o primeiro drop e o vínculo com o catálogo de pedido sem exibir o token.

### Etapa 4 — pedido, frete e estoque

- o checkout identifica a variação exata de cor e tamanho;
- catálogo, variação e preço são validados novamente pelo servidor;
- o pedido reserva o estoque em uma transação e registra o endereço estruturado;
- confirmação ou pagamento mantém a baixa; cancelamento devolve as unidades;
- o super admin global pode consultar cliente, endereço, frete, total e situação do estoque;
- a configuração compartilhada do tenant permite definir frete nacional fixo, limite de frete grátis e prazo;
- enquanto o frete não estiver configurado, o pedido pode ser registrado com `Frete a combinar`, mas a cobrança online fica bloqueada;
- o fluxo é exclusivo do tenant e do link varejista marcados como Maré Coral, sem mudar os pedidos atacadistas de outros clientes.

### Limites antes de vender

- o fluxo varejista usa `price_retail` (ou o preço específico da variante) no servidor; o preço de atacado não determina o total da Maré Coral;
- a gratuidade acima de R$ 200 está ativa; falta a tarifa aprovada para pedidos de até R$ 200 e o prazo da transportadora;
- pagamento, webhook, recusa, cancelamento e estorno ainda precisam ser homologados no sandbox do gateway.

## Dados que faltam para o gateway

- documentação da API e ambiente de sandbox;
- modelo de autenticação;
- endpoint para criar cobrança;
- Pix, cartão, parcelamento e webhooks disponíveis;
- estados possíveis do pagamento;
- mecanismo de estorno e cancelamento;
- assinatura/verificação dos webhooks;
- credenciais de teste fornecidas por variável de ambiente, nunca pelo Git.

## Fotos definitivas por produto

Cada SKU deve receber arquivos em alta resolução e fundo consistente:

- frente com a Coral;
- costas com a Coral;
- detalhe de acabamento e costura;

Não gerar novos modelos de roupa. As três fotos existentes por cor são suficientes. Os cinco modelos extras foram retirados da vitrine e dos feeds; seus registros e arquivos anteriores não foram apagados do backend.

### Configuração comercial ativa parcialmente — 02/09/2026

As decisões estão registradas em `src/data/launch-policy.json` e foram salvas por sessão autenticada do admin exclusivo no tenant `mare-coral`: CEP 24340140, regra habilitada, limite exclusivo de R$ 200, tarifa paga e prazo de transporte vazios. O backend permite frete grátis sem tarifa fixa; em R$ 200 exatos ou menos, a cotação fica não configurada e impede cobrança online. Isso não é integração automática com os Correios. A postagem continua em até 2 dias úteis; não confundir postagem com prazo de transporte.

Consulte [EXECUCAO-1-A-4.md](EXECUCAO-1-A-4.md) para os testes locais e as pendências de homologação.

## Meta: Instagram e Facebook

As duas páginas existentes devem ser vinculadas ao mesmo portfólio empresarial da Meta. Depois do deploy:

1. renomear usuário, nome, foto, capa e dados da página;
2. usar a bio aprovada: `Fitwear com alma da Região Oceânica 🌊🪸 Vista o treino. Sinta a maré. Coral, nossa embaixadora digital criada com IA.`;
3. criar o catálogo no Commerce Manager;
4. cadastrar como fonte agendada `https://DOMINIO/feeds/meta-catalog.csv`;
5. conectar o catálogo ao Instagram e à Página do Facebook;
6. adicionar o Pixel da Meta somente depois do consentimento de marketing;
7. identificar imagens, áudio e vídeos realistas da Coral como conteúdo criado ou alterado com IA.

## TikTok

Depois do deploy:

1. criar ou conectar o TikTok Business Center;
2. criar um catálogo de e-commerce;
3. cadastrar como fonte agendada `https://DOMINIO/feeds/tiktok-catalog.csv`;
4. conectar o Pixel do TikTok somente depois do consentimento de marketing;
5. garantir que os IDs enviados pelo pixel sejam os mesmos SKUs do feed.

O TikTok aceita catálogo por inclusão manual, upload de arquivo ou feed agendado. A disponibilidade comercial de recursos pode variar conforme mercado e tipo de conta.

## Critérios antes do deploy

- confirmar os dados comerciais das três peças com referência aprovada, sem inventar novos modelos;
- cadastrar estoque por variante de cor e tamanho;
- incluir fotos finais e revisar descrições/composição;
- definir domínio final e URLs reais das redes sociais;
- cadastrar as credenciais do gateway por tenant e homologar os webhooks no sandbox;
- configurar e testar o valor de frete e a faixa de frete grátis;
- integrar rastreamento quando a transportadora for escolhida;
- revisar textos jurídicos com dados empresariais;
- testar compra, pagamento, recusa, cancelamento, estorno, troca e devolução;
- testar os feeds no Meta Commerce Manager e TikTok Catalog Manager;
- validar LGPD, consentimento, pixels e métricas;
- só então publicar o DNS e abrir vendas.

## Referências oficiais usadas

- Ministério da Justiça: direito de arrependimento em compras on-line e solução de defeitos.
- Meta: transparência para conteúdo fotorrealista e áudio criado ou alterado com IA.
- TikTok for Business: catálogos, feeds agendados e parâmetros de produto.
