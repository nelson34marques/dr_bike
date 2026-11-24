import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, CalendarCheck, ShoppingBag, ShieldCheck, Truck, Stethoscope, Cog,
  MessageCircle, MapPin, Clock, Phone, Wrench, PackageCheck, ClipboardList,
} from 'lucide-react'
import Icon from '../components/Icon'
import ImageSlot from '../components/ImageSlot'
import ProductCard from '../components/ProductCard'
import SectionHead from '../components/SectionHead'
import HeroCanvas from '../components/HeroCanvas'
import Ticker from '../components/Ticker'
import { categories, services, site, stats, fmtPrice, waLink } from '../config/site'
import { listProducts } from '../lib/db'

const trust = [
  { icon: Stethoscope, t: 'Diagnóstico rápido', d: 'Avaliação honesta antes de qualquer reparação.' },
  { icon: Cog, t: 'Peças de qualidade', d: 'Componentes testados e compatíveis.' },
  { icon: ShieldCheck, t: 'Garantia no serviço', d: 'Trabalho garantido. Se falhar, voltamos a ver.' },
  { icon: Truck, t: 'Recolha e entrega', d: 'Vamos buscar e entregamos na tua porta.' },
]

const steps = [
  { icon: ClipboardList, n: '01', t: 'Marca', d: 'Preenche o formulário ou envia mensagem no WhatsApp com o problema.' },
  { icon: Wrench, n: '02', t: 'Diagnóstico e orçamento', d: 'Avaliamos, dizemos o preço e só avançamos com a tua aprovação.' },
  { icon: PackageCheck, n: '03', t: 'Pronto a rolar', d: 'Reparação feita, testada e entregue. Com garantia.' },
]

function StatCounter({ value, label }) {
  const ref = useRef(null)
  const startedRef = useRef(false)
  const [n, setN] = useState(0)
  const str = String(value)
  const m = str.match(/^(\D*)(\d+)(.*)$/)
  const pre = m ? m[1] : ''
  const target = m ? parseInt(m[2], 10) : 0
  const suf = m ? m[3] : ''

  useEffect(() => {
    const el = ref.current
    if (!el || !m) return
    const run = () => {
      if (startedRef.current) return
      startedRef.current = true
      const dur = 1200
      const t0 = performance.now()
      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1)
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(tick)
        else setN(target)
      }
      requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        run()
        io.disconnect()
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [target])

  return (
    <div ref={ref} className="text-center lg:text-left">
      <div className="font-display text-5xl font-black leading-none sm:text-6xl">
        {m ? `${pre}${n}${suf}` : value}
      </div>
      <div className="mt-1 font-display text-sm font-bold uppercase tracking-widest">{label}</div>
    </div>
  )
}

