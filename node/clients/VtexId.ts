import { JanusClient } from '@vtex/api'

import { ENDPOINTS } from '../helpers'

type User = {
  user: string
}

export default class VtexId extends JanusClient {
  public async getUser() {
    return this.http.post<User>(ENDPOINTS.getUser, {
      token: this.context.adminUserAuthToken,
    })
  }
}
