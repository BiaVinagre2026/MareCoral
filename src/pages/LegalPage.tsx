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
    intro: 'Minuta operacional para validação com os processos da loja.',
    sections: [
      ['Arrependimento', 'Compras online poderão ser canceladas em até 7 dias corridos após o recebimento, conforme a legislação aplicável.'],
      ['Condições da peça', 'A peça deverá ser devolvida sem sinais de uso, lavagem ou alteração, com etiquetas e acessórios originais.'],
      ['Defeitos', 'Produtos com possível defeito serão analisados e tratados de acordo com os prazos e garantias legais.'],
      ['Como solicitar', 'O canal e o passo a passo de troca serão publicados antes da abertura das vendas.'],
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
