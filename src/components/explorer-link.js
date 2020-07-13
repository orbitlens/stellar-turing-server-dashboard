import React from 'react'

export function AccountExplorerLink({address, network}) {
    const link = `https://stellar.expert/explorer/${network.toLowerCase()}/account/${address}`
    return <a href={link} target="_blank" className="condensed">{address}</a>
}