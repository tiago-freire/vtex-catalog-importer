import { delay, updateImport } from '../../helpers'

const handleCategories = async (context: AppEventContext) => {
  // TODO: process categories import
  const { importEntity } = context.clients
  const { id = '', settings = {} } = context.state.body

  await updateImport(context, { sourceCategoriesTotal: 3 })

  await delay(1000)
  await importEntity.save({
    executionImportId: id,
    name: context.state.entity,
    sourceAccount: settings.account ?? '',
    sourceId: '1',
    payload: { name: `${context.state.entity} 1` },
  })

  await delay(1000)
  await importEntity.save({
    executionImportId: id,
    name: context.state.entity,
    sourceAccount: settings.account ?? '',
    sourceId: '2',
    payload: { name: `${context.state.entity} 2` },
  })

  await delay(1000)
  await importEntity.save({
    executionImportId: id,
    name: context.state.entity,
    sourceAccount: settings.account ?? '',
    sourceId: '3',
    payload: { name: `${context.state.entity} 3` },
  })
}

export default handleCategories
