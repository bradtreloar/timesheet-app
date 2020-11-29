import React, { useCallback } from "react";
import { addDays, longFormatDate, Time } from "../services/date";
import { Shift, ShiftTimes } from "../types";
import WeekSelect from "./WeekSelect";
import { range } from "lodash";
import useForm, { FormErrors } from "../hooks/useForm";
import TimeInput from "./TimeInput";

export const shiftTimesNames = [
  "startTime",
  "endTime",
  "breakDuration",
] as const;

export const shiftTimesInputNames = shiftTimesNames.reduce((names, name) => {
  names.push(`${name}.hours`);
  names.push(`${name}.minutes`);
  return names;
}, [] as string[]);

export const shiftInputNames = ["isActive", ...shiftTimesInputNames] as const;

/**
 * Prepares the values for the form's initial state.
 *
 * @param defaultWeekStartDate
 *   The start date of the default week to be selected.
 * @param defaultShifts
 *   The start time, end time, and break duration for each shift, or null for
 *   each shift that is disabled by default.
 * @returns
 *   An object containing the default value for each form input.
 */
const buildInitialValues = (
  defaultWeekStartDate: Date,
  defaultShifts: ShiftTimes[]
) => ({
  weekStartDate: defaultWeekStartDate,
  ...range(7).reduce((values, index) => {
    const dv = defaultShifts[index];
    const name = `shift.${index}`;
    values[`${name}.isActive`] = dv.isActive;
    values[`${name}.startTime.hours`] = dv.startTime.hours;
    values[`${name}.startTime.minutes`] = dv.startTime.minutes;
    values[`${name}.endTime.hours`] = dv.endTime.hours;
    values[`${name}.endTime.minutes`] = dv.endTime.minutes;
    values[`${name}.breakDuration.hours`] = dv.breakDuration.hours;
    values[`${name}.breakDuration.minutes`] = dv.breakDuration.minutes;
    return values;
  }, {} as any),
});

/**
 * Prepares the value to be passed to the form's onSubmit callback.
 *
 * @param values
 *   An object containing the value for each form input.
 * @returns
 *   A array of Shift objects.
 */
const process = (values: any): { shifts: Shift[] } => {
  const weekStartDate = values.weekStartDate;
  const shifts: Shift[] = [];
  range(7).forEach((index) => {
    if (values[`shift.${index}.isActive`]) {
      const shiftDate = addDays(weekStartDate, index);
      const shift = {
        start: new Time(
          values[`shift.${index}.startTime.hours`],
          values[`shift.${index}.startTime.minutes`]
        )
          .toDate(shiftDate)
          .toISOString(),
        end: new Time(
          values[`shift.${index}.endTime.hours`],
          values[`shift.${index}.endTime.minutes`]
        )
          .toDate(shiftDate)
          .toISOString(),
        breakDuration: new Time(
          values[`shift.${index}.breakDuration.hours`],
          values[`shift.${index}.breakDuration.minutes`]
        ).toMinutes(),
      };
      shifts.push(shift);
    }
  });

  return { shifts };
};

/**
 * Validates the form inputs.
 *
 * @param values
 *   An object containing the value for each form input.
 * @returns
 *   An object containing the error for any form inputs that contain invalid
 *   values. Returns null if no errors are found.
 */
const validate = (values: any) => {
  const errors = {} as FormErrors<any>;
  let hasActiveShifts = false;

  range(7).forEach((index) => {
    // Don't validate a shift's values while it is disabled.
    if (values[`shift.${index}.isActive`] === false) {
      return;
    }
    hasActiveShifts = true;

    shiftTimesNames.forEach((name) => {
      const prefix = `shift.${index}.${name}`;
      const hours = values[`${prefix}.hours`];
      const minutes = values[`${prefix}.minutes`];

      if (hours === "") {
        errors[`${prefix}.hours`] = `Hours required`;
      } else {
        const hoursInt = parseInt(hours);
        if (isNaN(hoursInt) || hoursInt < 0 || hoursInt >= 24) {
          errors[`${prefix}.hours`] = `Hours must be a number between 0 and 23`;
        }
      }

      if (minutes === "") {
        errors[`${prefix}.minutes`] = `Minutes required`;
      } else {
        const minutesInt = parseInt(minutes);
        if (isNaN(minutesInt) || minutesInt < 0 || minutesInt >= 60) {
          errors[
            `${prefix}.hours`
          ] = `Minutes must be a number between 0 and 59`;
        }
      }
    });
  });

  if (!hasActiveShifts) {
    errors[`form`] = `At least one shift is required.`;
  }

  return errors;
};

