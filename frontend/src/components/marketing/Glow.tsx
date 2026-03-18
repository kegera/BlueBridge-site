export function Glow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      <span className="absolute w-[580px] h-[580px] -top-44 -left-40 rounded-full bg-[radial-gradient(circle,rgba(30,94,255,.18)_0%,transparent_65%)] animate-drift blur-[80px]" />
      <span className="absolute w-[520px] h-[520px] top-16 -right-44 rounded-full bg-[radial-gradient(circle,rgba(17,181,164,.16)_0%,transparent_65%)] animate-drift blur-[80px] [animation-delay:-3.5s]" />
      <span className="absolute w-[440px] h-[440px] -bottom-40 left-[38%] rounded-full bg-[radial-gradient(circle,rgba(255,176,32,.14)_0%,transparent_65%)] animate-drift blur-[80px] [animation-delay:-6s]" />
    </div>
  )
}
