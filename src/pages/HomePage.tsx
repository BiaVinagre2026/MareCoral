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
  ShieldCheck,
  Sparkles,
  Sun,
  Truck,
  Waves,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import BrandMark from '../components/BrandMark.tsx'

const collections = [
  { name: 'Maré Areia', use: 'Beach tennis & praia', icon: Sun, tone: 'orange' },
  { name: 'Maré Studio', use: 'Academia & pilates', icon: Sparkles, tone: 'pink' },
  { name: 'Maré Box', use: 'Crossfit & intensidade', icon: Dumbbell, tone: 'graphite' },
  { name: 'Maré Run', use: 'Corrida & caminhada', icon: Footprints, tone: 'aqua' },
]

const neighborhoods = ['Camboinhas', 'Itaipu', 'Itacoatiara', 'Piratininga', 'Maravista']

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL as string | undefined

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <div className="announcement">
        <span>Primeiro drop em preparação</span>
        <span className="announcement__dot" aria-hidden="true" />
        <strong>Região Oceânica · Niterói</strong>
      </div>

      <header className="site-header">
        <a className="brand-link" href="#inicio" aria-label="Maré Coral — início">
          <BrandMark />
        </a>

        <nav className={`desktop-nav ${menuOpen ? 'desktop-nav--open' : ''}`} aria-label="Navegação principal">
          <a href="#colecoes" onClick={closeMenu}>Coleções</a>
          <a href="#coral" onClick={closeMenu}>Conheça a Coral</a>
          <a href="#entrega" onClick={closeMenu}>Entrega local</a>
          <a href="#lista-vip" className="nav-cta" onClick={closeMenu}>Lista VIP</a>
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
            <p className="eyebrow"><Waves size={18} /> Corpo, praia e movimento</p>
            <h1>Vista o treino.<br /><em>Sinta a maré.</em></h1>
            <p className="hero__lead">
              Fitwear com energia de praia, curadoria local e entrega rápida para acompanhar sua rotina — do treino à areia.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="#lista-vip">
                Quero acesso ao primeiro drop <ArrowRight size={18} />
              </a>
              <a className="button button--ghost" href="#colecoes">Explorar a Maré</a>
            </div>
            <div className="hero__trust">
              <span><BadgeCheck size={17} /> Curadoria local</span>
              <span><Truck size={17} /> Entrega na Região Oceânica</span>
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
              <div><h3>Entrega próxima</h3><p>Agilidade local para seu look não perder a próxima aula ou partida.</p></div>
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
            <p>Estamos estruturando entrega rápida para a Região Oceânica e envio para todo o Brasil.</p>
            <ul>
              <li><Truck size={19} /> Entrega local expressa</li>
              <li><Waves size={19} /> Retirada em ponto parceiro</li>
              <li><ShieldCheck size={19} /> Troca simples e atendimento próximo</li>
            </ul>
          </div>
        </section>

        <section className="vip-section" id="lista-vip">
          <div className="vip-section__glow" aria-hidden="true" />
          <p className="eyebrow eyebrow--light">Primeiro drop · Coral de Largada</p>
          <h2>Chegue antes da maré.</h2>
          <p>Entre na lista VIP para receber tamanhos, cores e acesso antecipado ao primeiro drop.</p>
          {whatsappUrl ? (
            <a className="button button--light" href={whatsappUrl} target="_blank" rel="noreferrer">
              Entrar pelo WhatsApp <ArrowRight size={18} />
            </a>
          ) : (
            <span className="button button--light button--disabled" title="Configure VITE_WHATSAPP_URL no arquivo .env">
              WhatsApp em configuração
            </span>
          )}
          <small>Sem spam. Só novidades, drops e convite para experimentar.</small>
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
            <a href="#entrega">Entrega local</a>
          </div>
          <div>
            <strong>Informações</strong>
            <Link to="/politica-de-privacidade">Privacidade</Link>
            <Link to="/trocas-e-devolucoes">Trocas e devoluções</Link>
          </div>
          <div>
            <strong>Social</strong>
            <span className="social-placeholder"><Instagram size={16} /> @marecoralfitwear</span>
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
