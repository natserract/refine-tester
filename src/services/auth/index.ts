import Oidc from 'oidc-client'
import { setCookie } from '../../utils/cookie'

const mgr = new Oidc.UserManager({
  authority: process.env.OIDC_AUTHORITY || 'https://xyz.idp.uat.connexify.io/',
  client_id: process.env.OIDC_CLIENT_ID || 'xyz.app',
  redirect_uri: window.location.origin,
  response_type: 'code',
  scope: 'openid profile offline_access email',
  loadUserInfo: false,
  automaticSilentRenew: true,
})

Oidc.Log.logger = console
Oidc.Log.level = Oidc.Log.INFO

mgr.events.addUserLoaded(function (user) {
  console.log('New User Loaded:', user)

  if (document.domain !== 'localhost') {
    const domain = document.domain
    setCookie(
      'app',
      JSON.stringify({
        access_token: user.access_token,
      }),
      {
        secure: true,
        domain: domain.split('.').slice(1).join('.'),
        'max-age': 3600,
      }
    )
  }

  //console.log('get cookie', getCookie('app'))
})

mgr.events.addAccessTokenExpiring(function () {
  console.log('AccessToken Expiring: ')
})

mgr.events.addAccessTokenExpired(function () {
  console.log('AccessToken Expired: ')
  alert('Session expired. Going out!')
  mgr
    .signoutRedirect()
    .then(function (resp) {
      console.log('signed out', resp)
    })
    .catch(function (err) {
      console.log(err)
    })
})

mgr.events.addSilentRenewError(function () {
  console.error('Silent Renew Error: ')
})

mgr.events.addUserSignedOut(function () {
  mgr
    .signoutRedirect()
    .then(function (resp) {
      console.log('signed out', resp)
    })
    .catch(function (err) {
      console.log(err)
    })
})

export default class SecurityService {
  // Renew the token manually
  renewToken() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    return new Promise((resolve, reject) => {
      mgr
        .signinSilent()
        .then(function (user) {
          if (user == null) {
            self.signIn()
          }
          return resolve(user)
        })
        .catch(function (err) {
          console.log(err)
          return reject(err)
        })
    })
  }

  // // Get the user who is logged in
  getUser() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then(function (user) {
          if (user == null) {
            self.signIn()
            return resolve(null)
          }

          return resolve(user)
        })
        .catch(function (err) {
          return reject(err)
        })
    })
  }

  login() {
    console.log('amu')
  }

  // Check if there is any user logged in
  getSignedIn(): Promise<boolean > {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then(function (user) {
          if (user == null) {
            self.signIn()
            return resolve(false)
          }
          return resolve(true)
        })
        .catch(function (err) {
          console.log(err)
          return reject(err)
        })
    })
  }

  // Redirect of the current window to the authorization endpoint.
  signIn() {
    mgr
      .signinRedirect()
      .then((v) => {
        console.log('signin', v)
      })
      .catch(function (err) {
        console.log(err)
      })
  }

  // Signin callback
  signInCallback() {
    mgr
      .signinRedirectCallback()
      .then((v) => {
        console.log('callback', v)
      })
      .catch(function (err) {
        console.log('error callback', err)
        console.log(err)
      })
  }

  // Redirect of the current window to the end session endpoint
  signOut() {
    mgr
      .signoutRedirect()
      .then(function (resp) {
        console.log('signed out', resp)
      })
      .catch(function (err) {
        console.log(err)
      })
  }

  // Get the profile of the user logged in
  getProfile() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then(function (user) {
          console.log('user', user)
          if (user == null) {
            self.signIn()
            return resolve(null)
          }
          return resolve(user.profile)
        })
        .catch(function (err) {
          console.log(err)
          return reject(err)
        })
    })
  }

  // Get the token id
  getIdToken() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then(function (user) {
          if (user == null) {
            self.signIn()
            return resolve(null)
          }
          return resolve(user.id_token)
        })
        .catch(function (err) {
          console.log(err)
          return reject(err)
        })
    })
  }

  // Get the session state
  getSessionState() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then(function (user) {
          if (user == null) {
            self.signIn()
            return resolve(null)
          }
          return resolve(user.session_state)
        })
        .catch(function (err) {
          console.log(err)
          return reject(err)
        })
    })
  }

  // Get the access token of the logged in user
  getAcessToken() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then(function (user) {
          if (user == null) {
            self.signIn()
            return resolve(null)
          }
          return resolve(user.access_token)
        })
        .catch(function (err) {
          console.log(err)
          return reject(err)
        })
    })
  }

  // Takes the scopes of the logged in user
  getScopes() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then(function (user) {
          if (user == null) {
            self.signIn()
            return resolve(null)
          } else {
            return resolve(user.scopes)
          }
        })
        .catch(function (err) {
          console.log(err)
          return reject(err)
        })
    })
  }

  // Get the user roles logged in
  getRole() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then(function (user) {
          if (user == null) {
            self.signIn()
            return resolve(null)
          }
          return resolve(user.profile.role)
        })
        .catch(function (err) {
          console.log(err)
          return reject(err)
        })
    })
  }
}
