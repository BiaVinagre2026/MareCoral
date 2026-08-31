import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import BrandMark from '../components/BrandMark.tsx'

type LegalPageProps = {
  type: 'privacy' | 'exchanges'
}

const content = {
  privacy: {
    title: 'Política de privacidade',
    intro: 'Minuta operacional para revisão antes do lançamento da loja.',
    sections: [
      ['Dados coletados', 'A loja poderá coletar dados de identificação, contato, entrega e pagamento estritamente necessários para processar pedidos e prestar atendimento.'],
      ['Como usamos', 'Os dados serão usados para concluir compras, organizar entregas, prevenir fraudes, cumprir obrigações legais e enviar comunicações quando houver consentimento.'],
      ['Seus direitos', 'A cliente poderá solicitar acesso, correção, portabilidade ou exclusão dos dados, observados os prazos legais de guarda.'],
      ['Contato', 'O canal oficial de privacidade será publicado antes da abertura das vendas.'],
    ],
  },
  exchanges: {
    title: 'Trocas e devoluções',
    intro: 'Minuta baseada no Código de Defesa do Consumidor e sujeita à validação operacional antes do lançamento.',
    sections: [
      ['Direito de arrependimento', 'Compras feitas pelo site ou pelas redes sociais poderão ser canceladas em até 7 dias corridos após o recebimento. A cliente receberá orientação de devolução e, após a conferência, o valor integral será estornado pelo meio de pagamento original.'],
      ['Troca por tamanho ou cor', 'Como política comercial, a solicitação poderá ser feita em até 30 dias corridos após o recebimento, sujeita à disponibilidade de estoque. A peça deverá estar sem sinais de uso, lavagem, odores ou alterações, com etiqueta e acessórios originais.'],
      ['Produto com defeito', 'A solicitação será analisada conforme o Código de Defesa do Consumidor. Quando aplicável, o fornecedor terá até 30 dias para solucionar o problema; se isso não ocorrer, serão oferecidas as alternativas previstas em lei.'],
      ['Como solicitar', 'A cliente poderá iniciar a solicitação pelo site, Instagram ou WhatsApp oficial, informando o número do pedido e o motivo. Os canais definitivos serão publicados antes da abertura das vendas.'],
    ],
  },
}

function LegalPage({ type }: LegalPageProps) {
  const page = content[type]

  return (
    <main className="legal-page">
      <header className="legal-page__header">
        <Link to="/" aria-label="Voltar para a página inicial"><BrandMark /></Link>
        <Link className="legal-page__back" to="/"><ArrowLeft size={17} /> Voltar</Link>
      </header>
      <article className="legal-page__content">
        <span className="draft-badge">Minuta · não publicada</span>
        <h1>{page.title}</h1>
        <p className="legal-page__intro">{page.intro}</p>
        {page.sections.map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
        <aside>
          Este conteúdo é um rascunho de trabalho. Deve ser revisado com os dados jurídicos, fiscais e operacionais definitivos antes do lançamento.
        </aside>
      </article>
    </main>
  )
}

export default LegalPage
