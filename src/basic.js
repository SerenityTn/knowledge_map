import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import events from './events';
import moment from 'moment';
import Trello from 'trello';

import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
	constructor(){
		super();
		const appKey = "b707659cd995ea808667eadfe7580cc6";
		const token = "23a6b51ce2d02f622d889695005f37d4bce0e8b23c2463cff1a1279b48a4d3c4";
		let trello = new Trello(appKey, token);
		trello.makeRequest('get', '/1/members/me', { webhooks: true })
		.then((res) => {
			console.log(res)
		});
	}
	render(){
		return (
			<BigCalendar
			{...this.props}
			events={events}
			defaultDate={new Date(2015, 3, 1)}
			/>
			)
	}
}

export default Calendar;