function StatsSection() {
  return (
      <section className="bg-hot text-on-brand">
        <div className="container-x grid grid-cols-2 gap-y-8 py-12 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCounter key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </section>
  )
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [trustIdx, setTrustIdx] = useState(0)
  useEffect(() => {
    listProducts().then((all) => setFeatured(all.filter((p) => p.featured).slice(0, 3)))
  }, [])
  useEffect(() => {
    const id = setInterval(() => setTrustIdx((i) => (i + 1) % trust.length), 2800)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <HeroCanvas className="opacity-80" />
        <div className="glow pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px]" aria-hidden="true" />
        <div className="glow pointer-events-none absolute -bottom-56 -left-40 h-[480px] w-[480px] opacity-60" aria-hidden="true" />
        <span className="outline-text pointer-events-none absolute -bottom-6 left-1/2 hidden -translate-x-1/2 select-none whitespace-nowrap font-display text-[14rem] font-black uppercase leading-none lg:block" aria-hidden="true">
          Dr.Bike
        </span>

        <div className="container-x relative grid items-center gap-10 py-8 sm:py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="eyebrow rise">{site.tagline} · Luanda</span>
            <h1 className="rise rise-2 mt-4 text-4xl leading-[0.95] sm:text-6xl lg:text-8xl">
              Reparamos <br />
              <span className="text-glow">o que te move.</span>
            </h1>
            <p className="rise rise-3 mt-4 max-w-lg text-sm text-fg/85 sm:mt-6 sm:text-lg">
              Bicicletas, motos elétricas, baterias e cadeiras de rodas. Assistência técnica, peças e acessórios num só lugar.
            </p>
            <div className="rise rise-3 mt-6 flex flex-nowrap gap-2 sm:mt-8 sm:gap-3">
              <Link to="/marcacao" className="btn btn-primary flex-1 px-3 py-2 text-sm sm:flex-none sm:px-6 sm:py-3 sm:text-base">
                <CalendarCheck size={18} /> Marcar assistência
              </Link>
              <Link to="/loja" className="btn btn-outline flex-1 px-3 py-2 text-sm sm:flex-none sm:px-6 sm:py-3 sm:text-base">
                <ShoppingBag size={18} /> Ver loja
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-fg-2">
              <span className="flex items-center gap-2"><Clock size={16} className="text-brand" /> {site.hours[0].d} {site.hours[0].h}</span>
              <span className="flex items-center gap-2"><Phone size={16} className="text-brand" /> {site.phoneDisplay}</span>
            </div>
          </div>

          <div className="rise rise-2 relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-ink-2/90">
              <img
                src="https://images.pexels.com/photos/10263879/pexels-photo-10263879.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Mecânico a reparar uma bicicleta na oficina Dr. Bike"
                className="h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              <span className="absolute bottom-0 left-0 h-1.5 w-28 bg-gradient-to-r from-brand to-hot" aria-hidden="true" />
            </div>
            {/* selo flutuante */}
            <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-sm border border-line bg-ink px-4 py-3 sm:-left-6">
              <span className="grid h-10 w-10 place-items-center rounded-sm bg-hot text-on-brand"><ShieldCheck size={22} /></span>
              <div className="leading-tight">
                <div className="font-display text-base font-bold uppercase tracking-wide">Garantia no serviço</div>
                <div className="text-xs text-fg-2">Orçamento antes de reparar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAIXA EM MOVIMENTO */}
      <Ticker items={[...categories.map((c) => c.label), 'Reparação', 'Peças originais', 'Recolha e entrega']} />

      {/* TRUST */}
      <section className="border-b border-line bg-ink-2">
        <div className="container-x hidden gap-px sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {trust.map(({ icon: I, t, d }) => (
            <div key={t} className="group flex gap-4 py-8 lg:pr-8">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-brand text-on-brand transition-colors group-hover:bg-hot"><I size={22} /></span>
              <div>
                <h3 className="text-lg">{t}</h3>
                <p className="mt-1 text-sm text-fg-2">{d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="container-x mt-4 py-10 sm:hidden">
          <div className="relative h-32 overflow-hidden">
            {trust.map(({ icon: I, t, d }, i) => {
              const len = trust.length
              let off = i - trustIdx
              if (off > len / 2) off -= len
              if (off < -len / 2) off += len
              const active = off === 0
              const near = Math.abs(off) === 1
              return (
                <div
                  key={t}
                  className="absolute inset-x-0 top-1/2 flex gap-4 transition-all duration-500 ease-out"
                  style={{
                    transform: `translateY(calc(-50% + ${off * 7}rem)) scale(${active ? 1 : 0.88})`,
                    opacity: active ? 1 : near ? 0.12 : 0,
                    zIndex: active ? 2 : 1,
                  }}
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-brand text-on-brand"><I size={22} /></span>
                  <div>
                    <h3 className="text-lg">{t}</h3>
                    <p className="mt-1 text-sm text-fg-2">{d}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="container-x py-20">
        <SectionHead eyebrow="Especialidades" title="O que tratamos" text="Cada tipo de veículo tem as suas particularidades. Conhecemos todas." />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link key={c.id} to={`/loja?categoria=${c.id}`} className="card card-hover group flex flex-col items-center gap-3 p-6 text-center transition-colors hover:border-brand/60 hover:bg-ink-3">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-on-brand">
                <Icon name={c.icon} size={28} />
              </span>
              <span className="font-display text-lg font-bold uppercase leading-tight tracking-wide group-hover:text-brand">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* NÚMEROS */}
      <StatsSection />

      {/* SERVIÇOS */}
      <section className="dots relative border-y border-line bg-ink-2">
        <div className="glow pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] opacity-50" aria-hidden="true" />
        <div className="container-x relative py-20">
          <SectionHead
            eyebrow="Oficina"
            title="Serviços"
            text="Preços a partir de. O orçamento final é confirmado depois do diagnóstico."
            action={<Link to="/servicos" className="btn btn-outline">Todos os serviços <ArrowRight size={18} /></Link>}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((s) => (
              <div key={s.id} className="card card-hover flex flex-col p-6 transition-colors hover:bg-ink-3">
                <Icon name={s.icon} size={28} className="text-brand" />
                <h3 className="mt-4 text-2xl">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm text-fg-2">{s.desc}</p>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                  <span className="text-sm text-fg-3">Desde <span className="font-display text-lg font-bold text-fg">{fmtPrice(s.from)}</span></span>
                  <Link to={`/marcacao?servico=${s.id}`} className="btn btn-ghost btn-sm text-brand">Marcar <ArrowRight size={16} /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUTOS EM DESTAQUE */}
      <section className="container-x py-20">
        <SectionHead
          eyebrow="Loja"
          title="Em destaque"
          text="Peças, acessórios, baterias e veículos. Encomenda online e levanta na loja ou recebe em casa."
          action={<Link to="/loja" className="btn btn-outline">Ver toda a loja <ArrowRight size={18} /></Link>}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-y border-line bg-ink-2">
        <div className="container-x py-20">
          <SectionHead eyebrow="Simples" title="Como funciona" align="center" />
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map(({ icon: I, n, t, d }) => (
              <div key={n} className="card card-hover relative p-7 transition-colors hover:bg-ink-3">
                <span className="text-glow absolute right-5 top-4 font-display text-5xl font-black opacity-40">{n}</span>
                <I size={30} className="text-brand" />
                <h3 className="mt-5 text-2xl">{t}</h3>
                <p className="mt-2 text-sm text-fg-2">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="container-x grid items-center gap-10 py-20 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute -left-4 -top-4 h-24 w-24 stripe opacity-70" aria-hidden="true" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-ink-2">
            <img
              src="https://images.pexels.com/photos/33506466/pexels-photo-33506466.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Interior da oficina Dr. Bike com mecânico a trabalhar"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <div>
          <span className="eyebrow">Sobre nós</span>
          <h2 className="mt-3 text-5xl leading-none">Mecânica com paixão por duas rodas e mobilidade.</h2>
          <p className="mt-5 text-fg-2">
            O Dr. Bike nasceu de uma oficina de bairro e cresceu com a confiança dos clientes. Hoje reparamos desde a bicicleta de todos os dias
            até motos elétricas e cadeiras de rodas, com a mesma atenção ao detalhe.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {['Técnicos certificados', 'Orçamento antes de reparar', 'Peças originais e compatíveis', 'Garantia escrita'].map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm"><ShieldCheck size={18} className="text-brand" /> {t}</li>
            ))}
          </ul>
          <Link to="/contactos" className="btn btn-outline mt-8">Visitar a oficina <ArrowRight size={18} /></Link>
        </div>
      </section>

      {/* CTA WHATSAPP */}
      <section className="bg-hot text-on-brand">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="text-4xl leading-none sm:text-5xl">Precisas de ajuda agora?</h2>
            <p className="mt-2 font-medium">Fala connosco no WhatsApp. Respondemos em horário de expediente.</p>
          </div>
          <a href={waLink('Olá Dr. Bike! Preciso de ajuda com o meu veículo.')} target="_blank" rel="noreferrer" className="btn btn-lg bg-[#0b0b0c] text-[#f4f4f1] hover:bg-[#1b1b1e]">
            <MessageCircle size={20} /> Abrir WhatsApp
          </a>
        </div>
      </section>

      {/* CONTACTO RÁPIDO */}
      <section className="container-x grid gap-4 py-12 sm:py-20 md:grid-cols-3">
        <div className="card p-6">
          <MapPin size={26} className="text-brand" />
          <h3 className="mt-4 text-xl">Morada</h3>
          <p className="mt-1 text-sm text-fg-2">{site.address}</p>
          <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-brand">Abrir no mapa <ArrowRight size={14} /></a>
        </div>
        <div className="card p-6">
          <Clock size={26} className="text-brand" />
          <h3 className="mt-4 text-xl">Horário</h3>
          <ul className="mt-1 space-y-1 text-sm text-fg-2">
            {site.hours.map((h) => <li key={h.d}><span className="text-fg">{h.d}</span> · {h.h}</li>)}
          </ul>
        </div>
        <div className="card p-6">
          <Phone size={26} className="text-brand" />
          <h3 className="mt-4 text-xl">Telefone</h3>
          <p className="mt-1 text-sm text-fg-2">{site.phoneDisplay}</p>
          <a href={`tel:${site.whatsapp}`} className="mt-3 inline-flex items-center gap-1 text-sm text-brand">Ligar agora <ArrowRight size={14} /></a>
        </div>
      </section>
    </>
  )
}
