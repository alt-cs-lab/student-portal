import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/apiHook'

// Import token store
import { useTokenStore } from './TokenStore'

export const useStudentStore = defineStore('student', {
  state: () => {
    return {
        courses: []
        
    }
  },
  actions: {
    async hydrate() {
      Logger.info('student:courses:hydrate')

      // Access the token store to get the token
      const tokenStore = useTokenStore()

      // Get the token from the token store
      const token = tokenStore.token
      
      if (!token) {
        Logger.error('No token found')
        return
      }

      try {
        // Make API request with the token in the Authorization header
        const response = await api.get('/api/v1/protected/courses/self', {
          headers: {
            Authorization: `Bearer ${token}` // Send token in Authorization header
          }
        })

        this.courses = response.data
      } catch (error) {
        Logger.error('Error fetching student courses:', error)
        if (error.response && error.response.status === 401) {
          Logger.error('Token expired or invalid. Please log in again.')
        }
      }
  }
}
})
