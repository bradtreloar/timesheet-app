import React from "react";
import { Settings } from "types";
import { Button, Form } from "react-bootstrap";
import useForm from "hooks/useForm";

interface SettingsFormProps {
  defaultValues: Settings;
  onSubmit: (values: Settings) => void;
  pending?: boolean;
  className?: string;
}

const validate = (values: Settings) => {
  const { timesheetRecipients } = values;
  const errors = {} as any;

  if (
    timesheetRecipients.match(
      /^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4}(,[ ]*)?)+$/
    ) === null
  ) {
    errors.timesheetRecipients = `Must be a valid list of emails, separated by a comma`;
  }

  return errors;
};

const SettingsForm: React.FC<SettingsFormProps> = ({
  defaultValues,
  onSubmit,
  pending,
  className,
}) => {
  const {
    values,
    errors,
    visibleErrors,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useForm<Settings>(defaultValues, onSubmit, validate);

  return (
    <Form onSubmit={handleSubmit} className={className}>
      <Form.Group controlId="timesheetRecipients">
        <Form.Label>Timesheet Recipients</Form.Label>
        <Form.Control
          type="text"
          name="timesheetRecipients"
          value={values.timesheetRecipients}
          isInvalid={visibleErrors.timesheetRecipients}
          placeholder="e.g. timesheet@example.com, admin@example.com"
          onBlur={handleBlur}
          onChange={handleChange}
          disabled={pending}
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
      <Button variant="primary" type="submit" disabled={pending}>
        {pending ? `Saving settings` : `Save settings`}
      </Button>
    </Form>
  );
};

export default SettingsForm;
