import React, { Component } from 'react'

import { withTranslation } from 'react-i18next'
import { Routes, Route } from 'react-router-dom'

import HomePage from '~View/home'

class BootApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageId: 'popup',
    }
  }

  componentDidMount() {
    // initailize load data from localStorage
    const { t } = this.props
  }

  componentWillUnmount() {
    // reset localStorage actived popupPage = false
  }

  render() {
    const { t } = this.props

    return (
      <Routes>
        <Route exact path='/' element={<HomePage />} />
      </Routes>
    )
  }
}

export default withTranslation()(BootApp)
