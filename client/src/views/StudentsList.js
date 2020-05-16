import React, { useState, useEffect, useContext } from 'react'
import api from '../api'
import { isNull } from '../helpers'
import { UserContext } from '../contexts/UserContext'
import MainTemplate from '../templates/MainTemplate'
import { withRouter } from 'react-router-dom'
import DangerDialog from '../components/DangerDialog'

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'


const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

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

function StudentsList(props) {
    const classes = useStyles();
    const [students, setStudents] = useState([])
    const [user, setUser] = useContext(UserContext)
    const { match: { params } } = props
    const [open, setOpen] = React.useState(false)
    const [selectedItem, setSelectedItem] = React.useState('')

    const handleClickOpen = (id) => {
        setSelectedItem(id)
        setOpen(true)
    };

    const handleClose = (id) => {
        setStudents(students.filter(student => {
            return student._id !== id
        }))
        setOpen(false)
    };

    useEffect(() => {
        if (isNull(user)) {
            api.get('students', { headers: { Authorization: `Bearer ${user.token}` } })
                .then(res => setStudents(res.data))
        }
    }, [user])

    function attachStudent(studentId) {
        api.put(`subjects/${params.subjectId}/attachStudent`, { studentId }, { headers: { Authorization: `Bearer ${user.token}` } })
            .then(attachedStudent => {
                props.history.push(`/subjects/${params.subjectId}`)
            })
    }

    return (
        <MainTemplate>
            <Paper className={classes.root}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Imię</StyledTableCell>
                            <StyledTableCell>Nazwisko</StyledTableCell>
                            {props.attach ? <StyledTableCell align="right">Dołącz</StyledTableCell> : <StyledTableCell align="right">Akcje</StyledTableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map(student => (
                            <StyledTableRow hover key={student._id}>
                                <StyledTableCell component="th" scope="subject" onClick={() => props.history.push(`/students`)}>
                                    {student.firstName}
                                </StyledTableCell>
                                <StyledTableCell onClick={() => props.history.push(`/students`)}>{student.lastName}</StyledTableCell>
                                {props.attach ? <StyledTableCell align="right">
                                    <Button variant="contained" color="secondary" className={classes.button} onClick={() => attachStudent(student._id)}>
                                        +
                                    </Button>
                                </StyledTableCell> :
                                    <StyledTableCell align="right">
                                        <Button variant="contained" color="secondary" className={classes.button} onClick={() => handleClickOpen(student._id)}>
                                            <DeleteIcon />
                                        </Button>
                                    </StyledTableCell>}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <Button variant="contained" color="primary" className={classes.button} onClick={() => props.history.push('/students/add')}>
                Dodaj ucznia
            </Button>
            <DangerDialog open={open} handleClose={handleClose} item="student" itemId={selectedItem}>Czy na pewno chcesz usunąć ten przedmiot?</DangerDialog>
        </MainTemplate>
    )
}

export default withRouter(StudentsList)