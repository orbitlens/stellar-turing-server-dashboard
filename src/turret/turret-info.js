const turretCache = {
    prefix: '_turret:', //session storage prefix
    ttl: 30, //cached item time-to-live in seconds
    formatStorageKey(key) {
        return this.prefix + key
    },
    get(key) {
        const cachedEntry = sessionStorage.getItem(this.formatStorageKey(key))
        if (!cachedEntry) return
        const parsed = JSON.parse(cachedEntry)
        if (parsed && parsed._ts + this.ttl * 1000 < new Date().getTime()) return //expired

    },
    set(key, info) {
        info._ts = new Date().getTime()
        sessionStorage.setItem(this.formatStorageKey(key), JSON.stringify(info))
    },
    invalidate(key) {
        sessionStorage.removeItem(this.formatStorageKey(key))
    }
}

export function fetchTurretInfo(domain, forceUpdate = false) {
    if (!forceUpdate) {
        const cached = turretCache.get(domain)
        if (cached) return Promise.resolve(cached)
    }
    return fetch(domain)
        .then(res => res.json())
        .then(data => {
            data.domain = domain
            turretCache.set(domain, data)
            return data
        })
}

export function invalidateTurretInfoCache(domain) {
    turretCache.invalidate(domain)
}