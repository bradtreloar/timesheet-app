import React from "react";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/auth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import store from "./store";
import { fetchTimesheets } from "./store/timesheets";

const initialiseStore = async () => {
  store.dispatch(fetchTimesheets());
};

const App: React.FC = () => {
  const [initialised, setInitialised] = React.useState(false);
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated && !initialised) {
      (async () => {
        await initialiseStore();
        setInitialised(true);
      })();
    }
  }, [isAuthenticated, initialised, setInitialised]);

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
