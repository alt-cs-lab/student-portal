// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/apiHook'

export const useApplicationStore = defineStore('application', {
  state: () => {
    return {
      courses: [],
      application: {notes: "", advisor: ""}
    }
  },
  getters: {
    
  },
  actions: {
    //Gets information on the already submitted application (if there is one) and the courses for the application
    async hydrate() {
      Logger.info('application: hydrate')
      try {
        await api.get('/api/v1/protected/applications/self').then((response) => {
          if(response.data.courses){
            this.courses = response.data.courses;
          }
          if(response.data.application){
            this.application = response.data.application;
          }
      })} catch (err) {
          Logger.error('Unknown error fetching professional program application: ', err)
      }
    },
    //Submits the application information. Server handles determining if this is an insert or update.
    async submit(user_application, user_courses) {
      Logger.info('application: submit')
      await api.post('/api/v1/protected/applications/submit', {
        application: user_application,
        courses: user_courses
      })
    }
  }
})