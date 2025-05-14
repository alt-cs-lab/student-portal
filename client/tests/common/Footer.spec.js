import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Footer from '@/components/layout/Footer.vue'

describe('Footer tests', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(Footer)
    })


    it("Should render the Footer", () => {
        const footer = wrapper.findComponent(Footer)

        expect(footer.exists()).toBe(true)
    })
})