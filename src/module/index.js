import angular from 'angular'
import 'angular-sanitize'
import 'angular-ui-router'
import 'angular-ui-bootstrap'
import 'angular-touch'
import 'angular-animate'
import ngRedux from 'ng-redux'
import ngReduxRouter from 'redux-ui-router'

import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'

export default angular.module('app', [
    'ngAnimate', 'ui.router', 'ui.bootstrap', 'ngTouch',
    'ngSanitize',
    ngRedux,
    ngReduxRouter
])


