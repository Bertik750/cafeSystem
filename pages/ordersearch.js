import { Component } from 'react';
import Header from '../components/header.js';
import firebase from '../firestore';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import Typography from '@material-ui/core/Typography';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

class OrderSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: "",
            loading: true,
            query: false,
            revenue: 0,
            revenueAfternoon: 0,
            revenueEvening: 0,
            selectedDate: new Date(),
        }
    }

    componentDidMount = async () => {
        var d = new Date();
        var dd = new Date();
        d.setHours(23, 59, 59);
        d.setDate(d.getDate()-1);
        dd.setHours(23,59,59);

        const db = firebase.firestore();
        let query = [];
        let revenue = 0;
        let revenueAfternoon = 0;
        let revenueEvening = 0;
        await db.collection("orders").orderBy("timestamp", "desc").where("timestamp", ">=", d).where("timestamp", "<=", dd)
            .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let ddata = doc.data();
                let obj = {
                    id: doc.id,
                    data: ddata
                }
                revenue += ddata.price;
                query.push(obj);

                var d = new Date();
                d.setHours(18, 0, 0, 999);
                var mili6 = d.getTime();

                if(ddata.date.toMillis() < mili6) {
                    revenueAfternoon += ddata.price;
                } else {
                    revenueEvening += ddata.price;
                }
            });
        });
        this.setState({ query: query, revenue: revenue, revenueAfternoon: revenueAfternoon, revenueEvening: revenueEvening,loading: false });
    }

    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
            this.search();
        }
    }

    search = async () => {
        this.setState({ loading: true })
        const db = firebase.firestore();
        var orderRef = db.collection("orders");
        if (this.state.filter != " " && this.state.filter != undefined) {
            let query = [];
            let revenue = 0;
            await orderRef.where("customer", "==", this.state.filter.toLowerCase())
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        let obj = {
                            id: doc.id,
                            data: doc.data()
                        }
                        revenue += doc.data().price;
                        query.push(obj);
                    });
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
            this.setState({
                revenue: revenue,
                query: query,
                loading: false
            });
            }
    }

    handleDateChange = async (date) => {
        var d = new Date(date);
        var dd = new Date(date);
        d.setHours(23, 59, 59);
        d.setDate(d.getDate()-1);
        dd.setHours(23,59,59);

        const db = firebase.firestore();
        let query = [];
        let revenue = 0;
        let revenueAfternoon = 0;
        let revenueEvening = 0;
        await db.collection("orders").orderBy("timestamp", "desc").where('timestamp', ">=", d).where('timestamp', "<=", dd)
            .get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let data = doc.data();
                    let obj = {
                        id: doc.id,
                        data: data
                    }
                    dd.setHours(18, 0, 0, 999);
                    var mili6 = dd.getTime();
                    var dateTime = data.date.seconds * 1000;

                    if(dateTime < mili6) {
                        revenueAfternoon += data.price;
                    } else {
                        revenueEvening += data.price;
                    }
                    revenue += data.price;
                    query.push(obj);
                });
                this.setState({selectedDate: date, revenueAfternoon: revenueAfternoon, revenueEvening: revenueEvening, query: query, revenue: revenue, loading: false });
            });
    };

    delEvent(doc) {
        const id = doc.id;
        const db = firebase.firestore();
        db.collection("orders").doc(id).delete().then(function () {
            console.log("Document successfully deleted!");
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });
        const products = doc.data.products;
        for(var i in products) {
            updateRef(products[i].cartQuant);
            function updateRef(cartQuant) {
                let dbref = db.collection("products").doc(products[i].id);
                dbref.get().then(function(thisDoc) {
                    let productQuantity = Number(thisDoc.data().quantity);
                    let newQuantity = productQuantity + Number(cartQuant);
                    dbref.update({quantity: newQuantity});
                });
            }
        }

        const orders = Object.assign([], this.state.query);
        const updatedOrders = orders.filter((x) => x.id != id);
        this.setState({ query: updatedOrders })

    }

    render() {
        const loading = this.state.loading;
        return(
            <Grid container>
                <Header />
                <Grid item md={12}>
                    <Paper style={{marginLeft: 10, marginRight: 10, padding: 10, height: '100%' }}>
                        <Grid container direction="row" justify="space-between" alignItems="flex-start">
                            <Grid item md={5}>
                                <TextField
                                    style={{ marginTop: 15 }}
                                    name="filter"
                                    label="Search By Name"
                                    onChange={this.updateInput}
                                    value={this.state.filter}
                                    onKeyPress={this.enterPressed}
                                />
                                <Button color="primary" style={{marginTop: 20}} onClick={this.search}>search</Button>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DatePicker
                                        style={{ marginLeft: 20 }}
                                        margin="normal"
                                        label="Date picker"
                                        value={this.state.selectedDate}
                                        onChange={this.handleDateChange}
                                />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                         
                        <br />
                        <Typography textalign="left" style={{fontSize: 18}}>
                          <b>Revenue: {this.state.revenue} Kč</b><br />
                          <b>Afternoon Revenue: {this.state.revenueAfternoon} Kč</b><br />
                          <b>Evening Revenue: {this.state.revenueEvening} Kč</b>
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#ID</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Products</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell>LOADING</TableCell></TableRow>
                                ) : (
                                        this.state.query &&
                                        this.state.query.map((doc) => {
                                            return (
                                                <TableRow key={doc.id}>
                                                    <TableCell>{doc.id}</TableCell>
                                                    <TableCell>{doc.data.customer}</TableCell>
                                                    <TableCell>{doc.data.products.map((item, i) => {
                                                        return(<p key={i}>{item.cartQuant}x {item.name}</p>)
                                                    })
                                                    }</TableCell>
                                                    <TableCell>{doc.data.date.toDate().toString()}</TableCell>
                                                    <TableCell>{doc.data.price} Kč</TableCell>
                                                    <TableCell><Button style={{color: "red"}} onClick={this.delEvent.bind(this, doc)} >Delete</Button></TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}
export default OrderSearch