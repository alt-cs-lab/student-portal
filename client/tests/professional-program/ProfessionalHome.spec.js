import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ProfessionalHome from '@/sub-apps/professional-program-app/ProfessionalHome.vue'
import { createTestingPinia } from '@pinia/testing'

describe('ProfessionalHome tests', () => {
    let wrapper

    beforeEach(() => {

        // Mount the component with the mock store
        wrapper = mount(ProfessionalHome, {
            global: {
              plugins: [
                createTestingPinia({
                  createSpy: vi.fn 
                })
              ],
            }
          });
    })

    it("Should render the ProfessionalHome view", () => {
        const home = wrapper.findComponent(ProfessionalHome)
        expect(home.exists()).toBe(true)
    })
})
