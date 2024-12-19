/* https://www.bezkoder.com/vue-refresh-token/ */
// Imports
import api from './tokenApi'

// Stores
import { useTokenStore } from '@/stores/TokenStore.js'

const setupInterceptors = () => {
  // Request configuration
  api.interceptors.request.use(
    (config) => {
      // If we are not trying to get a token, we must send the token with any request
      if (config.url !== '/auth/token') {
        const tokenStore = useTokenStore()
        if (tokenStore.token) {
          config.headers['Authorization'] = 'Bearer ' + tokenStore.token
        }
      }
      return config
    },

    // If we receive an error, we reject with the error
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response configuration
  api.interceptors.response.use(
    (res) => {
      return res
    },
    async (err) => {
      const original_config = err.config

      // If we are not trying to get a token, but we get an error
      if (original_config.url !== '/auth/token' && err.response) {
        // If we have an expired token, we should get a 401 error
        if (err.response.status === 401) {
          // Prevent infinite loops by tracking number of retries
          if (!original_config._retry) {
            original_config._retry = true

            // Try to refresh the token - if this fails the token will be removed and the user is logged out
            try {
              const tokenStore = useTokenStore()
              await tokenStore.refreshToken()
              return api(original_config)
            } catch (_error) {
              return Promise.reject(_error)
            }
          } else {
            //console.log('This is a retry - aborting')
          }
        }
      }
      return Promise.reject(err)
    }
  )
/*
  lti.interceptors.request.use(
    (config) => {
      const tokenStore = useTokenStore()
      if (tokenStore.ltik) {
        config.headers['Authorization'] = 'Bearer ' + tokenStore.ltik
      }
      return config
    },

    // If we receive an error, we reject with the error
    (error) => {
      return Promise.reject(error)
    }
  )
    */
}

export default setupInterceptors