import { Component } from 'react';
import Header from '../components/header.js';
import firebase from '../firestore';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import isAdmin from '../functions/isAdmin';

class Money extends Component {
    constructor(props) {
        super(props);
        this.state = {
            states: [],
            loading: true,
            initial: "",
            final: "",
            note: "",
            moneyBox: [],
            money: "",
            movement: "",
            noteBox: "",
            auth: "",
            timeOfDay: "Odpoledne / Večer"
        }
    }

    componentDidMount = async () => {
        const db = firebase.firestore();
        var d = new Date();
        d.setHours(23, 59, 59, 999);
        var miliMidnight = d.getTime();

        let states = [];
        let initial = "";
        await db.collection("state")
            .get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let obj = {
                        final: doc.data().final,
                        initial: doc.data().initial,
                        note: doc.data().note,
                        time: doc.data().time,
                        timeOfDay: doc.data().timeOfDay
                    }
                    states.push(obj);
                    //console.log(`${doc.id} => ${doc.data()}`);
                    if(miliMidnight == obj.time) {
                        initial = obj.initial;
                    }
                });
            });
            states.reverse();
        let moneyBox = [];
        await db.collection("moneyBox")
            .get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let obj = {
                        money: doc.data().money,
                        movement: doc.data().movement,
                        noteBox: doc.data().noteBox,
                        time: doc.data().time
                    }
                    moneyBox.push(obj);
                    //console.log(`${doc.id} => ${doc.data()}`);
                });
            });
            moneyBox.reverse();
        this.setState({ states: states, moneyBox: moneyBox,initial: initial, auth: await isAdmin(), loading: false});
    }

    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submitState = async (a, b, c, type) => {
        const db = firebase.firestore();
        let d = new Date();
        d.setHours(23, 59, 59, 999);
        var miliMidnight = d.getTime();

        const item = {
            time: miliMidnight
        }
        item[a] = this.state[a];
        item[b] = this.state[b];
        item[c] = this.state[c];
        item.timeOfDay = this.state.timeOfDay;

        let itemID;
        if(item.timeOfDay == "vecer") {
            itemID = miliMidnight.toString() + "v";
        } else {
            itemID = miliMidnight.toString() + "o";
        }

        await db.collection(type).doc(itemID).set(item)
            .then(function () {
                console.log("Document written");
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
        const states = Object.assign([], this.state.states);
        const moneyBox = Object.assign([], this.state.moneyBox);

        if(states[0].time != item.time || states[0].timeOfDay != item.timeOfDay) {
            if(type == "state") {
                states.unshift(item);
            } else {
                moneyBox.unshift(item);
            }
        } else {
            states[0].final = item.final;
            states[0].note = item.note;
        }

        this.setState({
            states: states,
            moneyBox: moneyBox,
        });

    }

    render() {
        const loading = this.state.loading;

        return(
            <Grid container>
                <Header />
                <Grid item md={6}>
                    <Paper style={{ marginLeft: 10, marginRight: 10, padding: 10, height: '100%' }}>
                        <Typography variant="h4" style={{ margin: 10, color: '#000' }}>
                            Pokladnička
                        </Typography>
                        <Grid
                            container
                            spacing={2}
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                            style={{margin: 10}}
                        >
                            <Grid item md={2}>
                                <TextField
                                    name="initial"
                                    label="Initial"
                                    onChange={this.updateInput}
                                    value={this.state.initial}
                                />
                            </Grid>
                            <Grid item md={2}>
                                <TextField
                                    name="final"
                                    label="Final"
                                    onChange={this.updateInput}
                                    value={this.state.final}
                                />
                            </Grid>
                            <Grid item md={3}>
                                <Select
                                    name="timeOfDay"
                                    value={this.state.timeOfDay}
                                    onChange={this.updateInput}
                                    style={{width: 188, height: 48}}
                                >
                                    <MenuItem value={"odpoledne"}>Odpolední</MenuItem>
                                    <MenuItem value={"vecer"}>Večerní</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item md={3}>
                                <TextField
                                    name="note"
                                    label="Služba"
                                    multiline
                                    onChange={this.updateInput}
                                    value={this.state.note}
                                />
                            </Grid>
                            <Grid item md={2}>
                                <Button variant="contained" onClick={this.submitState.bind(this, "initial", "final", "note", "state")} style={{ marginTop: 10, marginRight: 10 }} >Submit</Button>
                            </Grid>
                        </Grid>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Čas Kavárny</TableCell>
                                    <TableCell>Initial</TableCell>
                                    <TableCell>Final</TableCell>
                                    <TableCell>Služba</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell>LOADING</TableCell></TableRow>
                                ) : (
                                        this.state.states &&
                                        this.state.states.map((doc, i) => {
                                            return (
                                                <TableRow key={i}>
                                                    <TableCell>{new Date(doc.time).toString().slice(0, 15)}</TableCell>
                                                    <TableCell>{doc.timeOfDay} </TableCell>
                                                    <TableCell>{doc.initial} Kč</TableCell>
                                                    <TableCell>{doc.final} Kč</TableCell>
                                                    <TableCell>{doc.note}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        )};
}
export default Money

/*{this.state.auth && 
                <Grid item md={6}>
                    <Paper style={{ marginLeft: 10, marginRight: 10, padding: 10, height: '100%' }}>
                        <Typography variant="h4" style={{ margin: 10, color: '#000' }}>
                            Money Box
                        </Typography>
                        <Grid
                            container
                            spacing={8}
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                            style={{ margin: 10 }}
                        >
                            <Grid item md={3}>
                                <TextField
                                    name="money"
                                    label="Money"
                                    onChange={this.updateInput}
                                    value={this.state.money}
                                />
                            </Grid>
                            <Grid item md={3}>
                                <TextField
                                    name="movement"
                                    label="Money movement"
                                    onChange={this.updateInput}
                                    value={this.state.movement}
                                />
                            </Grid>
                            <Grid item md={3}>
                                <TextField
                                    name="noteBox"
                                    label="Notes"
                                    multiline
                                    onChange={this.updateInput}
                                    value={this.state.noteBox}
                                />
                            </Grid>
                            <Grid item md={3}>
                                <Button onClick={this.submitState.bind(this, "money", "movement", "noteBox", "moneyBox")} style={{ marginTop: 10, marginRight: 10 }} >Submit</Button>
                            </Grid>
                        </Grid>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Money status</TableCell>
                                    <TableCell>Money movement</TableCell>
                                    <TableCell>Note</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell>LOADING</TableCell></TableRow>
                                ) : (
                                        this.state.moneyBox &&
                                        this.state.moneyBox.map((doc, i) => {
                                            return (
                                                <TableRow key={i}>
                                                    <TableCell>{new Date(doc.time).toString().slice(0, 15)}</TableCell>
                                                    <TableCell>{doc.money} Kč</TableCell>
                                                    <TableCell>{doc.movement} Kč</TableCell>
                                                    <TableCell>{doc.noteBox}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                }*/
