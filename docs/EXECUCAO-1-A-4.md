# Maré Coral — execução dos itens 1 a 4

Verificação: 02/09/2026. Ambiente local, sem deploy e sem cobranças reais.

## Situação

| Item | Executado | Ainda necessário para concluir |
| --- | --- | --- |
| 1. Frete | Origem 24340-140; grátis acima de R$ 200 salvo pelo admin Maré; limite exato não é grátis; postagem em até 2 dias úteis | Tarifa para até R$ 200 e prazo de transporte. CEP sozinho não gera cotação Correios |
| 2. Gateway próprio | Adaptador Pix existente verificado; código copia e cola priorizado na tela; erros preservam pedido; callbacks assinados testados com simulação | Credenciais de teste do tenant, URL de callback acessível e homologação no provedor. Pagamento permanece desligado |
| 3. Produtos e checkout | 3 referências, 22 variantes; galeria com até 3 imagens por cor; estoque e preço do servidor; frete invalidado ao mudar CEP/sacola/preço; removida promessa de parcelamento | Aprovação de preços, custo, saldo físico, composição e tabela real de medidas |
| 4. Testes completos | 50 testes backend e 13 do painel na rodada anterior; 10 testes da loja na rodada mobile; builds aprovados; compra técnica local e cancelamento com devolução de estoque; layout responsivo verificado | Pagamento e estorno no sandbox real, ciclo de troca/devolução e validação final em celular físico |

Não considerar os quatro itens integralmente concluídos enquanto essas pendências existirem.

## Evidência local

- Pedido técnico #2 criado pela interface da loja por R$ 289,90, frete grátis e `payment_status=not_required`.
- Consultado no admin exclusivo Maré; endereço estruturado e reserva presentes.
- Cancelado pela API administrativa autenticada após conferência do identificador, comprador técnico e tenant.
- Estoque da variante Coral/P: 3 → 2 na reserva → 3 após cancelamento. Pedido permanece cancelado para auditoria; não houve cobrança ou envio.
- No navegador: três imagens carregadas, guia de medidas informa pendência, sacola e checkout operantes, frete anterior descartado ao aumentar quantidade.
- Auditoria dos três produtos: 51 unidades de preparação e 22 variantes. Esses números não são confirmação de estoque físico.
- Testes backend rodados somente com `RAILS_ENV=test`, banco `app_test` verificado antes da execução. As chamadas de pagamento foram simuladas, não enviadas ao provedor.

## Continuação — experiência mobile

- Checkout conferido no navegador em 320, 390, 768 e 1280 pixels; sem transbordamento horizontal. Não equivale a teste em aparelho físico.
- Ao navegar da loja para uma peça, a página abre no topo; links para seções preservam o destino. Verificado com Top Onda Um Ombro, com frente/costas/detalhe.
- Resumo do pedido aparece antes do formulário no celular; campos com fonte de 16 pixels e botões de sacola maiores para toque.
- Estado selecionado em uma lista de UFs. Nome, e-mail, telefone, CEP, endereço e aceite recebem mensagens próprias; envio vazio exibiu 10 avisos e focou o nome, sem criar pedido.
- Frete pela interface: uma unidade de Top Onda Um Ombro Coral/P (R$ 139,90) ficou `A combinar`; duas unidades (R$ 279,80) receberam frete grátis. A cotação antiga foi invalidada ao mudar a quantidade.
- A API local apresentou lentidão intermitente. A falha de carregamento agora mostra nova tentativa no checkout, preserva a seleção e bloqueia envio/pagamento até recuperar disponibilidade. Retomada verificada com a mesma peça e quantidade.
- A leitura da resposta completa dos produtos fica dentro do limite de tempo; não se usa resumo incompleto como se fosse estoque zerado.
- `npm test`: 10 testes aprovados; `npm run lint` e `npm run build`: aprovados após os ajustes.
- Nesta continuação não foram criados pedidos, cobranças, roupas ou imagens. A sacola técnica foi esvaziada ao concluir os testes. Backend, portas e deploy não foram alterados.

