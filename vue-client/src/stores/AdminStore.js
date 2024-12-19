import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/adminApi'

//Backing store for the mixin to determine if adminMode is currently toggled on
export const useAdminStore = defineStore('admin', {
  state: () => {
    applications: []
    return {
      IsAdminMode: true
    }
  },
  actions: {
    async fetchApplications() {
      Logger.info('admin:fetchApplications')
      await api.get('/api/applications').then((response) => {
        this.applications = response.data
      })
    },
  }
})