import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import ProfessionalProgram from '@/sub-apps/professional-program-app/ProfessionalProgram.vue'

describe('ProfessionalProgram tests', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(ProfessionalProgram, {
            global: {
                plugins: [],
            },
        })
    })

    it("Should render the ProfessionalProgram view", () => {
        const prof = wrapper.findComponent(ProfessionalProgram)
        expect(prof.exists()).toBe(true)
    })
})
