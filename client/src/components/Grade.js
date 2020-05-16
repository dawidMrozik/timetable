import React, { useContext, useState } from 'react'

import GradeEditModal from './GradeEditModal'

import { makeStyles } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import Button from '@material-ui/core/Button'
import api from '../api'
import { UserContext } from '../contexts/UserContext'

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        boxShadow: '1px 1px 5px 0px rgba(0,0,0,0.75)'
    },
    edit: {
        marginLeft: theme.spacing(1),
        backgroundColor: '#ebc934',
        color: 'white',
        '&:hover': {
            backgroundColor: '#dab823'
        }
    },
    grade: {
        padding: theme.spacing(1),
        backgroundColor: '#fafafa',
        '&:hover': {
            backgroundColor: '#d9d9d9'
        },
        boxShadow: '1px 1px 5px 0px rgba(0,0,0,0.4)',
        margin: theme.spacing(1),
        cursor: 'pointer'
    }
}));

function Grade({ grade }) {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [user, setUser] = useContext(UserContext)
    const [ownGrade, setGrade] = useState(grade)
    const [openModal, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function handleClick(event) {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    function removeGrade() {
        api.delete(`/grades/${grade._id}`, { headers: { Authorization: `Bearer ${user.token}` } })
            .then(removedGrade => {
                console.log(removedGrade)
                setAnchorEl(null)
                setGrade(null)
            })
    }



    return (
        <>
            {ownGrade && (
                <>
                    <span className={classes.grade} aria-describedby={id} onClick={handleClick}>{ownGrade.grade}</span>
                    <Popper id={id} open={open} anchorEl={anchorEl}>
                        <div className={classes.paper}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={removeGrade}
                            >
                                <DeleteIcon />
                            </Button>
                            <Button
                                variant="contained"
                                className={classes.edit}
                                onClick={handleClickOpen}
                            >
                                <EditIcon />
                            </Button>
                            <p>Waga: {ownGrade.weight}</p>
                            <p>Opis: {ownGrade.type}</p>
                        </div>
                    </Popper>
                    <GradeEditModal open={openModal} grade={ownGrade} handleClose={handleClose} setOwnGrade={setGrade} />
                </>
            )}
        </>
    )
}

export default Grade