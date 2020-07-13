import React from 'react'
import ContractDetailsView from './contract-details-view'

export default function ContractsListView({turretInfo}) {
    const {contracts, network} = turretInfo
    return <div>
        <h3>Available contracts</h3>
        {!contracts.length &&
        <div className="dimmed text-small">(no contracts uploaded to this server so far)</div>}
        {contracts.map(contract => <ContractDetailsView key={contract.hash} contract={contract} network={network}/>)}
    </div>
}