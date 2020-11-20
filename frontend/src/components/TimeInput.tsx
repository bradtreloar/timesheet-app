import React from "react";
import classnames from "classnames";
import { SimpleTime } from "../helpers/date";

interface TimeInputProps {
  time: SimpleTime;
  error?: TimeInputError | false;
  onChange: (time: SimpleTime, error?: string) => void;
}

export interface TimeInputError {
  hours: boolean;
  minutes: boolean;
  message: string;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  time,
  error,
  onChange,
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
    <div>
      <div>
        <input
          aria-label="Hours"
          className={classnames(error && error.hours && "is-invalid")}
          type="text"
          pattern="[0-2]{0,1}[0-9]{0,1}"
          value={hours !== null ? hours.toString() : ""}
          onChange={(event) => {
            const newHours = parseValue(event.target.value, hours);
            try {
              const newTime = new SimpleTime(newHours, minutes);
              onChange(newTime);
            } catch (error) {}
          }}
        />
        <span className="mx-1">:</span>
        <input
          aria-label="Minutes"
          className={classnames(error && error.minutes && "is-invalid")}
          type="text"
          pattern="[0-5]{0,1}[0-9]{0,1}"
          value={formattedValue(minutes, hasFocus)}
          onChange={(event) => {
            const newMinutes = parseValue(event.target.value, minutes);
            try {
              const newTime = new SimpleTime(hours, newMinutes);
              onChange(newTime);
            } catch (error) {}
          }}
          onFocus={() => {
            setHasFocus(false);
          }}
          onBlur={() => {
            setHasFocus(true);
          }}
        />
      </div>
      {error && (
        <div className="invalid-feedback">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default TimeInput;
