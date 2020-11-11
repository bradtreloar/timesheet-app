import React from "react";
import { SimpleTime } from "../helpers/date";

interface TimeInputProps {
  time: SimpleTime | null;
  onChange: (time: SimpleTime | null) => void;
  "aria-label"?: string;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  time,
  onChange,
  "aria-label": ariaLabel,
}) => {
  const [hours, minutes] = time !== null ? time.toArray() : [null, null];
  const [hasFocus, setHasFocus] = React.useState(true);

  const parseValue = (value: string, defaultValue: number | null) => {
    if (value === "") {
      return null;
    }
    const integerValue = parseInt(value);
    if (isNaN(integerValue)) {
      return defaultValue;
    }
    if (integerValue < 0) {
      return integerValue * -1;
    }
    return integerValue;
  };

  const formattedValue = (value: number | null, isPadded: boolean) => {
    return value !== null
      ? isPadded
        ? value.toString().padStart(2, "0")
        : value.toString()
      : "";
  };

  return (
    <div aria-label={ariaLabel}>
      <input
        type="number"
        aria-label="Hours"
        min={0}
        max={23}
        step={1}
        required
        value={hours !== null ? hours.toString() : ""}
        onChange={(event) => {
          const newHours = parseValue(event.target.value, hours);
          onChange(new SimpleTime(newHours, minutes));
        }}
      />
      <span className="mx-1">:</span>
      <input
        type="number"
        aria-label="Minutes"
        min={0}
        max={59}
        step={1}
        required
        value={formattedValue(minutes, hasFocus)}
        onChange={(event) => {
          const newMinutes = parseValue(event.target.value, minutes);
          onChange(new SimpleTime(hours, newMinutes));
        }}
        onFocus={() => {
          setHasFocus(false);
        }}
        onBlur={() => {
          setHasFocus(true);
        }}
      />
    </div>
  );
};

export default TimeInput;
