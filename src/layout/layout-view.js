import React from 'react'
import './layout.scss'

export default function LayoutView({children}) {
    return <>
        <header className="container">
            <h2><img src="/logo.svg" className="logo"/> Turing Server Dashboard</h2>
            <hr/>
        </header>
        <div className="page-container container space">{children}</div>
        <footer className="text-center dimmed">

        </footer>
    </>
}