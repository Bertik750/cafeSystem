import { Component } from 'react'
import Chip from '@material-ui/core/Chip';

class OrderBlock extends Component {
    constructor(props) {
        super(props);
        this.delFromOrder = props.delFromOrder;
    }

    render() {
        const content = this.props.cartQuant + "x" + " " + this.props.name;
        return (
            <li>
                <Chip
                    label={content}
                    onDelete={this.delFromOrder}
                    style={{margin: 3}}
                />
            </li>
        );
    }
}

export default OrderBlock