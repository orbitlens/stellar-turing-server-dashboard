import React from 'react'
import {render} from 'react-dom'
import Router from './router'
import {bindNavigation} from './util/nav'
import './styles/styles.scss'

const appContainer = document.createElement('div')

bindNavigation(appContainer)

render(<Router/>, appContainer)

document.body.appendChild(appContainer)