/*! This module home DOM Root **/
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'

class IndexPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // a: true, // Page cache state defined here.
    }
  }

  componentDidMount() {
    //here regist some eventlistener or handle init.
  }

  componentWillUnmount() {
    //here unregist some eventlistener or handle destory.
  }

  renderHeader(){
    return <div className='home__header'>IndexPage Header </div>
  }

  renderContent(){
    return <div className='home__content'>IndexPage Content </div>
  }

  renderFooter(){
    return <div className='home__footer'>IndexPage Footer </div>
  }

  render() {
    // const {t,isDarkTheme} = this.props
    // translation use: t('key',options)

    return (
      <div className='home-page'>
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderFooter()}
     </div>
   )
  }

}

export default withTranslation()(IndexPage)
