/* eslint-disable no-console */
import { updateCurrentImport } from '../../helpers'

const handleStocks = async (context: AppEventContext) => {
  // TODO: process stocks import
  const { importEntity } = context.clients
  const { id, settings = {} } = context.state.body
  const { entity } = context.state
  const { account: sourceAccount } = settings
  const sourceStocksTotal = 3

  await updateCurrentImport(context, { sourceStocksTotal })

  for (let i = 1; i <= sourceStocksTotal; i++) {
    // eslint-disable-next-line no-await-in-loop
    await importEntity.save({
      executionImportId: id,
      name: entity,
      sourceAccount,
      sourceId: i,
      payload: { name: `${entity} ${i}` },
    })
  }
}

export default handleStocks
