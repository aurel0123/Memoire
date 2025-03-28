import Routes from './routes/Routes'
import ThemeProvider from './context/theme-context'
function App() {
  return (
    <>
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
    </>
  )
}

export default App