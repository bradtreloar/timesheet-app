import React, { useState } from "react";
import classnames from "classnames";
import "./TimeInput.scss";
import { isInteger } from "lodash";

export type TimeInputValue = {
  hour: string;
  minute: string;
};

interface TimeInputProps {
  id?: string;
  name?: string;
  value: TimeInputValue;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  id,
  name,
  value,
  onBlur,
  onChange,
  disabled,
  className,
}) => {
  const { hour, minute } = value;
  const [minuteHasFocus, setMinuteHasFocus] = useState(false);

  const underMaxLength = (value: string) => value.length <= 2;

  const underMaxValue = (value: string, maxValue: number) => {
    if (isInteger(value)) {
      return parseInt(value) <= maxValue;
    }
    return true;
  };

  const processedValue = (value: string, maxValue: number) => {
    if (underMaxLength(value) && underMaxValue(value, maxValue)) {
      return value;
    }
    return null;
  }

  const componentName = (name: string) => name.split(".").pop();

  const setFocus = (name: string, hasFocus: boolean) => {
    if (componentName(name) === "minute") {
      setMinuteHasFocus(hasFocus);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const maxValue = componentName(event.target.name) === "minute" ? 59 : 23;
    const value = processedValue(event.target.value, maxValue);
    if (value !== null) {
      onChange(event);
    }
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocus(event.target.name, true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocus(event.target.name, false);
    if (onBlur !== undefined) {
      onBlur(event);
    }
  };

  // Prevent Enter keystroke from submitting form.
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const paddedValue = (value: string) =>
    value === "" ? value : value.padStart(2, "0");

  return (
    <div className={classnames("time-input", className)} id={id}>
      <div className="time-input-inner">
        <input
          aria-label="Hours"
          name={name && `${name}.hour`}
          type="text"
          pattern="[0-2]{0,1}[0-9]{0,1}"
          value={hour}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />
        <span className="mx-1">:</span>
        <input
          aria-label="Minutes"
          name={name && `${name}.minute`}
          type="text"
          pattern="[0-5]{0,1}[0-9]{0,1}"
          value={minuteHasFocus ? minute : paddedValue(minute)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default TimeInput;
