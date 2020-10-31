import { Component } from 'react';
import Link from 'next/link'
import Router from 'next/router'
import firebase from '../firestore';

import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import LoggedIn from '../functions/loggedIn';

const linkStyle = {
    color: '#fff'
}

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: undefined
        };
    }
    componentDidMount = async () => {
        if(await LoggedIn()) {
            this.setState({ loggedIn: true })
        } else {
            this.setState({ loggedIn: false })
        }
    }

    logOut = () => {
        firebase.auth().signOut().then(function () {
            console.log("signed out");
            Router.push('/login');
        }, function (error) {
            console.log(error);
        });
    }

    render() {
        return (<div style={{ width: "100%", marginBottom: 5 }}>
            <AppBar position="static">
                <Toolbar style={{ marginTop: 10 }}>
                    <Grid
                        justify="space-between"
                        container
                        spacing={10}
                    >
                        <Grid item>
                            <Grid container>
                                <Grid item>
                                    <Typography variant="h4" style={{ marginRight: 25, color: '#fff' }}>
                                        OG Cafe
                                    </Typography>
                                </Grid>
                                {this.state.loggedIn == true &&
                                    <Grid item>
                                        <Link href="/">
                                            <Button style={linkStyle}>Home</Button>
                                        </Link>
                                        <Link href="/ordersearch">
                                            <Button style={linkStyle}>Order Search</Button>
                                        </Link>
                                        <Link href="/editcustomers">
                                            <Button style={linkStyle}>Edit Customers</Button>
                                        </Link>
                                        <Link href="/editproducts">
                                            <Button style={linkStyle}>Edit Products</Button>
                                        </Link>
                                        <Link href="/money">
                                            <Button style={linkStyle}>Money Management</Button>
                                        </Link>
                                    </Grid>
                                }
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container>
                                <Grid item>
                                    <div style={{marginRight: 20}}>
                                        <p style={{margin: 0}}>By: Bertram</p>
                                        <p style={{margin: 0}}>V 0.1.4</p>
                                    </div>
                                </Grid>
                                <Grid item>
                                    {this.state.loggedIn == true &&
                                        <Button variant="outlined" color="secondary" onClick={this.logOut} >Logout</Button>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
        )
    }
}
    
/*                <Link href="/">
                            <Button style={linkStyle}>Home</Button>
                        </Link>
                        <Link href="/ordersearch">
                            <Button style={linkStyle}>Order Search</Button>
                        </Link>
                        <Link href="/editcustomers">
                            <Button style={linkStyle}>Edit Customers</Button>
                        </Link>
                        <Link href="/editproducts">
                            <Button style={linkStyle}>Edit Products</Button>
                        </Link>
                        <Link href="/money">
                            <Button style={linkStyle}>Money Management</Button>
                        </Link>*/

export default Header