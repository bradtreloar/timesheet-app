import React, { useEffect, useMemo, useState } from "react";
import { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import classnames from "classnames";
import {
  startOfWeek,
  addDays,
  addWeek,
  subtractWeek,
  SimpleTime,
} from "../helpers/date";
import { Shift, ShiftTimes } from "../types";
import ShiftInput, { EMPTY_SHIFT_TIMES, ShiftInputErrors } from "./ShiftInput";
import WeekSelect from "./WeekSelect";
import { getShiftFromTimes } from "../helpers/shift";
import { forOwn, isEqual } from "lodash";

type ShiftTimesPayload = {
  shiftTimes: ShiftTimes;
  index: number;
};

type ErrorPayload = {
  name: string;
  message: string | object;
};

interface TimesheetFormProps {
  allDefaultShiftTimes: (ShiftTimes | null)[];
  onSubmit: (shifts: Shift[]) => void;
}

interface TimesheetFormState {
  values: {
    allShiftTimes: (ShiftTimes | null)[];
  };
  errors: {
    name: string;
    message: string | object;
  }[];
}

const clearShiftTimes = (index: number): PayloadAction<number> => ({
  type: "values/shiftTimes/clear",
  payload: index,
});

const setShiftTimes = (
  shiftTimes: ShiftTimes,
  index: number
): PayloadAction<ShiftTimesPayload> => ({
  type: "values/shiftTimes/set",
  payload: { index, shiftTimes },
});

const setError = (
  name: string,
  message: string | object
): PayloadAction<ErrorPayload> => ({
  type: "errors/set",
  payload: { name, message },
});

const clearError = (name: string) => ({
  type: "errors/clear",
  payload: name,
});

const clearAllErrors = () => ({
  type: "errors/clearAll",
});

export const reducer = (state: TimesheetFormState, action: AnyAction) => {
  if (action.type === "values/shiftTimes/clear") {
    const clearIndex = action.payload as number;
    const allShiftTimes = state.values.allShiftTimes.map((shiftTimes, index) =>
      index === clearIndex ? null : shiftTimes
    );
    return Object.assign({}, state, { values: { allShiftTimes } });
  }

  if (action.type === "values/shiftTimes/set") {
    const {
      index: shiftIndex,
      shiftTimes: newShiftTimes,
    } = action.payload as ShiftTimesPayload;
    const allShiftTimes = state.values.allShiftTimes.map((shiftTimes, index) =>
      index === shiftIndex ? newShiftTimes : shiftTimes
    );
    return Object.assign({}, state, { values: { allShiftTimes } });
  }

  if (action.type === "errors/set") {
    const { name, message } = action.payload as ErrorPayload;
    const errors = state.errors;
    const newError = { name, message };
    let updatedErrors = null;
    if (errors.find((error) => error.name === name)) {
      updatedErrors = errors.map((error) =>
        error.name === name ? newError : error
      );
    } else {
      updatedErrors = [...errors, newError];
    }
    return Object.assign({}, state, {
      errors: updatedErrors,
    });
  }

  if (action.type === "errors/clear") {
    const name = action.payload as string;
    return Object.assign({}, state, {
      errors: state.errors.filter((error) => error.name !== name),
    });
  }

  if (action.type === "errors/clearAll") {
    return Object.assign({}, state, {
      errors: [],
    });
  }

  return state;
};

const initialWeekStartDate = startOfWeek(new Date());

const TimesheetForm: React.FC<TimesheetFormProps> = ({
  allDefaultShiftTimes,
  onSubmit,
}) => {
  const [weekStartDate, setWeekStartDate] = React.useState(
    initialWeekStartDate
  );
  const [state, dispatch] = React.useReducer(reducer, {
    values: { allShiftTimes: allDefaultShiftTimes },
    errors: [],
  });
  const { values, errors } = state;
  const [validated, setValidated] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const hasShifts = useMemo(
    () =>
      values.allShiftTimes.reduce(
        (hasShifts, shiftTimes) => hasShifts || shiftTimes !== null,
        false
      ),
    [values.allShiftTimes]
  );

  useEffect(() => {
    dispatch(clearAllErrors());

    if (!hasShifts) {
      dispatch(setError(`form`, `You must enter at least one shift.`));
      return;
    }

    values.allShiftTimes.forEach((shiftTimes, index) => {
      if (shiftTimes === null) {
        return;
      }

      const validateTime = (time: SimpleTime) => {
        if (time.isNull()) {
          return {
            hours: true,
            minutes: true,
            message: `Enter time`,
          };
        }

        if (time.hours === null) {
          return {
            hours: true,
            minutes: false,
            message: `Enter hours`,
          };
        }

        if (time.minutes === null) {
          return {
            hours: false,
            minutes: true,
            message: `Enter minutes`,
          };
        }
      };

      const errors = {} as ShiftInputErrors;
      forOwn(shiftTimes, (time, key) => {
        const error = validateTime(time);
        if (error) {
          errors[key as keyof ShiftTimes] = error;
        }
      });

      const key = `shiftInputs.${index}`;
      if (isEqual(errors, {})) {
        dispatch(clearError(key));
      } else {
        dispatch(setError(key, errors));
      }
    });

    setValidated(true);
  }, [hasShifts, values.allShiftTimes]);

  const handleSubmit = () => {
    if (!validated || errors.length > 0) {
      setShowErrors(true);
      return;
    }

    const shifts: Shift[] = [];
    values.allShiftTimes.forEach((shiftTimes, index) => {
      if (shiftTimes !== null) {
        const date = addDays(weekStartDate, index);
        const shift = getShiftFromTimes(date, shiftTimes);
        shifts.push(shift);
      }
    });

    onSubmit(shifts);
  };

  const shiftInputs = values.allShiftTimes.map((shiftTimes, index) => {
    const shiftDate = addDays(weekStartDate, index);
    const key = `shiftInputs.${index}`;
    const shiftErrors = showErrors && errors.find(({ name }) => name === key);
    if (shiftErrors && typeof shiftErrors !== "object") {
      throw new Error(
        `shiftErrors must be a valid ShiftInputErrors object. ${typeof shiftErrors} given.`
      );
    }

    return (
      <ShiftInput
        key={index}
        date={shiftDate}
        shiftTimes={shiftTimes}
        errors={shiftErrors && (shiftErrors.message as object)}
        onChange={(shiftTimes) => {
          dispatch(setShiftTimes(shiftTimes, index));
        }}
        onToggle={() => {
          if (shiftTimes === null) {
            dispatch(setShiftTimes(EMPTY_SHIFT_TIMES, index));
          } else {
            dispatch(clearShiftTimes(index));
          }
        }}
      />
    );
  });

  const formErrors = showErrors
    ? errors
        .filter(({ name }) => name === "form")
        .map((error, index) => <p key={index}>{error.message}</p>)
    : [];

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (hasShifts) {
          handleSubmit();
        }
      }}
    >
      <WeekSelect
        weekStartDate={weekStartDate}
        onChangeWeek={(forward: boolean) => {
          const newWeekStartDate = forward
            ? addWeek(weekStartDate)
            : subtractWeek(weekStartDate);
          setWeekStartDate(newWeekStartDate);
        }}
      />
      {formErrors.length > 0 && (
        <div className="alert alert-danger">{formErrors}</div>
      )}
      <div>{shiftInputs}</div>
      <div>
        <button
          className={classnames("btn btn-primary", !hasShifts && "disabled")}
          type="submit"
          disabled={!hasShifts}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default TimesheetForm;
