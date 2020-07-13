import {useState, useEffect} from 'react'
import {useParams} from 'react-router'
import {fetchTurretInfo} from './turret-info'

/**
 * React hook for parsing turret origin from the location URI.
 */
export function useTurretDomain() {
    let {domain} = useParams()
    domain = decodeURIComponent(domain || '')
    if (domain.substr(-1) !== '/') {
        domain += '/'
    }
    return domain
}

const turretInfoListeners = []

/**
 * React hook for fetching general Turing server parameters and information about uploaded contracts.
 * @return {{domain: String, network: String, vault: String, runFee: Number, uploadFee: Number, contracts: Array<Object>}}
 */
export function useTurretInfo() {
    const domain = useTurretDomain()
    const [turretInfo, updateTurretInfo] = useState(null)
    useEffect(() => {
        fetchTurretInfo(domain)
            .then(data => updateTurretInfo(data))
        //watch for forced updates
        turretInfoListeners.push(updateTurretInfo)
        return () => {
            //unbind forced updates listener
            const idx = turretInfoListeners.indexOf(updateTurretInfo)
            if (idx > -1) {
                turretInfoListeners.splice(idx, 1)
            }
        }
    }, [domain])
    return turretInfo
}

export function refreshTurretInfo() {
    const domain = useTurretDomain()
    fetchTurretInfo(domain, true)
        .then(data => {
            for (const updateTurretInfo of turretInfoListeners) {
                updateTurretInfo(data)
            }
        })
}