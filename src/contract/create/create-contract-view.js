import React, {useState, useEffect} from 'react'
import CodeHighlight from '../../components/code-highlight'
import {useTurretInfo} from '../../turret/turret-hooks'
import {navigate} from '../../util/nav'
import isEqual from 'react-fast-compare'
import UploadContractModel from '../../models/upload-contract'
import CreateContractTurretsView from './create-contract-turrets-view'
import CreateContractUploadFeeView from './create-contract-upload-fee-view'
import CreateContractFieldsView from './create-contract-fields-view'
import CreateContractAuthKeyView from './create-contract-authkey-view'


function formatTurretBaseLink(domain) {
    return `/turret/${encodeURIComponent(domain)}`
}

export default function CreateContractView() {
    const turretInfo = useTurretInfo()
    const [{contract}, setContract] = useState({}),
        [inProgress, setInProgress] = useState(false),
        [error, setError] = useState(null)
    useEffect(() => {
        if (turretInfo) {
            setContract({contract: new UploadContractModel(turretInfo)})
        }
    }, [turretInfo])
    if (!contract) return <div className="loader"/>
    const {isValid} = contract

    function upload() {
        if (inProgress || !isValid) return
        setInProgress(true)
        setError(null)
        contract.upload()
            .then(res => {
                console.log(res)
                if (!res.ok) {
                    res.json()
                        .then(r => setError(r))
                        .catch(() => {
                            setError(res.statusText)
                        })
                    return
                }
                //TODO: navigate to the contract extended info page instead
                navigate(formatTurretBaseLink(turretInfo.domain))
            })
            .catch(err => {
                console.error(err)
                setError(err)
            })
            .finally(() => setInProgress(false))

    }

    function setValue(key, value) {
        setContract(prevState => {
            const {contract} = prevState
            if (isEqual(contract[key], value)) return prevState //no changes
            contract[key] = value
            return {contract}
        })
    }

    return <div>
        <div className="segment">
            <h3>Source code</h3>
            <p className="dimmed">
                Source code of the smart contract
            </p>
            <CodeHighlight value={contract.code} lang="javascript" onChange={v => setValue('code', v)}/>
        </div>
        <CreateContractAuthKeyView authKey={contract.authKey} onChange={v => setValue('authKey', v)}/>
        <CreateContractFieldsView fields={contract.fields} onChange={v => setValue('fields', v)}/>
        <CreateContractTurretsView onChange={v => setValue('turrets', v)}/>
        <CreateContractUploadFeeView onTransactionReady={tx => setValue('payment', tx)}/>
        {error && <div className="space error">
            {error}
        </div>}
        <div className="space row">
            <div className="column column-50 text-left">
                <div style={{display: 'inline-block'}}>
                    {inProgress && <div className="loader micro"/>}
                </div>
            </div>
            <div className="column column-25">
                <button className="button button-block" disabled={!isValid || inProgress} onClick={() => upload()}>
                    Upload contract
                </button>
            </div>
            <div className="column column-25">
                <a href={formatTurretBaseLink(turretInfo.domain)} disabled={inProgress}
                   className="button button-outline button-block">Cancel</a>
            </div>
        </div>
    </div>
}