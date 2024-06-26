import type { useModalState } from '@vtex/admin-ui'
import {
  Button,
  IconTrash,
  Modal,
  ModalContent,
  ModalDismiss,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Stack,
  Tag,
  Text,
} from '@vtex/admin-ui'
import React from 'react'
import { useIntl } from 'react-intl'
import type { Import } from 'ssesandbox04.catalog-importer'
import { useRuntime } from 'vtex.render-runtime'

import { useDeleteImport } from '.'
import {
  Checked,
  Unchecked,
  messages,
  useStatusLabel,
  useStockOptionLabel,
} from '../../../common'
import { mapStatusToVariant } from '../useImportColumns'

type ConfirmeModalProps = {
  openInfosImportmodal: ReturnType<typeof useModalState>
  infoModal?: Import
}

export const ConfirmeModal: React.FC<ConfirmeModalProps> = ({
  openInfosImportmodal,
  infoModal,
}) => {
  const {
    culture: { locale },
  } = useRuntime()

  const getStockOptionLabel = useStockOptionLabel()
  const getStatusLabel = useStatusLabel()

  return (
    <Modal state={openInfosImportmodal}>
      <ModalHeader>
        <ModalTitle>Import Details</ModalTitle>
        <ModalDismiss />
      </ModalHeader>
      <ModalContent>
        {infoModal && (
          <Stack space="$space-2">
            <Text style={{ display: 'flex', gap: '0.5rem' }}>
              <h6>Source VTEX Account: </h6>
              {infoModal.settings.useDefault ? (
                <Text>Default</Text>
              ) : (
                <Text> {infoModal.settings.account}</Text>
              )}
            </Text>
            <Text style={{ display: 'flex', gap: '0.5rem' }}>
              <h6>ID:</h6> {infoModal.id}
            </Text>
            <Text style={{ display: 'flex', gap: '0.5rem' }}>
              <h6>Created In:</h6>
              {new Date(infoModal.createdIn).toLocaleString(locale)}
            </Text>
            <Text style={{ display: 'flex', gap: '0.5rem' }}>
              <h6> Last Interaction in:</h6>
              {new Date(infoModal.lastInteractionIn).toLocaleString(locale)}
            </Text>
            <Text style={{ display: 'flex', gap: '0.5rem' }}>
              <h6>User: </h6>
              {infoModal.user}
            </Text>
            <Text style={{ display: 'flex', gap: '0.5rem' }}>
              <h6>Import Images:</h6>
              {infoModal.importImages ? <Checked /> : <Unchecked />}
            </Text>
            <Text style={{ display: 'flex', gap: '0.5rem' }}>
              <h6> Import Prices:</h6>
              {infoModal.importPrices ? <Checked /> : <Unchecked />}
            </Text>
            {infoModal.stockValue && (
              <Text style={{ display: 'flex', gap: '0.5rem' }}>
                <h6>Stock to be defined for all SKUs:</h6>{' '}
                {infoModal.stockValue}
              </Text>
            )}
            <Text style={{ display: 'flex', gap: '0.5rem' }}>
              <h6>Stock Option: </h6>
              {getStockOptionLabel(infoModal.stocksOption).toLowerCase()}
            </Text>
            {infoModal.categoryTree && (
              <Text style={{ display: 'flex', gap: '0.5rem' }}>
                <h6>Category Tree:</h6> {infoModal.categoryTree}
              </Text>
            )}
            <Text style={{ display: 'flex', gap: '0.5rem' }}>
              <h6>Status:</h6>{' '}
              <Tag
                label={getStatusLabel(infoModal.status)}
                variant={mapStatusToVariant[infoModal.status]}
              />
            </Text>
            {infoModal.error && (
              <Text style={{ display: 'flex', gap: '0.5rem' }}>
                <h6>Error: </h6>
                {infoModal.error}
              </Text>
            )}
          </Stack>
        )}
      </ModalContent>
    </Modal>
  )
}

type DeleteConfirmationModalProps = {
  openDeleteConfirmationModal: ReturnType<typeof useModalState>
  deleteId: string | undefined
  setDeleted: React.Dispatch<React.SetStateAction<string[]>>
}
export const DeleteConfirmationModal = ({
  openDeleteConfirmationModal,
  deleteId,
  setDeleted,
}: DeleteConfirmationModalProps) => {
  const { formatMessage } = useIntl()
  const { loading, deleteImport } = useDeleteImport(
    setDeleted,
    openDeleteConfirmationModal
  )

  const handleDelete = () => {
    if (deleteId) {
      deleteImport(deleteId)
    }
  }

  return (
    <Modal state={openDeleteConfirmationModal}>
      <ModalHeader>
        <ModalTitle>Deseja mesmo excluir a importação?</ModalTitle>
        <ModalDismiss />
      </ModalHeader>
      <ModalContent>
        Os respectivos logs de importação também serão excluídos.
      </ModalContent>
      <ModalFooter>
        <Button
          loading={loading}
          onClick={handleDelete}
          variant="critical"
          icon={<IconTrash />}
        >
          {formatMessage(messages.deleteLabel)}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
