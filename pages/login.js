import { Component } from 'react';
import Header from '../components/header.js';
import firebase from '../firestore';
import Router from 'next/router'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            pass: "",

        }
    }

    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    login = async() => {
        const db = firebase;
        db.auth().signInWithEmailAndPassword(this.state.user + "@admin.com", this.state.pass)
        .then(function() {
            console.log("success");
            Router.push('/');
        })
        .catch(function (error) {
            console.log(error.code, error.message)
        });

    }

    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
            this.login();
        }
    }

    render() {
        return(
            <Grid container>
                <Header />
                <Paper style={{marginLeft: 10, marginRight: 10, padding: 10, height: '100%' }}>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        style={{ margin: 10 }}
                    >
                        <Grid item md={5}>
                            <TextField
                                name="user"
                                label="username"
                                onChange={this.updateInput}
                                value={this.state.user}
                            />
                        </Grid>
                        <Grid item md={5}>
                            <TextField
                                name="pass"
                                label="password"
                                type="password"
                                onChange={this.updateInput}
                                value={this.state.pass}
                                onKeyPress={this.enterPressed}
                            />
                        </Grid>
                        <Grid item md={2}>
                            <Button onClick={this.login} style={{ marginTop: 10, marginRight: 10 }}>Login</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        )
    }
}

export default Login