import { mount } from '@vue/test-utils'
import LoginPage from '@/views/LoginPage'

test('lorem-ipsum on main scr', () => {
    const wrapper = mount(LoginPage)
    expect(wrapper.text()).toContain('Lorem ipsumv2')
})
