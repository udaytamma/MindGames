/**
 * @fileoverview Component tests for OperationMixSlider
 * Tests the operation mix UI including presets, sliders, and percentage calculations.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OperationMixSlider, { OperationMix } from '@/components/OperationMixSlider';

describe('OperationMixSlider', () => {
  const defaultMix: OperationMix = { add: 25, subtract: 25, multiply: 25, divide: 25 };
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('Rendering', () => {
    it('should render all four operation controls', () => {
      render(<OperationMixSlider value={defaultMix} onChange={mockOnChange} />);

      expect(screen.getByText('Add')).toBeInTheDocument();
      expect(screen.getByText('Sub')).toBeInTheDocument();
      expect(screen.getByText('Mul')).toBeInTheDocument();
      expect(screen.getByText('Div')).toBeInTheDocument();
    });

    it('should render all preset buttons', () => {
      render(<OperationMixSlider value={defaultMix} onChange={mockOnChange} />);

      expect(screen.getByText('Random')).toBeInTheDocument();
      expect(screen.getByText('Basic')).toBeInTheDocument();
      expect(screen.getByText('Advanced')).toBeInTheDocument();
      expect(screen.getByText('Expert')).toBeInTheDocument();
    });

    it('should display current percentages', () => {
      const mix: OperationMix = { add: 40, subtract: 30, multiply: 20, divide: 10 };
      render(<OperationMixSlider value={mix} onChange={mockOnChange} />);

      expect(screen.getByText('40%')).toBeInTheDocument();
      expect(screen.getByText('30%')).toBeInTheDocument();
      expect(screen.getByText('20%')).toBeInTheDocument();
      expect(screen.getByText('10%')).toBeInTheDocument();
    });

    it('should render plus and minus buttons for each operation', () => {
      render(<OperationMixSlider value={defaultMix} onChange={mockOnChange} />);

      // 4 operations x 2 buttons each = 8 buttons (plus preset buttons)
      const allButtons = screen.getAllByRole('button');
      // 4 presets + 8 +/- buttons = 12 total
      expect(allButtons.length).toBe(12);
    });
  });

  describe('Presets', () => {
    it('should apply Random preset (25/25/25/25)', () => {
      render(<OperationMixSlider value={defaultMix} onChange={mockOnChange} />);

      fireEvent.click(screen.getByText('Random'));

      expect(mockOnChange).toHaveBeenCalledWith({
        add: 25,
        subtract: 25,
        multiply: 25,
        divide: 25,
      });
    });

    it('should apply Basic preset (40/40/10/10)', () => {
      render(<OperationMixSlider value={defaultMix} onChange={mockOnChange} />);

      fireEvent.click(screen.getByText('Basic'));

      expect(mockOnChange).toHaveBeenCalledWith({
        add: 40,
        subtract: 40,
        multiply: 10,
        divide: 10,
      });
    });

    it('should apply Advanced preset (20/20/30/30)', () => {
      render(<OperationMixSlider value={defaultMix} onChange={mockOnChange} />);

      fireEvent.click(screen.getByText('Advanced'));

      expect(mockOnChange).toHaveBeenCalledWith({
        add: 20,
        subtract: 20,
        multiply: 30,
        divide: 30,
      });
    });

    it('should apply Expert preset (10/10/40/40)', () => {
      render(<OperationMixSlider value={defaultMix} onChange={mockOnChange} />);

      fireEvent.click(screen.getByText('Expert'));

      expect(mockOnChange).toHaveBeenCalledWith({
        add: 10,
        subtract: 10,
        multiply: 40,
        divide: 40,
      });
    });

    it('should highlight selected preset', () => {
      const randomMix: OperationMix = { add: 25, subtract: 25, multiply: 25, divide: 25 };
      render(<OperationMixSlider value={randomMix} onChange={mockOnChange} />);

      const randomButton = screen.getByText('Random').closest('button');
      expect(randomButton).toHaveClass('bg-primary-500');
    });
  });

  describe('Increment/Decrement', () => {
    it('should call onChange when plus button is clicked', () => {
      const mix: OperationMix = { add: 25, subtract: 25, multiply: 25, divide: 25 };
      render(<OperationMixSlider value={mix} onChange={mockOnChange} />);

      // Find the plus buttons (they contain a Plus icon, so we find by structure)
      const buttons = screen.getAllByRole('button');
      // Plus buttons are at indices 4, 6, 8, 10 (after 4 preset buttons)
      const addPlusButton = buttons[5]; // Plus for Add

      fireEvent.click(addPlusButton);

      expect(mockOnChange).toHaveBeenCalled();
    });

    it('should respect minimum percentage constraint', () => {
      const mix: OperationMix = { add: 10, subtract: 30, multiply: 30, divide: 30 };
      render(
        <OperationMixSlider value={mix} onChange={mockOnChange} minPercent={10} />
      );

      // The minus button for Add should be disabled at 10%
      const buttons = screen.getAllByRole('button');
      const addMinusButton = buttons[4]; // Minus for Add

      expect(addMinusButton).toBeDisabled();
    });

    it('should respect maximum percentage constraint', () => {
      // With minPercent=10, max for any single op is 100 - 3*10 = 70
      const mix: OperationMix = { add: 70, subtract: 10, multiply: 10, divide: 10 };
      render(
        <OperationMixSlider value={mix} onChange={mockOnChange} minPercent={10} />
      );

      const buttons = screen.getAllByRole('button');
      const addPlusButton = buttons[5]; // Plus for Add

      expect(addPlusButton).toBeDisabled();
    });
  });

  describe('Slider Range Inputs', () => {
    it('should render range inputs for each operation', () => {
      render(<OperationMixSlider value={defaultMix} onChange={mockOnChange} />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(4);
    });

    it('should have correct min/max values based on minPercent', () => {
      render(
        <OperationMixSlider value={defaultMix} onChange={mockOnChange} minPercent={10} />
      );

      const sliders = screen.getAllByRole('slider');
      sliders.forEach((slider) => {
        expect(slider).toHaveAttribute('min', '10');
        expect(slider).toHaveAttribute('max', '70'); // 100 - 3*10
      });
    });

    it('should update on slider change', () => {
      render(<OperationMixSlider value={defaultMix} onChange={mockOnChange} />);

      const sliders = screen.getAllByRole('slider');
      fireEvent.change(sliders[0], { target: { value: '40' } });

      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('Visual Bar', () => {
    it('should render visual distribution bar', () => {
      render(<OperationMixSlider value={defaultMix} onChange={mockOnChange} />);

      // Check for the slider-track class
      const track = document.querySelector('.slider-track');
      expect(track).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      render(<OperationMixSlider value={defaultMix} onChange={mockOnChange} />);

      // All buttons should be keyboard accessible
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabIndex', '-1');
      });
    });
  });
});
