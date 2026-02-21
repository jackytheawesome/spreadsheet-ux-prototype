import { useEffect, useRef } from 'react'
import type { IWorkbookData } from '@univerjs/core'
import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets'
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core'
import UniverPresetSheetsCoreEnUS from '@univerjs/preset-sheets-core/locales/en-US'

import '@univerjs/preset-sheets-core/lib/index.css'
import './App.css'
import { appTheme } from './theme'

const WORKBOOK_STORAGE_KEY = 'univer-workbook-snapshot'

/** Only these fonts are shown in the font dropdown (Univer default list overridden). */
const ALLOWED_FONTS = [
  { value: 'Arial', label: 'fontFamily.arial', category: 'sans-serif' as const },
  { value: 'Times New Roman', label: 'fontFamily.times-new-roman', category: 'serif' as const },
  { value: 'Tahoma', label: 'fontFamily.tahoma', category: 'sans-serif' as const },
  { value: 'Verdana', label: 'fontFamily.verdana', category: 'sans-serif' as const },
]

function loadWorkbookFromStorage(): Partial<IWorkbookData> | null {
  try {
    const raw = localStorage.getItem(WORKBOOK_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<IWorkbookData>
    return data && typeof data === 'object' ? data : null
  } catch {
    return null
  }
}

function saveWorkbookToStorage(getSnapshot: () => IWorkbookData | undefined) {
  try {
    const snapshot = getSnapshot()
    if (snapshot) localStorage.setItem(WORKBOOK_STORAGE_KEY, JSON.stringify(snapshot))
  } catch {
    // ignore serialization errors
  }
}

function App() {
  const univerRef = useRef<ReturnType<typeof createUniver> | null>(null)

  useEffect(() => {
    const { univer, univerAPI } = createUniver({
      theme: appTheme,
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

    const saved = loadWorkbookFromStorage()
    univerAPI.createWorkbook(saved ?? {})

    const save = () =>
      saveWorkbookToStorage(() => univerAPI.getActiveWorkbook()?.getSnapshot())

    let saveTimeout: ReturnType<typeof setTimeout> | null = null
    const disposeCommand = univerAPI.addEvent(
      univerAPI.Event.CommandExecuted,
      () => {
        if (saveTimeout) clearTimeout(saveTimeout)
        saveTimeout = setTimeout(() => {
          saveTimeout = null
          save()
        }, 400)
      }
    )

    return () => {
      save()
      if (saveTimeout) clearTimeout(saveTimeout)
      disposeCommand.dispose()
      univerAPI.dispose()
      univerRef.current = null
    }
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title-row">
          <img src="/logo.svg" alt="" className="app-logo" width={30} height={30} />
          <h1 className="app-title">Прототип таблицы</h1>
        </div>
      </header>
      <div id="univer-container" className="univer-container" />
    </div>
  )
}

export default App
