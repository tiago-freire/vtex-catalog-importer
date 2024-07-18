import type { MutationExecuteImportArgs } from 'ssesandbox04.catalog-importer'

import { IMPORT_STATUS } from '../../helpers'
import { setCacheContext } from '../../helpers/pendingImportsTimer'

export const executeImport = async (
  _: unknown,
  { args }: MutationExecuteImportArgs,
  context: Context
) => {
  const { user } = await context.clients.vtexId.getUser()
  const { useDefault } = args.settings
  const settings = useDefault ? { useDefault } : args.settings
  const status = args.status ?? IMPORT_STATUS.PENDING
  const entityPayload = { ...args, user, settings, status }

  const id = await context.clients.importExecution
    .save(entityPayload)
    .then((response) => response.DocumentId)

  // const eventPayload = {
  //   ...entityPayload,
  //   id,
  //   categoryTree: undefined,
  // }

  // context.clients.events.sendEvent('', 'runImport', eventPayload)

  setCacheContext(context)

  return id
}
