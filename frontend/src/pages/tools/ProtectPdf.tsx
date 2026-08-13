import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'
import { PasswordField } from '@/components/PasswordField'

export function ProtectPdf() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="protect"
      title={t('tools.protect.label')}
      description={t('tools.protect.description')}
      submitLabel={t('tools.protect.label')}
      optionsForm={(options, setOptions) => (
        <PasswordField
          label={t('common.setPasswordLabel')}
          value={options.password ?? ''}
          onChange={(password) => setOptions({ ...options, password })}
        />
      )}
      validateOptions={(options) => (!options.password ? t('common.enterPassword') : null)}
    />
  )
}
