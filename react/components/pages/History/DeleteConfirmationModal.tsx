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
} from '@vtex/admin-ui'
import React from 'react'
import { useIntl } from 'react-intl'

import { messages } from '../../common'
import { useDeleteImport } from './common'

type Props = {
  modalState: ReturnType<typeof useModalState>
  deleteId: string | undefined
  setDeleted: React.Dispatch<React.SetStateAction<string[]>>
}

const DeleteConfirmationModal = ({
  modalState,
  deleteId,
  setDeleted,
}: Props) => {
  const { formatMessage } = useIntl()
  const { loading, deleteImport } = useDeleteImport(setDeleted, modalState)

  const handleDelete = () => {
    if (deleteId) {
      deleteImport(deleteId)
    }
  }

  return (
    <Modal state={modalState}>
      <ModalHeader>
        <ModalTitle> {formatMessage(messages.importDelete)}</ModalTitle>
        <ModalDismiss disabled={loading} />
      </ModalHeader>
      <ModalContent>{formatMessage(messages.importDeleteText)}</ModalContent>
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

export default DeleteConfirmationModal