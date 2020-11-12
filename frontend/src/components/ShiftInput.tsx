import React from "react";
import { ShiftTimes } from "../types";
import { longFormatDate, SimpleTime } from "../helpers/date";
import TimeInput from "./TimeInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface ShiftInputProps {
  date: Date;
  shiftTimes: ShiftTimes | null;
  onChange: (shiftTimes: ShiftTimes) => void;
  onToggle: () => void;
}

const ShiftInput: React.FC<ShiftInputProps> = ({
  date,
  shiftTimes,
  onChange,
  onToggle,
}) => {
  const label = longFormatDate(date);

  return (
    <div aria-label="Shift" className="d-flex">
      <label>
        <ShiftToggle isChecked={shiftTimes !== null} onToggle={onToggle} />
        <div>{label}</div>
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
  isChecked: boolean;
  onToggle: () => void;
}

const ShiftToggle: React.FC<ShiftToggleProps> = ({ isChecked, onToggle }) => {
  return isChecked ? (
    <button
      aria-label="Worked"
      className="shift-toggler btn btn-light is-unchecked"
      onClick={onToggle}
    >
      <span className="sr-only">Inactive</span>
    </button>
  ) : (
    <button
      aria-label="Worked"
      className="shift-toggler btn btn-light is-checked"
      onClick={onToggle}
    >
      <FontAwesomeIcon className="icon" icon={faCheck} />
      <span className="sr-only">Active</span>
    </button>
  );
};

export default ShiftInput;
