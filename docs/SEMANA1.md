# Semana 1 — Base visual e avatar

Atualizado em: 26/08/2026

## Concluído tecnicamente

- [x] Repositório `BiaVinagre2026/MareCoral` clonado em pasta isolada.
- [x] Base white-label do CCNF analisada e reduzida ao frontend reutilizável.
- [x] React, Vite e TypeScript configurados.
- [x] Identidade visual Maré Coral aplicada à landing page responsiva.
- [x] Coral identificada explicitamente como embaixadora digital.
- [x] Docker de desenvolvimento configurado sem colisão; nesta máquina usa `127.0.0.1:4311` porque a 4310 já estava ocupada.
- [x] Docker/Nginx de produção local configurado em `127.0.0.1:4312`.
- [x] Container de desenvolvimento homologado como `healthy`, HTTP 200 e proxy do backend respondendo na porta 4311.
- [x] Imagem de produção homologada com Nginx, healthcheck e rotas SPA.
- [x] Políticas de privacidade e trocas criadas como minutas, sem publicação enganosa.
- [x] CI preparado para lint, build e imagem Docker.

### Evidências da validação técnica

- `npm run lint`: aprovado.
- `npm run build`: aprovado.
- Desktop 1440×900: navegação, seções e CTA revisados sem erros de console.
- Mobile 390×844: menu, hero, lista VIP e páginas legais revisados sem erros de console.
- O desenvolvimento Docker integrado permanece disponível em `http://127.0.0.1:4311`.

## Backend e loja — estado atual

O site e o checkout pertencem à Maré Coral / Fitness Oceânica. O backend multitenant e o super admin global pertencem ao Meu Mostruário.

- [x] Backend Meu Mostruário ativo em `127.0.0.1:8000`.
- [x] Tenant/schema isolado `mare-coral` provisionado.
- [x] Oito produtos de preparação cadastrados com variantes e estoque.
- [x] Frontend consumindo exclusivamente o tenant `mare-coral`, sem catálogo substituto.
- [x] Pedido criado pelo link autorizado sem confiar em preço vindo do navegador.
- [x] Teste técnico de pedido concluído e pedido de teste cancelado.
- [ ] Cadastrar credenciais do gateway próprio e habilitar cobrança.
- [x] Validar e reservar estoque no servidor durante o pedido.
- [x] Estruturar endereço e preparar a configuração de frete por tenant.
- [ ] Integrar cálculo/rastreio da transportadora escolhida.
- [ ] Substituir produtos e fotos de preparação pelos dados finais do drop.

## Prioridade oficial da fase visual

- [x] Nome, posicionamento, paleta e linguagem aprovados.
- [x] Logo escolhida aplicada em versões vetoriais e favicon.
- [x] Identidade-base da Coral Real criada e integrada ao site.
- [x] Preservar a Coral Ícone como mascote estilizada.
- [ ] Testar três peças reais em formatos 1:1, 4:5 e 9:16 — peça 1/3 concluída (look rosa v1).
- [ ] Produzir vídeo vertical curto com identidade e roupa consistentes.
- [x] Integrar logo e imagens aprovadas da Coral ao site.

Os critérios completos estão em [REQUISITOS_VISUAIS.md](REQUISITOS_VISUAIS.md).

## Ações externas adiadas para o final do projeto

- [ ] Comprar `marecoral.com.br` no Registro.br.
- [ ] Reservar `@marecoralfitwear` no Instagram.
- [ ] Reservar `@marecoralfitwear` no TikTok.
- [ ] Confirmar/regularizar MEI e CNAEs.
- [ ] Criar conta PJ e cadastrar as credenciais do gateway próprio.
- [ ] Criar número e perfil no WhatsApp Business.
- [ ] Enviar a URL do WhatsApp para configurar `VITE_WHATSAPP_URL`.

## Marca e conteúdo

- [x] Nome, posicionamento, paleta, slogan e linhas de produto documentados no brand kit.
- [x] Conceito visual e avatar-base disponíveis no workspace.
- [x] Logo definitivo escolhido e organizado no kit de marca.
- [ ] Criar briefing completo da Coral e referências para LoRA.
- [ ] Criar 7 roteiros, captions e capas de Reels.
- [ ] Criar 12 templates editáveis para redes sociais.

## Loja e operação

- [ ] Contatar e registrar retorno de pelo menos três fornecedores.
- [ ] Validar amostras, tabela de tamanhos e qualidade dos tecidos.
- [x] Adotar a loja própria conectada ao backend white-label Meu Mostruário.
- [x] Configurar o catálogo técnico inicial e os preços de preparação.
- [ ] Homologar o gateway próprio, o serviço de frete e o Instagram Shopping.
- [ ] Executar uma compra de teste e um fluxo de troca/estorno.

## Critério de encerramento da fase visual

A fase visual estará encerrada quando a família do logo estiver exportada, a identidade-mestra das duas versões da Coral estiver aprovada, três peças tiverem passado pela prova de conceito, um vídeo vertical curto estiver validado e os ativos finais estiverem integrados ao site em Docker. CNPJ, Instagram, TikTok e WhatsApp não bloqueiam esse encerramento.
