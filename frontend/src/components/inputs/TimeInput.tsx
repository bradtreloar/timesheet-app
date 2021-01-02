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
  className?: string;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  id,
  name,
  value,
  onBlur,
  onChange,
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

  const setFocus = (name: string, hasFocus: boolean) => {
    if (name.split(".").pop() === "minute") {
      setMinuteHasFocus(hasFocus);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocus(event.target.name, true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocus(event.target.name, false);
    if (onBlur !== undefined) {
      onBlur(event);
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
          onChange={(event) => {
            const value = event.target.value;
            if (underMaxLength(value) && underMaxValue(value, 23)) {
              onChange(event);
            }
          }}
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
          onChange={(event) => {
            const value = event.target.value;
            if (underMaxLength(value) && underMaxValue(value, 59)) {
              onChange(event);
            }
          }}
        />
      </div>
    </div>
  );
};

export default TimeInput;
