import {createBrowserHistory} from 'history'

const history = createBrowserHistory()

export {history}

export function navigate(newUrl) {
    //ignore if new url = current url
    if ((window.location.pathname + window.location.search) === newUrl) return
    //update history
    history.push(newUrl)
    //scroll the page
    setTimeout(() => {
        document.body.scrollIntoView({behavior: 'smooth'})
    }, 200)
}

export function bindNavigation(appContainer) {
    appContainer.addEventListener('click', e => {
        //ignore ctrl+click
        if (e.ctrlKey) return
        //get the actual A tag target
        let link = e.target
        while (link && link.tagName.toLowerCase() !== 'a') {
            link = link.parentElement
        }
        if (!link) return
        const href = link.getAttribute('href')
        //skip empty links
        if (href === '#') return e.preventDefault()
        //sometimes links don't have href (null received)
        if (!href) return
        //skip external links
        if (link.target === '_blank') return
        if (link.classList.contains('external-link')) return
        if (/^(mailto:|tel:|(https?):\/\/)/.test(href)) return
        //prevent browser redirect
        e.preventDefault()
        //trigger navigation
        navigate(href)
    })
}