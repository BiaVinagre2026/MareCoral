# Requisitos visuais — Maré Coral Fitwear

Atualizado em: 11/08/2026

## 1. Objetivo desta fase

Construir e validar a base visual da Maré Coral Fitwear antes da abertura dos canais comerciais. A ordem oficial é:

1. marca;
2. logo;
3. avatares Coral Real e Coral Ícone;
4. prova de conceito com três peças reais;
5. vídeo vertical curto;
6. integração dos ativos ao site.

Instagram, TikTok, WhatsApp Business e CNPJ ficam fora do caminho crítico desta fase e serão tratados no final do projeto.

## 2. Marca

| Item | Definição aprovada |
|---|---|
| Nome | Maré Coral Fitwear |
| Categoria | Moda fitness / activewear feminino |
| Paleta exclusiva da logo | Rosa e coral mesclados; sem outras cores |
| Fundo da logo | Transparente; não depende de fundo branco |
| Linguagem | Leve, carioca, esportista e jovem |
| Assinatura | Vista o treino. Sinta a maré. |
| Transparência | Todo conteúdo com avatar deve identificar Coral como persona digital criada com IA |

### Critérios de aceite

- A identidade deve funcionar em fundo claro e escuro.
- A leitura do nome deve permanecer clara em desktop, celular e impressão pequena.
- A marca não deve parecer academia agressiva, souvenir de praia ou marca infantil.
- A logo utiliza somente coral e rosa, incluindo mesclas e gradientes entre essas duas cores.
- A assinatura “Vista o treino. Sinta a maré.” permanece no sistema principal.

## 3. Sistema de logo

### Entregáveis

- logo principal;
- logo horizontal;
- símbolo reduzido;
- versão monocromática escura;
- versão monocromática clara;
- arquivos SVG editáveis;
- arquivos PNG para uso rápido;
- favicon.

### Critérios de aceite

- Silhueta reconhecível em 32 px.
- Contraste suficiente nos fundos previstos.
- Palavra “Maré Coral” legível sem depender do slogan.
- Símbolo baseado em praia, maré e movimento, inspirado por academia, beach tennis, corrida e crossfit sem ficar preso a um único esporte.
- Fundo transparente e desenho limitado a coral e rosa.

## 4. Arquitetura dos avatares

### Coral Real

Modelo digital de aparência humana e consistente, usado para:

- vestir peças por try-on virtual;
- imagens de catálogo e lookbook;
- apresentações da marca;
- páginas do site;
- vídeos verticais.

Características-base: brasileira, identidade facial baseada em fotos autorizadas da Bia, idade adulta natural sem rejuvenescimento artificial, corpo atlético digital já aprovado, pele morena, cabelos castanhos longos com reflexos, expressão próxima e confiante.

### Coral Ícone

Versão estilizada já existente, com estética de mascote/miniatura 3D, usada para:

- ilustrações;
- adesivos e materiais descontraídos;
- conteúdos de bastidor;
- elementos decorativos da marca.

### Invariantes de identidade

- Manter formato do rosto, olhos, cabelo, tom de pele e biotipo reconhecíveis entre imagens.
- Não alterar a idade adulta natural da Bia ou as proporções corporais aprovadas entre peças.
- Evitar retoque excessivo, anatomia artificial e padrão de “corpo perfeito”.
- Não atribuir experiência real de uso, compra ou teste físico à persona digital.

## 5. Prancha-mestra da Coral Real

Deve conter, com a mesma identidade:

- retrato frontal;
- retrato em três quartos;
- corpo inteiro frontal em pose neutra;
- corpo inteiro lateral ou três quartos;
- expressão sorrindo e expressão neutra;
- iluminação e fundo neutros para facilitar novas gerações.

Essa prancha será a referência visual para try-on, apresentações, site e vídeo.

## 6. Prova de conceito de roupas

### Entrada mínima por peça

- foto frontal;
- foto traseira, quando disponível;
- detalhe de textura, recortes ou estampa;
- nome, cor, tamanho e tecido;
- imagem com boa luz e fundo simples.

### Saída por peça

- uma imagem quadrada `1:1`;
- uma imagem de feed `4:5`;
- uma imagem vertical `9:16`;
- registro do prompt e das referências utilizadas.

### Critérios de aceite

- Rosto, cabelo e corpo da Coral permanecem consistentes.
- Cor, recortes, comprimento e textura da peça permanecem reconhecíveis.
- Sem logos, acessórios ou detalhes inventados.
- Mãos, braços, cintura e encontro entre peças não apresentam deformações visíveis.

## 7. Prova de conceito de vídeo

Status: **pausada** até o recebimento de uma gravação autorizada da filha da Bia para servir como referência de voz da Coral.

### Entregável inicial

- vídeo vertical `9:16`;
- duração alvo entre 5 e 8 segundos;
- uma apresentação simples do look;
- movimento de câmera e corpo discretos;
- sem fala na primeira prova;
- identidade e roupa consistentes do primeiro ao último quadro.

O vídeo motion design de 10 segundos já serve como prova técnica. A versão final de voz e a futura sincronização labial serão retomadas após o recebimento da gravação de referência.

## 8. Integração com o site

- Aplicar a família final do logo no cabeçalho, rodapé e favicon.
- Usar Coral Real nas áreas de apresentação, looks e vídeos.
- Usar Coral Ícone como mascote e elemento secundário.
- Criar espaço para galeria de testes sem apresentar peças experimentais como produtos disponíveis.
- Manter o funcionamento em Docker nas portas locais `4310` e `4312`.

## 9. Fora do escopo imediato

- abertura de CNPJ;
- criação de Instagram e TikTok;
- configuração do WhatsApp Business;
- pagamentos, frete e operação comercial;
- publicação automática em redes sociais;
- avatar conversacional ou atendente em tempo real.
