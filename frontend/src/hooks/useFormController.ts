import { useState } from "react";

const useFormController = <T>(onSubmit: (values: T) => Promise<void>) => {
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
  };

  return {
    formError,
    formPending,
    handleSubmit,
  };
};

export default useFormController;
