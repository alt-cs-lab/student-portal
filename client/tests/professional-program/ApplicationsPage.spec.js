import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ApplicationsPage from '@/sub-apps/professional-program-app/ProfessionalProgram.vue'
import { createTestingPinia } from '@pinia/testing'

describe('ApplicationsPage tests', () => {
    let wrapper

    beforeEach(() => {

        // Mount component with the mock store
        wrapper = mount(ApplicationsPage, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn 
                      })
                ],
            },
        });
    })

    it("Should render the ApplicationsPage", () => {
        const applications = wrapper.findComponent(ApplicationsPage)
        expect(applications.exists()).toBe(true)
    })
})
