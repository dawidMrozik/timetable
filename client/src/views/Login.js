import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormTemplate from "../templates/FormTemplate";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import api from "../api";
import { UserContext } from "../contexts/UserContext";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function Login(props) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useContext(UserContext);

  function signin(e) {
    e.preventDefault();
    api
      .post("auth/login", { email, password })
      .then(res => {
        setUser(res.data);
        props.setIsAuth(true);
        document.cookie = `user=${JSON.stringify(res.data)}`;
        props.history.push("/");
      })
      .catch(err => console.log(err));
  }

  return (
    <FormTemplate>
      <Typography component="h1" variant="h5">
        Logowanie
      </Typography>
      <form className={classes.form} noValidate onSubmit={signin}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Adres email"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Hasło"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Typography onClick={() => props.history.push("/register")}>
          Nie masz jeszcze konta? Zarejestruj się tutaj
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Zaloguj
        </Button>
      </form>
    </FormTemplate>
  );
}

export default withRouter(Login);
