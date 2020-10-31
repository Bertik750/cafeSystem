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
            class: this.props.class
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
            class: this.state.class
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
                            type="text"
                            name="class"
                            placeholder="class"
                            onChange={this.updateInput}
                            value={this.state.class}
                        /></TableCell>
                        <TableCell><Button onClick={this.handleSave} color="primary">Save</Button></TableCell>
                    </>
                ) : (
                    <>
                        <TableCell>{this.props.name}</TableCell>
                        <TableCell>{this.props.class}</TableCell>
                        <TableCell><Button onClick={this.handleClick} color="primary" >Edit</Button></TableCell>
                    </>
                )}
                <TableCell><Button color="secondary" onClick={this.delEvent} >Delete</Button></TableCell>
            </TableRow>
        );
    }
}

export default ListBlock