## Continuação — gateway Orbe/Casetec (03/09/2026)

- Documentação pública [Orbe PSP 1.1.0](https://psp.casetec.com.br/api-docs) conferida no navegador. Somente `https://api.casetec.com.br` aparece na lista de servidores, marcado como **Production**; não foi identificado um sandbox nessa página.
- Corrigida a incompatibilidade do callback: o contrato atual usa `X-PSP-Signature`, com timestamp e uma ou mais assinaturas `v1`, calculadas sobre `<timestamp>.<corpo bruto>`. O verificador recusa horários com diferença maior que 300 segundos, corpo alterado, segredo de outro tenant e tentativas de substituir a validação por HMAC legado.
- A nova validação é selecionada pela configuração isolada do tenant; os demais tenants não foram alterados.
- Salvo **somente** `psp_signature_header=X-PSP-Signature` pela API autenticada com o admin exclusivo da Maré Coral. Leitura posterior confirmou o valor e que os demais campos do gateway permaneceram iguais.
- URL da API, merchant, API key e segredo do callback continuam sem cadastro; `psp_configured=false`. O formato de assinatura não é uma credencial e não conecta o gateway sozinho.
- **78 testes backend aprovados**, zero falhas: 20 novos testes do verificador, 8 novos testes de callbacks e os 50 testes anteriores de gateway, callbacks, isolamento, estoque, frete e pedidos Maré. Execução protegida por conferência de `RAILS_ENV=test` e banco `app_test`; chamadas ao gateway simuladas. A loja não foi testada novamente nesta rodada.
- A usuária informou que ainda não tem login administrativo no PSP. É necessário obter esse acesso ou solicitar ao administrador da Orbe/Casetec uma conta merchant exclusiva da Maré Coral, credenciais de teste e confirmação de como executar operações sem dinheiro real. Não criar nem reutilizar credenciais de outro cliente.
- Depois do acesso: cadastrar as chaves por canal protegido, disponibilizar um callback de homologação autorizado e testar Pix/confirmação, rejeição, expiração, duplicidade e estorno no ambiente confirmado pelo provedor. Estorno financeiro continua pendente; não confundir cancelamento local com devolução de dinheiro.
- Nenhuma conta, chave, cobrança, pedido real, túnel ou deploy foi criado nesta rodada. **A conexão externa e a homologação real continuam pendentes.**

## Dados comerciais em preparação

| Referência | Preço cadastrado | Estoque cadastrado | Medidas |
| --- | ---: | ---: | --- |
| Conjunto Onda Coral | R$ 289,90 | 18 | Não cadastradas |
| Top Onda Um Ombro | R$ 139,90 | 12 | Não cadastradas |
| Legging Maré Alta | R$ 189,90 | 21 | Não cadastradas |

As descrições atuais de poliamida, secagem rápida, elasticidade e proteção UV precisam ser conferidas com o fornecedor antes das vendas. Não inferir características técnicas pelas imagens. Custos e margens devem ficar somente no painel protegido.

## Como destravar

1. Confirmar tabela comercial, saldo por cor/tamanho, composição e medidas das peças existentes.
2. Informar a tarifa aprovada para pedidos de até R$ 200 e os prazos da transportadora. Não usar tarifa fictícia.
3. Cadastrar as credenciais de sandbox em Maré Coral → Configurações → Pagamento. Não enviar chaves por conversa ou gravá-las em variáveis públicas `VITE_*`.
4. Disponibilizar um callback de homologação autorizado. O endereço atual em localhost não recebe notificações externas. Não foi criado túnel ou deploy.
5. Homologar criação de Pix, confirmação, recusa, expiração e estorno no gateway. O código atual trata cancelamento; não há fluxo de solicitação de estorno validado. Cancelar um pedido não prova devolução de dinheiro.
6. Validar a compra e a experiência no celular físico antes da abertura de vendas.

Somente depois dessas validações: etapa de deploy com autorização própria.
