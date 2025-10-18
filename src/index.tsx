/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import './index.css';
import { routes } from './routes';

const root = document.getElementById('root');

if (root) {
  render(
    () => (
      <Router>
        {routes.map(route => (
          <Route path={route.path} component={route.component} />
        ))}
      </Router>
    ),
    root
  );
}
