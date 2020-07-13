import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import './tabs.scss'
import {withRouter} from 'react-router'

function Tabs({tabs, selectedTab, onChange, className, children}) {
    const [selected, setSelectedTab] = useState(() => {
        //try to retrieve from props
        if (selectedTab) {
            if (tabs.find(t => t.name === selectedTab)) return selectedTab
        }
        //use the first tab by default
        let candidate = tabs[0]
        //try to get from location
        for (let tab of tabs) {
            if (tab.href === location.pathname) {
                candidate = tab
                break
            }
        }
        if (!candidate) return null
        return candidate.name
    })

    useEffect(() => {
        selectedTab !== undefined && setSelectedTab(selectedTab)
    }, [selectedTab])

    function selectTab(tabName) {
        const tab = tabs.find(t => t.name === tabName)
        if (tab) {
            if (selectedTab === undefined) {
                setSelectedTab(tabName)
            }
            if (onChange) {
                onChange(tabName)
            }
        }
    }

    const s = selected,//selectedTab || selected,
        tabToRender = tabs.find(({name}) => name === s)

    return <div className={cn('tabs', className)}>
        <div className="tabs-header">
            <div>
                {tabs.map(({name, title, href}) => <a href={href || '#'} key={name} onClick={() => selectTab(name)}
                                                      className={cn('tabs-item', {selected: s === name})}>
                    {title || name}</a>)}
            </div>
            {children}
        </div>
        <div className="tabs-body">
            {tabToRender.render && tabToRender.render()}
        </div>
    </div>
}

Tabs.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        title: PropTypes.string,
        render: PropTypes.func,
        href: PropTypes.string
    })).isRequired,
    className: PropTypes.string,
    onChange: PropTypes.func,
    selectedTab: PropTypes.string
}

export default withRouter(Tabs)