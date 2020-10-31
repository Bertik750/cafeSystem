import { Component } from 'react'
import firebase from "../../firestore"
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

class ProductsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            quantity: "",
            price: "",
            category: ""
        };
    }
    
    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    addProduct = async (e) => {
        e.preventDefault();
        const db = firebase.firestore();
        var id = "";
        await db.collection("products").add({
            name: this.state.name,
            quantity: this.state.quantity,
            price: this.state.price,
            category: this.state.category
        })
        .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
                id = docRef.id;
        })
        .catch(function (error) {
                console.error("Error adding document: ", error);
        });
        this.props.addE({
            id: id,
            name: this.state.name,
            quantity: this.state.quantity,
            price: this.state.price,
            category: this.state.category
        });
        this.setState({
            name: "",
            quantity: "",
            price: "",
            category: ""
        });
    };

    render() {
        return (
            <form style={{
                margin: "auto",
                textAlign: "center",
                width: "50 %",
                padding: 10}} onSubmit={this.addProduct}>
                <Input
                    name="name"
                    placeholder="Name"
                    onChange={this.updateInput}
                    value={this.state.name}
                />
                <Input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    onChange={this.updateInput}
                    value={this.state.quantity}
                />
                <Input
                    type="number"
                    name="price"
                    placeholder="Price"
                    onChange={this.updateInput} 
                    value={this.state.price}
                />
                <Input
                    type="text"
                    name="category"
                    placeholder="category"
                    onChange={this.updateInput}
                    value={this.state.category}
                />
                <Button variant="contained" color="primary" type="submit" style={{marginLeft: 10}}>Submit</Button>
            </form>
        );
    }
}

export default ProductsForm