interface TimesheetFormProps {
  defaultWeekStartDate: Date;
  defaultShifts: ShiftTimes[];
  onSubmit: (values: { shifts: Shift[] }) => void;
  className?: string;
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({
  defaultWeekStartDate,
  defaultShifts,
  onSubmit,
  className,
}) => {
  const initialValues = useCallback(
    () => buildInitialValues(defaultWeekStartDate, defaultShifts),
    [defaultWeekStartDate, defaultShifts]
  );

  const {
    values,
    setSomeValues,
    setSomeTouchedValues,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    initialValues,
    (values) => {
      onSubmit(process(values));
    },
    validate
  );

  // Clear the time values for the shift and flag the time inputs as untouched.
  const clearShiftValues = (shiftName: string) => {
    const newValues = shiftTimesInputNames.reduce((values, inputName) => {
      values[`${shiftName}.${inputName}`] = "";
      return values;
    }, {} as { [key: string]: "" | false });
    newValues[`${shiftName}.isActive`] = false;
    const newTouchedValues = shiftTimesInputNames.reduce(
      (touchedValues, inputName) => {
        touchedValues[`${shiftName}.${inputName}`] = false;
        return touchedValues;
      },
      {} as { [key: string]: false }
    );
    setSomeValues(newValues);
    setSomeTouchedValues(newTouchedValues);
  };

  const timeInput = (name: string, label: string) => {
    const hoursError = errors[`${name}.hours`];
    const minutesError = errors[`${name}.minutes`];

    return (
      <div aria-label={label}>
        <span className="sr-only">{label}</span>
        <TimeInput
          name={name}
          value={{
            hours: values[`${name}.hours`],
            minutes: values[`${name}.minutes`],
          }}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {(hoursError || minutesError) && (
          <div className="invalid-feedback">
            {hoursError && <div>{hoursError}</div>}
            {minutesError && <div>{minutesError}</div>}
          </div>
        )}
      </div>
    );
  };

  const shiftInputs = range(7).map((index) => {
    const name = `shift.${index}`;
    const shiftDate = addDays(values.weekStartDate, index);
    const label = longFormatDate(shiftDate);
    const isActive = values[`${name}.isActive`] as boolean;

    return (
      <div key={index} aria-label="Shift">
        <label>
          <input
            data-testid="shift-toggle"
            name={`${name}.isActive`}
            type="checkbox"
            checked={isActive}
            onChange={(event) => {
              if (!event.target.checked) {
                clearShiftValues(name);
              } else {
                handleChange(event);
              }
            }}
          />
          <span>{label}</span>
        </label>
        {isActive && (
          <>
            <div>
              {timeInput(`${name}.startTime`, "Start time")}
              {timeInput(`${name}.endTime`, "End time")}
              {timeInput(`${name}.breakDuration`, "Break Duration")}
            </div>
          </>
        )}
      </div>
    );
  });

  return (
    <form onSubmit={handleSubmit} className={className}>
      <WeekSelect
        value={values.weekStartDate}
        onChange={(value: Date) => {
          handleChange({
            target: {
              type: "weekSelect",
              name: "weekStartDate",
              value,
            },
          });
        }}
      />
      {errors.form && <div className="alert alert-danger">{errors.form}</div>}
      <div>{shiftInputs}</div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default TimesheetForm;
