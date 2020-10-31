import React, { Component } from 'react'
import firebase from "../firestore"
import Header from '../components/header.js'
import Form from '../components/products/productsForm'
import ListBlock from '../components/products/listBlock'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class EditProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        };
        this.addE = this.addE.bind(this);
        this.editE = this.editE.bind(this);
    }

    componentDidMount() {
        const db = firebase.firestore();
        db.collection("products").get().then((querySnapshot) => {
            var data = [];
            querySnapshot.forEach((doc) => {
                let dat = doc.data();
                var product = {
                    id: doc.id,
                    name: dat.name,
                    quantity: dat.quantity,
                    category: dat.category,
                    price: dat.price,      
                };
                data.push(product);
                //console.log(`${doc.id} => ${doc.data()}`);
            });
            this.setState({ products: data });
        });
    }

    addE(item) {
        const products = Object.assign([], this.state.products);
        products.push(item);

        this.setState({
            products: products
        });
    }

    editE(item) {
        const db = firebase.firestore();
        db.collection("products").doc(item.id).set({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            category: item.category
        })
        .then(function () {
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
        const products = Object.assign([], this.state.products);
        for (var i in products) {
            var obj = products[i];
            if (obj.id == item.id) {
                obj.name = item.name;
                obj.quantity = item.quantity;
                obj.price = item.price;
                obj.category = item.category;
                break;
            }
        }
        this.setState({ products: products })
    }

    delEvent(id) {
        const db = firebase.firestore();
        db.collection("products").doc(id).delete().then(function () {
            console.log("Document successfully deleted!");
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });

        const products = Object.assign([], this.state.products);
        const newProducts = products.filter((x) => x.id !== id);
        this.setState({ products: newProducts })

    }

    render() {
        var categories = [];
        return (
            <Grid container>
                <Header />
                <Grid item md={12}>
                    <Paper style={{marginLeft: 10, marginRight: 10, padding: 10, height: 80}}>
                        <Form addE={this.addE} />
                    </Paper>
                    <Paper style={{ margin: 10, padding: 15}}>
                        {this.state.products.map((item, i) => {
                            if(categories.indexOf(item.category) < 0) {
                                categories.push(item.category)
                                return(
                                    <ExpansionPanel key={i}>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography>{item.category}</Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Name</TableCell>
                                                        <TableCell>Quantity</TableCell>
                                                        <TableCell>Price - Kč</TableCell>
                                                        <TableCell>Category</TableCell>
                                                        <TableCell>Edit</TableCell>
                                                        <TableCell>Delete</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.products.map((product, k) => {
                                                        if (item.category == product.category) {
                                                            return <ListBlock key={product.id} id={product.id} name={product.name} quantity={product.quantity} price={product.price} category={product.category} delEvent={this.delEvent.bind(this, product.id, i)} editE={this.editE} />
                                                        }
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                )
                            }
                        })}
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

export default EditProducts