import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { site, waLink } from '../config/site'

export default function Contactos() {
  const mapEmbed = 'https://www.google.com/maps?q=-8.982147,13.249299&z=17&output=embed'

  return (
    <div className="container-x py-10 sm:py-16">
      <span className="eyebrow">Fala connosco</span>
      <h1 className="mt-2 text-5xl leading-none sm:text-6xl">Contactos</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="card flex gap-4 p-6">
            <MapPin size={24} className="shrink-0 text-brand" />
            <div>
              <h3 className="text-xl">Morada</h3>
              <p className="mt-1 text-fg-2">{site.address}</p>
              <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-brand">Abrir no Google Maps</a>
            </div>
          </div>
          <div className="card flex gap-4 p-6">
            <Phone size={24} className="shrink-0 text-brand" />
            <div>
              <h3 className="text-xl">Telefone e WhatsApp</h3>
              <a href={`tel:${site.whatsapp}`} className="mt-1 block text-fg-2 hover:text-brand">{site.phoneDisplay}</a>
              <a href={waLink('Olá Dr. Bike!')} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm mt-3"><MessageCircle size={16} /> Abrir WhatsApp</a>
            </div>
          </div>
          <div className="card flex gap-4 p-6">
            <Mail size={24} className="shrink-0 text-brand" />
            <div>
              <h3 className="text-xl">Email</h3>
              <a href={`mailto:${site.email}`} className="mt-1 block text-fg-2 hover:text-brand">{site.email}</a>
            </div>
          </div>
          <div className="card flex gap-4 p-6">
            <Clock size={24} className="shrink-0 text-brand" />
            <div>
              <h3 className="text-xl">Horário</h3>
              <ul className="mt-1 space-y-1 text-fg-2">
                {site.hours.map((h) => <li key={h.d}><span className="text-fg">{h.d}</span> · {h.h}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="min-h-80 overflow-hidden rounded-md border border-line bg-ink-2">
          <iframe
            title="Mapa - Dr. Bike"
            src={mapEmbed}
            className="h-full min-h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}
