import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompanyDashboard from './CompanyDashboard';

describe('CompanyDashboard interactions', () => {
  it('opens the create job modal and adds a new job', async () => {
    const user = userEvent.setup();
    render(<CompanyDashboard />);

    await user.click(screen.getByRole('button', { name: /^create job$/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/job title/i), 'Data Scientist');
    await user.type(screen.getByLabelText(/location/i), 'New York');
    await user.type(screen.getByLabelText(/job description/i), 'Help build the next wave of AI recruiting models.');
    await user.type(screen.getByLabelText(/application deadline/i), '2026-12-31');
    await user.type(screen.getByPlaceholderText(/min/i), '18');
    await user.type(screen.getByPlaceholderText(/max/i), '30');

    await user.click(screen.getByRole('button', { name: /publish job/i }));

    expect(await screen.findByText('Data Scientist')).toBeInTheDocument();
  });
});
