import type { useModalState } from '@vtex/admin-ui'
import { useMutation } from 'react-apollo'
import type {
  Mutation,
  MutationDeleteImportsArgs,
} from 'ssesandbox04.catalog-importer'

import { DELETE_IMPORTS_MUTATION } from '../../../graphql'

export const useDeleteImport = (
  setDeleted: React.Dispatch<React.SetStateAction<string[]>>,
  openDeleteConfirmationModal: ReturnType<typeof useModalState>
) => {
  const [deleteImports, { loading }] = useMutation<
    Mutation,
    MutationDeleteImportsArgs
  >(DELETE_IMPORTS_MUTATION, {
    onCompleted(data) {
      setDeleted((prev) => [...prev, ...data.deleteImports])
      openDeleteConfirmationModal.hide()
    },
  })

  const deleteImport = (deleteId: string) => {
    deleteImports({ variables: { ids: [deleteId] } })
  }

  return { loading, deleteImport }
}
