
const tokenKey = 'aps_token'

// 获取token
export function getToken() {
    return localStorage.getItem(tokenKey)
}

// 设置token
export function setToken(token: string) {
    return localStorage.setItem(tokenKey, token)
}

// 移除token
export function removeToken() {
    return localStorage.removeItem(tokenKey)
  }