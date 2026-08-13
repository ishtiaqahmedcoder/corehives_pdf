import { SimpleToolPage } from '@/components/SimpleToolPage'
import { PasswordField } from '@/components/PasswordField'

export function ProtectPdf() {
  return (
    <SimpleToolPage
      tool="protect"
      title="Protect PDF"
      description="Add a password so only people you share it with can open this PDF."
      submitLabel="Protect PDF"
      optionsForm={(options, setOptions) => (
        <PasswordField
          label="Set a password"
          value={options.password ?? ''}
          onChange={(password) => setOptions({ ...options, password })}
        />
      )}
      validateOptions={(options) => (!options.password ? 'Enter a password.' : null)}
    />
  )
}
