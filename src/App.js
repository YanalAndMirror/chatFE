import Login from './components/Auth/Login';
import Chat from './components/Chat/Chat';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route exact path="/" component={Chat} />
        <Route render={() => <h1>page not found</h1>} />
      </Switch>
    </Router>
  );
}

export default App;
