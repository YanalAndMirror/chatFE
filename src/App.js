// React imports
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';

// components imports
import Login from './components/Auth/Login';
import Chat from './components/Chat/Chat';

// styles import
import './App.css';

function App() {
  // fetching store
  const user = useSelector((state) => state.user.user);

  // checking if user is logged in
  if (!user) {
    return <Login />;
  }
  return (
    // routes
    <Switch>
      <Route exact path="/" component={Chat} />
      <Route render={() => <h1>page not found</h1>} />
    </Switch>
  );
}

export default App;
