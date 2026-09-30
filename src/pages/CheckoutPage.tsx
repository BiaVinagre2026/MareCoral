import { ArrowLeft, CheckCircle2, Instagram, LoaderCircle, LockKeyhole, ShoppingBag, Truck } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import StoreHeader from '../components/StoreHeader.tsx'
import { useCart } from '../context/CartContext.tsx'
import { useCatalog } from '../context/CatalogContext.tsx'
import { formatPrice, getColorImage, getOptionPrice } from '../data/products.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { checkoutEnabled, createCheckoutSession, quoteShipping, type ShippingQuote } from '../services/paymentGateway.ts'
import { isCurrentShippingQuote, shippingQuoteKey } from '../services/checkoutPresentation.ts'
import { brazilStates, requiredText, validEmail, validPhone, validPostalCode, validState } from '../services/checkoutValidation.ts'

type CheckoutForm = {
  name: string
  email: string
  phone: string
  document: string
  postalCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  terms: boolean
}

function CheckoutPage() {
  const { lines, subtotal, openCart, clearCart } = useCart()
  const { products, allowOrder, allowPayment, status: catalogStatus, reload: reloadCatalog } = useCatalog()
  const [notice, setNotice] = useState('')
  const [pixCode, setPixCode] = useState('')
  const [completedOrderId, setCompletedOrderId] = useState<number | null>(null)
  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | null>(null)
  const [quotedKey, setQuotedKey] = useState('')
  const [quoteAttemptKey, setQuoteAttemptKey] = useState('')
  const [shippingNotice, setShippingNotice] = useState('')
  const [isQuoting, setIsQuoting] = useState(false)
  const { register, handleSubmit, getValues, watch, formState: { errors, isSubmitting } } = useForm<CheckoutForm>()
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL as string | undefined
  const currentPostalCode = watch('postalCode', '').replace(/\D/g, '')
  const currentQuoteKey = shippingQuoteKey(currentPostalCode, lines, subtotal)
  const activeQuote = isCurrentShippingQuote(shippingQuote, quotedKey, currentQuoteKey, subtotal) ? shippingQuote : null
  usePageMeta({ title: 'Checkout | Maré Coral Fitwear', description: 'Finalize seu pedido Maré Coral com segurança.' })

  const fieldA11y = (name: keyof CheckoutForm) => ({
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `checkout-${name}-error` : undefined,
  })
  const fieldError = (name: keyof CheckoutForm) => errors[name]
    ? <small id={`checkout-${name}-error`} role="alert">{errors[name]?.message}</small>
    : null

  const handleShippingQuote = async () => {
    const postalCode = getValues('postalCode').replace(/\D/g, '')
    const requestKey = shippingQuoteKey(postalCode, lines, subtotal)
    setQuoteAttemptKey(requestKey)
    setShippingQuote(null)
    setShippingNotice('')
    if (!/^\d{8}$/.test(postalCode)) {
      setShippingNotice('Informe um CEP com 8 números.')
      return
    }

    setIsQuoting(true)
    try {
      const quote = await quoteShipping({ postalCode, lines, products })
      setShippingQuote(quote)
      setQuotedKey(requestKey)
      setShippingNotice(Math.round(quote.subtotal * 100) !== Math.round(subtotal * 100)
        ? 'O preço foi atualizado. Atualize a loja e revise a sacola antes de concluir.'
        : quote.configured
        ? `${quote.method}${quote.estimatedDays ? ` · prazo estimado de ${quote.estimatedDays} dias úteis` : ''}.`
        : 'A regra de frete ainda está sendo configurada. O pedido pode ser registrado sem cobrança.')
    } catch (error) {
      setShippingNotice(error instanceof Error ? error.message : 'Não foi possível calcular o frete.')
    } finally {
      setIsQuoting(false)
    }
  }

  const onSubmit = async (data: CheckoutForm) => {
    setNotice('')
    if (!allowOrder || !checkoutEnabled || isQuoting || (allowPayment && !activeQuote?.configured)) {
      setNotice('Confira a disponibilidade da loja e calcule o frete antes de continuar.')
      return
    }
    try {
      const result = await createCheckoutSession({
        customer: { name: data.name, email: data.email, phone: data.phone, document: data.document },
        shippingAddress: {
          postalCode: data.postalCode,
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
        },
        lines,
        products,
      })
      if (result.status === 'configuration_required') {
        setNotice('As vendas online ainda não foram abertas. Em breve você poderá concluir sua compra por aqui.')
      } else {
        if (result.status === 'redirect') {
          clearCart()
          window.location.assign(result.checkoutUrl)
        } else if (result.status === 'pix') {
          setPixCode(result.qrCode)
          setCompletedOrderId(result.orderId)
          setNotice(`Pedido ${result.orderId} criado. Copie o código PIX abaixo para pagar.`)
          clearCart()
        } else if (result.status === 'payment_failed') {
          setCompletedOrderId(result.orderId)
          setNotice(`${result.message} O estoque ficou reservado; não envie o pedido novamente. Entre em contato para concluirmos o pagamento.`)
          clearCart()
        } else {
          const delivery = result.shipping.configured
            ? ` ${result.shipping.method} incluído no total.`
            : ' O frete será confirmado no atendimento.'
          setCompletedOrderId(result.orderId)
          setNotice(`Pedido ${result.orderId} registrado com estoque reservado.${delivery}`)
          clearCart()
        }
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Não foi possível iniciar o pagamento.')
    }
  }

  return (
    <div className="store-page checkout-shell">
      <StoreHeader />
      <main className="checkout-page">
        <Link className="checkout-back" to="/"><ArrowLeft size={16} /> Continuar comprando</Link>
        <div className="checkout-heading"><p className="eyebrow"><LockKeyhole size={17} /> Compra segura</p><h1>Finalize sua compra.</h1><p>Revise seus dados, a entrega e o pedido antes de concluir.</p></div>

        {catalogStatus === 'loading' && !completedOrderId ? (
          <section className="checkout-empty" role="status"><LoaderCircle className="spin" size={32} /><h2>Atualizando sua sacola…</h2><p>Estamos conferindo preços e disponibilidade antes de concluir.</p></section>
        ) : catalogStatus === 'error' && !completedOrderId ? (
          <section className="checkout-empty" role="alert"><h2>Não conseguimos atualizar as peças.</h2><p>Sua sacola foi mantida. Tente novamente para conferir o estoque e continuar sem duplicar o pedido.</p><button className="button button--primary" type="button" onClick={reloadCatalog}>Tentar novamente</button></section>
        ) : lines.length === 0 ? completedOrderId ? (
          <section className="checkout-empty checkout-success">
            <CheckCircle2 size={42} />
            <h2>Pedido #{completedOrderId} recebido.</h2>
            <p>{notice}</p>
            {pixCode && <label className="pix-code">PIX copia e cola<textarea value={pixCode} readOnly rows={4} onFocus={(event) => event.currentTarget.select()} /></label>}
            <Link className="button button--primary" to="/#loja">Voltar para a loja</Link>
          </section>
        ) : (
          <section className="checkout-empty"><ShoppingBag size={38} /><h2>Sua sacola está vazia.</h2><p>Volte à vitrine e escolha as peças do primeiro drop.</p><Link className="button button--primary" to="/#loja">Ver o drop</Link></section>
        ) : (
          <div className="checkout-grid">
            <form className="checkout-form" noValidate onSubmit={handleSubmit(onSubmit)}>
              <section>
                <span>1</span><div><h2>Seus dados</h2><p>Usados somente para pedido, entrega e atendimento.</p></div>
                <label>Nome completo<input {...register('name', { validate: (value) => requiredText(value) || 'Informe seu nome completo.' })} {...fieldA11y('name')} autoComplete="name" />{fieldError('name')}</label>
                <div className="form-row">
                  <label>E-mail<input type="email" {...register('email', { validate: (value) => validEmail(value) || 'Informe um e-mail válido.' })} {...fieldA11y('email')} autoComplete="email" autoCapitalize="none" />{fieldError('email')}</label>
                  <label>Telefone<input type="tel" {...register('phone', { validate: (value) => validPhone(value) || 'Informe o telefone com DDD.' })} {...fieldA11y('phone')} autoComplete="tel" placeholder="(21) 99999-9999" />{fieldError('phone')}</label>
                </div>
                <label>CPF ou CNPJ<input {...register('document', { validate: (value) => !allowPayment || requiredText(value) || 'Informe o CPF ou CNPJ para o pagamento.' })} {...fieldA11y('document')} inputMode="numeric" autoComplete="off" placeholder={allowPayment ? 'Obrigatório para gerar a cobrança' : 'Opcional'} />{fieldError('document')}</label>
              </section>
              <section>
                <span>2</span><div><h2>Entrega</h2><p>Enviamos para todo o Brasil e postamos em até 2 dias úteis. Frete grátis acima de R$ 200 em produtos; até esse valor, a tarifa está em definição.</p></div>
                <div className="form-row form-row--short">
                  <label>CEP<input {...register('postalCode', { validate: (value) => validPostalCode(value) || 'Informe um CEP com 8 números.' })} {...fieldA11y('postalCode')} maxLength={9} inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" />{fieldError('postalCode')}</label>
                  <label>Estado<select {...register('state', { validate: (value) => validState(value) || 'Selecione o estado de entrega.' })} {...fieldA11y('state')} autoComplete="address-level1" defaultValue=""><option value="" disabled>UF</option>{brazilStates.map((state) => <option key={state} value={state}>{state}</option>)}</select>{fieldError('state')}</label>
                </div>
                <div className="shipping-quote-action">
                  <button type="button" onClick={handleShippingQuote} disabled={isQuoting || !checkoutEnabled}>
                    {isQuoting ? <LoaderCircle className="spin" size={17} /> : <Truck size={17} />}
                    {isQuoting ? 'Calculando…' : 'Calcular frete'}
                  </button>
                  {shippingNotice && quoteAttemptKey === currentQuoteKey && <p role="status">{shippingNotice}</p>}
                </div>
                <label>Endereço<input {...register('street', { validate: (value) => requiredText(value) || 'Informe a rua ou avenida.' })} {...fieldA11y('street')} autoComplete="address-line1" />{fieldError('street')}</label>
                <div className="form-row"><label>Número<input {...register('number', { validate: (value) => requiredText(value) || 'Informe o número ou S/N.' })} {...fieldA11y('number')} />{fieldError('number')}</label><label>Complemento<input {...register('complement')} autoComplete="address-line2" /></label></div>
                <div className="form-row"><label>Bairro<input {...register('neighborhood', { validate: (value) => requiredText(value) || 'Informe o bairro.' })} {...fieldA11y('neighborhood')} />{fieldError('neighborhood')}</label><label>Cidade<input {...register('city', { validate: (value) => requiredText(value) || 'Informe a cidade.' })} {...fieldA11y('city')} autoComplete="address-level2" />{fieldError('city')}</label></div>
              </section>
              <section className="checkout-payment">
                <span>3</span><div><h2>Pagamento</h2><p>Confira abaixo a disponibilidade do pagamento para o seu pedido.</p></div>
                <div className="gateway-placeholder"><LockKeyhole /><div><strong>Pagamento seguro</strong><p>{checkoutEnabled && allowOrder ? (allowPayment ? 'Pagamento online disponível para este pedido.' : 'Seu pedido será registrado; o pagamento online estará disponível em breve.') : catalogStatus === 'connected' ? 'Estamos finalizando a abertura das vendas.' : 'Estamos atualizando a disponibilidade das peças.'}</p></div></div>
                <label className="terms-check"><input type="checkbox" {...register('terms', { required: 'Confirme as políticas para continuar.' })} {...fieldA11y('terms')} /><span>Li e concordo com a <Link to="/politica-de-privacidade">política de privacidade</Link> e as <Link to="/trocas-e-devolucoes">regras de troca</Link>.</span></label>
                {fieldError('terms')}
                <button className="button button--primary" type="submit" disabled={isSubmitting || isQuoting || !checkoutEnabled || !allowOrder || (allowPayment && !activeQuote?.configured)}>{isSubmitting ? 'Preparando…' : checkoutEnabled && allowOrder ? allowPayment ? 'Ir para o pagamento' : 'Finalizar pedido' : 'Vendas em breve'}</button>
                {allowPayment && !activeQuote?.configured && <small>Calcule o frete antes de seguir para o pagamento.</small>}
                {notice && <div className="checkout-notice"><CheckCircle2 />{notice}</div>}
                {pixCode && <label className="pix-code">PIX copia e cola<textarea value={pixCode} readOnly rows={4} onFocus={(event) => event.currentTarget.select()} /></label>}
              </section>
            </form>

            <aside className="order-summary">
              <div className="order-summary__title"><h2>Resumo</h2><button type="button" onClick={openCart}>Editar sacola</button></div>
              {lines.map((line) => {
                const product = products.find((candidate) => candidate.id === line.productId)
                const image = product ? getColorImage(product, line.color) || product.image : ''
                return product ? <article key={`${line.productId}-${line.color}-${line.size}`}><img src={image} alt="" style={{ objectPosition: product.imagePosition }} /><div><strong>{product.name}</strong><span>{line.color} · {line.size} · Qtd. {line.quantity}</span></div><b>{formatPrice(getOptionPrice(product, line.color, line.size) * line.quantity)}</b></article> : null
              })}
              <div className="order-summary__totals"><p><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></p><p><span>Frete</span><strong>{activeQuote ? activeQuote.configured ? formatPrice(activeQuote.amount) : 'A combinar' : 'Informe o CEP'}</strong></p><div><span>{activeQuote?.configured ? 'Total' : 'Total parcial'}</span><strong>{formatPrice(subtotal + (activeQuote?.configured ? activeQuote.amount : 0))}</strong></div></div>
              {instagramUrl && <a className="social-checkout" href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={18} /> Prefere atendimento pelo Instagram?</a>}
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

export default CheckoutPage
