import { Service } from '@vtex/api'

import clients from './clients'
import { setupVerifyImports } from './helpers'
import graphql from './resolvers'
import routes from './routes'

setupVerifyImports()

export default new Service({ clients, graphql, routes })
