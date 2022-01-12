export interface CurrentUser {
  email: string
  name: string
  id: number
  sub?: string
  email_verified?: boolean
}

export interface AuthContextInterface {
  loading: boolean
  isAuthenticated: boolean
  currentUser: CurrentUser | null
  logIn: () => Promise<void>
  logOut: () => Promise<void>
  getToken: () => Promise<unknown>
}
