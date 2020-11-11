import React from "react";
import { ShiftTimes } from "../types";
import { longFormatDate, SimpleTime } from "../helpers/date";
import TimeInput from "./TimeInput";

interface ShiftInputProps {
  date: Date;
  shiftTimes: ShiftTimes | null;
  defaultShiftTimes: ShiftTimes | null;
  onChange: (shiftTimes: ShiftTimes | null) => void;
}

const ShiftInput: React.FC<ShiftInputProps> = ({
  date,
  shiftTimes,
  defaultShiftTimes,
  onChange,
}) => {
  const label = longFormatDate(date);

  return (
    <div aria-label="Shift" className="d-flex">
      <label>
        <ShiftToggle
          date={date}
          shiftTimes={shiftTimes}
          defaultShiftTimes={defaultShiftTimes}
          onToggle={onChange}
        />
        <div>
          {label}
        </div>
      </label>
      {shiftTimes && (
        <div>
          <TimeInput
            aria-label="Start time"
            time={shiftTimes.startTime}
            onChange={(startTime: SimpleTime | null) => {
              onChange(Object.assign({}, shiftTimes, { startTime }));
            }}
          />
          <TimeInput
            aria-label="End time"
            time={shiftTimes.endTime}
            onChange={(endTime: SimpleTime | null) => {
              onChange(Object.assign({}, shiftTimes, { endTime }));
            }}
          />
          <TimeInput
            aria-label="Break duration"
            time={shiftTimes.breakDuration}
            onChange={(breakDuration: SimpleTime | null) => {
              onChange(Object.assign({}, shiftTimes, { breakDuration }));
            }}
          />
        </div>
      )}
    </div>
  );
};

interface ShiftToggleProps {
  date: Date;
  shiftTimes: ShiftTimes | null;
  defaultShiftTimes: ShiftTimes | null;
  onToggle: (shift: ShiftTimes | null) => void;
}

const ShiftToggle: React.FC<ShiftToggleProps> = ({
  date,
  shiftTimes,
  defaultShiftTimes,
  onToggle,
}) => {
  if (shiftTimes === null) {
    return (
      <button
        className="is-unchecked"
        onClick={() => {
          onToggle(
            defaultShiftTimes || {
              startTime: null,
              endTime: null,
              breakDuration: null,
            }
          );
        }}
      >
        UNCHECKED
      </button>
    );
  } else {
    return (
      <button
        className="is-checked"
        onClick={() => {
          onToggle(null);
        }}
      >
        CHECKED
      </button>
    );
  }
};

export default ShiftInput;
