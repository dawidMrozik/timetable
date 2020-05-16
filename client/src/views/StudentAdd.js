import React, { useState, useContext } from 'react'
import api from '../api'
import { UserContext } from '../contexts/UserContext'
import FormTemplate from '../templates/FormTemplate'
import { withRouter } from 'react-router-dom'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}))

function StudentAdd(props) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [user, setUser] = useContext(UserContext)
    const classes = useStyles()

    function addStudent(e) {
        e.preventDefault()

        api.post('students', { firstName, lastName }, { headers: { Authorization: `Bearer ${user.token}` } })
            .then(addedSubject => {
                props.history.push('/students')
            })
            .catch(err => console.log(err))
    }

    return (
        <FormTemplate>
            <form className={classes.form} noValidate onSubmit={addStudent}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Imię ucznia"
                    name="name"
                    autoFocus
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="lastName"
                    label="Nazwisko ucznia"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Dodaj ucznia
        </Button>
            </form>
        </FormTemplate>
    )
}

export default withRouter(StudentAdd)