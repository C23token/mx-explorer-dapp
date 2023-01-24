import React from 'react';

import { Search, NotificationsBar } from 'components';
import { multiversxApps } from 'config';
import {
  useFetchStats,
  useFetchEconomics,
  useNetworkRouter,
  useLoopManager,
  useActiveRoute,
  useIsMainnet,
  useCheckVersion
} from 'helpers';
import { wrappedRoutes, validatorsRoutes, searchRoutes } from 'routes';
import { Footer } from './Footer/index';
import { GlobalStatsCard } from './GlobalStatsCard';
import { Navbar } from './Navbar/index';
import { PageLayout } from './PageLayout';
import { TestnetGlobalStatsCard } from './TestnetGlobalStatsCard';
import { Unavailable } from './Unavailable';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const activeRoute = useActiveRoute();
  const isMainnet = useIsMainnet();

  const showGlobalStats = () => {
    let show = true;
    const routeExists = wrappedRoutes.some(({ path }) => activeRoute(path));

    switch (true) {
      case !routeExists:
      case activeRoute('/'):
      case activeRoute(searchRoutes.index):
      case activeRoute(searchRoutes.query):
      case activeRoute(validatorsRoutes.identities):
      case activeRoute(validatorsRoutes.identityDetails):
      case activeRoute(validatorsRoutes.providers):
      case activeRoute(validatorsRoutes.providerDetails):
      case activeRoute(validatorsRoutes.providerTransactions):
      case activeRoute(validatorsRoutes.nodes):
      case activeRoute(validatorsRoutes.nodeDetails):
      case activeRoute(validatorsRoutes.statistics):
      case activeRoute(validatorsRoutes.queue):
        show = false;
        break;
    }

    return show;
  };

  useNetworkRouter();
  useLoopManager();
  useFetchEconomics();
  useFetchStats();
  useCheckVersion();

  const offline = !window.navigator.onLine;

  const isHome = activeRoute('/');

  const explorerApp = multiversxApps.find((app) => app.id === 'explorer');
  const explorerTitle = explorerApp ? explorerApp.name : 'Explorer';

  return (
    <div className='d-flex'>
      <div className='flex-fill vh-100'>
        <main className='main-content d-flex flex-column flex-grow-1'>
          <Navbar />
          <NotificationsBar />
          <div className='main-content-container container-fluid p-0 d-flex flex-column'>
            {offline ? (
              <Unavailable />
            ) : (
              <>
                <div className='main-search-container py-spacer'>
                  <div className={`container ${isHome ? 'py-3' : ''}`}>
                    {isHome && (
                      <div className='row'>
                        <div className='col-12 text-center'>
                          <h1 className='mb-4'>
                            The MultiversX (Elrond) Blockchain {explorerTitle}
                          </h1>
                        </div>
                      </div>
                    )}

                    <div className='row'>
                      <div className='col-12 col-lg-9 mx-auto'>
                        <Search />
                      </div>
                    </div>
                  </div>
                </div>

                {showGlobalStats() && (
                  <div className='container mb-spacer'>
                    <>
                      {isMainnet ? (
                        <GlobalStatsCard />
                      ) : (
                        <TestnetGlobalStatsCard />
                      )}
                    </>
                  </div>
                )}

                <div className='page-container' data-testid='mainPageContent'>
                  <PageLayout>{children}</PageLayout>
                </div>
              </>
            )}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
