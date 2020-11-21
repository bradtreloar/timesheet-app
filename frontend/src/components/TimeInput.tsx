import React, { useMemo } from "react";
import classnames from "classnames";
import { SimpleTime } from "../helpers/date";

interface TimeInputProps {
  id?: string;
  name?: string;
  value: SimpleTime;
  error?:
    | {
        hours: boolean;
        minutes: boolean;
      }
    | false;
  onChange: (value: SimpleTime, error?: string) => void;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  id,
  name,
  value,
  error,
  onChange,
}) => {
  const [hours, minutes] = value !== null ? value.toArray() : [null, null];
  const [padMinutes, setPadMinutes] = React.useState(true);
  const hoursValue = useMemo(() => (hours === null ? "" : hours.toString()), [
    hours,
  ]);
  const minutesValue = useMemo(
    () =>
      minutes === null
        ? ""
        : padMinutes
        ? minutes.toString().padStart(2, "0")
        : minutes.toString(),
    [minutes]
  );

  function parseValue(value: string) {
    return value === "" ? null : parseInt(value);
  }

  return (
    <div id={id}>
      <input
        aria-label="Hours"
        name={name && `${name}.hours`}
        className={classnames(error && error.hours && "is-invalid")}
        type="text"
        pattern="[0-2]{0,1}[0-9]{0,1}"
        value={hoursValue}
        onChange={(event) => {
          try {
            const newTime = new SimpleTime(
              parseValue(event.target.value),
              minutes
            );
            onChange(newTime);
          } catch (error) {}
        }}
      />
      <span className="mx-1">:</span>
      <input
        aria-label="Minutes"
        name={name && `${name}.hours`}
        className={classnames(error && error.minutes && "is-invalid")}
        type="text"
        pattern="[0-5]{0,1}[0-9]{0,1}"
        value={minutesValue}
        onChange={(event) => {
          try {
            const newTime = new SimpleTime(
              hours,
              parseValue(event.target.value)
            );
            onChange(newTime);
          } catch (error) {}
        }}
        onFocus={() => {
          setPadMinutes(true);
        }}
        onBlur={() => {
          setPadMinutes(false);
        }}
      />
    </div>
  );
};

export default TimeInput;
