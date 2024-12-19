import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach, assert } from 'vitest'
import AdminForm from '@/sub-apps/professional-program-app/AdminForm.vue'
import PrimeVue from 'primevue/config'
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';

describe('AdminForm tests', () => {
    let wrapper

    wrapper = mount(AdminForm, {
        global: {
          components: {
            DataTable,
            Dialog
          }
        }
    });

    it("Should render the AdminForm", async () => {
        await wrapper.vm.$nextTick()
        const adminForm = wrapper.findComponent(AdminForm)
        expect(adminForm.exists()).toBe(true)
    })

    it('Dialogs exists', async () => {
        const notes = wrapper.findComponent(Dialog)
        expect(notes.exists()).toBe(true) 
    });
    
    it("Should render the datatable", async () => {
        await wrapper.vm.$nextTick()
        const table = wrapper.findComponent(DataTable)
        expect(table.exists()).toBe(true)
    })
})