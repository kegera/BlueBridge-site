interface Props { value: 'package' | 'monthly'; onChange: (v: 'package' | 'monthly') => void }

export function PricingToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex bg-white/80 border border-bborder rounded p-1 gap-1">
      {(['package', 'monthly'] as const).map(v => (
        <button key={v} onClick={() => onChange(v)}
          className={`px-5 py-2 rounded-sm text-sm font-semibold transition-all ${value === v ? 'bg-navy text-white' : 'text-muted hover:text-navy'}`}>
          {v === 'package' ? 'Package' : 'Monthly'}
        </button>
      ))}
    </div>
  )
}
