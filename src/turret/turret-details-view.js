import React from 'react'
import ContractsListView from '../contract/contracts-list-view'
import {useTurretInfo} from './turret-hooks'
import {AccountExplorerLink} from '../components/explorer-link'

export default function TurretDetailsView() {
    const turretInfo = useTurretInfo()
    if (!turretInfo) return <div className="loader"/>
    const {network, vault, runFee, uploadFee, contracts} = turretInfo
    const vaultLink = `https://stellar.expert/explorer/${network.toLowerCase()}/account/${vault}`
    return <>
        <div className="segment">
            <div>
                <span className="dimmed">Stellar network: </span>
                {network}
            </div>
            <div>
                <span className="dimmed">Vault address: </span>
                <AccountExplorerLink address={vault} network={network}/>
            </div>
            <div>
                <span className="dimmed">Contract execution fee: </span>
                {runFee} XLM
            </div>
            <div>
                <span className="dimmed">Contract upload fee: </span>
                {uploadFee} XLM
            </div>
            <div>
                <span className="dimmed">Active contracts: </span>
                {contracts.length}
            </div>
        </div>
        <ContractsListView turretInfo={turretInfo}/>
    </>
}