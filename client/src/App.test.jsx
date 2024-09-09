import { expect, describe, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx';
import { UserProvider } from './context/UserContext.jsx'


beforeEach(() => {
    global.fetch = vi.fn(() => 
        Promise.resolve({
            json: () => Promise.resolve({ user: {name: 'John Doe'} }),
        })
    );
});


describe('App Component', () => {

    it('Renders header and footer', async () => {
        render(
            <UserProvider>
                <MemoryRouter intialEntries={['/']}>
                    <App/>
                </MemoryRouter>
            </UserProvider>
        );
        expect(screen.getByText('Not logged in')).toBeInTheDocument();
        expect(screen.getByText('Not logged in')).toBeInTheDocument();
    })

})