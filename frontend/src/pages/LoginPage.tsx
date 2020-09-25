import React from "react";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../context/auth";

const LoginPage = () => {
  const { login } = useAuth();
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [loginPending, setLoginPending] = React.useState<boolean>(false);

  const handleSubmitLogin = async (email: string, password: string) => {
    try {
      setLoginPending(true);
      await login(email, password);
    } catch (error) {
      setLoginError(error);
      setLoginPending(false);
    }
  };

  return (
    <div>
      <p>You must sign in to continue.</p>
      <LoginForm
        onSubmit={handleSubmitLogin}
        error={loginError}
        pending={loginPending}
      ></LoginForm>
    </div>
  );
};

export default LoginPage;
