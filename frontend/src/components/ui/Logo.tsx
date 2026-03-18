interface LogoProps {
  size?: number
  className?: string
  variant?: 'full' | 'icon'
}

export function Logo({ size = 36, className = '', variant = 'full' }: LogoProps) {
  const icon = (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bbGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E5EFF" />
          <stop offset="1" stopColor="#11B5A4" />
        </linearGradient>
      </defs>
      {/* Background pill */}
      <rect width="40" height="40" rx="10" fill="url(#bbGrad)" />
      {/* Bridge arch */}
      <path d="M6 26 Q13 14 20 14 Q27 14 34 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Bridge deck */}
      <line x1="6" y1="26" x2="34" y2="26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      {/* Bridge pillars */}
      <line x1="14" y1="26" x2="14" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="26" x2="20" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="26" x2="26" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* Globe dot above */}
      <circle cx="20" cy="10" r="3" fill="white" fillOpacity="0.9" />
      {/* Orbit ring */}
      <ellipse cx="20" cy="10" rx="6" ry="2.5" stroke="white" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
    </svg>
  )

  if (variant === 'icon') return <span className={className}>{icon}</span>

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {icon}
      <span className="font-heading font-bold text-navy leading-tight">
        Blue<span className="text-primary">Bridge</span>
      </span>
    </span>
  )
}
