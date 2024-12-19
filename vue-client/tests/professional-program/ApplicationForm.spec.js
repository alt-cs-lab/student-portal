import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import ApplicationForm from '@/sub-apps/professional-program-app/ApplicationForm.vue'

describe('ApplicationForm tests', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(ApplicationForm)
    })


    it("Should render the ApplicationForm", () => {
        const applicationForm = wrapper.findComponent(ApplicationForm)

        expect(applicationForm.exists()).toBe(true)
    })

    it("Should render the student name textbox", () => {
        const name = wrapper.findComponent("#studentName")

        expect(name.exists()).toBe(true)
    })

    it("Should render the student wid textbox", () => {
        const wid = wrapper.findComponent("#wid")

        expect(wid.exists()).toBe(true)
    })

    it("Should render the student advisor dropdown", () => {
        const advisor = wrapper.findComponent("#advisor")

        expect(advisor.exists()).toBe(true)
    })

    it("Should render the application table", () => {
        const table = wrapper.findComponent("#appTable")

        expect(table.exists()).toBe(true)
    })

    it("Should render the comment text area", () => {
        const box = wrapper.findComponent("#commentBox")

        expect(box.exists()).toBe(true)
    })

    it("Should render the submit button", () => {
        const btn = wrapper.findComponent("#submitBtn")

        expect(btn.exists()).toBe(true)
    })

})