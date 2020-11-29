import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
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
    const success = await login(email, password);
    if (!success) {
      setLoginPending(false);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      if (location.state?.referer) {
        history.push(location.state.referer.pathname);
      } else {
        history.push("/");
      }
    }
  }, [isAuthenticated, history, location.state]);

  return (
    <DefaultLayout>
      <PageTitle>Log in</PageTitle>
      <div className="container">
        {error && <div className="alert alert-danger">{error}</div>}
        <LoginForm
          onSubmit={handleSubmitLogin}
          pending={loginPending}
        ></LoginForm>
        <div>
          <Link to="reset-password">
            Forgot your password? Click here to reset it.
          </Link>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LoginPage;
