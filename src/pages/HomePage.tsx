import { useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Dumbbell,
  Footprints,
  Instagram,
  MapPin,
  Menu,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Sun,
  Truck,
  Waves,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import BrandMark from '../components/BrandMark.tsx'
import { useCart } from '../context/CartContext.tsx'
import { useCatalog } from '../context/CatalogContext.tsx'
import { formatPrice, getFirstAvailableOption, getOptionStock } from '../data/products.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'

const collections = [
  { name: 'Maré Areia', use: 'Beach tennis & praia', icon: Sun, tone: 'orange' },
  { name: 'Maré Studio', use: 'Academia & pilates', icon: Sparkles, tone: 'pink' },
  { name: 'Maré Box', use: 'Crossfit & intensidade', icon: Dumbbell, tone: 'graphite' },
  { name: 'Maré Run', use: 'Corrida & caminhada', icon: Footprints, tone: 'aqua' },
]

const neighborhoods = ['Camboinhas', 'Itaipu', 'Itacoatiara', 'Piratininga', 'Maravista']

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { itemCount, addItem, openCart } = useCart()
  const { products, status, error, reload } = useCatalog()
  const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL as string | undefined
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL as string | undefined
  const facebookUrl = import.meta.env.VITE_FACEBOOK_URL as string | undefined
  const tiktokUrl = import.meta.env.VITE_TIKTOK_URL as string | undefined
  usePageMeta({
    title: 'Maré Coral Fitwear | Vista o treino. Sinta a maré.',
    description: 'Fitwear coral e rosa para academia, beach tennis, corrida e crossfit, com envio para todo o Brasil.',
    image: '/og-v1.png',
  })

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <div className="announcement">
        <span>Envio para todo o Brasil</span>
        <span className="announcement__dot" aria-hidden="true" />
        <strong>Postagem em até 2 dias úteis</strong>
      </div>

      <header className="site-header">
        <a className="brand-link" href="#inicio" aria-label="Maré Coral — início">
          <BrandMark />
        </a>

        <nav className={`desktop-nav ${menuOpen ? 'desktop-nav--open' : ''}`} aria-label="Navegação principal">
          <a href="#loja" onClick={closeMenu}>Loja</a>
          <a href="#coral" onClick={closeMenu}>Conheça a Coral</a>
          <a href="#entrega" onClick={closeMenu}>Entrega</a>
          <button type="button" className="nav-cta nav-cart" onClick={() => { closeMenu(); openCart() }}>
            <ShoppingBag size={17} /> Sacola <span>{itemCount}</span>
          </button>
        </nav>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero__wash hero__wash--one" aria-hidden="true" />
          <div className="hero__wash hero__wash--two" aria-hidden="true" />
          <div className="hero__content">
            <p className="eyebrow"><Waves size={18} /> Primeiro drop · em breve</p>
            <h1>Seu treino encontrou<br /><em>a própria maré.</em></h1>
            <p className="hero__lead">
              Fitwear coral e rosa para academia, beach tennis, corrida e crossfit. Compra direta, envio nacional e a Coral mostrando cada detalhe.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="#loja">
                Comprar o primeiro drop <ArrowRight size={18} />
              </a>
              <a className="button button--ghost" href="#colecoes">Explorar a Maré</a>
            </div>
            <div className="hero__trust">
              <span><BadgeCheck size={17} /> Curadoria local</span>
              <span><Truck size={17} /> Envio para todo o Brasil</span>
            </div>
          </div>

          <div className="hero__visual" aria-label="Coral, embaixadora digital da Maré Coral">
            <div className="hero-card">
              <div className="hero-card__label"><Sparkles size={16} /> Conheça a Coral</div>
              <img src="/images/coral-avatar.jpeg" alt="Coral, embaixadora digital da Maré Coral, usando look fitness" />
              <div className="hero-card__caption">
                <span>Embaixadora digital</span>
                <strong>Foco. Força. Praia.</strong>
              </div>
            </div>
            <div className="floating-tag floating-tag--top">Niterói · RJ</div>
            <div className="floating-tag floating-tag--bottom">movimento real</div>
          </div>
        </section>

        <section className="shop-preview" id="loja">
          <div className="shop-preview__heading">
            <div>
              <p className="eyebrow">Coral de Largada · {status === 'connected' ? 'catálogo sincronizado' : status === 'loading' ? 'sincronizando catálogo' : 'catálogo demonstrativo'}</p>
              <h2>Peças que acompanham o seu movimento.</h2>
            </div>
            <p>{status === 'connected'
              ? `${products.length} ${products.length === 1 ? 'produto publicado' : 'produtos publicados'} no primeiro drop. Preço, imagens, cores, tamanhos e estoque vêm diretamente do painel Maré Coral.`
              : 'A vitrine demonstrativa permanece disponível enquanto o catálogo do painel é sincronizado.'}</p>
          </div>

          {status === 'demo' && error && (
            <div className="catalog-status" role="status">
              <span>Exibindo o catálogo demonstrativo enquanto o Meu Mostruário é configurado.</span>
              <button type="button" onClick={reload}>Tentar sincronizar</button>
            </div>
          )}

          {status === 'connected' && products.length === 0 && (
            <div className="catalog-status" role="status">
              <span>O primeiro drop ainda não tem produtos publicados no painel.</span>
            </div>
          )}

          <div className="product-grid">
            {products.map((product) => {
              const firstOption = getFirstAvailableOption(product)
              const available = getOptionStock(product, firstOption.color, firstOption.size)
              return <article className="product-card" key={product.id}>
                <div className="product-card__image">
                  {product.badge && <span className="product-card__badge">{product.badge}</span>}
                  <Link to={`/produto/${product.slug}`} aria-label={`Ver ${product.name}`}>
                    <img src={product.image} alt={`Coral apresentando ${product.name}`} style={{ objectPosition: product.imagePosition }} />
                  </Link>
                  <button
                    type="button"
                    className="product-card__quick-add"
                    disabled={available <= 0}
                    onClick={() => addItem({ productId: product.id, color: firstOption.color, size: firstOption.size })}
                    aria-label={available > 0 ? `Adicionar ${product.name} à sacola` : `${product.name} esgotado`}
                  >
                    <ShoppingBag size={17} /> {available > 0 ? 'Adicionar' : 'Esgotado'}
                  </button>
                </div>
                <div className="product-card__info">
                  <p>{product.category} · {product.sport}</p>
                  <h3><Link to={`/produto/${product.slug}`}>{product.name}</Link></h3>
                  <div>
                    <strong>{formatPrice(product.price)}</strong>
                    <span>ou 3x de {formatPrice(product.price / 3)}</span>
                  </div>
                </div>
              </article>
            })}
          </div>

          <a className="shop-preview__all" href="#colecoes">
            Encontrar sua modalidade <ArrowRight size={18} />
          </a>
        </section>

        <section className="marquee" aria-label="Valores da marca">
          <div className="marquee__track">
            <span>Treino</span><i />
            <span>Praia</span><i />
            <span>Cor</span><i />
            <span>Movimento</span><i />
            <span>Leveza</span><i />
            <span>Região Oceânica</span>
          </div>
        </section>

        <section className="section collections" id="colecoes">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Feita para a sua rotina</p>
              <h2>Uma maré para cada movimento.</h2>
            </div>
            <p>Linhas pensadas pelo uso — para você encontrar rápido a peça certa para o treino que ama.</p>
          </div>

          <div className="collection-grid">
            {collections.map(({ name, use, icon: Icon, tone }, index) => (
              <article className={`collection-card collection-card--${tone}`} key={name}>
                <div className="collection-card__index">0{index + 1}</div>
                <Icon className="collection-card__icon" aria-hidden="true" />
                <div>
                  <h3>{name}</h3>
                  <p>{use}</p>
                </div>
                <ChevronRight className="collection-card__arrow" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="manifesto">
          <div className="manifesto__statement">
            <p className="eyebrow eyebrow--light">Nosso jeito de fazer</p>
            <h2>Moda ativa com<br />alma de praia.</h2>
            <p>
              A Maré Coral nasce perto de quem vai vestir. Menos catálogo infinito, mais escolha com propósito, caimento e conversa de verdade.
            </p>
          </div>
          <div className="manifesto__pillars">
            <article>
              <span>01</span>
              <div><h3>Curadoria local</h3><p>Peças escolhidas para o clima, o ritmo e as modalidades da região.</p></div>
            </article>
            <article>
              <span>02</span>
              <div><h3>Entrega próxima</h3><p>Postagem em até 2 dias úteis e acompanhamento do pedido.</p></div>
            </article>
            <article>
              <span>03</span>
              <div><h3>Vida real</h3><p>Conforto, sustentação e estilo para o treino e tudo que vem depois.</p></div>
            </article>
          </div>
        </section>

        <section className="section coral-section" id="coral">
          <div className="coral-section__portrait">
            <div className="portrait-orbit" aria-hidden="true"><span>Coral</span><span>Coral</span></div>
            <img src="/images/coral-avatar.jpeg" alt="Retrato da Coral, persona digital da Maré Coral" />
          </div>
          <div className="coral-section__copy">
            <p className="eyebrow"><Sparkles size={18} /> Persona digital · embaixadora</p>
            <h2>Oi, eu sou a Coral.</h2>
            <p className="coral-section__lead">
              Eu visto os drops, experimento combinações e traduzo o lifestyle ativo da Região Oceânica em conteúdo para inspirar — sempre com transparência.
            </p>
            <blockquote>“Disciplina, constância e liberdade. O resto a maré ensina.”</blockquote>
            <div className="disclosure">
              <ShieldCheck size={22} />
              <p><strong>Transparência faz parte da marca.</strong> Coral é uma persona criada com IA e identificada como embaixadora digital em todo conteúdo.</p>
            </div>
          </div>
        </section>

        <section className="delivery" id="entrega">
          <div className="delivery__map" aria-hidden="true">
            <div className="map-ring map-ring--one" />
            <div className="map-ring map-ring--two" />
            <div className="map-pin"><MapPin /></div>
            {neighborhoods.map((neighborhood, index) => (
              <span className={`map-label map-label--${index + 1}`} key={neighborhood}>{neighborhood}</span>
            ))}
          </div>
          <div className="delivery__copy">
            <p className="eyebrow eyebrow--light"><MapPin size={18} /> De perto, do nosso jeito</p>
            <h2>Sua próxima peça pode chegar na próxima maré.</h2>
            <p>Postamos em até 2 dias úteis e enviamos para todo o Brasil, com prazo e valor calculados no checkout.</p>
            <ul>
              <li><Truck size={19} /> Envio nacional com rastreio</li>
              <li><Waves size={19} /> Postagem em até 2 dias úteis</li>
              <li><ShieldCheck size={19} /> Troca simples e atendimento próximo</li>
            </ul>
          </div>
        </section>

        <section className="vip-section" id="lista-vip">
          <div className="vip-section__glow" aria-hidden="true" />
          <p className="eyebrow eyebrow--light">Atendimento próximo</p>
          <h2>Do feed para a sua sacola.</h2>
          <p>Compre direto pelo site ou converse com a Maré Coral pelo Instagram e WhatsApp.</p>
          {whatsappUrl ? (
            <a className="button button--light" href={whatsappUrl} target="_blank" rel="noreferrer">
              Falar pelo WhatsApp <ArrowRight size={18} />
            </a>
          ) : (
            <span className="button button--light button--disabled" title="Configure VITE_WHATSAPP_URL no arquivo .env">
              WhatsApp em configuração
            </span>
          )}
          <small>Atendimento humano para medidas, entrega, troca e acompanhamento do pedido.</small>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__brand">
          <BrandMark inverted />
          <p>Fitwear para corpo, praia e movimento.</p>
        </div>
        <div className="site-footer__links">
          <div>
            <strong>Maré Coral</strong>
            <a href="#colecoes">Coleções</a>
            <a href="#coral">Conheça a Coral</a>
            <a href="#entrega">Entrega nacional</a>
          </div>
          <div>
            <strong>Informações</strong>
            <Link to="/politica-de-privacidade">Privacidade</Link>
            <Link to="/trocas-e-devolucoes">Trocas e devoluções</Link>
          </div>
          <div>
            <strong>Social</strong>
            {instagramUrl ? <a href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={16} /> Instagram</a> : <span className="social-placeholder"><Instagram size={16} /> Instagram em configuração</span>}
            {facebookUrl && <a href={facebookUrl} target="_blank" rel="noreferrer">Facebook</a>}
            {tiktokUrl && <a href={tiktokUrl} target="_blank" rel="noreferrer">TikTok</a>}
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© 2026 Maré Coral Fitwear</span>
          <span>Região Oceânica · Niterói, RJ</span>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
