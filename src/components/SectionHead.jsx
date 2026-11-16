export default function SectionHead({ eyebrow, title, text, action, align = 'left' }) {
  return (
    <div className={`mb-8 flex flex-col gap-4 sm:mb-10 ${align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}>
      <div className="max-w-2xl">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="mt-2 text-3xl leading-tight sm:text-5xl">{title}</h2>
        {text && <p className="mt-3 text-sm text-fg-2 sm:text-base">{text}</p>}
      </div>
      {action && <div className="w-full sm:w-auto">{action}</div>}
    </div>
  )
}


