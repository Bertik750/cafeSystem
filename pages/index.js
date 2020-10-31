import { Component } from 'react';
import Header from '../components/header';
import OrderBlock from '../components/orderBlock'
import firebase from '../firestore';
import app from 'firebase/app';
import Select from 'react-select';
import NoSsr from '@material-ui/core/NoSsr';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import MSelect from '@material-ui/core/Select';
import Back from '@material-ui/icons/ArrowBack';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredProducts: [],
      filter: "",
      categoryFilter: "All",
      order: {
        products: [],
        date: null,
        price: 0,
      },
      selectedOption: null,
      loading: true,
      orderLoading: false,
      customers: [],
      products: []
    };
  }

  componentDidMount = () => {
    const db = firebase.firestore();
    db.collection("products").get().then((querySnapshot) => {
      let data = [];
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
        console.log(`${doc.id} => ${doc.data()}`);
      });
      this.setState({ products: data, filteredProducts: data, loading: false });
    });
    db.collection("customers").get().then((querySnapshot) => {
      let data = [];
      querySnapshot.forEach((doc) => {
        let dat = doc.data();
        var customer = {
          id: doc.id,
          name: dat.name,
          class: dat.class,
          value: dat.name,
          label: dat.name
        };
        data.push(customer);
        console.log(`${doc.id} => ${doc.data()}`);
      });
      this.setState({ customers: data})
    });
  }

  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    let products = Object.assign([], this.state.products);
    let updatedProducts = products.filter((item) => {
      return item.name.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1;
    });
    this.setState({ filteredProducts: updatedProducts });
  }

  changeCategory = (category) => {
    this.setState({
      categoryFilter: category
    });
    let products = Object.assign([], this.state.products);
    let updatedProducts = products.filter((item) => {
      return item.category.toLowerCase().search(
        category.toLowerCase()) !== -1;
    });
    this.setState({ filteredProducts: updatedProducts });
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    //console.log(`Option selected:`, selectedOption);
  }

  addToOrder = (item) => {
    let order = Object.assign({}, this.state.order);
    var test = 0;
    for (var i in order.products) {
      const oProduct = order.products[i];
      if (oProduct.id == item.id && oProduct.cartQuant != undefined) {
        oProduct.cartQuant += 1
        test = 1
      }
    }
    if (order.products.length < 1 || test === 0) {
      item.cartQuant = 1;
      order.products.push(item);
    }
    order.price += Number(item.price);
    this.setState({ order: order, filter: "" })
  }

  delFromOrder = (item) => {
    let order = Object.assign({}, this.state.order);
    for (var i in order.products) {
      const oProduct = order.products[i];
      if (oProduct.id == item.id && oProduct.cartQuant > 1) { order.products[i].cartQuant -= 1 }
      else if (oProduct.id == item.id && oProduct.cartQuant == 1) {
        order.products.splice(i, 1)
      }
    }
    order.price -= Number(item.price);
    this.setState({ order: order })
  }

  finishOrder = async (e) => {
    e.preventDefault();
    if (!this.state.loading && !this.state.orderLoading) {
      this.setState({ orderLoading: true });
      const db = firebase.firestore();
      var highNum = await db.collection("orders").orderBy("timestamp", "desc").limit(1).get()
        .then(function (querySnapshot) {
          var arr = [];
          querySnapshot.forEach(function (doc) {
            arr.push(Number(doc.id));
          });
          return Math.max(...arr);
        });

      var id = highNum + 1;
      db.collection("orders").doc(id.toString()).set({
        customer: this.state.selectedOption.name.toLowerCase(),
        products: this.state.order.products,
        price: this.state.order.price,
        date: app.firestore.FieldValue.serverTimestamp(),
        timestamp: app.firestore.FieldValue.serverTimestamp()
      })
        .then(function () {
          //console.log("Document written");
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });

      var orderProducts = this.state.order.products;
      var products = this.state.products;
      for (var i in orderProducts) {
        var quantity;
        for (var k in products) {
          if (products[k].id == orderProducts[i].id) {
            products[k].quantity -= orderProducts[i].cartQuant;
            quantity = products[k].quantity;
          }
        }
        await db.collection("products").doc(orderProducts[i].id).set({
          quantity: quantity
        }, { merge: true })
          .then(function () {
            //console.log("Stock updated");
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
          });
      }

      this.setState({
        order: {
          products: [],
          date: null,
          price: 0,
        },
        selectedOption: null,
        orderLoading: false
      });
    }
  }

  render() {
    var categories = [];
    return (
      <Grid container>
        <Header />
        <Grid item md={9}>
          <Paper style={{marginLeft: 10, marginRight: 5, padding: 15, height: '100%' }}>
            <NoSsr>
              {this.state.loading ? (
                <CircularProgress style={{ margin: 10 }} />
              ) : (
              <div style={{ width: 600, display: 'flex'}}>
                <Select
                styles={{
                  singleValue: (base) => ({ ...base, color: 'black' }),
                  valueContainer: (base) => ({ ...base, color: 'white', width: 300 }),
                }}
                value={this.state.selectedOption}
                onChange={this.handleChange}
                options={this.state.customers}
                placeholder="Search Customer"
                isClearable
                isSearchable
                />
                <Input
                style={{marginLeft: 20}}
                type="text"
                name="filter"
                placeholder="Filter Products"
                onChange={this.updateInput}
                value={this.state.filter}
                />
            
              </div>
              )}
            </NoSsr>
            <Grid
              container
              spacing={1}
              alignItems={'center'}
              direction={'row'}
              justify={'center'}
              style={{ margin: 15 }}
            >
              {this.state.categoryFilter == "All" ? ( this.state.loading ? (
                <CircularProgress style={{ margin: 10 }} />
              ) : (
                  this.state.products.map((item) => {
                    if (categories.indexOf(item.category) < 0) {
                      categories.push(item.category);
                      var randomColor = "#" + ((1 << 24) * Math.random() | 0).toString(16); 
                      return (
                        <Paper key={item.category} onClick={this.changeCategory.bind(this, item.category)} style={{ backgroundColor: randomColor, padding: 20, margin: 10 }}>
                          <Typography variant="h6" textalign="center" >
                            {item.category}
                          </Typography>
                        </Paper>
                      );
                    }
                  })
                )) : (
                  <Grid
                    container
                    spacing={8}
                    alignItems={'center'}
                    direction={'row'}
                    justify={'center'}
                    style={{ margin: 15 }}
                  >
                    <Paper key={"back"} onClick={this.changeCategory.bind(this, "All")} style={{ padding: 20, margin: 10 }}>
                      <Back />
                    </Paper>
                    {this.state.loading ? (
                      <CircularProgress style={{ margin: 10 }} />
                    ) : (
                        this.state.filteredProducts.map((item) => {
                          if(item.name.indexOf("služba") > -1) {
                            var sluzbaHighlight = "#FF9E9E"
                          }
                          return (
                            <Paper key={item.id} onClick={this.addToOrder.bind(this, item)} style={{ backgroundColor: sluzbaHighlight, padding: 20, margin: 10 }}>
                              <Typography variant="h6" textalign="left" >
                                {item.name}
                              </Typography><br />
                              <Typography textalign="left" style={{ marginBottom: 5 }}>
                                Stock: {item.quantity}x
                        </Typography><br />
                              <Typography textalign="left" style={{ marginBottom: 5 }}>
                                Price: {item.price} Kč
                        </Typography>
                            </Paper>
                          );
                        })
                      )
                    }
                  </Grid>
                )
              }
            </Grid>
            
          </Paper>
        </Grid>
        <Grid item md={3}>
          <Paper style={{ marginRight: 10, marginLeft: 5, padding: 15, height: '100%'}}>
            <ul style={{ listStyleType: "none", marginLeft: 0, paddingLeft: 0}}>
              {this.state.order.products &&
                this.state.order.products.map((item) => {
                  return <OrderBlock key={item.id} name={item.name} cartQuant={item.cartQuant} delFromOrder={this.delFromOrder.bind(this, item)} />
                })
              }
            </ul>
            {this.state.selectedOption &&
            <Typography textalign="left" style={{marginBottom: 15}}>
              Customer: {this.state.selectedOption.name}
            </Typography>}
            <Typography textalign="left" style={{marginBottom: 15}}>
              Order Total: {this.state.order.price} Kč
            </Typography>
            <div style={{position: "relative"}}>
              <Button
                variant="contained"
                color="primary"
                disabled={this.state.orderLoading}
                onClick={this.finishOrder}
                style={{width: "100%"}}
              >
                Finish Order
            </Button>
              {this.state.orderLoading && <CircularProgress size={24} style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                color: "red",
                marginTop: -12,
                marginLeft: -12
              }} />
              }
            </div>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default Index

