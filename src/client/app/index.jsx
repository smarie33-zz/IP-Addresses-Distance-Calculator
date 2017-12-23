import React, { Component } from 'react'
import {render} from 'react-dom'
import axios from 'axios'

const Origin = (props) => {
	return (
		<div className="form-group">
	    	<label htmlFor="origin">Where are you coming from:</label>
	    {props.time =='' &&
	    	<input type="text" className="form-control" id="origin" onChange={(e) => props.listenToInput(e, 'origin')} placeholder="like 69.202.224.2" />
		}
		{props.time !='' &&
			<div>
		    	<h4 className="street font-weight-bold">{props.originResult[0]}</h4>
		    	<h4 className="state">{props.originResult[1]}</h4>
	    	</div>
		}
		{props.apiErrorsO != '' &&
			<div className="text-danger">{props.apiErrorsO}</div>
		}
		</div>
	)
}

const Destination = (props) => {
	return (
		<div className="form-group">
		    <label htmlFor="destination">Where do you go:</label>
		{props.time =='' &&
		    <input type="text" className="form-control" id="destination" onChange={(e) => props.listenToInput(e, 'destination')} placeholder="like 72.229.28.185" />
		}
		{props.time !='' &&
			<div>
		    	<h4 className="street font-weight-bold">{props.destinationResult[0]}</h4>
		    	<h4 className="state">{props.destinationResult[1]}</h4>
		    </div>
		}
		{props.apiErrorsD != '' &&
			<div className="text-danger">{props.apiErrorsD}</div>
		}
		</div>
	)
}

class App extends React.Component{
	constructor() {
    	super();
    	this.getAddressesFromIps = this.getAddressesFromIps.bind(this)
    	this.hitGraphAPI = this.hitGraphAPI.bind(this)
    	this.hitGeoAPI = this.hitGeoAPI.bind(this)
    	this.preValidation = this.preValidation.bind(this)
    	this.createAddress = this.createAddress.bind(this)
    	this.restart = this.restart.bind(this)
	    this.state = {
	    	origin:'',
	    	originResult: [],
	    	destination:'',
	    	destinationResult: [],
	    	apiErrorsO: '',
	    	apiErrorsD: '',
	    	validated: 0,
	    	time: '',
	    	overAllError: ''
	    }
	}
	listenToInput(e, name) {
		this.setState({ [name]: e.target.value });
	}
	getAddressesFromIps(e){
		const s = this.state
		e.preventDefault()
        e.stopPropagation()
        if(this.preValidation(s.origin, 'apiErrorsO') && this.preValidation(s.destination, 'apiErrorsD')){
			this.hitGraphAPI(s.origin, 'apiErrorsO', 'origin')
			this.hitGraphAPI(s.destination, 'apiErrorsD', 'destination')
		}
	}
	hitGraphAPI(sendIP, errorAnnouncement, results){
		axios.get('https://api.graphloc.com/graphql', {
			params: {
				query : '{getLocation(ip: "'+sendIP+'"){location{latitude,longitude}}}'
			}
		})
		.then(response => {
		    const s = this.state
		    if ('errors' in response.data){
		    	response.data.errors.map((error) => {
		    		this.setState({[errorAnnouncement]: s[errorAnnouncement] += error.message})
		    	})
		    	if(s.validated > 0){
		    		this.setState({'validated': s.validated - 1 })
		    	}
		    }else{
		    	this.setState({'overAllError': ''})
		    	this.setState({[results]: response.data.data.getLocation.location.latitude+','+response.data.data.getLocation.location.longitude})
			    this.setState({'validated': s.validated + 1}, () => {
			    	if(s.validated > 0){
				    	this.hitGeoAPI()
				    }
			    })
		    }
		})
		.catch(response => {
		    if (response instanceof Error){
		      // Something happened in setting up the request that triggered an Error
		      this.setState({'overAllError': 'One of these IP\'s is not like the other. One of these IP\'s is BAD!'})
		    } else {
		      // The request was made, but the server responded with a status code 
		      // that falls out of the range of 2xx 
		      this.setState({'overAllError': response.status})
		      console.log(response.data)
		      console.log(response.status)
		      console.log(response.headers)
		      console.log(response.config)
		    }
		});
	}
	hitGeoAPI(){
		const s = this.state
		const t = this
 		const directionsService = new google.maps.DirectionsService
		directionsService.route({
          origin: s.origin,
          destination: s.destination,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            console.log(response.routes[0].legs)
            t.setState({'time': response.routes[0].legs[0].duration.text})
            t.createAddress(response.routes[0].legs[0].start_address, 'originResult')
            t.createAddress(response.routes[0].legs[0].end_address, 'destinationResult')
            t.setState({'overAllError': ''})
          } else {
            t.setState({'overAllError': 'Directions request failed due to ' + status})
          }
        })	
	}
	createAddress(string,place){
		let address = [string.substring(0, string.indexOf(',')), string.substring(string.indexOf(',') + 1)]
    	this.setState({ [place]: address });
	}
	preValidation(toCheck, place){
		let error = 0
		if(toCheck.trim() == ''){
			error++
			this.setState({ [place]:'Please enter something' });
			return
		}

		const testipv4 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(toCheck)
		if(!testipv4){
			error++
			this.setState({ [place]: 'Please enter a proper ip address' });
			return
		}

		if(error == 0){
			this.setState({ [place]:'' });
			return true
		}else{
			return false
		}

	}
	restart(){
		this.setState({
	    	origin:'',
	    	originResult: [],
	    	destination:'',
	    	destinationResult: [],
	    	apiErrorsO: '',
	    	apiErrorsD: '',
	    	validated: 0,
	    	time: '',
	    	overAllError: ''
	    })
	}
	render(){
		return(
			<div className="container">
				<div className="row">
					<div className="col">
					<h1 className="text-center mt-5">IP Addresses Distance Calculator</h1>
					<h3 className="text-center">Add an ip for origin and destination</h3>
					<h5 className="text-center">Please use IPv4</h5>
					{this.state.time != '' &&
						<p className="text-center retry" onClick={() => this.restart()}><i className="material-icons">replay</i> Try agggaaaaiiiinnnn</p>
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
								apiErrorsO={this.state.apiErrorsO}
								time={this.state.time}
							/>
						</div>
						<div className="col-12 col-md-6 mt-5">
							<Destination
								validated={this.state.validated}
								destinationResult={this.state.destinationResult}
								listenToInput={this.listenToInput.bind(this)}
								apiErrorsD={this.state.apiErrorsD}
								time={this.state.time}
							/>
						</div>
						{this.state.time != '' &&
							<div className="col-12 mt-5">
						    	<h3 className="text-success text-center">{this.state.time}</h3>
						    </div>
						}
						{this.state.overAllError != '' &&
							<div className="col-12 mt-3">
								<div className="text-center text-danger">{this.state.overAllError}</div>
							</div>						    
						}
						{this.state.time == '' &&
						<div className="col-12 mt-5">
							<button type="submit" className="btn btn-primary btn-block" onClick={(e) => this.getAddressesFromIps(e)}>Get teh distance</button>
						</div>
						}
					</div>
				</form>
			</div>
		) 
	}
}

render(<App/>, document.getElementById('app'));