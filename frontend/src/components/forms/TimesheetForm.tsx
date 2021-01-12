import React, { useCallback, useMemo } from "react";
import { isEmpty, range } from "lodash";
import classnames from "classnames";
import {
  getShiftHoursFromTimes,
  InvalidTimeException,
  Time,
} from "services/date";
import { Absence, Shift, ShiftValues } from "types";
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

export const reasons = {
  none: "Select a reason",
  "absent:sick-day": "Absent: sick day",
  "absent:not-sick-day": "Absent: not sick day",
  "annual-leave": "Annual leave",
  "long-service": "Long service leave",
  "unpaid-leave": "Unpaid leave",
  "rostered-day-off": "Rostered day off",
} as const;

const getShiftValuesFromFormValues = (
  values: any,
  index: number
): ShiftValues => {
  return {
    isActive: values[`shift.${index}.isActive`],
    reason: values[`shift.${index}.reason`],
    ...shiftTimesNames.reduce((times, name) => {
      times[name] = {
        hour: values[`shift.${index}.${name}.hour`],
        minute: values[`shift.${index}.${name}.minute`],
      };
      return times;
    }, {} as any),
  } as ShiftValues;
};

/**
 * Prepares the values for the form's initial state.
 *
 * @param defaultShiftValues
 *   The start time, end time, and break duration for each shift, or null for
 *   each shift that is disabled by default.
 * @returns
 *   An object containing the default value for each form input.
 */
const buildInitialValues = (defaultShiftValues: ShiftValues[]) => ({
  weekStartDateTime: DateTime.fromObject({
    weekday: 1,
  }),
  comment: "",
  ...range(7).reduce((values, index) => {
    const dv = defaultShiftValues[index];
    const name = `shift.${index}`;
    values[`${name}.isActive`] = dv.isActive;
    values[`${name}.reason`] = dv.reason;
    shiftTimesNames.forEach((shiftTimesName) => {
      values[`${name}.${shiftTimesName}.hour`] = dv[
        shiftTimesName
      ].hour.toString();
      values[`${name}.${shiftTimesName}.minute`] = dv[
        shiftTimesName
      ].minute.toString();
    });
    return values;
  }, {} as any),
});

/**
 * Processes form values into an array of ShiftValues objects
 *
 * @param values
 *   An object containing the value for each form input.
 * @returns
 *   A array of ShiftValues objects.
 */
const processShiftValues = (values: any): ShiftValues[] =>
  range(7).map((index) => getShiftValuesFromFormValues(values, index));

/**
 * Prepares the value to be passed to the form's onSubmitTimesheet callback.
 *
 * @param values
 *   An object containing the value for each form input.
 * @returns
 *   A array of Shift objects.
 */
const processTimesheet = (
  values: any
): { shifts: Shift[]; absences: Absence[]; comment: string } => {
  const weekStartDateTime = values.weekStartDateTime as DateTime;
  const comment = values.comment;
  const allShiftValues = processShiftValues(values);
  const shifts: Shift[] = [];
  const absences: Absence[] = [];
  allShiftValues.forEach((shiftValues, index) => {
    const shiftDate = weekStartDateTime.plus({ days: index });
    if (shiftValues.isActive) {
      const shift: Shift = {
        start: shiftDate
          .set({
            hour: parseInt(shiftValues.startTime.hour),
            minute: parseInt(shiftValues.startTime.minute),
          })
          .toISO(),
        end: shiftDate
          .set({
            hour: parseInt(shiftValues.endTime.hour),
            minute: parseInt(shiftValues.endTime.minute),
          })
          .toISO(),
        breakDuration: new Time(
          shiftValues.breakDuration.hour,
          shiftValues.breakDuration.minute
        ).toMinutes(),
      };
      shifts.push(shift);
    } else {
      if (shiftValues.reason !== "rostered-day-off") {
        const absence: Absence = {
          date: shiftDate.toISO(),
          reason: shiftValues.reason,
        };
        absences.push(absence);
      }
    }
  });

  return { shifts, absences, comment };
};

