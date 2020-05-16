import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { UserProvider } from './contexts/UserContext'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import moment from "moment"
import 'moment/locale/pl'

moment.locale('pl')

ReactDOM.render(<MuiPickersUtilsProvider utils={MomentUtils} locale="pl"><UserProvider><App /></UserProvider></MuiPickersUtilsProvider>, document.getElementById('root'))
