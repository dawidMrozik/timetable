import React, { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button'
import api from '../api';

function DangerDialog(props) {
    const [user, setUser] = useContext(UserContext)

    function deleteItem() {
        switch (props.item) {
            case 'subject': {
                api.delete(`subjects/${props.itemId}`, { headers: { Authorization: `Bearer ${user.token}` } })
                    .then((subject) => props.handleClose(subject.data._id))
                break
            }
            case 'student': {
                api.delete(`students/${props.itemId}`, { headers: { Authorization: `Bearer ${user.token}` } })
                    .then((student) => props.handleClose(student.data._id))
                break
            }
            case 'deattach': {
                api.put(`subjects/${props.itemId}/deattachStudent/${props.studentId}`, {}, { headers: { Authorization: `Bearer ${user.token}` } })
                    .then((student) => props.handleClose(student.data))
                break
            }
        }
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{props.children}</DialogTitle>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Anuluj
            </Button>
                <Button onClick={deleteItem} color="secondary" autoFocus>
                    Usuń
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DangerDialog