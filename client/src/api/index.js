const hostname = window && window.location && window.location.hostname

let API_ENDPOINT = ''

if (hostname.indexOf('localhost') > -1) {
  API_ENDPOINT = 'http://localhost:8080/graphql'
} else {
  API_ENDPOINT = 'https://api.cartridge.gg/x/block-droid/torii/graphql'
}

export {
  API_ENDPOINT
}