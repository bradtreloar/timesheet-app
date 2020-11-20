import React from "react";
import { ShiftTimes } from "../types";
import { longFormatDate, SimpleTime } from "../helpers/date";
import TimeInput, { TimeInputError } from "./TimeInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import "./ShiftInput.scss";
import { getShiftDuration } from "../helpers/shift";

export const EMPTY_SHIFT_TIMES = {
  startTime: new SimpleTime(null, null),
  endTime: new SimpleTime(null, null),
  breakDuration: new SimpleTime(null, null),
} as ShiftTimes;

export interface ShiftInputErrors {
  shiftDuration?: string;
  startTime?: TimeInputError;
  endTime?: TimeInputError;
  breakDuration?: TimeInputError;
}

interface ShiftInputProps {
  date: Date;
  shiftTimes: ShiftTimes | null;
  errors?: ShiftInputErrors | false;
  onChange: (shiftTimes: ShiftTimes) => void;
  onToggle: () => void;
}

const ShiftInput: React.FC<ShiftInputProps> = ({
  date,
  shiftTimes,
  errors,
  onChange,
  onToggle,
}) => {
  const label = longFormatDate(date);
  const shiftDuration = React.useMemo(() => {
    const shiftDuration = shiftTimes ? getShiftDuration(shiftTimes) : null;
    return shiftDuration !== null ? shiftDuration.toFixed(2) : "N/A";
  }, [shiftTimes]);

  return (
    <div aria-label="Shift" className="d-flex">
      <label>
        <ShiftToggle isChecked={shiftTimes !== null} onToggle={onToggle} />
        <div>{label}</div>
      </label>
      {shiftTimes && (
        <>
          <div>
            <div aria-label="Start time">
              <TimeInput
                time={shiftTimes.startTime}
                error={errors && errors.startTime}
                onChange={(startTime: SimpleTime | null) => {
                  onChange(Object.assign({}, shiftTimes, { startTime }));
                }}
              />
            </div>
            <div aria-label="End time">
              <TimeInput
                time={shiftTimes.endTime}
                error={errors && errors.endTime}
                onChange={(endTime: SimpleTime | null) => {
                  onChange(Object.assign({}, shiftTimes, { endTime }));
                }}
              />
            </div>
            <div aria-label="Break duration">
              <TimeInput
                time={shiftTimes.breakDuration}
                error={errors && errors.breakDuration}
                onChange={(breakDuration: SimpleTime | null) => {
                  onChange(Object.assign({}, shiftTimes, { breakDuration }));
                }}
              />
            </div>
          </div>
          <div>
            <span aria-label="shift duration" className="shift-duration">
              {shiftDuration}
            </span>
          </div>
        </>
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
      className="shift-toggler btn btn-light is-checked"
      type="button"
      onClick={(event) => {
        event.preventDefault();
        onToggle();
      }}
    >
      <FontAwesomeIcon className="icon" icon={faCheck} />
      <span className="sr-only">Active</span>
    </button>
  ) : (
    <button
      aria-label="Worked"
      className="shift-toggler btn btn-light is-unchecked"
      onClick={onToggle}
    >
      <span className="sr-only">Inactive</span>
    </button>
  );
};

export default ShiftInput;
