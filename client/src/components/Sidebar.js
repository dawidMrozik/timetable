import React, { useContext } from 'react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { UserContext } from '../contexts/UserContext'
import { deleteCookie } from '../helpers'
import { withRouter } from 'react-router-dom'

export const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar
}));

function Sidebar(props) {
    const classes = useStyles();
    const [user, setUser] = useContext(UserContext)

    function renderUsername() {
        if (Object.keys(user).length > 0) {
            return user.user.firstName + ' ' + user.user.lastName
        } else {
            return null
        }
    }

    function logout() {
        deleteCookie('user')
        setUser({})
        props.history.push('/login')
    }

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="left"
        >
            <List>
                <ListItem>
                    <ListItemText primary={renderUsername()} />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button onClick={() => props.history.push('/subjects')}>
                    <ListItemText primary="Przedmioty" />
                </ListItem>
                <ListItem button onClick={() => props.history.push('/students')} >
                    <ListItemText primary="Uczniowie" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button onClick={logout}>
                    <ListItemText primary='Wyloguj się' />
                </ListItem>
            </List>
        </Drawer>
    )
}

export default withRouter(Sidebar);