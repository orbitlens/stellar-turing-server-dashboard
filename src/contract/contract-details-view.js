import React from 'react'
import {AccountExplorerLink} from '../components/explorer-link'

export default function ContractDetailsView({contract, network}) {
    const {contract: contractAddress, authkey, signer, fields} = contract
    return <div className="segment">
        <h4>Contract <AccountExplorerLink address={contractAddress} network={network}/></h4>
        <div className="micro-space">
            <span className="dimmed">Auth key: </span>
            <AccountExplorerLink address={authkey} network={network}/>
        </div>
        <div>
            <span className="dimmed">Signer public key: </span>
            <AccountExplorerLink address={signer} network={network}/>
        </div>
        {fields && fields.length && <>
            <h4>Request fields:</h4>
            {fields.map(({name, type, rule, description}) => <div key={name} className="micro-space">
                <b>{name}</b> <span className="dimmed">({type})</span>
                {description && <div>{description}</div>}
                {rule && <div>{rule}</div>}
            </div>)}
        </>}
    </div>
}