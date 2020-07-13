import React, {useState} from 'react'
import CodeHighlight from '../components/code-highlight'
import {useTurretDomain, useTurretInfo} from '../turret/turret-hooks'
import {navigate} from '../util/nav'
import isEqual from 'react-fast-compare'
import {TransactionBuilder, Server, Operation, Networks, Keypair, Asset} from 'stellar-sdk'

function ContractTurretsView({onChange}) {
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
        {parsedTurrets.map((turret, i) => <input type="text" key={i} value={turret} readOnly={turret === self}
                                                 onChange={e => updateTurretEndpoint(e.target.value, i)}/>)}
    </div>

}

function ContractFieldDefinitionView({field, onChange}) {
    const [fieldDefinition, setFieldDefinition] = useState(field || {})

    function update(key, value) {
        const updated = {...fieldDefinition, [key]: value || undefined}
        if (!isEqual(updated, fieldDefinition)) {
            setFieldDefinition(updated)
            onChange((updated))
        }
    }

    const {name, type, description, rule} = fieldDefinition
    return <>
        <b><code>{name || <span className="dimmed">new field</span>}</code></b>
        <div style={{paddingLeft: '1em'}}>
            <div className="row">
                <div className="column column-50">
                    <label>
                        Field name:
                        <input type="text" value={name || undefined} placeholder="Short field name"
                               onChange={e => update('name', e.target.value.trim())}/>
                    </label>
                </div>
                <div className="column column-50">
                    <label>
                        Type:
                        <select value={type || 'string'} onChange={e => update('type', e.target.value)}>
                            <option value="string">String</option>
                            <option value="number">Number</option>
                        </select>
                    </label>
                </div>
                <div className="column column-50">
                    <label>
                        Description:
                        <textarea placeholder="what it is used for" value={description}
                                  onChange={e => update('description', e.target.value)}/>
                    </label>
                </div>
                <div className="column column-50">
                    <label>
                        Validation rule:
                        <textarea placeholder="what data should it contain" value={rule}
                                  onChange={e => update('rule', e.target.value)}/>
                    </label>
                </div>
            </div>
        </div>
    </>
}

function ContractFields({fields = [], onChange}) {
    function updateField(index, fieldDefinition) {
        const newFields = fields.slice()
        newFields.splice(index, 1, fieldDefinition)
        onChange(newFields)
    }

    function addNewField() {
        const newFields = fields.slice()
        newFields.push({})
        onChange(newFields)
    }

    return <div className="segment">
        <h3>Fields</h3>
        <p className="dimmed">
            Request parameters that the contract expects to receive
        </p>
        {fields.map((f, i) =>
            <ContractFieldDefinitionView key={i} field={f} onChange={d => updateField(i, d)}/>
        )}
        <div className="text-small">
            <a href="#" onClick={() => addNewField()}>+ add new field</a>
        </div>
    </div>
}

async function prepareContractUploadFeeTx(sourceAccountSecret, {network, uploadFee, vault}) {
    const horizonAddress = network.toLowerCase() === 'public' ?
        'https://horizon.stellar.org/' :
        'https://horizon-testnet.stellar.org/'

    const networkPassphrase = Networks[network.toUpperCase()]
    const sourceKeypair = Keypair.fromSecret(sourceAccountSecret)
    const horizon = new Server(horizonAddress)
    const sourceAccount = await horizon.loadAccount(sourceKeypair.publicKey())
    const builder = new TransactionBuilder(sourceAccount, {networkPassphrase, fee: '10000'})
    builder.setTimeout(600)
    builder.addOperation(Operation.payment({amount: uploadFee, asset: Asset.native(), destination: vault}))
    const tx = builder.build()
    tx.sign(sourceKeypair)
    return tx.toXDR()
}

function formatTurretBaseLink(domain) {
    return `/turret/${encodeURIComponent(domain)}`
}

async function uploadContract(turretInfo, code, fields, turretsList, sourceAccountSecret) {
    const data = new FormData()
    data.append('file', new Blob([code], {type: 'application/javascript'}))
    data.append('turrets', turretsList)
    data.append('fields', fields)
    data.append('contract', code)
    if (turretInfo.uploadFee > 0) {

        data.append('payment', await prepareContractUploadFeeTx(sourceAccountSecret, turretInfo))
    }
    await fetch(`${turretInfo.domain}contract`, {
        body: data,
        method: 'post'
    })
    //TODO: navigate to the contract extended info page instead
    navigate(formatTurretBaseLink(turretInfo.domain))
}

export default function CreateContractView() {
    const turretInfo = useTurretInfo()
    const [secret, setSecretKey] = useState(''),
        [code, setCode] = useState(''),
        [fields, setFields] = useState([]),
        [turretsList, setTurretsList] = useState('')

    if (!turretInfo) return <div className="loader"/>
    const {domain} = turretInfo
    return <div>
        <div className="segment">
            <h3>Source code</h3>
            <p className="dimmed">
                Source code of the smart contract
            </p>
            <CodeHighlight value={code} lang="javascript" onChange={v => setCode(v)}/>
        </div>
        <ContractFields fields={fields} onChange={v => setFields(v)}/>
        <ContractTurretsView onChange={v => setTurretsList(v)}/>
        {turretInfo.uploadFee && <div className="segment">
            <h3>Upload fees</h3>
            <p className="dimmed">Secret key of the account to pay <b>{turretInfo.uploadFee}XLM</b> of the upload fee
            </p>
            <input type="text" placeholder="Account secret key starting with S..." value={secret}
                   onChange={e => setSecretKey(e.target.value)}/>
        </div>}
        <div className="space row">
            <div className="column column-50"/>
            <div className="column column-25">
                <button className="button button-block"
                        onClick={() => uploadContract(turretInfo, code, fields, turretsList, secret)}>
                    Upload contract
                </button>
            </div>
            <div className="column column-25">
                <a href={formatTurretBaseLink(domain)} className="button button-outline button-block">Cancel</a>
            </div>
        </div>
    </div>
}