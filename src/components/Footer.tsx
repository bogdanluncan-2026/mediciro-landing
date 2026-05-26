import content from '../content'

export default function Footer({ onDocsClick }: { onDocsClick?: () => void }) {
  const { footer, meta } = content

  const copyright = footer.copyright
    .replace('{year}', new Date().getFullYear().toString())
    .replace('{company}', meta.companyName)

  return (
    <footer className="bg-ink text-white px-6 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#" className="flex items-center mb-4">
              <img src="/logo.svg" alt="MediciRO" className="h-9 w-auto brightness-0 invert" />
            </a>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{footer.description}</p>
            <p className="text-sm text-gray-500 mt-4">
              {footer.developedBy}{' '}
              <a
                href={meta.companyUrl}
                className="text-gray-300 hover:text-white transition-colors underline underline-offset-2"
              >
                {meta.companyName}
              </a>
            </p>
          </div>

          {/* Links */}
          {footer.columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">{column.title}</h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {(link as any).isDocsLink ? (
                      <button
                        onClick={onDocsClick}
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200 text-left"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-gray-500">{copyright}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            {footer.statusText}
          </div>
        </div>
      </div>
    </footer>
  )
}
