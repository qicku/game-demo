import { compose } from 'redux'
import { connect } from 'react-redux'
// import { withRouter } from 'react-router-dom'

import IndexPage from './home-comp'

/**
 * 
 * @module	: home
 * 	 make state inject into react dom ... ed.
 *
 */
const mapStateToProps = (state) => {
  // global state contains skinState ... ed.
  const {
    skinState: { isDarkTheme }
  } = state

  return {
    isDarkTheme,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // doSomeThing: (arg1,arg2) => (dispatch) => {
    //  ...
    //  dispatch(action)
    // },
  }
}

export default compose(
  // withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(IndexPage)
