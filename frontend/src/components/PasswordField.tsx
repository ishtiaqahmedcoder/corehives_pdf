interface PasswordFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function PasswordField({ label, value, onChange }: PasswordFieldProps) {
  return (
    <label className="block text-left text-sm">
      <span className="font-medium" style={{ color: 'var(--text-h)' }}>
        {label}
      </span>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter password"
        className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
      />
    </label>
  )
}