/**
 * Validates the shift times inputs.
 *
 * @param values
 *   An object containing the value for each form input.
 * @returns
 *   An object containing the error for any form inputs that contain invalid
 *   values. Returns null if no errors are found.
 */
const validateShiftValues = (values: any) => {
  const errors = {} as FormErrors<any>;
  let hasActiveShifts = false;

  range(7).forEach((index) => {
    // Don't validate a shift's values while it is disabled.
    if (values[`shift.${index}.isActive`] === true) {
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
    } else {
      if (values[`shift.${index}.reason`] === "none") {
        errors[`shift.${index}.reason`] = `Reason required`;
      }
    }
  });

  if (isEmpty(errors)) {
    range(7).forEach((index) => {
      const shiftValues = getShiftValuesFromFormValues(values, index);
      if (shiftValues.isActive) {
        const startTime = Time.fromObject(shiftValues.startTime);
        const endTime = Time.fromObject(shiftValues.endTime);
        const breakDuration = Time.fromObject(shiftValues.breakDuration);

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
  const errors = validateShiftValues(values);

  if (values.comment.length > 255) {
    errors[`comment`] = `Must be no longer than 255 characters`;
  }

  return errors;
};

interface TimesheetFormProps {
  defaultShiftValues: ShiftValues[];
  onSubmitTimesheet: (values: {
    shifts: Shift[];
    absences: Absence[];
    comment: string;
  }) => void;
  onSubmitDefaultShiftValues: (shifts: ShiftValues[]) => void;
  pending?: boolean;
  className?: string;
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({
  defaultShiftValues,
  onSubmitTimesheet,
  onSubmitDefaultShiftValues,
  pending,
  className,
}) => {
  const initialValues = useCallback(
    () => buildInitialValues(defaultShiftValues),
    [defaultShiftValues]
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

  const defaultShiftValuesErrors = useMemo(() => validateShiftValues(values), [
    values,
  ]);

  const handleSubmitDefaultShifts = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();
    const errors = validateShiftValues(values);
    if (isEmpty(errors)) {
      onSubmitDefaultShiftValues(processShiftValues(values));
    }
  };

  const handleShiftToggle = (
    name: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isActive = event.target.checked;
    const newValues = {} as { [key: string]: "" | boolean };
    const newTouchedValues = {} as { [key: string]: false };
    newValues[`${name}.isActive`] = isActive;
    if (!isActive) {
      // Clear the time values for the shift and flag the time inputs
      // as untouched.
      shiftTimesInputNames.forEach((inputName) => {
        newValues[`${name}.${inputName}`] = "";
        newTouchedValues[`${name}.${inputName}`] = false;
      });
    }
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
    const visibleError = visibleHourError || visibleMinuteError;

    return (
      <div className="mr-md-3 mb-2 mb-md-0 flex-grow-1">
        <div>
          <div className="input-group" aria-label={label}>
            <div className="input-group-prepend flex-grow-1">
              <div className="input-group-text w-100">
                <small className="text-uppercase">{label}</small>
              </div>
            </div>
            <TimeInput
              className={classnames(
                "form-control w-auto flex-grow-0",
                (visibleError || timeError) && "is-invalid"
              )}
              name={name}
              value={{
                hour: hourValue,
                minute: minuteValue,
              }}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={pending}
            />
          </div>
          {(timeError || visibleError) && (
            <div className="sr-only">
              <Form.Control.Feedback type="invalid">
                {timeError && <div>{timeError}</div>}
                {visibleHourError && <div>{hourError}</div>}
                {visibleMinuteError && <div>{minuteError}</div>}
              </Form.Control.Feedback>
            </div>
          )}
        </div>
      </div>
    );
  };

  const allShiftValues = range(7).map((index) =>
    getShiftValuesFromFormValues(values, index)
  );

  const allShiftHours = allShiftValues.map((shiftValues) => {
    try {
      return getShiftHoursFromTimes(shiftValues);
    } catch (error) {
      if (!(error instanceof InvalidTimeException)) {
        throw error;
      }
    }
    return null;
  });

  const timesheetTotalHours = allShiftHours.reduce(
    (totalHours: number, shiftHours) => {
      return shiftHours ? totalHours + shiftHours : totalHours;
    },
    0
  );

  const shiftInputs = range(7).map((index) => {
    const name = `shift.${index}`;
    const shiftDate = values.weekStartDateTime.plus({ days: index });
    const shiftValues = allShiftValues[index];
    const shiftHours = allShiftHours[index];
    const label = shiftDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
    const isActive = shiftValues.isActive;
    const reason = shiftValues.reason;

    return (
      <div key={index} className="shift-input border p-1 my-1 bg-light">
        <div className="d-lg-flex" aria-label="Shift">
          <label className="d-flex align-items-center m-0 flex-grow-1 pl-2 py-1 py-lg-2 mr-lg-3">
            <input
              data-testid={`shift-${index}-toggle`}
              name={`${name}.isActive`}
              type="checkbox"
              checked={isActive}
              onChange={(event) => handleShiftToggle(name, event)}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                }
              }}
            />
            <span className="ml-3">{label}</span>
          </label>
          {isActive ? (
            <div className="d-md-flex align-items-center mt-1 mt-lg-0">
              {timeInput(`${name}.startTime`, "Start")}
              {timeInput(`${name}.endTime`, "End")}
              {timeInput(`${name}.breakDuration`, "Break")}
              <div className="shift-hours">
                <div className="form-control w-100 text-right">
                  {shiftHours ? `${shiftHours} hours` : `\u00A0`}
                </div>
              </div>
            </div>
          ) : (
            <div className="d-md-flex align-items-center mt-1 mt-lg-0">
              <Form.Control
                isInvalid={visibleErrors[`${name}.reason`]}
                aria-label="reason"
                data-testid={`shift-${index}-reason`}
                as="select"
                name={`${name}.reason`}
                value={reason}
                onChange={handleChange}
              >
                {Object.keys(reasons).map((name) => (
                  <option key={name} value={name}>
                    {reasons[name as keyof typeof reasons]}
                  </option>
                ))}
              </Form.Control>
              {visibleErrors[`${name}.reason`] && (
                <div className="sr-only">
                  <Form.Control.Feedback type="invalid">
                    {errors[`${name}.reason`]}
                  </Form.Control.Feedback>
                </div>
              )}
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
          disabled={pending}
        />
      </div>
      <div>
        {shiftInputs}
        <div className="border p-1 my-1 bg-light">
          <div
            aria-label="Total"
            className="d-flex w-100 align-items-center mt-1 mt-lg-0"
          >
            <div className="mx-2 text-right flex-grow-1">Total</div>
            <div className="timesheet-total-hours">
              <div className="form-control w-100 text-right">
                {timesheetTotalHours
                  ? `${timesheetTotalHours} hours`
                  : `\u00A0`}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Form.Group controlId="comment" className="my-3">
        <Form.Label>Comments/Notes</Form.Label>
        <Form.Control
          name="comment"
          onChange={handleChange}
          disabled={pending}
        />
      </Form.Group>
      <div className="my-3 text-right">
        {isEmpty(defaultShiftValuesErrors) && (
          <>
            <Button
              variant="light"
              type="button"
              onClick={handleSubmitDefaultShifts}
            >
              Save these shifts as my default
            </Button>
            &nbsp;
          </>
        )}
        <Button variant="primary" type="submit" disabled={pending}>
          {pending ? `Submitting` : `Submit`}
        </Button>
      </div>
    </form>
  );
};

export default TimesheetForm;
