import classes from "./App.module.css"
import MainForm from "./components/MainForm/MainForm"

function App() {

  return (
    <div className={classes["app"]}>
      <div className={classes["content"]}>
        <MainForm />
      </div>
    </div>
  )
}

export default App
