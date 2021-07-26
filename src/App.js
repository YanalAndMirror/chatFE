import Login from './components/Auth/Login';
import Chat from './components/Chat/Chat';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { useSelector } from 'react-redux';

function App() {
  const user = useSelector((state) => state.user.user);
  if (!user) {
    return <Login />;
  }
  return (
    <Switch>
      <Route exact path="/" component={Chat} />
      <Route render={() => <h1>page not found</h1>} />
    </Switch>
  );
}

export default App;
