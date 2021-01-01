import React from "react";
import { Route, Switch } from "react-router-dom";
import GuestRoute from "components/routes/GuestRoute";
import ProtectedRoute from "components/routes/ProtectedRoute";
import { useAuth } from "context/auth";
import LoginPage from "components/pages/LoginPage";
import NotFoundPage from "components/pages/NotFoundPage";
import store from "store";
import { fetchTimesheets } from "store/timesheets";
import { User } from "types";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PasswordPage from "./pages/PasswordPage";
import TimesheetConfirmPage from "./pages/TimesheetConfirmPage";
import TimesheetFormPage from "./pages/TimesheetFormPage";
import AdminRoute from "./routes/AdminRoute";
import SettingsPage from "./pages/SettingsPage";
import UserIndexPage from "./pages/UserIndexPage";
import UserFormPage from "./pages/UserFormPage";
import UserDeletePage from "./pages/UserDeletePage";
import TimesheetIndexPage from "./pages/TimesheetIndexPage";

const initialiseStore = async (user: User) => {
  store.dispatch(fetchTimesheets(user));
};

const App: React.FC = () => {
  const [initialised, setInitialised] = React.useState(false);
  const { user } = useAuth();

  React.useEffect(() => {
    if (user && !initialised) {
      (async () => {
        await initialiseStore(user);
        setInitialised(true);
      })();
    }
  }, [user, initialised, setInitialised]);

  return (
    <Switch>
      <ProtectedRoute exact path="/">
        <TimesheetIndexPage />
      </ProtectedRoute>
      <ProtectedRoute exact path="/timesheet/new">
        <TimesheetFormPage />
      </ProtectedRoute>
      <ProtectedRoute exact path="/timesheet/confirmation">
        <TimesheetConfirmPage />
      </ProtectedRoute>
      <ProtectedRoute exact path="/account/password">
        <PasswordPage />
      </ProtectedRoute>
      <AdminRoute exact path="/settings">
        <SettingsPage />
      </AdminRoute>
      <AdminRoute exact path="/users">
        <UserIndexPage />
      </AdminRoute>
      <AdminRoute exact path="/users/add">
        <UserFormPage />
      </AdminRoute>
      <AdminRoute exact path="/users/:id">
        <UserFormPage />
      </AdminRoute>
      <AdminRoute exact path="/users/:id/delete">
        <UserDeletePage />
      </AdminRoute>
      <GuestRoute exact path="/login">
        <LoginPage />
      </GuestRoute>
      <GuestRoute exact path="/forgot-password">
        <ForgotPasswordPage />
      </GuestRoute>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  );
};

export default App;
