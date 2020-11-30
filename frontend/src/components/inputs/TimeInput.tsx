import React from "react";

export type TimeInputValue = {
  hours: string;
  minutes: string;
};

interface TimeInputProps {
  id?: string;
  name?: string;
  value: TimeInputValue;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  id,
  name,
  value,
  onBlur,
  onChange,
}) => {
  const { hours, minutes } = value;

  return (
    <span id={id} onBlur={onBlur}>
      <input
        aria-label="Hours"
        name={name && `${name}.hours`}
        type="text"
        pattern="[0-2]{0,1}[0-9]{0,1}"
        value={hours}
        onChange={onChange}
      />
      <span className="mx-1">:</span>
      <input
        aria-label="Minutes"
        name={name && `${name}.minutes`}
        type="text"
        pattern="[0-5]{0,1}[0-9]{0,1}"
        value={minutes}
        onChange={onChange}
      />
    </span>
  );
};

export default TimeInput;
