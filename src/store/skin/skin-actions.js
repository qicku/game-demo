/*!
 *
 * @module	: Actions file generate by QuickDev Tools 
 * @createDate	: 2022-1-19 20:49
 * @auhtor	: wade<wade@csdn.com>
 * @description	: 
 *
 * @license MIT
 * 
 */
// Action types defined here or defined in global file: store/core-action-types.js
export const UPD_SKIN_STATE_BY_PROPS = 'skin@props/update_state'

// This action generate by QuickDev Tools
export const updateSkinStateByProps = (skinState) => ({
  type: UPD_SKIN_STATE_BY_PROPS,
  val: skinState || {},
})
