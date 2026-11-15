// Remonta a cada navegação no painel: cada página entra com um fade curto
export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-in duration-300 ease-out fade-in slide-in-from-bottom-2">{children}</div>
}
