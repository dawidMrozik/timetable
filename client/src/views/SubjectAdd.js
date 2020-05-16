import React, { useState, useContext } from 'react'
import api from '../api'
import { UserContext } from '../contexts/UserContext'
import FormTemplate from '../templates/FormTemplate'
import { withRouter } from 'react-router-dom'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { TimePicker } from "@material-ui/pickers"
import moment from 'moment'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'

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

function SubjectAdd(props) {
    const [name, setName] = useState('')
    const [day, setDay] = useState('Poniedziałek')
    const [time, setTime] = useState(moment())
    const [user, setUser] = useContext(UserContext)
    const classes = useStyles()

    function addSubject(e) {
        e.preventDefault()

        const subjectDate = `${day}, ${time.format("HH:mm")}`

        api.post('subjects', { name, date: subjectDate }, { headers: { Authorization: `Bearer ${user.token}` } })
            .then(addedSubject => {
                props.history.push('/subjects')
            })
            .catch(err => console.log(err))
    }

    return (
        <FormTemplate>
            <form className={classes.form} noValidate onSubmit={addSubject}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Nazwa przedmiotu"
                            name="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel id="day">Dzień</InputLabel>
                        <Select
                            labelId="day"
                            id="day-select"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                        >
                            <MenuItem value="Poniedziałek">Poniedziałek</MenuItem>
                            <MenuItem value="Wtorek">Wtorek</MenuItem>
                            <MenuItem value="Środa">Środa</MenuItem>
                            <MenuItem value="Czwartek">Czwartek</MenuItem>
                            <MenuItem value="Piątek">Piątek</MenuItem>
                            <MenuItem value="Sobota">Sobota</MenuItem>
                            <MenuItem value="Niedziela">Niedziela</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TimePicker
                            clearable
                            ampm={false}
                            label="Godzina zajęć"
                            value={time}
                            onChange={setTime}
                        />
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Dodaj przedmiot
                    </Button>
                </Grid>
            </form>
        </FormTemplate>
    )
}

export default withRouter(SubjectAdd)