import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

import { useNodeContext } from './Context/Node/NodeContext';

function App() {
  const ctx = useNodeContext();
  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        {!ctx.isLoggedIn && (<Route path='/auth'><AuthPage /></Route>)}
        {ctx.isLoggedIn && (<Route path='/profile'><UserProfile /></Route>)}
        <Route path='*'>
          <Redirect to='/' />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;