import React from 'react'
import {withRouter} from 'react-router'
import {useTurretDomain} from './turret-hooks'
import Tabs from '../components/tabs'

export default withRouter(function TurretLayoutView({children}) {
    const domain = useTurretDomain(),
        turretHomeLink = `/turret/${encodeURIComponent(domain)}`
    return <>
        <h2>Server <span className="color-primary">{domain}</span>&emsp;
            <a href="/" className="text-small">&#9850; change</a>
        </h2>
        <div>
            <Tabs tabs={[
                {name: 'overview', title: 'Overview', href: turretHomeLink},
                {name: 'upload', title: 'Upload new contract', href: turretHomeLink + '/contract/new'}
            ]}/>
        </div>
        {children}
    </>
})