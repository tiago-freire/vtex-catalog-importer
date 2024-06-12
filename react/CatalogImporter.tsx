import React, { lazy } from 'react'

import MainTemplate from './components/MainTemplate'

const ImportWizard = lazy(() => import('./components/ImportWizard'))

const CatalogImporter = () => (
  <MainTemplate>
    <ImportWizard />
  </MainTemplate>
)

export default CatalogImporter
