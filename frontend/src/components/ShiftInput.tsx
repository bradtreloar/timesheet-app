import React from "react";
import classnames from "classnames";
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
  value: ShiftTimes | null;
  errors?: ShiftInputErrors | false;
  onChange: (value: ShiftTimes) => void;
  onToggle: () => void;
}

const ShiftInput: React.FC<ShiftInputProps> = ({
  date,
  value,
  errors,
  onChange,
  onToggle,
}) => {
  const label = longFormatDate(date);
  const shiftDuration = React.useMemo(() => {
    const shiftDuration = value ? getShiftDuration(value) : null;
    return shiftDuration !== null ? shiftDuration.toFixed(2) : "N/A";
  }, [value]);

  return (
    <div aria-label="Shift" className="d-flex">
      <label>
        <ShiftToggle isChecked={value !== null} onToggle={onToggle} />
        <div>{label}</div>
      </label>
      {value && (
        <>
          <div>
            <div aria-label="Start time">
              <TimeInput
                value={value.startTime}
                error={errors && errors.startTime}
                onChange={(startTime: SimpleTime | null) => {
                  onChange(Object.assign({}, value, { startTime }));
                }}
              />
              {errors && errors.startTime && (
                <div className="invalid-feedback">
                  {errors.startTime.message}
                </div>
              )}
            </div>
            <div aria-label="End time">
              <TimeInput
                value={value.endTime}
                error={errors && errors.endTime}
                onChange={(endTime: SimpleTime | null) => {
                  onChange(Object.assign({}, value, { endTime }));
                }}
              />
              {errors && errors.endTime && (
                <div className="invalid-feedback">
                  {errors.endTime.message}
                </div>
              )}
            </div>
            <div aria-label="Break duration">
              <TimeInput
                value={value.breakDuration}
                error={errors && errors.breakDuration}
                onChange={(breakDuration: SimpleTime | null) => {
                  onChange(Object.assign({}, value, { breakDuration }));
                }}
              />
              {errors && errors.breakDuration && (
                <div className="invalid-feedback">
                  {errors.breakDuration.message}
                </div>
              )}
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

const ShiftToggle: React.FC<ShiftToggleProps> = ({ isChecked, onToggle }) => (
  <button
    aria-label="Worked"
    className={classnames(
      "shift-toggler btn btn-light",
      isChecked ? "is-checked" : "is-unchecked"
    )}
    type="button"
    onClick={(event) => {
      event.preventDefault();
      onToggle();
    }}
  >
    {isChecked && <FontAwesomeIcon className="icon" icon={faCheck} />}
    <span className="sr-only">{isChecked ? `Active` : `Inactive`}</span>
  </button>
);

export default ShiftInput;
