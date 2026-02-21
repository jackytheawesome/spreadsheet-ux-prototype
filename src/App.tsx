import { useEffect, useRef } from 'react'
import { Button } from '@gravity-ui/uikit'
import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets'
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core'
import UniverPresetSheetsCoreEnUS from '@univerjs/preset-sheets-core/locales/en-US'

import '@univerjs/preset-sheets-core/lib/index.css'
import './App.css'

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
        <h1 className="app-title">Таблицы (Univer + Gravity UI)</h1>
        <Button view="action" size="m">
          Gravity UI
        </Button>
      </header>
      <div id="univer-container" className="univer-container" />
    </div>
  )
}

export default App
