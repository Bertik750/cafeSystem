import React, { Component } from 'react'
import firebase from "../firestore"
import Header from '../components/header.js'
import Form from '../components/customers/customersForm'
import ListBlock from '../components/customers/listBlock'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


class EditCustomers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: []
        };
        this.addE = this.addE.bind(this);
        this.editE = this.editE.bind(this);
    }

    componentDidMount() {
        const db = firebase.firestore();
        db.collection("customers").get().then((querySnapshot) => {
            var data = [];
            querySnapshot.forEach((doc) => {
                let dat = doc.data();
                var customer = {
                    id: doc.id,
                    name: dat.name,
                    class: dat.class
                };
                data.push(customer);
                //console.log(`${doc.id} => ${doc.data()}`);
            });
            this.setState({ customers: data });
        });
    }

    addE(item) {
        const customers = Object.assign([], this.state.customers);
        customers.push(item);

        this.setState({
            customers: customers
        });
    }

    editE(item) {
        const db = firebase.firestore();
        db.collection("customers").doc(item.id).set({
            name: item.name,
            class: item.class
        })
        .then(function () {
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
        const customers = Object.assign([], this.state.customers);
        for (var i in customers) {
            var obj = customers[i];
            if (obj.id == item.id) {
                obj.name = item.name;
                obj.class = item.class
                break;
            }
        }
        this.setState({ customers: customers })
    }

    delEvent(i, id) {
        const db = firebase.firestore();
        db.collection("customers").doc(id).delete().then(function () {
            console.log("Document successfully deleted!");
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });

        const customers = Object.assign([], this.state.customers);
        const newCustomers = customers.filter((x) => x.id !== id);
        this.setState({ customers: newCustomers })

    }

    render() {
        return (
            <Grid container>
                <Header />
                <Grid item xs={12}>
                    <Paper style={{marginLeft: 10, marginRight: 10, padding: 10, height: 80 }}>
                        <Form addE={this.addE} />
                    </Paper>
                    <Paper style={{ margin: 10, padding: 15 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Class</TableCell>
                                    <TableCell>Edit</TableCell>
                                    <TableCell>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.customers.map((item, i) => {
                                    return <ListBlock key={item.id} id={item.id} name={item.name} class={item.class} delEvent={this.delEvent.bind(this, i, item.id)} editE={this.editE} />
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

export default EditCustomers