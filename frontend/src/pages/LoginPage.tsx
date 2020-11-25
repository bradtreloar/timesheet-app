import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../context/auth";
import DefaultLayout from "../layouts/DefaultLayout";

const LoginPage = () => {
  const { login, isAuthenticated, error } = useAuth();
  const history = useHistory();
  const location = useLocation<{
    referer?: Location;
  }>();
  const [loginPending, setLoginPending] = React.useState<boolean>(false);

  const handleSubmitLogin = async (email: string, password: string) => {
    setLoginPending(true);
    await login(email, password);
    setLoginPending(false);
  };

  React.useEffect(() => {
    // Wait until login is no longer pending before redirecting.
    if (!loginPending && isAuthenticated) {
      if (location.state?.referer) {
        history.push(location.state.referer.pathname);
      } else {
        history.push("/");
      }
    }
  }, [isAuthenticated, loginPending, history, location.state]);

  return (
    <DefaultLayout>
      <PageTitle>Log in</PageTitle>
      {error && <div className="invalid-feedback">{error}</div>}
      <div className="container">
        <LoginForm
          onSubmit={handleSubmitLogin}
          pending={loginPending}
        ></LoginForm>
      </div>
    </DefaultLayout>
  );
};

export default LoginPage;
