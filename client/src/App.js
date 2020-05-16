import React, { useState, useEffect, useContext } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import './App.css'
import Login from './views/Login'
import Register from './views/Register'
import Home from './views/Home'
import SubjectList from './views/SubjectList'
import NoMatch from './views/NoMatch'
import { showCookie } from './helpers'
import { UserProvider } from './contexts/UserContext'
import { UserContext } from './contexts/UserContext'
import SubjectItem from './views/SubjectItem'
import SubjectAdd from './views/SubjectAdd'
import StudentAdd from './views/StudentAdd'
import StudentsList from './views/StudentsList'
import Presence from './views/Presence'

function App() {
  const [isAuth, setIsAuth] = useState(true)
  const [user, setUser] = useContext(UserContext)

  useEffect(() => {
    if (showCookie('user')) {
      const userFromCookies = JSON.parse(showCookie('user'))
      setUser(userFromCookies)
      setIsAuth(true)
    } else {
      setIsAuth(false)
    }
  }, [])

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      isAuth === true
        ? <Component {...props} />
        : <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
    )} />
  )

  return (
    <Router>
      <Switch>
        <Route exact path="/subjects">
          <SubjectList />
        </Route>
        <Route exact path="/students">
          <StudentsList />
        </Route>
        <Route exact path="/students/add">
          <StudentAdd />
        </Route>
        <Route exact path="/subjects/add">
          <SubjectAdd />
        </Route>
        <Route exact path="/subjects/:subjectId/attachStudent">
          <StudentsList attach="true" />
        </Route>
        <Route exact path="/subjects/:subjectId/presence">
          <Presence />
        </Route>
        <Route exact path="/subjects/:subjectId">
          <SubjectItem />
        </Route>
        <Route exact path="/login">
          <Login setIsAuth={setIsAuth} />
        </Route>
        <Route exact path="/register">
          <Register setIsAuth={setIsAuth} />
        </Route>
        <PrivateRoute exact path="/" component={Home} />
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
