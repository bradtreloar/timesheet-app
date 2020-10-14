interface RelatedResourceData<T> {
  id: string;
  type: T;
}

interface RelatedResource<T> {
  data: RelatedResourceData<T>;
}

interface RelatedResourceArray<T> {
  data: RelatedResourceData<T>[];
}

export interface UserResource {
  id: string;
  type: "users";
  attributes: {
    name: string;
    email: string;
    created: string;
    changed: string;
  };
  relationships: {
    timesheets?: RelatedResourceArray<"users">;
  };
}

export interface TimesheetResource {
  id?: string;
  type: "timesheets";
  attributes: {
    created?: string;
    changed?: string;
  };
  relationships: {
    user: RelatedResource<"users">;
    shifts?: RelatedResourceArray<"shifts">;
  };
}

export interface ShiftResource {
  id?: string;
  type: "shifts";
  attributes: {
    start: string;
    end: string;
    break_duration: string;
    created?: string;
    changed?: string;
  };
  relationships: {
    timesheet: RelatedResource<"timesheets">;
  };
}
