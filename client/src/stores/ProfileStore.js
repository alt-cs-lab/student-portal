// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/apiHook'

//Stores work kind of like classes, they just have to be made differently because of our specific use case
//They sit outside of any pages so that information can be shared between them, and allow you to interact with data a bit more normally.
//I'll put more comments in sub-apps/profile-app/ProfilePage.vue to show how to use it

//This line is pretty much the same between all stores, just changing the function name and the argument to match the name of the store
export const useProfileStore = defineStore('profile', {
  //The state is the equivalent of a class's attributes, and otherwise work like the fields of a js object
  state: () => {
    return {
      user: {}, // user object
      academics: '',
      discord: '',
      github: ''
    }
  },
  //Getters are like properties, they let you compute extra fields
  getters: {
    full_name(state) {
      return state.user.first_name + " " + state.user.last_name
    }
  },
  //Actions are methods. Primary use case for us has been to make API calls, as this hides it from the user a little bit.
  //As you can see from all of these, they pretty much all just make an api call, and throw an error if one comes up.
  actions: {
    /**
     * Hydrate the store by querying the API for data
     * Refreshes the data in the store
     */
    async hydrate() {
      Logger.info('profile:hydrate')
      await api.get('/api/v1/protected/profile').then((response) => {
        this.user = response.data
      })
      await api.get('/api/v1/protected/academics').then((response) => {
        this.academics = response.data
      })
    },
    async unlinkDiscord(userId){
      try {
        return await api.delete(`/api/v1/discord/`, {
            params: { userId },
        })
        } catch (error) {
            console.error('Error unlinking Discord:', error);
        }
    },
    async unlinkGitHub(userId){
      try {
        return await api.delete(`/api/v1/github/`, {
            params: { userId },
        })
        } catch (error) {
            console.error('Error unlinking GitHub:', error);
        }
    },
    async getDiscordInfo(userId) {
      try {
        const response = await api.get(`/api/v1/discord/username`, {
            params: { userId },
        });
        this.discord = response.data.username;
        } catch (error) {
            console.log('User Discord not found.');
        }
    },
    async getGitHubInfo(userId) {
      try {
        const response = await api.get(`/api/v1/github/username`, {
            params: { userId },
        });
        this.github = response.data.username;
    } catch (error) {
        console.log('User GitHub not found.');
    }
    },
    /**
     * Pushes the updated data of the store to the server
     * then updates the store's data
     */
    async update() {
      await api
        .post('/api/v1/protected/profile/', {
          user: this.user
        })
        .then(async () => {
          await this.hydrate()
        })
    }
  }
})