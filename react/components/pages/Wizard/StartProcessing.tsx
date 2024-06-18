import type { TabState } from '@vtex/admin-ui'
import {
  Button,
  Flex,
  IconArrowLeft,
  IconArrowLineDown,
  IconCheckCircle,
  IconXCircle,
  Modal,
  ModalContent,
  ModalDismiss,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Stack,
  csx,
  useModalState,
  useToast,
} from '@vtex/admin-ui'
import React, { useCallback } from 'react'
import { useMutation } from 'react-apollo'
import { useIntl } from 'react-intl'
import type {
  AppSettingsInput,
  Category,
  CategoryInput,
  Mutation,
  MutationExecuteImportArgs,
  StocksOption,
} from 'ssesandbox04.catalog-importer'
import { useRuntime } from 'vtex.render-runtime'

import type { CheckedCategories } from '.'
import { IMPORT_OPTIONS, STOCK_OPTIONS } from '.'
import { Countdown, messages } from '../../common'
import {
  EXECUTE_IMPORT_MUTATION,
  getGraphQLMessageDescriptor,
} from '../../graphql'

interface StartProcessingProps {
  checkedTreeOptions: CheckedCategories
  optionsChecked: {
    checkedItems: number[]
    value: string
    stockOption: StocksOption
  }
  state: TabState
  settings: AppSettingsInput
}

const NAVIGATE_DELAY = 10000

