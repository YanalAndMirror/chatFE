import Login from "./components/Auth/Login";
import Chat from "./components/Chat/Chat";
import UserSettings from "./components/Chat/UserSettings";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.user.user);
  if (!user) {
    return <Login />;
  }
  return (
    <Switch>
      <Route exact path="/" component={Chat} />
      <Route path="/settings" component={UserSettings} />
      <Route render={() => <h1>page not found</h1>} />
    </Switch>
  );
}

export default App;
