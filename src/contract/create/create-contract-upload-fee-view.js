import React, {useState} from 'react'
import {useTurretInfo} from '../../turret/turret-hooks'
import albedo from '@albedo-link/intent'
import {Asset, Keypair, Networks, Operation, Server, TransactionBuilder} from 'stellar-sdk'

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

export default function CreateContractUploadFeeView({onTransactionReady}) {
    const turretInfo = useTurretInfo(),
        [uploadFeeTx, setUploadFeeTx] = useState(null),
        [inProgress, setInProgress] = useState(false),
        [txError, setTxError] = useState(null)
    if (!turretInfo || !turretInfo.uploadFee) return null
    const {network, uploadFee, vault} = turretInfo

    function requestFeeSignature() {
        setTxError(null)
        setInProgress(true)
        albedo.pay({
            amount: uploadFee,
            destination: vault,
            network
        })
            .then(res => {
                setTxError(null)
                setUploadFeeTx(res.signed_envelope_xdr)
                onTransactionReady(res.signed_envelope_xdr)
            })
            .catch(e => {
                console.error(e)
                setTxError('Failed to set upload fee.')
            })
            .finally(() => setInProgress(false))
    }

    return <div className="space segment">
        <h3>Upload fees</h3>
        <p className="dimmed">
            Selected server requires <b>{uploadFee}XLM</b> upload fee.<br/>
        </p>
        {inProgress ? <div className="loader micro"/> :
            <>
                {uploadFeeTx ? <p><b>✓</b> Upload fee transaction is ready</p> :
                    <>
                        <p>
                            You need to sign the following transaction before uploading the contract.
                        </p>
                        <button className="button" onClick={() => requestFeeSignature()}>Prepare upload fee tx</button>
                        {txError && <div className="error">{txError}</div>}
                    </>
                }
            </>}
        <p className="dimmed">
            🛈 The upload fee will not be charged until the contract is fully validated and accepted by the server.
        </p>
    </div>
}