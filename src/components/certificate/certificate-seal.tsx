// Selo do certificado: roseta com o texto em volta, a estrela da marca no centro e duas fitas
const CENTER = 100
// Circunferência do caminho do texto (raio 62), menos um respiro para a emenda não colar
const TEXT_LENGTH = Math.round(2 * Math.PI * 62 - 6)
const points = Array.from({ length: 32 }, (_, index) => {
  const radius = index % 2 === 0 ? 92 : 84
  const angle = (Math.PI * 2 * index) / 32 - Math.PI / 2
  return `${(CENTER + radius * Math.cos(angle)).toFixed(2)},${(CENTER + radius * Math.sin(angle)).toFixed(2)}`
}).join(' ')

export function CertificateSeal({ year, className }: { year: number; className?: string }) {
  return (
    <svg viewBox="0 0 200 250" className={className} aria-hidden>
      <defs>
        <path id="selo-texto" d="M100,100 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0" />
      </defs>
      <path d="M62 170 L46 244 L72 228 L86 250 L96 176 Z" className="fill-sage" />
      <path d="M138 170 L154 244 L128 228 L114 250 L104 176 Z" className="fill-sage-light" />
      <polygon points={points} className="fill-lime" />
      <circle cx={CENTER} cy={CENTER} r="76" className="fill-pine" />
      <circle cx={CENTER} cy={CENTER} r="72" className="fill-none stroke-lime/40" strokeWidth="1" />
      <circle
        cx={CENTER}
        cy={CENTER}
        r="54"
        className="fill-none stroke-lime/40"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      {/* textLength faz a frase dar exatamente uma volta, sem sobrar nem encavalar */}
      <text className="fill-lime font-mono" fontSize="10.5" fontWeight="600">
        <textPath href="#selo-texto" textLength={TEXT_LENGTH} lengthAdjust="spacing">
          INSTASANY • CURSO CONCLUÍDO • CERTIFICADO •
        </textPath>
      </text>
      <path
        d="M100 70 C102 88 108 96 126 100 C108 104 102 112 100 130 C98 112 92 104 74 100 C92 96 98 88 100 70 Z"
        className="fill-lime"
      />
      <text x={CENTER} y="143" textAnchor="middle" className="fill-paper/70 font-mono" fontSize="11" letterSpacing="2">
        {year}
      </text>
    </svg>
  )
}
