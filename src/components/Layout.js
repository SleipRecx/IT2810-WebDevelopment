import React from 'react';
import Navigation from './Navigation';
import FooterContent from './FooterContent';
import '../../public/styles/style.css';

export default class Layout extends React.Component {
    render() {
        return (
            <div className="app-container">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2">
                            <Navigation/>
                        </div>
                        <div className="col-md-10">
                            <div className="app-content col-md-8">{this.props.children}</div>
                        </div>
                    </div>
                </div>
                <footer>
                    <FooterContent/>
                </footer>
            </div>
        );
    }
}