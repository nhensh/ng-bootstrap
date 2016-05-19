import createLogger from 'redux-logger'
import {router} from 'redux-ui-router'

import thunk from 'redux-thunk'

app
    .config(/*@ngInject*/function ($locationProvider, $stateProvider, $urlRouterProvider) {

        $locationProvider.html5Mode({
            enabled: true
        });

        // For unmatched routes
        $urlRouterProvider.otherwise('/404');

        // Application routes
        $stateProvider
            .state('main', main)
    })
    .config(/*@ngInject*/$ngReduxProvider => {
        const logger = createLogger({
            level: DEBUG ? 'debug' : 'info'
        })

        const reducers = {
            router
        }

        $ngReduxProvider.createStoreWith(reducers, ['ngUiRouterMiddleware', logger, thunk])
    })
