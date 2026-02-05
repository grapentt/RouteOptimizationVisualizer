import React from 'react';
import ReactSlider from 'react-slider';
import { ANIMATION } from '../../constants/config.js';

/**
 * Speed control slider component
 */
export function SpeedControl({ value, onChange, maxSpeed = ANIMATION.MAX_SPEED, className }) {
  return (
    <div className="slider-wrapper">
      <label id="slider-label">Choose speed by sliding</label>
      <ReactSlider
        className={`slider-input ${className || 'speed-slider'}`}
        ariaLabelledby="slider-label"
        thumbClassName="slider-thumb"
        trackClassName="slider-track"
        max={maxSpeed}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        defaultValue={value}
        onChange={onChange}
      />
    </div>
  );
}
