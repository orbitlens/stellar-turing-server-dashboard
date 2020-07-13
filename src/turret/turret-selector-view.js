import React, {useState} from 'react'
import {navigate} from '../util/nav'

const allowedProtocols = ['https:']
if (process.env.NODE_ENV === 'development') {
    allowedProtocols.push('http:')
}

function submitUrl(url) {
    url = (url || '').trim()
    if (!url) return 'Please provide a valid Turing server URL'
    try {
        const {protocol} = new URL(url)
        if (!allowedProtocols.includes(protocol)) return `Invalid server protocol. Only ${allowedProtocols.join()} allowed.`
    } catch (e) {
        //failed to parse user's input
        return 'Invalid Turing server URL'
    }
    navigate(`/turret/${encodeURIComponent(url)}`)
    return null
}

export default function TurretSelectorView() {
    const [url, setUrl] = useState(''),
        [error, setError] = useState(null)
    return <div>
        <h2>Chose Turing Server</h2>
        <label className="dimmed">
            <p>
            Provide an URL of the Turing server to explore
            </p>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)}/>
        </label>
        <div className="micro-space">
            <button className="button" onClick={() => setError(submitUrl(url))}>Proceed</button>
        </div>
        {error && <div className="error">
            {error}
        </div>}
    </div>
}