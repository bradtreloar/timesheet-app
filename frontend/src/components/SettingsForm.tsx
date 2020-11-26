import React from "react";
import { Settings } from "../types";
import { Button, Form } from "react-bootstrap";
import { range } from "lodash";
import { getWeekdayName } from "../helpers/date";
import { useForm } from "../form/form";

interface SettingsFormProps {
  defaultValues: Settings;
  onSubmit: (values: Settings) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({
  defaultValues,
  onSubmit,
}) => {
  const {
    values,
    errors,
    visibleErrors,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useForm<Settings>(defaultValues, onSubmit, (values) => {
    return {};
  });

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="timesheetRecipients">
        <Form.Label>Timesheet Recipients</Form.Label>
        <Form.Control
          type="text"
          pattern="^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4}(,[ ]*)?)+$"
          name="timesheetRecipients"
          value={values.timesheetRecipients}
          isInvalid={visibleErrors.timesheetRecipients}
          placeholder="e.g. timesheet@example.com, admin@example.com"
          onBlur={handleBlur}
          onChange={handleChange}
          required
        />
        <Form.Text className="text-muted">
          Enter a comma-separated list of email addresses to receive timesheets.
        </Form.Text>
        {visibleErrors.timesheetRecipients && (
          <Form.Control.Feedback type="invalid">
            {errors.timesheetRecipients}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group controlId="startOfWeek">
        <Form.Label>Start of Week</Form.Label>
        <Form.Control
          as="select"
          custom
          name="startOfWeek"
          value={values.startOfWeek}
          data-value={values.startOfWeek}
          isInvalid={visibleErrors.startOfWeek}
          onBlur={handleBlur}
          onChange={handleChange}
        >
          {range(7).map((index) => {
            return (
              <option key={index} value={index.toString()}>
                {getWeekdayName(index)}
              </option>
            );
          })}
        </Form.Control>
        <Form.Text className="text-muted">
          Select which day should appear first on the timesheet form.
        </Form.Text>
      </Form.Group>
      <Button type="submit">Save settings</Button>
    </Form>
  );
};

export default SettingsForm;
