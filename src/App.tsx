import { Calendar } from './components/Calendar/Calendar'
import { Countdown } from './components/Countdown/Countdown'
import { Header } from './components/Header/Header'
import { ProgressSummary } from './components/ProgressSummary/ProgressSummary'
import { Snowfall } from './components/Snowfall/Snowfall'
import { StartBanner } from './components/StartBanner/StartBanner'
import { doorLayout } from './content/layout'
import { I18nProvider } from './i18n/I18nContext'
import { countdownTarget, firstDoorDate, isBeforeStart, isUnlockAll, useToday } from './lib/dates'
import { ProgressProvider } from './state/ProgressContext'
import { SettingsProvider } from './state/SettingsContext'

function Page() {
  const today = useToday()
  const beforeStart = isBeforeStart(today, isUnlockAll())

  return (
    <>
      <Snowfall />
      <main>
        <Header>
          <Countdown target={countdownTarget()} />
        </Header>
        {beforeStart && <StartBanner opensAt={firstDoorDate()} />}
        <Calendar layout={doorLayout} />
        <ProgressSummary />
      </main>
    </>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <I18nProvider>
        <ProgressProvider>
          <Page />
        </ProgressProvider>
      </I18nProvider>
    </SettingsProvider>
  )
}
