import React, { useEffect, useContext, useState, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import MainTemplate from '../templates/MainTemplate'
import { UserContext } from '../contexts/UserContext'
import api from '../api'
import { isNull, getDayOfWeek, getClosestDay } from '../helpers'

import { withStyles, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import { DatePicker } from "@material-ui/pickers"
import moment from 'moment'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    button: {
        margin: theme.spacing(1),
    },
}));

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

function Presence(props) {
    const [students, setStudents] = useState([])
    const [dayOfWeek, setDayOfWeek] = useState(null)
    const [date, setDate] = useState('')
    const [user, setUser] = useContext(UserContext)
    const { match: { params } } = props
    const classes = useStyles()
    const [selectedDate, handleDateChange] = useState(moment())
    const [subject, setSubject] = useState({})
    const [presences, setPresences] = useState([])

    useEffect(() => {
        if (isNull(user)) {
            api.get(`subjects/${params.subjectId}`, { headers: { Authorization: `Bearer ${user.token}` } })
                .then(subject => {
                    setDayOfWeek(getDayOfWeek(subject.data.date))
                    setStudents(subject.data.students)
                    setSubject(subject.data)
                    handleDateChange(getClosestDay(dayOfWeek))
                })
        }
    }, [user, dayOfWeek])

    useEffect(() => {
        if (isNull(subject)) {
            api.get(`/presences/${params.subjectId}/${selectedDate.format("DD.MM.YYYY")}`, { headers: { Authorization: `Bearer ${user.token}` } })
                .then(fetchedPresences => {
                    setPresences(fetchedPresences.data)
                    if (fetchedPresences.data.length === 0) {
                        let tmpPresences = []
                        subject.students.forEach(student => {
                            api.post(`/presences`, { student: student._id, subject: subject._id, date: selectedDate.format("DD.MM.YYYY"), present: false }, { headers: { Authorization: `Bearer ${user.token}` } })
                                .then(newPresence => {
                                    tmpPresences.push(newPresence.data)
                                    setPresences(tmpPresences)
                                })
                        })
                    }
                })
        }
    }, [selectedDate])

    function handlePresence(present, student) {
        const studentPresence = presences.find(presence => {
            return presence.student === student
        })

        api.put(`/presences/${studentPresence._id}`, { present }, { headers: { Authorization: `Bearer ${user.token}` } })
            .then(presence => {
                const newPresences = presences.map((p, i) => {
                    if (presence.data._id === p._id) {
                        return presence.data
                    } else return p
                })
                setPresences(newPresences)
            })
    }

    function disableDate(date) {
        return date.day() !== dayOfWeek
    }

    function getStudentPresence(student) {
        const studentPresence = presences.find(presence => {
            return presence.student === student
        })

        if (studentPresence) return studentPresence.present
        else return false
    }

    return (
        <MainTemplate>
            <h1>Obecność</h1>
            {
                dayOfWeek !== null ?
                    <DatePicker
                        label="Termin zajęć"
                        value={selectedDate}
                        onChange={handleDateChange}
                        animateYearScrolling
                        shouldDisableDate={disableDate}
                        format="DD.MM.YYYY"
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    /> : null
            }
            <Paper className={classes.root}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Imię</TableCell>
                            <TableCell>Nazwisko</TableCell>
                            <TableCell>Obecność</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student, index) => (
                            <TableRow key={student.name}>
                                <TableCell component="th" scope="student">
                                    {student.firstName}
                                </TableCell>
                                <TableCell>{student.lastName}</TableCell>
                                <TableCell>
                                    {
                                        presences.length > 0 &&
                                        <Checkbox
                                            onChange={(e) => handlePresence(e.target.checked, student._id)}
                                            checked={getStudentPresence(student._id)}
                                        />
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </MainTemplate>
    )
}

export default withRouter(Presence)