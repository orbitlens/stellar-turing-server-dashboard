import React from 'react'

export default function CreateContractAuthKeyView({authKey, onChange}) {
    return <div className="segment">
        <h3>AuthKey</h3>
        <p className="dimmed">
            Stellar account public key used to identify the contract
        </p>
        <input type="text" value={authKey} placeholder="Public key starting with G..."
               onChange={e => onChange(e.target.value.trim())}/>
    </div>
}