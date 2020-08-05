import React from 'react'

export default function CreateContractAuthKeyView({authKey, onChange}) {
    function updateValue(value) {
        value = value.trim().replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZ234567]/g, '')
        onChange(value)
    }

    return <div className="segment">
        <h3>AuthKey</h3>
        <p className="dimmed">
            Stellar account public key used to identify the contract
        </p>
        <input type="text" value={authKey} placeholder="Public key starting with G..." maxLength={60}
               onChange={e => updateValue(e.target.value)}/>
    </div>
}