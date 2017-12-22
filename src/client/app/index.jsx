import React, { Component } from 'react';
import {render} from 'react-dom';
import axios from 'axios';

const Origin = (props) => {
	return (
		<div className="form-group">
	    	<label htmlFor="origin">Where are you coming from:</label>{props.validated}
	    {props.validated < 2 &&
	    	<input type="text" className="form-control" id="origin" onChange={(e) => props.listenToInput(e, 'origin')} placeholder="xx.xxx.xxx. OR xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx" />
		}
		{props.validated > 1 &&
			<div>
		    	<div className="street">{props.originResult[0]}</div>
		    	<div className="state">{props.originResult[1]}</div>
	    	</div>
		}
		</div>
	)
}

const Destination = (props) => {
	return (
		<div className="form-group">
		    <label htmlFor="destination">Where do you go:</label>
		{props.validated < 2 &&
		    <input type="text" className="form-control" id="destination" onChange={(e) => props.listenToInput(e, 'destination')} placeholder="xx.xxx.xxx. OR xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx" />
		}
		{props.validated > 1 &&
			<div>
		    	<div className="street">{props.destinationResult[0]}</div>
		    	<div className="state">{props.destinationResult[1]}</div>
		    </div>
		}
		</div>
	)
}

class App extends React.Component{
	constructor() {
    	super();
    	this.getAddressesFromIps = this.getAddressesFromIps.bind(this)
    	this.hitGraphAPI = this.hitGraphAPI.bind(this);
    	this.hitGeoAPI = this.hitGeoAPI.bind(this);
	    this.state = {
	    	origin:'',
	    	originResult: [],
	    	destination:'',
	    	destinationResult: [],
	    	apiErrorsO: [],
	    	apiErrorsD: [],
	    	validated: 0,
	    	gotTime: false
	    };
	}
	listenToInput(e, name) {
		this.setState({ [name]: e.target.value });
	}
	getAddressesFromIps(e){
		e.preventDefault()
        e.stopPropagation()
		this.hitGraphAPI(this.state.origin)
		this.hitGraphAPI(this.state.destination)
	}
	hitGraphAPI(sendIP,api){
		axios.get('https://api.graphloc.com/graphql', {
			params: {
				query : '{getLocation(ip: "'+sendIP+'"){location{latitude,longitude}}}'
			}
		})
		.then(function (response) {
		    console.log(response);
		    if ('error' in response.data){

		    }else{
		    	this.setState({validated: this.state.validated + 1})
			    if(this.state.validated > 1){
			    	this.hitGeoAPI()
			    }
		    }
		    
		})
		.catch(function (response) {
		    if (response instanceof Error) {
		      // Something happened in setting up the request that triggered an Error 
		      console.log('Error', response.message);
		    } else {
		      // The request was made, but the server responded with a status code 
		      // that falls out of the range of 2xx 
		      console.log(response.data);
		      console.log(response.status);
		      console.log(response.headers);
		      console.log(response.config);
		    }
		});
	}
	hitGeoAPI(){

	}
	render(){
		return(
			<div className="container">
				<div className="row">
					<div className="col">
					<h1 className="text-center">IP Addresses Distance Calculator</h1>
					<h3 className="text-center">Add an ip for origin and destination</h3>
					<h5 className="text-center">Feel free to use IPv4 or IPv6</h5>
					{this.state.validated > 1 &&
						<p><i class="material-icons">replay</i> Try agggaaaaiiiinnnn</p>
					}
					</div>
				</div>
				<form>
					<div className="row">
						<div className="col-12 col-md-6 mt-5">
							<Origin
								validated={this.state.validated}
								originResult={this.state.originResult}
								listenToInput={this.listenToInput.bind(this)}
							/>
						</div>
						<div className="col-12 col-md-6 mt-5">
							<Destination
								validated={this.state.validated}
								destinationResult={this.state.destinationResult}
								listenToInput={this.listenToInput.bind(this)}
							/>
						</div>
						<div className="col-12 mt-3">
							<button type="submit" className="btn btn-primary" onClick={(e) => this.getAddressesFromIps(e)}>Get teh distance</button>
						</div>
					</div>
				</form>
			</div>
		) 
	}
}

render(<App/>, document.getElementById('app'));