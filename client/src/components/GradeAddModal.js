import React, { useState, useContext } from 'react'
import api from '../api'
import { UserContext } from '../contexts/UserContext'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

function GradeAddModal(props) {
    const [grade, setGrade] = useState('')
    const [weight, setWeight] = useState('')
    const [type, setType] = useState('')
    const [user, setUser] = useContext(UserContext)

    function addGrade() {
        api.post(`/grades`, { grade, weight, type, student: props.subject.students[props.student]._id, subject: props.subject._id },
            { headers: { Authorization: `Bearer ${user.token}` } })
            .then(newGrade => {
                const newSubject = props.subject
                newSubject.students[props.student].grades.push(newGrade.data)
                props.setSubject(newSubject)
                props.handleClose()
            })
    }

    return <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Wstaw ocenę</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="grade"
                label="Ocena"
                type="text"
                fullWidth
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
            />
            <TextField
                autoFocus
                margin="dense"
                id="weight"
                label="Waga"
                type="text"
                fullWidth
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
            />
            <TextField
                autoFocus
                margin="dense"
                id="type"
                label="Opis"
                type="text"
                fullWidth
                value={type}
                onChange={(e) => setType(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.handleClose} color="primary">
                Anuluj
            </Button>
            <Button onClick={addGrade} color="primary">
                Dodaj
            </Button>
        </DialogActions>
    </Dialog>
}

export default GradeAddModal