import { useState } from "react";

const useFormController = <T>(onSubmit: (values: T) => Promise<void>) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (values: T) => {
    setFormSubmitted(true);
    try {
      await onSubmit(values);
    } catch (error) {
      setFormError(error.message);
    }
  };

  return {
    formError,
    formSubmitted,
    handleSubmit,
  };
};

export default useFormController;
