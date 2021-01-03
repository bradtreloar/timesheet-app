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
import TimesheetViewPage from "./pages/TimesheetViewPage";
import { fetchSettings, fetchUnrestrictedSettings } from "store/settings";
import LoadingPage from "./pages/LoadingPage";
import AccountPage from "./pages/AccountPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import { fetchUsers } from "store/users";

const initialiseStore = async (user: User) => {
  store.dispatch(fetchTimesheets(user));
  if (user.isAdmin) {
    store.dispatch(fetchSettings());
    store.dispatch(fetchUsers());
  } else {
    store.dispatch(fetchUnrestrictedSettings());
  }
};

const App: React.FC = () => {
  const [initialised, setInitialised] = React.useState(false);
  const { user, userInitialised } = useAuth();

  React.useEffect(() => {
    if (user && !initialised) {
      (async () => {
        await initialiseStore(user);
        setInitialised(true);
      })();
    } else if (!user && initialised) {
      setInitialised(false);
    }
  }, [user, initialised, setInitialised]);

  return userInitialised ? (
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
      <ProtectedRoute exact path="/timesheet/:id">
        <TimesheetViewPage />
      </ProtectedRoute>
      <ProtectedRoute exact path="/account">
        <AccountPage />
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
      <AdminRoute exact path="/users/new">
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
      <GuestRoute exact path="/reset-password/:email/:token">
        <PasswordResetPage />
      </GuestRoute>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  ) : (
    <LoadingPage />
  );
};

export default App;
