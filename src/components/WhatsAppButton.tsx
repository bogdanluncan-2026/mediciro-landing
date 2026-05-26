export default function WhatsAppButton() {
  const phone = '40745779632'
  const message = encodeURIComponent('Bună ziua! Sunt interesat de platforma MediciRO pentru clinica mea.')
  const href = `https://wa.me/${phone}?text=${message}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactează-ne pe WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
      style={{ backgroundColor: '#25D366' }}
    >
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="white"
        className="w-8 h-8"
        aria-hidden="true"
      >
        <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.67 4.76 1.83 6.74L2 30l7.45-1.95A13.93 13.93 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.4a11.38 11.38 0 0 1-5.8-1.59l-.42-.25-4.42 1.16 1.18-4.3-.27-.44A11.4 11.4 0 1 1 16 27.4zm6.26-8.54c-.34-.17-2.02-1-2.33-1.11-.32-.11-.55-.17-.78.17s-.9 1.11-1.1 1.34c-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69a10.3 10.3 0 0 1-1.9-2.36c-.2-.34-.02-.53.15-.7.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.07-2.57-.28-.68-.57-.59-.78-.6h-.67c-.23 0-.6.09-.91.43-.32.34-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.87 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.02-.83 2.31-1.62.28-.8.28-1.48.2-1.62-.09-.14-.32-.23-.66-.4z" />
      </svg>
    </a>
  )
}
