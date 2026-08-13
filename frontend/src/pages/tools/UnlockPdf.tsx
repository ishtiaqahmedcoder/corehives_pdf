import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'
import { PasswordField } from '@/components/PasswordField'

export function UnlockPdf() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="unlock"
      title={t('tools.unlock.label')}
      description={t('tools.unlock.description')}
      submitLabel={t('tools.unlock.label')}
      optionsForm={(options, setOptions) => (
        <PasswordField
          label={t('common.currentPasswordLabel')}
          value={options.password ?? ''}
          onChange={(password) => setOptions({ ...options, password })}
        />
      )}
      validateOptions={(options) => (!options.password ? t('common.enterCurrentPassword') : null)}
    />
  )
}
