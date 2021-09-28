// import { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import genres from '../constant/genres';
import HomePage from '../pages/HomePage';
import ResultSearchPage from '../pages/ResultSearchPage';
import WatchPage from '../pages/WatchPage';
import SectionPage from '../pages/SectionPage';
import NotFound from '../pages/NotFound';
import UserPage from '../pages/UserPage';

// const WatchPage = lazy(() => import('../pages/WatchPage'));
// const ResultSearchPage = lazy(() => import('../pages/ResultSearchPage'));
// const SectionPage = lazy(() => import('../pages/SectionPage'));


const routers = [
    {
        exact: true,
        path: '/',
        component: ({ match, location }) => <HomePage match={match} location={location} />
    },
    {
        exact: true,
        path: '/not-found',
        component: () => <NotFound />
    },
    {
        exact: true,
        path: '/search',
        component: ({ match, history }) => <ResultSearchPage match={match} history={history} />
    },
    {
        exact: true,
        path: '/moi-cap-nhat',
        component: ({ match, history }) => <SectionPage match={match} />
    },
    {
        exact: true,
        path: '/hom-nay-xem-gi',
        component: ({ match, history }) => <SectionPage match={match} />
    },
    {
        exact: true,
        path: '/anime/all/:page',
        component: ({ match, history }) => <SectionPage match={match} />
    },
    {
        exact: true,
        path: '/bang-xep-hang/:option',
        component: ({ match, history }) => <SectionPage match={match} />
    },
    {
        exact: true,
        path: '/phim-da-thich',
        component: ({ match, history }) => <UserPage match={match} type="watch" />
    },
    {
        exact: true,
        path: '/phim-da-xem',
        component: ({ match, history }) => <UserPage match={match} type="watch" />
    },
    {
        exact: true,
        path: '/phim-dang-theo-doi',
        component: ({ match, history }) => <UserPage match={match} type="watch" />
    },
    {
        exact: true,
        path: '/sua-thong-tin',
        component: ({ match, history }) => <UserPage match={match} type="information" />
    },
    {
        exact: true,
        path: '/doi-mat-khau',
        component: ({ match, history }) => <UserPage match={match} type="information" />
    },
    {
        exact: true,
        path: '/:name',
        component: ({ match, history }) => <WatchPage match={match} history={history}/>
    },
    {
        exact: true,
        path: '/:name/:episode',
        component: ({ match, history }) => <WatchPage match={match} history={history} />
    },
    
    
];





function routes() {
    genres.forEach(item => {
        routers.push({
            exact: false,
            path: `/anime/${item.slug}/:page`,
            component: ({ match, history }) => <SectionPage match={match} />
        })
    })
    routers.push({
        exact: true,
        path: '*',
        component: () => <NotFound />
    })
    return (
        <Switch>
            {routers.map((item, index) => {
                return <Route key={index} exact={item.exact} path={item.path} component={item.component} />
            })}
        </Switch>
    )
}

export default routes;

