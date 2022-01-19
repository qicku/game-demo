/**
 *
 * @param  {...any} args
 * @returns
 */
module.exports.PrintInfo = (...args) =>
  console.log.call(console, '\x1b[36m%s\x1b[0m', ...args)

/**
 *
 * @param  {...any} args
 *
 */
module.exports.PrintError = (...args) => {
  if (args.length > 1) {
    console.log.call(console, '\x1b[31m❌%s\x1b[0m\n\x1b[35m%s\x1b[0m', ...args)
  } else {
    console.log.call(console, '\x1b[31m❌%s\x1b[0m', ...args)
  }
}

/**
 *
 * @param  {...any} args
 * @returns
 */
module.exports.PrintRun = (...args) =>
  console.log.call(
    console,
    '\x1b[34m🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️\x1b[0m\n\t\x1b[36m%s\x1b[0m',
    ...args
  )

/**
 *
 * @param  {...any} args
 */
module.exports.PrintOK = (...args) => {
  if (args.length > 1) {
    console.log.call(
      console,
      '\x1b[32m✨✨✨✨✨✨%s\x1b[0m\n\t\x1b[36m%s\x1b[0m',
      ...args
    )
    console.log('\x1b[32m✨✨✨✨✨✨\x1b[0m')
  } else {
    console.log.call(console, '\x1b[32m✨✨✨✨✨✨%s\x1b[0m', ...args)
    console.log('\x1b[32m✨✨✨✨✨✨\x1b[0m')
  }
}
