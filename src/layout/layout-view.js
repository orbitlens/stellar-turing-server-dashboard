import React from 'react'
import './layout.scss'
import {repository} from '../../package.json'

export default function LayoutView({children}) {
    return <>
        <header className="container">
            <h2><img src="/logo.svg" className="logo"/> Turing Server Dashboard</h2>
            <hr/>
        </header>
        <div className="page-container container space">{children}</div>
        <footer className="text-center text-small segment" style={{marginBottom: '0'}}>
            Turing Signing Server Dashboard
            <br/>
            <a href={repository.url} target="_blank">Open Source</a>
        </footer>
    </>
}