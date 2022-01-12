import React from 'react'

import { AuthContext } from '../store/auth/auth.store'
import type { AuthContextInterface } from '../store/auth/types'

export const useAuth = (): AuthContextInterface => {
  return React.useContext(AuthContext) as AuthContextInterface
}
