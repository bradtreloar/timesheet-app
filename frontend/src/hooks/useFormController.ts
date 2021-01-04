import { useState } from "react";

interface FormControllerOptions {
  unmountsOnSubmit?: boolean;
}

const useFormController = <T>(
  onSubmit: (values: T) => Promise<void>,
  options?: FormControllerOptions
) => {
  const [formPending, setFormPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (values: T) => {
    setFormPending(true);

    try {
      await onSubmit(values);
    } catch (error) {
      setFormError(error.message);
      setFormPending(false);
    }

    if (options?.unmountsOnSubmit === false) {
      setFormPending(false);
    }
  };

  return {
    formError,
    formPending,
    handleSubmit,
  };
};

export default useFormController;
