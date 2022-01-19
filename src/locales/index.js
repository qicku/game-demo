/*!
 * FilePath     : index.js
 * 2021-12-23 14:52:20
 * Description  : Extension devtools v0.1.0
 * 		 This file is implement I18N
 *
 * Copyright 2019-2021 Lamborui
 *
 */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import I18n_ZH_CN from './zh-CN/translation.json'
import I18n_ZH_TW from './zh-TW/translation.json'
import I18n_EN from './en/translation.json'
import { isDebugMode } from '~/lib/env/safe-dot-env'

/**
 * en
 */
const i18nResources = {
  en: {
    translation: I18n_EN,
  },
  'zh-TW': {
    translation: I18n_ZH_TW,
  },
  'zh-CN': {
    translation: I18n_ZH_CN,
  },
}

i18n.use(initReactI18next).init({
  debug: isDebugMode,
  resources: i18nResources,
  lng: 'zh-CN',
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: 'en',
})

window.i18n = i18n

export default i18n
