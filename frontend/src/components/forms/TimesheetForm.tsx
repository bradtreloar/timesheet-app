import React, { useCallback } from "react";
import { isEmpty, range } from "lodash";
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
  names.push(`${name}.hour`);
  names.push(`${name}.minute`);
  return names;
}, [] as string[]);

export const shiftInputNames = ["isActive", ...shiftTimesInputNames] as const;

const getShiftTimesFromValues = (values: any, index: number): ShiftTimes => {
  return {
    isActive: values[`shift.${index}.isActive`],
    ...shiftTimesNames.reduce((times, name) => {
      times[name] = {
        hour: values[`shift.${index}.${name}.hour`],
        minute: values[`shift.${index}.${name}.minute`],
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
    values[`${name}.startTime.hour`] = dv.startTime.hour;
    values[`${name}.startTime.minute`] = dv.startTime.minute;
    values[`${name}.endTime.hour`] = dv.endTime.hour;
    values[`${name}.endTime.minute`] = dv.endTime.minute;
    values[`${name}.breakDuration.hour`] = dv.breakDuration.hour;
    values[`${name}.breakDuration.minute`] = dv.breakDuration.minute;
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
            hour: parseInt(shiftTimes.startTime.hour),
            minute: parseInt(shiftTimes.startTime.minute),
          })
          .toISO(),
        end: shiftDate
          .set({
            hour: parseInt(shiftTimes.endTime.hour),
            minute: parseInt(shiftTimes.endTime.minute),
          })
          .toISO(),
        breakDuration: new Time(
          shiftTimes.breakDuration.hour,
          shiftTimes.breakDuration.minute
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
      const hour = values[`${prefix}.hour`];
      const minute = values[`${prefix}.minute`];

      if (hour === "") {
        errors[`${prefix}.hour`] = `Hour required`;
      } else {
        const hourInt = parseInt(hour);
        if (isNaN(hourInt) || hourInt < 0 || hourInt >= 24) {
          errors[`${prefix}.hour`] = `Hour must be a number between 0 and 23`;
        }
      }

      if (minute === "") {
        errors[`${prefix}.minute`] = `Minute required`;
      } else {
        const minuteInt = parseInt(minute);
        if (isNaN(minuteInt) || minuteInt < 0 || minuteInt >= 60) {
          errors[
            `${prefix}.hour`
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
    const hourError = errors[`${name}.hour`];
    const minuteError = errors[`${name}.minute`];
    const visibleHourError = visibleErrors[`${name}.hour`];
    const visibleMinuteError = visibleErrors[`${name}.minute`];

    return (
      <div aria-label={label}>
        <span className="sr-only">{label}</span>
        <TimeInput
          name={name}
          value={{
            hour: values[`${name}.hour`],
            minute: values[`${name}.minute`],
          }}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {(timeError || visibleHourError || visibleMinuteError) && (
          <div className="invalid-feedback">
            {timeError && (
              <div>{timeError}</div>
            )}
            {visibleHourError && (
              <div>{hourError}</div>
            )}
            {visibleMinuteError && (
              <div>{minuteError}</div>
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
