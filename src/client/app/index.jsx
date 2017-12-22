import React, { Component } from 'react';
import {render} from 'react-dom';
import axios from 'axios';

const Origin = (props) => {
	return (
		<div className="form-group">
	    	<label for="origin">Where are you coming from:</label>
	    	<input type="text" className="form-control" id="origin" onChange={(e) => props.listenToInput(e, 'origin')} placeholder="xx.xxx.xxx. OR xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx" />
		</div>
	)
}

const Destination = (props) => {
	return (
		<div className="form-group">
		    <label for="destination">Where do you go:</label>
		    <input type="text" className="form-control" id="destination" onChange={(e) => props.listenToInput(e, 'destination')} placeholder="xx.xxx.xxx. OR xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx" />
		</div>
	)
}

class App extends React.Component{
	constructor() {
    	super();
    	this.getAddressesFromIps = this.getAddressesFromIps.bind(this);
	    this.state = {
	    	origin:'',
	    	destination:'',
	    	gotTime: false
	    };
	}
	listenToInput(e, name) {
		this.setState({ [name]: e.target.value });
	}
	getAddressesFromIps(origin, destination){

	}
	render(){
		return(
			<div className="container">
				<div className="row">
					<div className="col">
					<h1 className="text-center">IP Addresses Distance Calculator</h1>
					<h3 className="text-center">Add an ip for origin and destination</h3>
					<h5 className="text-center">Feel free to use IPv4 or IPv6</h5>
					</div>
				</div>
				<form>
					<div className="row">
						<div className="col-12 col-md-6 mt-5">
							<Origin
								listenToInput={this.listenToInput.bind(this)}
							/>
						</div>
						<div className="col-12 col-md-6 mt-5">
							<Destination
								listenToInput={this.listenToInput.bind(this)}
							/>
						</div>
						<div className="col-12 mt-3">
							<button type="submit" class="btn btn-primary" onClick={this.getAddressesFromIps.bind(this)}>Get teh distance</button>
						</div>
					</div>
				</form>
			</div>
		) 
	}
}

render(<App/>, document.getElementById('app'));