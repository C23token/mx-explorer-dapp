import React from 'react';
import { withPageTitle, withTestnetReady } from 'sharedComponents';
import Home from './Home';
import Login from './Login';
import UnlockPem from './UnlockPem';

interface RouteType {
  path: string;
  title: string;
  component: any;
}

const routes: RouteType[] = [
  {
    path: '/',
    title: '',
    component: Home,
  },
  {
    path: '/login',
    title: 'Login',
    component: Login,
  },
  {
    path: '/unlock-pem',
    title: 'Unlock Pem',
    component: UnlockPem,
  },
];

const wrappedRoutes = () =>
  routes.map(route => {
    const title = route.title ? `${route.title} • Elrond Wallet` : 'Elrond Wallet';
    return {
      path: route.path,
      component: (withPageTitle(
        title,
        withTestnetReady(route.component)
      ) as any) as React.ComponentClass<{}, any>,
    };
  });

export default wrappedRoutes();
