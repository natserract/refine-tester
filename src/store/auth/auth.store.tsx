import React, {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AuthContextInterface, CurrentUser } from './types'
import { AuthProvider as AuthProviderT, useGetIdentity, useOne, Refine } from '@pankod/refine'
import SecurityService from 'services/auth'
import { RefineProps } from '@pankod/refine/dist/components/containers/refine'

export const AuthContext = React.createContext<AuthContextInterface>({
  loading: true,
  isAuthenticated: false,
  currentUser: null,
  logIn: async () => { },
  logOut: async () => { },
  getToken: async () => '',
})

type Props = {} & RefineProps

export const AuthProvider: React.FC<Props> = ({ children, ...rest }) => {
  const [state, setState] =
    useState<Pick<AuthContextInterface, 'loading' | 'isAuthenticated' | 'currentUser'>>({
      loading: true,
      isAuthenticated: false,
      currentUser: null,
    })

  const [auth] = useState(new SecurityService())

  const authProvider: AuthProviderT = {
    login: async ({ username, password, remember }) => {
      const currentUser = (await auth.getProfile()) as AuthContextInterface
      console.log('currentUser, login', currentUser)

      setState({
        ...currentUser,
        isAuthenticated: currentUser !== null,
      })

      return Promise.resolve(state);
    },
    logout: async () => {
      const currentUser = (await auth.getProfile()) as AuthContextInterface
      console.log('currentUser, logout', currentUser)

      setState({
        ...currentUser,
        currentUser: null,
        isAuthenticated: false,
      })

      return Promise.resolve('/');
    },
    checkError: (error) => {
      const errorCode = 401

      if (error.status === errorCode) {
        return Promise.reject();
      }

      return Promise.resolve();
    },
    checkAuth: async () => {
      const isSignedIn = await auth.getSignedIn()
      console.log('isSignedIn, checkAuth', isSignedIn)

      if (!isSignedIn) return Promise.reject()

      return Promise.resolve()
    },
    getPermissions: async () => {
      const role = await auth.getRole()
      console.log('role, getPermissions', role)

      if (role) {
        return Promise.resolve(role);
      }

      return Promise.reject()
    },
    getUserIdentity: async () => {
      const currentUser = (await auth.getProfile()) as AuthContextInterface

      if (currentUser) {
        const { currentUser: user } = currentUser
        return Promise.resolve(user?.email);
      }

      return Promise.reject();
    },
  }

  // const {} = useOne({
  //   resource: 'userDetail',
  //   id: "",
  //   metaData: {
  //     fields: [
  //       'id',
  //       'email',
  //       'email_verified'
  //     ]
  //   }
  // })


  // Prevents unnecessary renders
  const value = useMemo(
    () => ({
      ...state,
      authProvider,
    }),
    [state, authProvider]
  )

  return (
    <Refine
      authProvider={value?.authProvider}
      children={children}
      {...rest}
    />
  )
}