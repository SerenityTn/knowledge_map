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
			events:[]
		}		

		this.setTrelloCards();						
	}

	setTrelloCards(){		
		this.getBoardsIds()
		.then((boards_ids)=>{
			console.log(1);
			let eventsFromCards = [];
			let promises = [];
			boards_ids.forEach((board_id) =>{
				promises.push(this.getCardsByBoard(board_id));
			});			
			Promise.all(promises).then((cardsLists) => {				
				cardsLists.forEach((cards)=>{
					cards.forEach((card) =>{
						if(card.due){						
							eventsFromCards.push(this.convertCardToEvent(card));					
						}
					})			
				});				
				this.addEventsToCalendar(eventsFromCards);			
			});
		})		
	}

	addEventsToCalendar(eventsFromCards){
		const events = this.state.events;				
		this.setState({
			events: events.concat(eventsFromCards),
		});		
	}

	convertCardToEvent(card){
		return {
			'title': card.name,
			'start': new Date(card.due),
			'end': new Date(card.due)
		}
	}

	getCardsByBoard(boardId){
		return Calendar.trello.makeRequest('get', '/1/boards/'+boardId+'/cards')
		.then((cards) => {
			return cards;
		});
	}

	getBoardsIds(){
		let boards_ids = [];
		return Calendar.trello.makeRequest('get', '/1/members/me/boards', { webhooks: true })
		.then((boards) => {
			boards.forEach(function(board){				
				boards_ids.push(board.id);
			});			
		})
		.then(() => {			
			return boards_ids;
		});
	}	

	render(){		
		return (
			<BigCalendar			
			events={ this.state.events}
			defaultDate={new Date(Date.now())}
			/>
			)
	}
}

export default Calendar;
