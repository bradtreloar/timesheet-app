import { useState } from "react";

export function useFormController<T>(
  onSubmit: (values: T) => Promise<boolean>
) {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (values: T) => {
    setFormSubmitted(true);
    const success = await onSubmit(values);
    if (!success) {
      setFormSubmitted(false);
    }
  };

  return {
    formSubmitted,
    handleSubmit,
  };
}
