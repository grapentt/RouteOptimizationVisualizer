import React from 'react';
import { render, screen } from '@testing-library/react';
import { AlgorithmSelector, LocalSearchSelector } from '../ControlPanel/AlgorithmSelector';

describe('AlgorithmSelector', () => {
  const mockOnChange = jest.fn();

  it('should render without crashing', () => {
    render(<AlgorithmSelector onChange={mockOnChange} />);
  });

  it('should show warning class when showAlert is true', () => {
    const { container } = render(
      <AlgorithmSelector onChange={mockOnChange} showAlert={true} />
    );

    const warningDiv = container.querySelector('.select-warning');
    expect(warningDiv).toBeInTheDocument();
  });

  it('should not show warning class when showAlert is false', () => {
    const { container } = render(
      <AlgorithmSelector onChange={mockOnChange} showAlert={false} />
    );

    const warningDiv = container.querySelector('.select-warning');
    expect(warningDiv).not.toBeInTheDocument();
  });
});

describe('LocalSearchSelector', () => {
  const mockOnChange = jest.fn();

  it('should render without crashing', () => {
    render(<LocalSearchSelector onChange={mockOnChange} />);
  });

  it('should apply custom className if provided', () => {
    const { container } = render(
      <LocalSearchSelector onChange={mockOnChange} className="custom-class" />
    );

    const select = container.querySelector('.custom-class');
    expect(select).toBeInTheDocument();
  });

  it('should show warning class when showAlert is true', () => {
    const { container } = render(
      <LocalSearchSelector onChange={mockOnChange} showAlert={true} />
    );

    const warningDiv = container.querySelector('.select-warning');
    expect(warningDiv).toBeInTheDocument();
  });

  it('should not show warning class when showAlert is false', () => {
    const { container } = render(
      <LocalSearchSelector onChange={mockOnChange} showAlert={false} />
    );

    const warningDiv = container.querySelector('.select-warning');
    expect(warningDiv).not.toBeInTheDocument();
  });
});
