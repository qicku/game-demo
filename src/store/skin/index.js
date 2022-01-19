/*!
 *
 * @module	: skinState generate by QuickDev Tools 
 * @createDate	: 2022-1-19 20:49
 * @auhtor	: wade<wade@csdn.com>
 * @description	: 
 *
 * @license MIT
 * 
 */
import { UPD_SKIN_STATE_BY_PROPS } from './skin-actions'

// you should add skinState into root store file,usally at src/store/reducers.js
export default function reduceSkin(state = {}, { type, val }) {
  const skinState = {
    // xxx: '',
    ...state,
  }

  switch (type) {
    case UPD_SKIN_STATE_BY_PROPS: 
      return { ...skinState, ...val }
    default: 
      return skinState
  }
}
