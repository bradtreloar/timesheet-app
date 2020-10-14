import { TimesheetResource } from "../services/resourceTypes";
import { Timesheet } from "../types";

export const parseTimesheet = (resource: TimesheetResource) => {
  const {
    id,
    relationships: { user },
    attributes: { created, changed },
  } = resource;
  const timesheet: Timesheet = {
    id,
    userID: user.data.id,
  };
  if (changed && created) {
    timesheet.changed = changed;
    timesheet.created = created;
  }
  return timesheet
};

export const makeTimesheetResource = (
  timesheet: Timesheet
): TimesheetResource => {
  const { id, userID, changed, created, shifts } = timesheet;
  const resource: TimesheetResource = {
    type: "timesheets",
    attributes: {},
    relationships: {
      user: {
        data: {
          id: userID,
          type: "users",
        },
      },
    },
  };
  if (id) {
    resource.id = id;
  }
  if (changed && created) {
    resource.attributes = {
      changed,
      created,
    };
  }
  return resource;
};
