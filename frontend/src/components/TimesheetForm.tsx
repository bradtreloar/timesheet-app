import React from "react";
import { PayloadAction } from "@reduxjs/toolkit";
import { startOfWeek, addDays, addWeek, subtractWeek } from "../helpers/date";
import { Shift, ShiftTimes } from "../types";
import ShiftInput from "./ShiftInput";
import WeekSelect from "./WeekSelect";
import { getShiftDuration, getShiftFromTimes } from "../helpers/shift";

type ShiftTimesPayload = {
  shiftTimes: ShiftTimes;
  index: number;
};

export const EMPTY_SHIFT_TIMES = {
  startTime: null,
  endTime: null,
  breakDuration: null,
} as ShiftTimes;

const initialWeekStartDate = startOfWeek(new Date());

const clearShiftTimes = (index: number): PayloadAction<number> => {
  return {
    type: "clear",
    payload: index,
  };
};

const setShiftTimes = (
  shiftTimes: ShiftTimes,
  index: number
): PayloadAction<ShiftTimesPayload> => {
  return {
    type: "set",
    payload: { index, shiftTimes },
  };
};

const shiftsReducer = (
  state: (ShiftTimes | null)[],
  action: PayloadAction<ShiftTimesPayload | number>
) => {
  if (action.type === "clear") {
    const clearIndex = action.payload as number;
    return state.map((shiftTimes, index) =>
      index === clearIndex ? null : shiftTimes
    );
  }

  if (action.type === "set") {
    const {
      index: setIndex,
      shiftTimes: newShiftTimes,
    } = action.payload as ShiftTimesPayload;
    return state.map((shiftTimes, index) =>
      index === setIndex ? newShiftTimes : shiftTimes
    );
  }

  return state;
};

interface TimesheetFormProps {
  allDefaultShiftTimes: (ShiftTimes | null)[];
  onSubmit: (shifts: Shift[]) => void;
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({
  allDefaultShiftTimes,
  onSubmit,
}) => {
  const [weekStartDate, setWeekStartDate] = React.useState(
    initialWeekStartDate
  );
  const [allShiftTimes, dispatch] = React.useReducer(
    shiftsReducer,
    allDefaultShiftTimes
  );

  const validateShifts = () => {
    allShiftTimes.forEach((shiftTimes, index) => {
      if (shiftTimes !== null) {
        const shiftDuration = getShiftDuration(shiftTimes);
        if (shiftDuration !== null) {
          return false;
        }
      }
    });

    return true;
  };

  const handleSubmit = () => {
    const hasValidShifts = validateShifts();
    if (!hasValidShifts) {
      return;
    }
    
    const shifts: Shift[] = [];
    allShiftTimes.forEach((shiftTimes, index) => {
      // Skip disabled shift.
      if (shiftTimes === null) {
        return;
      }
      const date = addDays(weekStartDate, index);
      const shift = getShiftFromTimes(date, shiftTimes);
      if (shift !== null) {
        shifts.push(shift);
      }
    });
    
    onSubmit(shifts);
  };

  const shiftInputs = allShiftTimes.map((shiftTimes, index) => {
    const shiftDate = addDays(weekStartDate, index);

    return (
      <ShiftInput
        key={index}
        date={shiftDate}
        shiftTimes={shiftTimes}
        onChange={(shiftTimes) => {
          dispatch(setShiftTimes(shiftTimes, index));
        }}
        onToggle={() => {
          if (shiftTimes === null) {
            const defaultShiftTimes = allDefaultShiftTimes[index];
            dispatch(
              setShiftTimes(defaultShiftTimes || EMPTY_SHIFT_TIMES, index)
            );
          } else {
            dispatch(clearShiftTimes(index));
          }
        }}
      />
    );
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
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
      <div>{shiftInputs}</div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default TimesheetForm;
