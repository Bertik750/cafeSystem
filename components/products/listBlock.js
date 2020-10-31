import { Component } from 'react'
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

class ListBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            name: this.props.name,
            quantity: this.props.quantity,
            price: this.props.price,
            category: this.props.category
        };
        this.delEvent = props.delEvent;
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = e => {
        e.preventDefault();
        this.setState({editing:true});
    }

    handleSave = async (e) => {
        e.preventDefault();
        this.props.editE({
            id: this.props.id,
            name: this.state.name,
            quantity: this.state.quantity,
            price: this.state.price,
            category: this.state.category
        });
        this.setState({editing:false});
    }

    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        const editing = this.state.editing;
        return (
            <TableRow>
                {editing ? (
                    <>
                        <TableCell><Input
                            type="text"
                            name="name"
                            placeholder="name"
                            onChange={this.updateInput}
                            value={this.state.name}
                        /></TableCell>
                        <TableCell><Input
                            type="number"
                            name="quantity"
                            placeholder="quantity"
                            onChange={this.updateInput}
                            value={this.state.quantity}
                        /></TableCell>
                        <TableCell><Input
                            type="number"
                            name="price"
                            placeholder="price"
                            onChange={this.updateInput}
                            value={this.state.price}
                        /></TableCell>
                        <TableCell><Input
                            type="text"
                            name="category"
                            placeholder="category"
                            onChange={this.updateInput}
                            value={this.state.category}
                        /></TableCell>
                        <TableCell><Button color="primary" onClick={this.handleSave}>Save</Button></TableCell>
                    </>
                ) : (
                    <>
                        <TableCell>{this.props.name}</TableCell>
                        <TableCell>{this.props.quantity}</TableCell>
                        <TableCell>{this.props.price} Kč</TableCell>
                        <TableCell>{this.props.category}</TableCell>
                        <TableCell><Button color="primary" onClick={this.handleClick} >edit</Button></TableCell>
                    </>
                )}
                <TableCell><Button color="secondary" onClick={this.delEvent} >delete</Button></TableCell>
            </TableRow>
        );
    }
}

export default ListBlock