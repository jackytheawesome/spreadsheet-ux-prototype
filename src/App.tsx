import { useEffect, useRef } from 'react'
import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets'
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core'
import UniverPresetSheetsCoreEnUS from '@univerjs/preset-sheets-core/locales/en-US'

import '@univerjs/preset-sheets-core/lib/index.css'
import './App.css'

/** Only these fonts are shown in the font dropdown (Univer default list overridden). */
const ALLOWED_FONTS = [
  { value: 'Arial', label: 'fontFamily.arial', category: 'sans-serif' as const },
  { value: 'Times New Roman', label: 'fontFamily.times-new-roman', category: 'serif' as const },
  { value: 'Tahoma', label: 'fontFamily.tahoma', category: 'sans-serif' as const },
  { value: 'Verdana', label: 'fontFamily.verdana', category: 'sans-serif' as const },
]

function App() {
  const univerRef = useRef<ReturnType<typeof createUniver> | null>(null)

  useEffect(() => {
    const { univer, univerAPI } = createUniver({
      locale: LocaleType.EN_US,
      locales: {
        [LocaleType.EN_US]: mergeLocales(UniverPresetSheetsCoreEnUS),
      },
      presets: [
        UniverSheetsCorePreset({
          container: 'univer-container',
          customFontFamily: { override: true, list: ALLOWED_FONTS },
        }),
      ],
    })

    univerRef.current = { univer, univerAPI }
    univerAPI.createWorkbook({})

    return () => {
      univerAPI.dispose()
      univerRef.current = null
    }
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Таблицы</h1>
      </header>
      <div id="univer-container" className="univer-container" />
    </div>
  )
}

export default App
