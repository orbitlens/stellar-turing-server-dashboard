import React from 'react'
import PropTypes from 'prop-types'
import {Switch, Router, Route} from 'react-router'
import {history} from './util/nav'
import Layout from './layout/layout-view'
import NotFoundPageView from './content/not-found-page-view'
import TurretSelectorView from './turret/turret-selector-view'
import TurretDetailsView from './turret/turret-details-view'
import CreateContactView from './contract/create/create-contract-view'
import TurretLayoutView from './turret/turret-layout-view'

function AppRouter() {
    return <Layout>
        <Router history={history}>
            <Switch>
                <Route path="/turret/:domain">
                    <TurretLayoutView>
                        <Switch>
                            <Route path="/turret/:domain/contract/new" component={CreateContactView}/>
                            <Route path="/turret/:domain" component={TurretDetailsView}/>
                            {/*<Route path="/turret/:domain/contract/:contract" component={}/>
                <Route path="/turret/:domain/contract/:contract/invoke" component={}/>*/}
                        </Switch>
                    </TurretLayoutView>
                </Route>
                <Route path="/" exact component={TurretSelectorView}/>
                <Route component={NotFoundPageView}/>
            </Switch>
        </Router>
    </Layout>
}

export default AppRouter
