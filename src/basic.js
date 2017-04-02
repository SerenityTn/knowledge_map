import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.less';

import moment from 'moment';
import momentTz from 'moment-timezone';
import Trello from 'trello';

import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.momentLocalizer(moment);

const DragAndDropCalendar = withDragAndDrop(BigCalendar);


class Calendar extends Component {
	static get APPKEY (){
		return "b707659cd995ea808667eadfe7580cc6";
	}
	static get TOKEN(){
		return "23a6b51ce2d02f622d889695005f37d4bce0e8b23c2463cff1a1279b48a4d3c4"
	}	

	static trello = new Trello(Calendar.APPKEY, Calendar.TOKEN);
	
	constructor(props){
		super(props);
		this.state = {
			events:[]
		}				
		this.moveEvent = this.moveEvent.bind(this)				
	}

	componentDidMount() {	
		this.setTrelloCards();
	}

	moveEvent({ event, start, end }) {
		const { events } = this.state;		
		const idx = events.indexOf(event);
		const updatedEvent = { ...event, start, end };		
		const nextEvents = [...events]
		nextEvents.splice(idx, 1, updatedEvent);
		this.updateEventDue(event.id, end)
		.then((res) => {
			console.log(res);
			this.setState({
				events: nextEvents
			});
		})	;	
		//alert(`${event.title} was dropped onto ${event.start}`);
	}

	updateEventDue(cardId, endDate){
		return Calendar.trello.makeRequest('put', '/1/cards/' + cardId, { 'due' : endDate});
	}

	setTrelloCards(){
		this.getBoardsIds()
		.then((boards_ids)=>{			
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
			'id' : card.id,
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
			<DragAndDropCalendar
			selectable
			events={this.state.events}
			onEventDrop={this.moveEvent}
			defaultView='week'
			defaultDate={new Date()}
			/>
			)
	}
}

export default Calendar;
