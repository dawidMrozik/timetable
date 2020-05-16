import React from 'react'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import Sidebar from '../components/Sidebar'
import { drawerWidth } from '../components/Sidebar'

const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
}))

function MainTemplate({ children }) {
    const classes = useStyles()

    return (
        <>
            <CssBaseline />
            <Sidebar />
            <main className={classes.content}>
                {children}
            </main>
        </>
    )
}

export default MainTemplate
