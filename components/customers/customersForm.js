import { Component } from 'react'
import firebase from "../../firestore"
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

class CustomersForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            class: ""
        };
    }
    
    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    addCustomer = async (e) => {
        e.preventDefault();
        const db = firebase.firestore();
        var id = "";
        await db.collection("customers").add({
            name: this.state.name,
            class: this.state.class
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
            class: this.state.class
        });
        this.setState({
            name: "",
            class: ""
        });
    };

    render() {
        return (
            <form style={{
                margin: "auto",
                textAlign: "center",
                width: "50 %",
                padding: 10
            }} onSubmit={this.addCustomer}>
                <Input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    onChange={this.updateInput}
                    value={this.state.name}
                />
                <Input
                    type="text"
                    name="class"
                    placeholder="class"
                    onChange={this.updateInput}
                    value={this.state.class}
                />
                <Button variant="contained" color="primary" type="submit" style={{ marginLeft: 10 }}>Submit</Button>
            </form>
        );
    }
}

export default CustomersForm