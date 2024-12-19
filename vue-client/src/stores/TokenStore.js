// Imports
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { useStorage } from '@vueuse/core'
import Logger from 'js-logger'

// Services
import api from '../services/tokenApi.js'

export const useTokenStore = defineStore('token', {
  state: () => {
    return {
      token: '',
      email: '',
      id: '',
      is_admin: '',
      profile_updated: '',
      ltik: useStorage('ltik', '') // store current user LTI key in browser storage
    }
  },
  getters: {
    /**
     * Gets the user's refresh token
     *
     * @returns String: the user's refresh token
     */
    // refresh_token() {
    //   if (this.token) {
    //     return jwtDecode(this.token)['refresh_token']
    //   } else {
    //     return ''
    //   }
    // },
    /**
     * Gets the user's email
     *
     * @returns String: the user's email
     */
    get_email() {
      if (!this.email) {
        if (this.token) {
          this.email = jwtDecode(this.token)['email']
          return this.email
        } else {
          return ''
        }
      } else {
        return this.email
      }
    },
    /**
     * Gets the user's internal ID
     *
     * @returns String: the user's internal ID
     */
    get_id() {
      if (!this.id) {
        if (this.token) {
          this.id = jwtDecode(this.token)['user_id']
          return this.id
        } else {
          return ''
        }
      } else {
        return this.id
      }
    },
    /**
     * Gets the user's admin status
     *
     * @returns Boolean: true if the user is an admin, otherwise false
     */
    get_admin() {
      if (!this.is_admin) {
        if (this.token) {
          this.is_admin = jwtDecode(this.token)['is_admin']
          return this.is_admin
        } else {
          return ''
        }
      } else {
        return this.is_admin
      }
    },
    /**
     * Gets the user's LTI token
     *
     * @returns String: the user's LTI token
     */
    get_lti_token() {
      if (this.ltik) {
        this.ltik = jwtDecode(this.ltik)
        return this.ltik
      } else {
        return ''
      }
    },
    /**
     * Gets whether the user has updated their profile at least once.
     * Should only be false on a new user.
     *
     * @returns Boolean: true is the user has updated their profile at least once, false otherwise
     */
    get_profile_updated() {
      if (!this.profile_updated) {
        if (this.token) {
          this.profile_updated = jwtDecode(this.token)['profile_updated']
          return this.profile_updated
        } else {
          return ''
        }
      } else {
        return this.profile_updated
      }
    }
  },
  actions: {
    /**
     * Gets a token from the API using an existing cookie session
     * Will always get a new token.
     */
    async getToken() {
      Logger.info('token:get')
      await api
        .get('/auth/token', { withCredentials: true })
        .then((response) => {
          this.token = response.data.token
        })
        .catch((err) => {
          // If the response is a 401 error, the user is not logged in
          if (err.response && err.response.status === 401) {
            this.token = ''
            Logger.info('token:get login failed - redirecting to CAS')
            window.location.href = '/auth/login'
          } else {
            Logger.error('token:get error' + err)
            this.token = ''
          }
        })
    },

    /**
     * Tries the existing token or refresh token to establish a session
     * Will only get a new token if the current one is invalid
     */
    async tryToken() {
      Logger.info('token:try')
      await api
        .get('/auth/token', { withCredentials: true })
        .then((response) => {
          this.token = response.data.token
        })
        .catch(async (err) => {
          // If the current token fails, try the refresh token
          if (err.response && err.response.status === 401) {
            this.token = ''
            Logger.info('token:try login failed ')
          } else {
            this.token = ''
            Logger.error('token:try error' + err)
          }
        })
    },

    // /**
    //  * Use the refresh token to get a new API token
    //  */
    // async refreshToken() {
    //   Logger.info('token:refresh')
    //   await api
    //     .post('/auth/token', {
    //       refresh_token: this.refresh_token
    //     })
    //     .then((response) => {
    //       this.token = response.data.token
    //     })
    //     .catch((err) => {
    //       // If the refresh token fails, the user must log in again
    //       if (err.response && err.response.status === 401) {
    //         this.token = ''
    //         Logger.info('token:refresh login failed - redirecting to CAS')
    //         window.location.href = '/auth/login'
    //       } else {
    //         Logger.error('token:refresh error' + err)
    //         this.token = ''
    //       }
    //     })
    // },

    // /**
    //  * Try to establish a session with a refresh token.
    //  */
    // async tryRefreshToken() {
    //   Logger.info('token:tryrefresh')
    //   await api
    //     .post('/auth/token', {
    //       refresh_token: this.refresh_token
    //     })
    //     .then((response) => {
    //       this.token = response.data.token
    //     })
    //     .catch((err) => {
    //       // if it fails, log out the user but do not force a login
    //       if (err.response && err.response.status === 401) {
    //         this.token = ''
    //         Logger.info('token:tryrefresh login failed')
    //       } else {
    //         this.token = ''
    //         Logger.error('token:tryrefresh error' + err)
    //       }
    //     })
    // },

    /**
     * Log the user out and clear the token
     */
    async logout() {
      this.token = ''
      this.ltik = ''
      window.location.href = '/auth/logout'
    }
  }
})