import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Trello from 'trello';

import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
	static get APPKEY (){
		return "b707659cd995ea808667eadfe7580cc6";
	}
	static get TOKEN(){
		return "23a6b51ce2d02f622d889695005f37d4bce0e8b23c2463cff1a1279b48a4d3c4"
	}	

	static trello = new Trello(Calendar.APPKEY, Calendar.TOKEN);
	
	constructor(){
		super();
		this.state = {
			events: this.getEvents()
		}						
		Calendar.trello.makeRequest('get', '/1/members/me/boards', { webhooks: true })
		.then((res) => {
			console.log(res)
		});
	}

	getEvents(){
		return [  
		{
			'title': 'Serenity Event',
			'start': new Date(2017, 3, 30),
			'end': new Date(2017, 3, 30)
		},

		{
			'title': 'DTS STARTS',
			'start': new Date(2017, 3, 31, 12, 0, 0),
			'end': new Date(2017, 3, 31, 13, 0, 0)
		}
		]
	}	

	render(){		
		return (
			<BigCalendar
			{...this.props}
			events = { this.getEvents()}
			defaultDate={new Date(2017, 3, 30)}
			/>
			)
	}
}

export default Calendar;
