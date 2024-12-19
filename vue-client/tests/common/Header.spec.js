import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Header from '@/components/layout/Header.vue'
import { createRouter, createWebHistory } from 'vue-router';
import { createTestingPinia } from '@pinia/testing'
import ToggleSwitch from 'primevue/toggleswitch';
import { useTokenStore } from '@/stores/TokenStore';


//Route imports
import Error from '@/components/common/ErrorPage.vue'
import professionalRoutes from '@/sub-apps/professional-program-app/routes'
import ProfessionalProgram from '@/sub-apps/professional-program-app/ProfessionalProgram.vue'
import ProfileRoutes from '@/sub-apps/profile-app/ProfileRoutes'

//Mock Router
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'Home' },
        { path: '/home', name: 'Home' },
        { path: '/professional-program', component:ProfessionalProgram,
           children: professionalRoutes
        },
        { path : '/profile',
          children: ProfileRoutes
        },
        { path: '/:catchAll(.*)',  component: Error }
    ]
})

describe('Header tests', () => {
    let wrapper

    beforeEach(() => {

        // Mount the component with the mock store
        wrapper = mount(Header, {
            global: {
                plugins: [
                    createTestingPinia({
                    createSpy: vi.fn 
                  })
                ],
            },
        });
    })

    it("Should render the Header", () => {
        const header = wrapper.findComponent(Header)
        expect(header.exists()).toBe(true)
    })

    describe.skip("Admin toggle tests", () => {
        it("Should render if the user is an admin", () => {
            //Create mock admin user
            const wrapper = mount(Header, {
                global: {
                    plugins: [router, createTestingPinia({
                        initialState: {
                            Token: {is_admin: true}
                        }
                    })]
                }
            })

            const adminToggle = wrapper.findComponent(ToggleSwitch)
            expect(adminToggle.isVisible()).toBe(true)
        })

        it("Should not render if the user is not an admin", () => {
            //Create mock admin user
            const wrapper = mount(Header, {
                global: {
                    plugins: [router, createTestingPinia({
                        initialState: {
                            Token: {is_admin: false}
                        }
                    })]
                }
            })

            const adminToggle = wrapper.findComponent(ToggleSwitch)
            expect(adminToggle.isVisible()).toBe(false)
        })
    })

    describe('Header routing tests', () => {
        it.skip('Send you to Home if you click the menu item', async () => {
            //Create mock admin user
            const wrapper = mount(Header, {
                global: {
                    plugins: [router, createTestingPinia({
                        initialState: {
                            token: {is_admin: true}
                        }
                        , createSpy: vi.fn()
                    })]
                }
            })
            const homeLink = wrapper.findComponent('#nav0')

            await homeLink.trigger('click');

            expect(router.currentRoute.value.name).toBe('Home')
        })
    })
})
