import {render, screen} from '@testing-library/vue'
import LoginPage from '@/views/LoginPage'
import PrimeVue from 'primevue/config';

const mockfn = jest.fn();

jest.mock('@/services/api', () => ({
    login: () => mockfn
}));

jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: () => mockfn,
  }),
}));

jest.mock('primevue/usetoast', () => ({
    useToast: () => ({
    }),
  }));

test('lorem-ipsum on main scr', () => {
    render(LoginPage, {
        global: {
            plugins: [PrimeVue],
          },
    })
    expect(screen.queryAllByText('Log in')).toBeTruthy()
})
