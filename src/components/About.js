import React, { Component} from 'react';

import '../../public/styles/style.css';

export default class About extends Component {
    render() {
        return (
            <div>
                <h1>
                    {this.props.route.foo}
                </h1>
            </div>
        );
    }
}