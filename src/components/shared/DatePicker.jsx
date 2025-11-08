import React from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({ 
  value, 
  onChange, 
  label, 
  min, 
  max, 
  disabled = false,
  className = '' 
}) => {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          disabled={disabled}
          className="input pr-10"
        />
        <Calendar 
          size={18} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" 
        />
      </div>
    </div>
  );
};

export default DatePicker;