// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '../services/tokenApi.js'

//Admin level store to get list of users, currently unused
export const useUsersStore = defineStore('users', 'currentUser', {
  state: () => {
    return {
      users: [], // list of users
      currentUser: User() //logged in user
    }
  },
  getters: {
    /**
     * Getter for an individual item
     *
     * @param {State} state
     * @returns a function to find an item based on a given id
     */
    getUser: (state) => {
      return (id) => state.users.find((user) => user.id === id)
    }
  },
  actions: {
    /**
     * Hydrate the store by querying the API for data
     */
    async hydrate() {
      Logger.info('users:hydrate')
      await api.get('/api/v1/users').then((response) => {
        this.users = response.data
      })
    },
    /**
     * Update an item via the API
     *
     * @param {User} user
     */
    async update(user) {
      await api
        .post('/api/v1/users/' + user.id, {
          user: user
        })
        .then(async () => {
          await this.hydrate()
        })
    },

    /**
     * Create a new item via the API
     *
     * @param {User} user
     */
    async new(user) {
      await api.put('/api/v1/users/', { user: user }).then(async () => {
        await this.hydrate()
      })
    },

    /**
     * Delete an item with the given ID via the API
     *
     * @param {Integer} id
     */
    async delete(id) {
      await api.delete('/api/v1/users/' + id).then(async () => {
        await this.hydrate()
      })
    },

    /**
     * Load the currently logged in user to the store.
     */
    async loadCurrentUser() {
      await api.get('api/v1/users/whoami').then((response) => {
        this.currentUser = response.data
      })
    }
  }
})