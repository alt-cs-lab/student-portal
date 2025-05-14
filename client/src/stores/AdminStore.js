// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '../services/apiHook.js'

//Admin level store to get list of users, currently unused
export const useAdminStore = defineStore('users', {
  state: () => {
    return {
      users: []
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
      await api.get('/api/v1/protected/users').then((response) => {
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
        .post('/api/v1/protected/users/' + user.id, {
          user: user
        })
    },
    /**
         * Refresh the entire discord 
         */
    async refreshDiscord() {
      try{
        await api
        .post('/api/v1/discord/refreshDiscordRoles', {
        })
          return true;
      }catch{
        return false;
      }
    },
    /**
         * Send a student to get refreshed in the discord bot
         *
         * @param {User} user
         */
    async refreshStudent(user) {
      try{
        await api
        .post('/api/v1/discord/refreshStudentRoles', {
          user: user
        })
        return true;
      }
      catch{
        return false;
      }

    },
    /**
     * Create a new item via the API
     *
     * @param {User} user
     */
    async new(user) {
      await api.put('/api/v1/protected/users/', { user: user }).then(async () => {
        await this.hydrate()
      })
    },

    /**
     * Delete an item with the given ID via the API
     *
     * @param {Integer} id
     */
    async delete(id) {
      await api.delete('/api/v1/protected/users/' + id).then(async () => {
        await this.hydrate()
      })
    },
    /**
     * Get all usesers, names, EID, Discord
     */
    async getAllUsers(){
      try {
        const response = await api.get('/api/v1/protected/admin/allUsers');

        return response;
      } catch (error) {
        throw error
      }
    },

     /**
     * Swappes the users roles
     * @param {UserID} the ID of the user
     * @param {Role} What Role the user will be swapped to
     */
        async updateUserRoles(userId, roles){
          try {
            const response = await api.post('/api/v1/protected/admin/updateUser', {
              user_id: userId,
              roles: roles
            })
            return response;
          } catch (error) {
            console.error("Error fetching all users: ", error);
            throw error; 
          }
        },

    async importEnrollmentReport(parsed) {
      console.log(parsed)
      try {
        await api.post('/api/v1/protected/admin/importEnrollmentReport/', {parsed: parsed})
        return true
      } catch (error) {
        console.log(error)
        return false
      }
      
    },

    async importStudentReport(parsed) {
      console.log(parsed)
      try {
        await api.post('/api/v1/protected/admin/importStudentReport/', {parsed: parsed})
        return true
      } catch (error) {
        console.log(error)
        return false
      }
      
    }
  }
})