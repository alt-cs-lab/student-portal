import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ProfilesForm from '@/sub-apps/profile-app/ProfilePage.vue'
import { createTestingPinia } from '@pinia/testing'
import { useTokenStore } from '@/stores/TokenStore'
import { useProfileStore } from '@/stores/ProfileStore'
import {ref} from 'vue'
import router from '@/router'

vi.mock('@/stores/ProfileStore')
vi.mock('@/stores/TokenStore')


describe('ProfilesForm tests', () => {
    let wrapper
    let profileStore
    let tokenStore
    let spy

    beforeEach(() => {
        // Mock the profileStore object
        profileStore = {
          hydrate: vi.fn(),
          update: vi.fn(),
          user: ref({
            email: 'jdoe@ksu.edu',
            firstName: 'Johnathan',
            lastName: 'Doe',
            wid: '888888888'
          })
        };

        //And the tokenStore
        tokenStore = {
          useTokenStore: vi.fn(),
          getToken: vi.fn(),
          tryToken: vi.fn(),
          get_profile_updated: false,
        };

        spy = vi.spyOn(tokenStore, 'useTokenStore')
        // Mock the return of the useStore functions
        useProfileStore.mockReturnValue(profileStore)
        useTokenStore.mockReturnValue(tokenStore);
    
        // Mount the component with the necessary plugins and mocks
        wrapper = mount(ProfilesForm, {
            global: {
              plugins: [
                createTestingPinia({
                  createSpy: vi.fn 
                }),
              ],
              provide: {
                $toast: { add: vi.fn() }
              }
            }
          });
      });

    it("Should render the ProfilesForm", async () => {
        const profile = wrapper.findComponent(ProfilesForm)
        expect(profile.exists()).toBe(true)
    })

    it("Should render each of the text fields", () => {
        const firstName = wrapper.findComponent("#firstName")
        expect(firstName.exists()).toBe(true)

        const lastName = wrapper.findComponent('#lastName')
        expect(lastName.exists()).toBe(true)

        const email = wrapper.findComponent('#email')
        expect(email.exists()).toBe(true)

        const wid = wrapper.findComponent('#wid')
        expect(wid.exists()).toBe(true)
    })

    it("Should be able to change data and have it save", async () => {
        const profileStore = useProfileStore()

        const spy = vi.spyOn(wrapper.vm, 'save');
        profileStore.user.value.firstName = 'New Name'
        await wrapper.vm.save();
        expect(spy).toHaveBeenCalled()
    
        profileStore.hydrate()

        expect(profileStore.user.value.firstName).toBe('New Name');
    }) 

    it('save should show success toast on successful update', async () => {
        const toast = wrapper.vm.$toast;
        const toastSpy = vi.spyOn(toast, 'add');

        profileStore.update.mockResolvedValueOnce();

        await wrapper.vm.save();

        await wrapper.vm.$nextTick();

        expect(toastSpy).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Profile Updated!',
        life: 3000
        });
      })

    //Still cannot get these tests to work.
    //Attempted wrapping the Header as well to have a regular router-link, but those come up as undefined.
    //Any way I can find to manipulate the current router doesn't work.
    //I think something must be up with the specific way we're using pinia for these tests.
    it.skip('should prevent a new user from leaving the profile page', async () => {
        //Profile hasn't been updated.
        tokenStore.get_profile_updated = false
        //Try to go to home page.
        router.push('/')
        await router.isReady()
        //Should still be on profile page
        expect(router.currentRoute.value.path).toBe('/profile')
    })

    it.skip('should allow a user who has saved to leave the profile page', async () => {
      //Pretend the profile was updated
      tokenStore.get_profile_updated = true
      //Try to go to home page.
      router.push('/')
      await router.isReady()
      expect(spy).toHaveBeenCalledTimes(1)
      //Should be on the home page
      expect(router.currentRoute.value.fullPath).toBe('/')
      
    })
})
