import React, { useState, useEffect, useContext } from 'react'
import api from '../api'
import { isNull } from '../helpers'
import { UserContext } from '../contexts/UserContext'
import MainTemplate from '../templates/MainTemplate'
import { withRouter } from 'react-router-dom'
import Grade from '../components/Grade'
import DangerDialog from '../components/DangerDialog'

import Button from '@material-ui/core/Button'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import AddIcon from '@material-ui/icons/Add'
import GradeAddModal from '../components/GradeAddModal'
import DeleteIcon from '@material-ui/icons/Delete'

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

function SubjectItem(props) {
    const [subject, setSubject] = useState([])
    const [user, setUser] = useContext(UserContext)
    const { match: { params } } = props
    const classes = useStyles()
    const [openModal, setOpen] = React.useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [openDeattach, setDeattachOpen] = React.useState(false)
    const [selectedItem, setSelectedItem] = React.useState('')

    const handleDeaatachClickOpen = (id) => {
        setSelectedStudent(id)
        setDeattachOpen(true)
    };

    const handleDeattachClose = (id) => {
        const newStudents = subject.students.filter(student => {
            return student._id !== id
        })

        let tmp = subject
        tmp.students = newStudents

        setSubject(tmp)

        setDeattachOpen(false)
    };

    function handleClickOpen(student) {
        setSelectedStudent(student)
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function navToPresence() {
        props.history.push(`/subjects/${subject._id}/presence`)
    }

    function calcAvg(subjectId, studentId) {
        api.get(`students/${studentId}/${subjectId}/avg`, { headers: { Authorization: `Bearer ${user.token}` } })
            .then(avg => alert(avg.data))
    }

    useEffect(() => {
        if (isNull(user)) {
            api.get(`subjects/${params.subjectId}`, { headers: { Authorization: `Bearer ${user.token}` } })
                .then(res => setSubject(res.data))
        }
    }, [user])

    return (
        <MainTemplate>
            {
                isNull(subject) ? <>
                    <h1>{subject.name}</h1>
                    <Button variant="contained" color="primary" onClick={navToPresence}>Sprawdź obecność</Button>
                    {subject.students.length === 0 ?
                        <h2>Brak studentów na tym kursie</h2> :
                        <>
                            <h2>Studenci</h2>
                            <Paper className={classes.root}>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Imię</TableCell>
                                            <TableCell>Nazwisko</TableCell>
                                            <TableCell>Oceny</TableCell>
                                            <TableCell>Wstaw ocenę</TableCell>
                                            <TableCell>Średnia</TableCell>
                                            <TableCell>Usuń ucznia z przedmiotu</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {subject.students.map((student, index) => (
                                            <TableRow key={student.name}>
                                                <TableCell component="th" scope="student">
                                                    {student.firstName}
                                                </TableCell>
                                                <TableCell>{student.lastName}</TableCell>
                                                <TableCell>
                                                    {student.grades.map((grade) => {
                                                        if (grade.subject === subject._id) {
                                                            return <Grade grade={grade} />
                                                        }
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        className={classes.add}
                                                        onClick={() => handleClickOpen(index)}
                                                    >
                                                        <AddIcon />
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        className={classes.button}
                                                        onClick={() => calcAvg(subject._id, student._id)}
                                                    >
                                                        Policz
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="contained" color="secondary" className={classes.button} onClick={() => handleDeaatachClickOpen(student._id)}>
                                                        <DeleteIcon />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </>
                    }
                    <Button variant="contained" color="primary" className={classes.button} onClick={() => props.history.push(`/subjects/${params.subjectId}/attachStudent`)}>
                        Dołącz ucznia do kursu
                    </Button>
                    <GradeAddModal open={openModal} handleClose={handleClose} subject={subject} setSubject={setSubject} student={selectedStudent} />
                    <DangerDialog open={openDeattach} handleClose={handleDeattachClose} item="deattach" itemId={subject._id} studentId={selectedStudent}>Czy na pewno chcesz tego ucznia z przedmiotu?</DangerDialog>
                </> : null
            }
        </MainTemplate>
    )
}

export default withRouter(SubjectItem)