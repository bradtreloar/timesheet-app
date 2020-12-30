import React, { useCallback } from "react";
import { isEmpty, isEqual, range } from "lodash";
import {
  getShiftHoursFromTimes,
  InvalidTimeException,
  Time,
} from "services/date";
import { Shift, ShiftTimes } from "types";
import useForm, { FormErrors } from "hooks/useForm";
import WeekSelect from "components/inputs/WeekSelect";
import TimeInput from "components/inputs/TimeInput";
import { DateTime } from "luxon";

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

const getShiftTimesFromValues = (values: any, index: number) => {
  return {
    isActive: values[`shift.${index}.isActive`],
    ...shiftTimesNames.reduce((times, name) => {
      times[name] = {
        hours: values[`shift.${index}.${name}.hours`],
        minutes: values[`shift.${index}.${name}.minutes`],
      };
      return times;
    }, {} as any),
  } as ShiftTimes;
};

/**
 * Prepares the values for the form's initial state.
 *
 * @param defaultWeekStartDateTime
 *   The start date of the default week to be selected.
 * @param defaultShifts
 *   The start time, end time, and break duration for each shift, or null for
 *   each shift that is disabled by default.
 * @returns
 *   An object containing the default value for each form input.
 */
const buildInitialValues = (
  defaultWeekStartDateTime: DateTime,
  defaultShifts: ShiftTimes[]
) => ({
  weekStartDateTime: defaultWeekStartDateTime,
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
  const weekStartDateTime = values.weekStartDateTime as DateTime;
  const shifts: Shift[] = [];
  range(7).forEach((index) => {
    const shiftTimes = getShiftTimesFromValues(values, index);
    if (shiftTimes.isActive) {
      const shiftDate = weekStartDateTime.plus({ days: index });
      const shift = {
        start: shiftDate
          .set({
            hour: parseInt(shiftTimes.startTime.hours),
            minute: parseInt(shiftTimes.startTime.minutes),
          })
          .toISO(),
        end: shiftDate
          .set({
            hour: parseInt(shiftTimes.endTime.hours),
            minute: parseInt(shiftTimes.endTime.minutes),
          })
          .toISO(),
        breakDuration: new Time(
          shiftTimes.breakDuration.hours,
          shiftTimes.breakDuration.minutes
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

  if (isEmpty(errors)) {
    range(7).forEach((index) => {
      const shiftTimes = getShiftTimesFromValues(values, index);
      if (shiftTimes.isActive) {
        const startTime = Time.fromObject(shiftTimes.startTime);
        const endTime = Time.fromObject(shiftTimes.endTime);
        const breakDuration = Time.fromObject(shiftTimes.breakDuration);

        if (endTime.toMinutes() <= startTime.toMinutes()) {
          errors[`shift.${index}.endTime`] = `Must be later than start`;
        } else if (
          endTime.toMinutes() -
            startTime.toMinutes() -
            breakDuration.toMinutes() <=
          0
        ) {
          errors[
            `shift.${index}.breakDuration`
          ] = `Must be less than total shift`;
        }
      }
    });
  }

  if (!hasActiveShifts) {
    errors[`form`] = `At least one shift is required.`;
  }

  return errors;
};

interface TimesheetFormProps {
  defaultWeekStartDateTime: DateTime;
  defaultShifts: ShiftTimes[];
  onSubmit: (values: { shifts: Shift[] }) => void;
  className?: string;
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({
  defaultWeekStartDateTime,
  defaultShifts,
  onSubmit,
  className,
}) => {
  const initialValues = useCallback(
    () => buildInitialValues(defaultWeekStartDateTime, defaultShifts),
    [defaultWeekStartDateTime, defaultShifts]
  );

  const {
    values,
    setSomeValues,
    setSomeTouchedValues,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    visibleErrors,
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
    const timeError = errors[`${name}`];
    const hoursError = errors[`${name}.hours`];
    const minutesError = errors[`${name}.minutes`];
    const visibleHoursError = visibleErrors[`${name}.hours`];
    const visibleMinutesError = visibleErrors[`${name}.minutes`];

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
        {(timeError || visibleHoursError || visibleMinutesError) && (
          <div className="invalid-feedback">
            {timeError && (
              <div>{timeError}</div>
            )}
            {visibleHoursError && (
              <div>{errors[`${name}.hours`]}</div>
            )}
            {visibleMinutesError && (
              <div>{errors[`${name}.minutes`]}</div>
            )}
          </div>
        )}
      </div>
    );
  };

  const shiftInputs = range(7).map((index) => {
    const name = `shift.${index}`;
    const shiftDate = values.weekStartDateTime.plus({ days: index });
    const shiftTimes = getShiftTimesFromValues(values, index);
    let shiftHours;
    try {
      shiftHours = getShiftHoursFromTimes(shiftTimes);
    } catch (error) {
      if (!(error instanceof InvalidTimeException)) {
        throw error;
      }
    }
    const label = shiftDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
    const isActive = shiftTimes.isActive;

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
            <div>{shiftHours} hours</div>
          </>
        )}
      </div>
    );
  });

  return (
    <form onSubmit={handleSubmit} className={className}>
      <WeekSelect
        value={values.weekStartDateTime}
        onChange={(value) => {
          handleChange({
            target: {
              type: "weekSelect",
              name: "weekStartDateTime",
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
