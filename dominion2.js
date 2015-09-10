//Version 2.0


//Next up: show unmeetable requirements in red when !validateSetList

//Add more options later
//Alchemy limits, include trashers, exclude alt-vp cards

(function() {
	'use strict';

	
	//Detect mobile
	if($(window).width() < 800) { //mobile
			mobileWrap();
	} 

	$(window).resize(function(){
		if($(window).width() < 800) { //mobile
			mobileWrap();
		} else {
			mobileUnwrap();
		}
	});
	

	var kingdom = new Kingdom();
	assignEvents();


	//Kingdom class, holds information about which sets to use, requirements for kingdom cards,
	//which cards to use, and information about those cards, and methods for selecting them
	function Kingdom() {
		this.cards = [];
		this.bane = null;
		this.setList = [];

		this.setDistribution = {
			'Base' : 0,
			'Intrigue' : 0,
			'Seaside' : 0,
		 	'Alchemy': 0,
		 	'Prosperity' : 0,
		 	'Cornucopia' : 0,
		 	'Hinterlands' : 0,
		 	'Dark Ages' : 0,
		 	'Guilds' : 0,
		 	'Adventures' : 0,
		 	'Promo' : 0,
		}

		this.requirements = {
			actions: false,
			buys: false,
			cards: false,
			coins: false,
			isTrasher: false,
		}

		this.specReq = {
			moat: false,
		}
	}

	//Main function, called on button click
	Kingdom.prototype.generateKingdom = function() {

		if( anyChecked() ) { //At least one checkbox selected
				this.setList = kingdom.addSetList();
				
				if(this.validateSetList()) {
					this.chooseCards();
								
					this.outputKingdom();

				} else { //Sets unable to fulfill requirements
					activateButton(false);
					errorMsg('Sorry, unable to satisfy all the selected options with the selected sets.  Try different sets or different options.');
				}				

			} else { //No checkboxes checked				
				activateButton(false);
				errorMsg('Please select at least one set.');
			}	
	}

	//Add a bane card
	Kingdom.prototype.addBane =function() {
		var bane = getRandom(this.setList);			
		kingdom.bane = bane;
	}

	//Add a specific card object to the kingdom
	Kingdom.prototype.addCard = function(card) {
		this.cards.push(card);
		var setName = this.setNameById(card.setID);
		this.setDistribution[setName]++;
		remove(card, this.setList);

	}

	//Adds cards from the user-checked sets to setList object, from which to draw random cards
	Kingdom.prototype.addSetList = function() {
		var self = this;
		var setsToUse = [];

		$('.sets input[type="checkbox"]').not('[value="all"]').each(function(idx, el) {
			
			if(el.checked) {
				var setName = el.value;
				
				var set = self.setIdByName(setName);
				
				setsToUse = setsToUse.concat(self.pullCardsBySet(set));				
			}
		});

		return setsToUse;
	}
	
	//Check if card fulfills unmet requirement
	Kingdom.prototype.checkRequirements = function(card) {

		for(var prop in this.requirements) {

			//If a requirement is true and not yet fulfilled
			if(this.requirements[prop] && !this.hasType(prop)) {

				return(this.fulfillsRequirement(card, prop));
			}
		}
		return true;
	}

	//Choose ten random cards from setlist, test against requirements
	Kingdom.prototype.chooseCards = function() {
		kingdom.cards = [];
		kingdom.bane = null;

		kingdom.resetKingdom();
		kingdom.getRequirements();

		while(kingdom.cards.length < 10) {
			var card = getRandom(this.setList);

			//copy the set list, to whittle down while searching without effecting setlist
			var cardsToSearch = this.setList.slice();

			//Check a card against outstanding requirements			
			while(!this.checkRequirements(card)) {
				remove(card, cardsToSearch);
				card = getRandom(cardsToSearch);	
			}

			//Add Moat if option selected and attack card in deck
			if(card['isAttack']) {
				if(this.specReq.moat && !this.hasCard('Moat')) {
					
					//Add moat if there's room
					if(this.cards.length < 9) {
						this.addCard(cardsByName['Moat']);
						
					} else { //If its the last card and no moat, draw another non-attack
						while(card['isAttack']) {
							card = getRandom(setList);
						}
					}
				}
			}
			this.addCard(card);			
		}
		
		//Require bane
		if(this.hasCard('Young Witch')) {
			this.addBane();
		}
		
	}	

	//Checks if a card meets a given requirement
	Kingdom.prototype.fulfillsRequirement = function(card, type) {
		if(type == 'actions' || type == 'coins' || type == 'cards') {
				if(card[type] > 1) {
					return true;
				}
				
		} else {
			if(card[type]) {
				return true;
			}
		}

		return false;	
	}

	//Gets kingdom requirements based on checkboxes
	Kingdom.prototype.getRequirements = function() {
		var self = this;
		$('.require input').each(function() {
			if(this.checked) {
				self.requirements[this.value] = true;
			}
		});

		var moat = $('input[value="moat"]');

		if(moat[0].checked) {
			self.specReq.moat = true;
		}
	}


	//Check whether a certain card is present in kingdom.  Takes either string name or object
	Kingdom.prototype.hasCard = function(card) {
		if(card.constructor == String) {
			card = cardsByName[card];
		}

		if(kingdom.cards.indexOf(card) > -1) {
			return true;
		} else {
			return false;
		}
	}

	//Check if a requirement/card type is already present in selected cards 
	Kingdom.prototype.hasType = function(type) {
		
		for(var i = 0; i < this.cards.length; i++) {
			var card = this.cards[i];

			if(this.fulfillsRequirement(card, type)) {
				return true;
			}

		}
		return false;
	}
	
	//Print kingdom cards/bane card
	Kingdom.prototype.outputKingdom = function() {
		var output = '<h2>Kingdom Cards</h2>';
		for(var i = 0; i < kingdom.cards.length; i++) {
			var card = kingdom.cards[i];
			output += '<p>' + card.name + '</p>';
		}

		if(kingdom.bane) {
			output += '<h2>Bane Card</h2>';
			output += '<p>' + kingdom.bane.name + '</p>';
		}
		$('.output').empty().append(output);
	}


	Kingdom.prototype.pullCardsBySet = function(set) {
		var cardsInSet = [];

		for(var i = 0; i < cards.length; i++) { //run backwards for speed?
			var card = cards[i];
			
			if(card.setID == set) {
				cardsInSet.push(card);
			}

			//Cards object has cards in set order, don't loop through whole thing once you've passed your set
			if(card.setID > set) {		
				return cardsInSet;
			}
		}		
		return cardsInSet;
	}
		
	Kingdom.prototype.setIdByName = function(name) {
		for(var set in sets) {
			if(sets[set].name.toLowerCase() == name.toLowerCase()) {				
				return set;
			}
		}
		return false;
	}

	Kingdom.prototype.setNameById = function(id) {
		for(var set in sets) {
			if(set == id) {
				return sets[set].name;
			}
		}
	}
	
	//Clears out kingdom requirements and set distrubtion objects in preparation for new kingdom
	Kingdom.prototype.resetKingdom = function() {
		for(var prop in this.requirements) {
			this.requirements[prop] = false;
		}

		for(var prop in this.specReq) {
			this.specReq[prop] = false;
		}

		for(var prop in this.setDistribution) {
			this.setDistribution[prop] = 0;
		}
	}

	//Testing function, logs kingdom requirements and checks if any not met
	Kingdom.prototype.validateDeck = function() {
		for(var prop in this.requirements) {

			if(this.requirements[prop] && !this.hasType(prop)) {
				console.log('requirement true: ', prop);
				console.log('kingdom has type: ', this.hasType(prop));
				console.log('Deck not valid, missing: ', prop);
			}
		} 
	}


	//Upcoming: show which requirements can't be fulfilled - push those to array and highlight in dom

	//Check whether the selected sets are capable of fulfilling the selected requirements
	Kingdom.prototype.validateSetList = function() {
		var valid = true;
		var self = this;
		this.resetKingdom();
		this.getRequirements();
		

		if(self.setList.length < 10) {
			return false;
		}

		//Make array of true requirements
		var reqs = [];
		for(var prop in this.requirements) {
			if(this.requirements[prop]) {
				reqs.push(prop);
			}
		}

		//Return true if, for all requirements, any one card fills that requirement.
		if(reqs.length) {
			valid = reqs.every(function(property){
				return self.setList.some(function(el){
					
					if( self.fulfillsRequirement(el, property)) {
					
						return true;
					}
					
				});
			});
		}
		return valid;			
								
	}
	

	/*------------------------
	MOBILE FUNCTIONS
	-------------------------*/

	//Wraps labels in div so each appears on own line
	function mobileWrap() {
		$('.sets label, .require label').wrap('<div></div>');
	}

	//Unwraps labels when resized from small to large screen
	function mobileUnwrap() {
		$('.sets div label, .require label').unwrap();
	}



	/*------------------------
	DOM INTERACTION/EVENT HANDLING
	-------------------------*/

	//Attaches event handers to checkboxes and button
	function assignEvents() {
		activateButton(true);

		//Check all checkboxes		
		$('input[value="all"]').change(function(){
			if(this.checked) {
				$('.sets input').prop('checked', true);				
			} else {
				$('.sets input').not('[value="base"]').prop('checked', false);
			}
		});


		//Check if button should be active/inactive
		$('input[type="checkbox"]').change(function() {
			if(!anyChecked()) {
				activateButton(false);
				
			} else {
				activateButton(true);				
			}
		});
	}

	//Assigns generateKingdom to active button
	function assignButton() {
		//clear out attached functions so they dont stack
		$('.get-cards').off();

		$('.get-cards').click(function() {
			kingdom.generateKingdom();
		});		
	}

	//Takes true/false to activate/inactive button
	function activateButton(bool) {
		var button = $('button');
		if(bool) {
			
			//Only clear if going from inactive to active
			if(button.hasClass('inactive')) {
				$('.output').empty();
			}
			button.removeClass('inactive');
			button.addClass('active');			
			
		} else {
			
			button.addClass('inactive');
			button.removeClass('active');
			button.off();
			errorMsg('Please select at least one set.');
		}
		button[0].disabled = !bool;
		assignButton();
	}

	//Checks that at least one set checkbox is checked
	function anyChecked() {
		var selected = false;

		$('.sets input[type="checkbox"]').each(function() {
			if(this.checked) {
				selected = true;
			} 
		});
		return selected;
	}

	
	/*------------------------
	HELPER FUNCTIONS
	-------------------------*/

	//Get random item from array
	function getRandom(items) {
		var item = items[Math.floor(Math.random() * items.length)];
		return item;
	}



	function remove(el, array) {
		var index = array.indexOf(el);
		if(index > -1) {
			array.splice(index, 1);
		}
	}

	function errorMsg(error) {
		var msg = $('<p>');
		msg.text(error);
		$('.output').empty().append(msg);
	}




})();