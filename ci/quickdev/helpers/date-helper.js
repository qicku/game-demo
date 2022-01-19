/*!
 * FilePath     : date-helper.js
 * 2021-12-21 09:30:05
 * Description  : Extension devtools v0.1.0
 * 		 Refactor QuickDev For extension
 *
 * Copyright 2019-2021 Lamborui
 *
 */
module.exports.currentDateTime = currentDateTime
module.exports.currentDate = currentDate

function currentDateTime() {
  const d = new Date()
  let m = (d.getMonth() + 1).toString()
  m = m.length > 0 ? m : `0${m}`

  let day = d.getDate().toString()
  day = day.length > 1 ? day : `0${day}`

  let hours = d.getHours().toString()
  hours = hours.length > 1 ? hours : `0${hours}`
  let minutes = d.getMinutes().toString()

  minutes = minutes.length > 1 ? minutes : `0${minutes}`

  return `${d.getFullYear()}-${m}-${day} ${hours}:${minutes}`
}

function currentDate() {
  const d = new Date()
  let m = d.getMonth().toString()
  m = m.length > 0 ? m : `0${m}`

  let day = d.getDate().toString()
  day = day.length > 1 ? day : `0${day}`

  return `${d.getFullYear()}-${m}-${day}`
}
