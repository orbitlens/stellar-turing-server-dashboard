import React, {useState} from 'react'
import {useTurretDomain} from '../../turret/turret-hooks'

export default function CreateContractTurretsView({onChange}) {
    const self = useTurretDomain()
    const [turrets, setTurrets] = useState(self)
    const parsedTurrets = turrets.split(',').map(t => t.trim())
    parsedTurrets.push('')

    function updateTurretEndpoint(value, index) {
        parsedTurrets[index] = value.trim()
        const turretsList = parsedTurrets.filter(t => !!t).join()
        setTurrets(turretsList)
        onChange(turretsList)
    }

    return <div className="segment">
        <h3 className="space">Turrets</h3>
        <p className="dimmed small">A list of turing servers where this contract will be uploaded</p>
        {parsedTurrets.map((turret, i) => <input type="text" key={i} value={turret}
                                                 readOnly={turret === self && i === 0}
                                                 onChange={e => updateTurretEndpoint(e.target.value, i)}/>)}
    </div>
}