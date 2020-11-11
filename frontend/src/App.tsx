import React from "react";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/auth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import store from "./store";
import { fetchTimesheets } from "./store/timesheets";
import { User } from "./types";

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
        <HomePage />
      </ProtectedRoute>
      <Route exact path="/login">
        <LoginPage />
      </Route>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  );
};

export default App;