const StartProcessing: React.FC<StartProcessingProps> = ({
  checkedTreeOptions,
  optionsChecked,
  state,
  settings,
}) => {
  const { formatMessage } = useIntl()
  const showToast = useToast()
  const confirmationImportModal = useModalState()
  const { navigate } = useRuntime()

  const [executeImport, { loading }] = useMutation<
    Mutation,
    MutationExecuteImportArgs
  >(EXECUTE_IMPORT_MUTATION, {
    notifyOnNetworkStatusChange: true,
    onError(error) {
      showToast({
        message: formatMessage(getGraphQLMessageDescriptor(error)),
        variant: 'critical',
        key: 'execute-import-message',
      })
    },
    onCompleted(data) {
      if (!data.executeImport) {
        return
      }

      confirmationImportModal.hide()

      showToast({
        message: formatMessage(messages.startSuccess, {
          seconds: <Countdown seconds={NAVIGATE_DELAY / 1000} />,
        }),
        duration: NAVIGATE_DELAY,
        variant: 'positive',
        key: 'execute-import-message',
      })

      setTimeout(
        () => navigate({ page: 'admin.app.catalog-importer-history' }),
        NAVIGATE_DELAY
      )
    },
  })

  const renderTree = (category: Category, level = 0) => (
    <li key={category.id} style={{ marginLeft: level ? 30 : 0 }}>
      <span>{category.name}</span>
      {category.children && (
        <ul>
          {category.children.map((child: Category) =>
            renderTree(child, level + 1)
          )}
        </ul>
      )}
    </li>
  )

  const renderOption = (label: string, condition: boolean) => (
    <Stack direction="row" space="$space-1">
      <span>{label}</span>
      {condition ? (
        <IconCheckCircle
          title={formatMessage(messages.yesLabel)}
          weight="fill"
          className={csx({ color: '$positive' })}
        />
      ) : (
        <IconXCircle
          title={formatMessage(messages.noLabel)}
          weight="fill"
          className={csx({ color: '$critical' })}
        />
      )}
    </Stack>
  )

  const convertEntry: (
    entry: [string, Category]
  ) => CategoryInput = useCallback(
    (entry: [string, Category]) => ({
      id: entry[0],
      name: entry[1].name,
      ...(!!entry[1]?.children?.length && {
        children: Object.entries(entry[1].children).map(convertEntry),
      }),
    }),
    []
  )

  const handleStartImport = useCallback(
    () =>
      executeImport({
        variables: {
          args: {
            categoryTree: Object.entries(checkedTreeOptions).map(convertEntry),
            settings,
            importImages: optionsChecked.checkedItems.includes(
              IMPORT_OPTIONS.IMPORT_IMAGE
            ),
            importPrices: optionsChecked.checkedItems.includes(
              IMPORT_OPTIONS.IMPORT_PRICE
            ),
            stocksOption: optionsChecked.stockOption,
            ...(optionsChecked.stockOption === STOCK_OPTIONS.TO_BE_DEFINED &&
              optionsChecked.value && {
                stockValue: +optionsChecked.value,
              }),
          },
        },
      }),
    [
      checkedTreeOptions,
      convertEntry,
      executeImport,
      optionsChecked.checkedItems,
      optionsChecked.stockOption,
      optionsChecked.value,
      settings,
    ]
  )

  return (
    <Stack space="$space-4" fluid>
      <Flex
        direction={{ mobile: 'column', tablet: 'row' }}
        align={{ mobile: 'center', tablet: 'start' }}
        justify="space-evenly"
        className={csx({ gap: '$space-4' })}
      >
        <div>
          <h3>{formatMessage(messages.optionsCategories)}</h3>
          <ul>
            {Object.values(checkedTreeOptions).map((category) =>
              category.isRoot ? renderTree(category) : null
            )}
          </ul>
        </div>
        <div>
          <h3>{formatMessage(messages.optionsLabel)}</h3>
          <div>
            {formatMessage(messages.settingsAccountLabel)}:{' '}
            <b>
              {settings.useDefault
                ? formatMessage(messages.settingsDefaultLabel).toLowerCase()
                : settings.account}
            </b>
          </div>
          {renderOption(
            formatMessage(messages.importImage),
            optionsChecked.checkedItems.includes(IMPORT_OPTIONS.IMPORT_IMAGE)
          )}
          {renderOption(
            formatMessage(messages.importPrice),
            optionsChecked.checkedItems.includes(IMPORT_OPTIONS.IMPORT_PRICE)
          )}
          <div>
            {formatMessage(messages.importStocks)}:{' '}
            <b>
              {optionsChecked.stockOption === STOCK_OPTIONS.KEEP_SOURCE
                ? formatMessage(messages.optionsSource).toLowerCase()
                : optionsChecked.stockOption === STOCK_OPTIONS.UNLIMITED
                ? formatMessage(messages.optionsUnlimited).toLowerCase()
                : formatMessage(messages.optionsDefined).toLowerCase()}
            </b>
          </div>
          {optionsChecked.stockOption === STOCK_OPTIONS.TO_BE_DEFINED && (
            <div>
              {formatMessage(messages.stockValue)}:{' '}
              <b>{optionsChecked.value}</b>
            </div>
          )}
        </div>
      </Flex>
      <Flex justify="space-between" className={csx({ marginTop: '$space-4' })}>
        <Button
          onClick={() => state.select(state.previous())}
          icon={<IconArrowLeft />}
          disabled={loading}
        >
          {formatMessage(messages.previousLabel)}
        </Button>
        <Button
          icon={<IconArrowLineDown />}
          disabled={loading}
          loading={loading}
          onClick={() => confirmationImportModal.show()}
        >
          {formatMessage(messages.startLabel)}
        </Button>
      </Flex>
      <Modal state={confirmationImportModal}>
        <ModalHeader>
          <ModalTitle>{formatMessage(messages.startConfirmation)}</ModalTitle>
          <ModalDismiss />
        </ModalHeader>
        <ModalContent>{formatMessage(messages.startText)}</ModalContent>
        <ModalFooter>
          <Button
            disabled={loading}
            variant="secondary"
            onClick={() => confirmationImportModal.hide()}
          >
            {formatMessage(messages.cancelLabel)}
          </Button>
          <Button
            icon={<IconArrowLineDown />}
            disabled={loading}
            loading={confirmationImportModal.open && loading}
            onClick={handleStartImport}
          >
            {formatMessage(messages.startLabel)}
          </Button>
        </ModalFooter>
      </Modal>
    </Stack>
  )
}

export default StartProcessing
