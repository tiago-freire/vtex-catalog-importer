import {
  Alert,
  Center,
  DataView,
  IconCheckCircle,
  IconXCircle,
  Spinner,
  Stack,
  csx,
  useDataViewState,
} from '@vtex/admin-ui'
import React from 'react'
import type { MessageDescriptor } from 'react-intl'
import { useIntl } from 'react-intl'
import type { Import } from 'ssesandbox04.catalog-importer'

import type { GraphQLError } from '../graphql'
import { getGraphQLMessageDescriptor } from '../graphql'
import { messages } from './messages'

type ErrorMessageProps = { error: GraphQLError; title?: MessageDescriptor }

export const SuspenseFallback = () => (
  <Center className={csx({ height: '25vh', width: '100%' })}>
    <Spinner />
  </Center>
)

export const ErrorMessage = ({ error, title }: ErrorMessageProps) => {
  const { formatMessage } = useIntl()

  return (
    <Center>
      <Alert variant="critical">
        <Stack space="$space-4">
          {title && <span>{formatMessage(title)}</span>}
          <span>{formatMessage(getGraphQLMessageDescriptor(error))}</span>
        </Stack>
      </Alert>
    </Center>
  )
}

export const handleTrim = (e: React.FormEvent<HTMLInputElement>) => {
  e.currentTarget.value = e.currentTarget.value.trim()
}

export const Checked = () => {
  const { formatMessage } = useIntl()

  return (
    <IconCheckCircle
      title={formatMessage(messages.yesLabel)}
      weight="fill"
      className={csx({ color: '$positive' })}
    />
  )
}

export const Unchecked = () => {
  const { formatMessage } = useIntl()

  return (
    <IconXCircle
      title={formatMessage(messages.noLabel)}
      weight="fill"
      className={csx({ color: '$critical' })}
    />
  )
}

type EmptyViewProps = { text: string; onClick: () => void }

export const EmptyView = ({ text, onClick }: EmptyViewProps) => {
  const state = useDataViewState({
    notFound: false,
    loading: false,
    empty: { action: { text, onClick } },
    error: null,
  })

  return <DataView state={state} />
}

export const useStatusLabel = () => {
  const { formatMessage } = useIntl()

  return (status: Import['status']) =>
    formatMessage(
      messages[`importStatus${status}Label` as keyof typeof messages]
    )
}

export const useStockOptionLabel = () => {
  const { formatMessage } = useIntl()

  return (option: Import['stocksOption']) =>
    formatMessage(messages[`options${option}` as keyof typeof messages])
}

export const goToHistoryPage = (id?: string) => {
  const queryId = id ? `?id=${id}` : ''

  window.parent.location.href = `/admin/catalog-importer/history${queryId}`
}

export const goToWizardPage = () => {
  window.parent.location.href = '/admin/catalog-importer/wizard'
}

export { default as MainTemplate } from './MainTemplate'
export { messages } from './messages'
