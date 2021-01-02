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
import "./TimesheetForm.scss";
import { Button, Form } from "react-bootstrap";

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
  comment: "",
  ...range(7).reduce((values, index) => {
    const dv = defaultShifts[index];
    const name = `shift.${index}`;
    values[`${name}.isActive`] = dv.isActive;
    values[`${name}.startTime.hour`] = dv.startTime.hour.toString();
    values[`${name}.startTime.minute`] = dv.startTime.minute.toString();
    values[`${name}.endTime.hour`] = dv.endTime.hour.toString();
    values[`${name}.endTime.minute`] = dv.endTime.minute.toString();
    values[`${name}.breakDuration.hour`] = dv.breakDuration.hour.toString();
    values[`${name}.breakDuration.minute`] = dv.breakDuration.minute.toString();
    return values;
  }, {} as any),
});

/**
 * Prepares the value to be passed to the form's onSubmitTimesheet callback.
 *
 * @param values
 *   An object containing the value for each form input.
 * @returns
 *   A array of Shift objects.
 */
const processTimesheet = (values: any): { shifts: Shift[]; comment: string } => {
  const weekStartDateTime = values.weekStartDateTime as DateTime;
  const comment = values.comment;
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

  return { shifts, comment };
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
const validateTimesheet = (values: any) => {
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
  onSubmitTimesheet: (values: { shifts: Shift[]; comment: string }) => void;
  className?: string;
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({
  defaultWeekStartDateTime,
  defaultShifts,
  onSubmitTimesheet,
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
    handleSubmit: handleSubmitTimesheet,
    visibleErrors,
  } = useForm(
    initialValues,
    (values) => {
      onSubmitTimesheet(processTimesheet(values));
    },
    validateTimesheet
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
    const hourValue = values[`${name}.hour`];
    const minuteValue = values[`${name}.minute`];
    const hourError = errors[`${name}.hour`];
    const minuteError = errors[`${name}.minute`];
    const visibleHourError = visibleErrors[`${name}.hour`];
    const visibleMinuteError = visibleErrors[`${name}.minute`];

    return (
      <div className="mr-md-3 mb-2 mb-md-0 flex-grow-1">
        <div className="input-group" aria-label={label}>
          <div className="input-group-prepend flex-grow-1">
            <div className="input-group-text w-100">
              <small className="text-uppercase">{label}</small>
            </div>
          </div>
          <TimeInput
            className="form-control w-auto flex-grow-0"
            name={name}
            value={{
              hour: hourValue,
              minute: minuteValue,
            }}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {(timeError || visibleHourError || visibleMinuteError) && (
            <div className="invalid-feedback">
              {timeError && <div>{timeError}</div>}
              {visibleHourError && <div>{hourError}</div>}
              {visibleMinuteError && <div>{minuteError}</div>}
            </div>
          )}
        </div>
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
      <div key={index} className="border p-1 my-1 bg-light">
        <div className="d-lg-flex" aria-label="Shift">
          <label className="d-flex align-items-center m-0 flex-grow-1 pl-2 py-1 py-lg-2 mr-lg-3">
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
            <span className="ml-3">{label}</span>
          </label>
          {isActive && (
            <div className="d-md-flex align-items-center mt-1 mt-lg-0">
              {timeInput(`${name}.startTime`, "Start")}
              {timeInput(`${name}.endTime`, "End")}
              {timeInput(`${name}.breakDuration`, "Break")}
              <div className="shift-hours">
                <div className="form-control w-100">
                  {shiftHours ? `${shiftHours} hours` : `\u00A0`}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  });

  return (
    <form onSubmit={handleSubmitTimesheet} className={className}>
      {errors.form && <div className="alert alert-danger">{errors.form}</div>}
      <div className="my-3">
        <WeekSelect
          className="w-100"
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
      </div>
      <div>{shiftInputs}</div>
      <Form.Group controlId="comment" className="my-3">
        <Form.Label>Comments/Notes</Form.Label>
        <Form.Control
          name="comment"
          onChange={handleChange}
        />
      </Form.Group>
      <div className="my-3 text-right">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default TimesheetForm;
