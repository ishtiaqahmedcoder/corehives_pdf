import { SimpleToolPage } from '@/components/SimpleToolPage'
import { PasswordField } from '@/components/PasswordField'

export function UnlockPdf() {
  return (
    <SimpleToolPage
      tool="unlock"
      title="Unlock PDF"
      description="Remove a password from a PDF you own the password to."
      submitLabel="Unlock PDF"
      optionsForm={(options, setOptions) => (
        <PasswordField
          label="Current password"
          value={options.password ?? ''}
          onChange={(password) => setOptions({ ...options, password })}
        />
      )}
      validateOptions={(options) => (!options.password ? 'Enter the current password.' : null)}
    />
  )
}
