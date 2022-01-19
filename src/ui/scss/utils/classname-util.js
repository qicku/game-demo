export const classNamesJoin = (clsNames) => {
  return !!clsNames && clsNames.length ? clsNames.join(' ') : ''
}

export const classNameJoinOptions = (
  baseClsName = '',
  devideOption = {},
  extraClsNames = []
) => {
  let _cls = [baseClsName]
  const {
    isMobile = false,
    isBrowser = false,
    isImToken = false,
    isDarkTheme = false,
  } = devideOption
  isDarkTheme !== undefined &&
    (Boolean(isDarkTheme) ? _cls.push('is-dark') : _cls.push('is-light'))
  isMobile && _cls.push('is-mobile')
  isBrowser && _cls.push('is-pc')
  isImToken && _cls.push('is-imtoken')

  _cls = _cls.concat(extraClsNames)

  return _cls.filter((clsName) => Boolean(clsName)).join(' ')
}
