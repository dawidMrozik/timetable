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
import Button from '@material-ui/core/Button';
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

function SubjectList(props) {
    const classes = useStyles();
    const [subjects, setSubjects] = useState([])
    const [user, setUser] = useContext(UserContext)
    const [open, setOpen] = React.useState(false)
    const [selectedItem, setSelectedItem] = React.useState('')

    const handleClickOpen = (id) => {
        setSelectedItem(id)
        setOpen(true)
    };

    const handleClose = (id) => {
        setSubjects(subjects.filter(subject => {
            return subject._id !== id
        }))
        setOpen(false)
    };

    useEffect(() => {
        if (isNull(user)) {
            api.get(`users/${user.user._id}/subjects`, { headers: { Authorization: `Bearer ${user.token}` } })
                .then(res => setSubjects(res.data))
        }
    }, [user])

    return (
        <MainTemplate>
            <Paper className={classes.root}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Nazwa przedmiotu</StyledTableCell>
                            <StyledTableCell align="right">Termin zajęć</StyledTableCell>
                            <StyledTableCell align="right">Liczba studentów</StyledTableCell>
                            <StyledTableCell align="right">Akcje</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subjects.map(subject => (
                            <StyledTableRow hover key={subject._id}>
                                <StyledTableCell component="th" scope="subject" onClick={() => props.history.push(`/subjects/${subject._id}`)}>
                                    {subject.name}
                                </StyledTableCell>
                                <StyledTableCell align="right">{subject.date}</StyledTableCell>
                                <StyledTableCell align="right">{subject.students.length}</StyledTableCell>
                                <StyledTableCell align="right">
                                    <Button variant="contained" color="secondary" className={classes.button} onClick={() => handleClickOpen(subject._id)}>
                                        <DeleteIcon />
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <Button variant="contained" color="primary" className={classes.button} onClick={() => props.history.push('/subjects/add')}>
                Dodaj przedmiot
            </Button>
            <DangerDialog open={open} handleClose={handleClose} item="subject" itemId={selectedItem}>Czy na pewno chcesz usunąć ten przedmiot?</DangerDialog>
        </MainTemplate>
    )
}

export default withRouter(SubjectList)