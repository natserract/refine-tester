export function setCookie(
  name: string | number | boolean, 
  value: string | number | boolean, 
  options = {} as any
) {
  const now = new Date()
  const minutes = 30
  now.setTime(now.getTime() + minutes * 60 * 1000)

  options = {
    path: '/',
    // add other defaults here if necessary
    ...options,
  }

  if (options.expires instanceof Date) {
    options.expires = now.toUTCString()
  }

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)

  for (const optionKey in options) {
    updatedCookie += '; ' + optionKey
    const optionValue = options[optionKey]
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue
    }
  }

  document.cookie = updatedCookie
}

export function getCookie(name: string | null) {
  const value = '; ' + document.cookie
  const parts = value.split('; ' + name + '=')

  if (parts.length == 2) {
    const pop = parts.pop()!!
    return decodeURIComponent(pop.split(';').shift()!!)
  }
}

export function deleteCookie(name: string) {
  const date = new Date()

  // Set it expire in -1 days
  date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000)

  // Set it
  document.cookie = name + '=; expires=' + date.toUTCString() + '; path=/'
}
