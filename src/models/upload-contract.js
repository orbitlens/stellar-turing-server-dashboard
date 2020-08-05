import {StrKey} from 'stellar-base'

export default class UploadContractModel {
    constructor(turretInfo) {
        this.turretInfo = turretInfo
        this.turrets = turretInfo.domain
    }

    /**
     * TSS server info.
     * @type {{domain: String, uploadFee: String}}
     */
    turretInfo

    /**
     * Contract code.
     * @type {String}
     */
    code = ''

    /**
     * Addresses of servers that will run this contract.
     * @type {String}
     */
    turrets = ''

    /**
     * Contract request parameters.
     * @type {Array}
     */
    fields = []

    /**
     *
     * @type {String}
     */
    authKey

    /**
     * Upload fee transaction XDR.
     * @type {String}
     */
    payment

    /**
     * Check whether the server charges upload fee for the contract.
     * @return {Boolean}
     */
    get isFeeRequired() {
        return this.turretInfo.uploadFee > 0
    }

    /**
     * Check whether all parameters are valid
     * @return {Boolean}
     */
    get isValid() {
        if (!this.turrets) return false//'At least one turret is required'
        if (!this.authKey) return false//'Parameter "authKey" is required'
        if (!StrKey.isValidEd25519PublicKey(this.authKey)) return false//'Invalid authKey – a valid Stellar account public key expected'
        if (!this.code) return false //"Contract code can't be empty"
        if (this.isFeeRequired && !this.payment) return false//"Payment is required as this turret charges contract uploading fee"

        return true
    }

    /**
     * Upload the contract to selected TSS server
     * @return {Promise<Response>}
     */
    upload() {
        const data = new FormData()
        data.append('contract', new Blob([this.code], {type: 'application/javascript'}))
        data.append('turrets', this.turrets)
        data.append('fields', this.fields)
        data.append('authkey', this.authKey)
        if (this.isFeeRequired) {
            data.append('payment', this.payment)
        }
        return fetch(`${this.turretInfo.domain}contract`, {
            body: data,
            method: 'post'
        })
    }
}