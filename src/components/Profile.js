import React, {Component} from 'react';
import '../../public/styles/style.css';
import ResultTable from './ResultTable.js';
import LoginStore from '../stores/LoginStore';

export default class Profile extends Component{

    constructor(props) {
        super(props);
        this.data = {};

    }

    componentWillMount(){
        this.getData();
        LoginStore.on("change", () =>{
            this.getData()
        });

    }

    async getData(){
        var data= await LoginStore.decrypt(localStorage.getItem("token"))
       this.data=data;
        this.setState({
            data:data
        })
    }

    render(){
        return (
            <div>
                <div className="container">
                    <div className="row">
                         <div className="col-md-3">
                                <img className="img-responsive" src={this.data.image} alt="user"/>
                         </div>
                         <div className="col-md-7">
                                <p className="name">{this.data.first_name} {this.data.last_name}</p>

                         </div>

                    </div>

                </div>
            </div>
        )
    }
}