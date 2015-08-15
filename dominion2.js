//Version 2.0

//Add more options later
//Alchemy limits, include trashers, exclude alt-vp cards

(function() {
	'use strict';

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
		}

		this.specReq = {
			moat: false,
		}
	}

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

	Kingdom.prototype.checkRequirements = function(card, set) {
		//console.log('considering: ', card.name);

		for(var prop in this.requirements) {
			


			//If a requirement is true and not yet fulfilled
			if(this.requirements[prop] && !this.hasType(prop)) {

				if(!fulfillsRequirement(card, prop)) {
					return false;
				} else {
					console.log(card.name, ' fulfilled requirement: ', prop);
					return true;
				}
			}
		}
		return true;
	}

	Kingdom.prototype.addSetList = function() {

		var setsToUse = [];

		$('.sets input[type="checkbox"]').not('[value="all"]').each(function() {
			
			if(this.checked) {
				var setName = this.value;
				console.log('setname ', setName);
				var set = setIdByName(setName);
				console.log('setid ', set);
				setsToUse = setsToUse.concat(pullCardsBySet(set));				
			}
		});
		
		return setsToUse;
	}

	Kingdom.prototype.validateSetList = function() {
		var valid = true;
		var self = this;
		this.resetKingdom();
		this.getRequirements();
		//console.log(kingdom);

		if(self.setList.length < 10) {
			//console.log('setlist too short');
			return false;
		}

		var reqs = [];
		for(var prop in this.requirements) {
			if(this.requirements[prop]) {
				reqs.push(prop);
			}
		}

		if(reqs.length) {
			valid = reqs.every(function(property){
				return self.setList.some(function(el){
					//console.log('el is ', el);
					if( fulfillsRequirement(el, property)) {
						//console.log(el.name, 'fills req ', property);
						return true;
					}
					
				});
			});
		}
		//console.log('deck is ' + valid);
		return valid;			
								
	}

	Kingdom.prototype.hasType = function(type) {
		
		for(var i = 0; i < this.cards.length; i++) {
			var card = this.cards[i];

			if(fulfillsRequirement(card, type)) {
				return true;
			}

		}
		return false;
	}


	Kingdom.prototype.hasCard = function(card) {
		if(card.constructor == String) {
			card = cardsByName[card];
			//console.log(card);
		}

		if(kingdom.cards.indexOf(card) > -1) {
			return true;
		} else {
			return false;
		}
	}


	Kingdom.prototype.addCard = function(card) {
		this.cards.push(card);
		this.setDistribution[setNameById(card.setID)]++;
		remove(card, this.setList);

	}

	Kingdom.prototype.addBane =function() {
		var bane = getRandom(this.setList);			
		kingdom.bane = bane;
	}

	Kingdom.prototype.generateKingdom = function() {
		console.log('GENERATING');
		var button = $('button');
		if( anyChecked() ) { //At least one checkbox selected
				this.setList = kingdom.addSetList();
				
				if(this.validateSetList()) {
					getCards2(this.setList);
								
					outputKingdom();

				} else { //Sets unable to fulfill requirements
					activateButton(false);
					errorMsg('Sorry, unable to satisfy all the selected options with the selected sets.  Try different sets or different options.');
				}				

			} else { //No checkboxes checked				
				activateButton(false);
				errorMsg('Please select at least one set.');
			}		
	}


	//Wraps labels in div so each appears on own line
	function mobileWrap() {
		$('.sets label').wrap('<div></div>');
	}

	//Unwraps labels when resized from small to large screen
	function mobileUnwrap() {
		$('.sets div label').unwrap();
	}

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

	function assignButton() {
		
		//Get kingdom cards on button click
		$('.get-cards.active').click(function() {
			console.log('running by why');
			kingdom.generateKingdom();
			
		});
		
	}

	function activateButton(bool) {
		var button = $('button');
		if(bool) {
			
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
		// alert(button[0].disabled);
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

	//Returns cards in the selected sets
	function getSets() {
		var setsToUse = [];

		$('.sets input[type="checkbox"]').not('[value="all"]').each(function() {
			
			if(this.checked) {
				var set = this.value;
				setsToUse = setsToUse.concat(cardList[set]);				
			}
		});
		return setsToUse;
	}

	//Gets 10 random kingdom cards from the chosen sets
	function getCards(sets) {
		var cardsToUse = {
			"kingdom" : [],
			"bane": null
		};

		for(var i = 0; i < 10; i++) {
			var card = getRandom(sets);
			while(cardsToUse.kingdom.indexOf(card) > -1) {
				card = getRandom(sets);
			}

			//Add Moat if attack cards in kingdom
			if( $('input[value="moat"]')[0].checked ) {
					
				if(cardsToUse.kingdom.indexOf('Moat') == -1) {
					
					if(attackCards.indexOf(card) > -1 ) {

						if(i == 9) {
							while(attackCards.indexOf(card) > -1) {
								card = getRandom(sets);
							}
						} else {
							cardsToUse.kingdom.push('Moat');
							i++;
						}
					}					
				}
			}			
			cardsToUse.kingdom.push(card);
		}


		//Add bane if Young Witch in kingdom
		if(cardsToUse.kingdom.indexOf('Young Witch') > -1) {
			var bane = getRandom(sets);
			while(cardsToUse.kingdom.indexOf(bane) > -1) {
				bane = getRandom(sets);
			}
			cardsToUse.bane = bane;
		}
		return cardsToUse;
	}
	
	//Print kingdom cards/bane card
	function outputCards(cards) {
		

		var output='<h2>kingdom Cards</h2>';
		for(var i = 0; i < cards.kingdom.length; i++) {
			output += '<p>' + cards.kingdom[i] + '</p>';
		}

		if(cards.bane) {
			output += '<h2>Bane Card</h2>';
			output += '<p>' + cards.bane + '</p>'; 
		}

		$('.output').empty().append(output);
	}

	//Get random item from array
	function getRandom(items) {
		var item = items[Math.floor(Math.random() * items.length)];
		return item;
	}



	function setIdByName(name) {
		for(var set in sets) {
			//console.log(sets[set]);
			if(sets[set].name.toLowerCase() == name.toLowerCase()) {
				//console.log('returning ', set);
				return set;
			}
		}
		return false;
	}

	function setNameById(id) {
		for(var set in sets) {
			if(set == id) {
				return sets[set].name;
			}
		}
	}

	function pullCardsBySet(set) {
		//console.log(set);
		var cardsInSet = [];

		for(var i = 0; i < cards.length; i++) { //run backwards for speed?
			var card = cards[i];
			// console.log(card);
			if(card.setID == set) {
				//console.log('card', card);
				cardsInSet.push(card);
			}

			//add break if setID > set since start from beginning?
		}
		return cardsInSet;
	}




	function setHasType(set, type) {
		for(var i = 0; i < set.length; i++) {
			var card = set[i];
			
			if(fulfillsRequirement(card, type)) {
				return true;
			}

		}
		return false;			
	}



	function getCards2(setList) {
		kingdom.cards = [];
		kingdom.bane = null;

		kingdom.resetKingdom();
		kingdom.getRequirements();

		//for(var i = 0; i < 10; i++) {
		while(kingdom.cards.length < 10) {
			var card = getRandom(setList);

			var cardsToSearch = setList.slice();

			//Check a card against outstanding requirements
			//passing the set is to check if the set has the required cards - maybe should do earlier?
			while(!kingdom.checkRequirements(card, cardsToSearch)) {
				remove(card, cardsToSearch);
				//console.log('cardsToSearch.length = ', cardsToSearch.length);

				card = getRandom(cardsToSearch);
				//console.log('new card, passing ' + card.name);
			}

			//TESTING LOGS
			//console.log('passed: ', card.name);
			//console.log('removing ', card.name);
			//console.log(setList);


			//Add Moat if option selected and attack card in deck
			if(card['isAttack']) {
				if(kingdom.specReq.moat && !kingdom.hasCard('Moat')) {
					
					//Add moat if there's room
					if(kingdom.cards.length < 9) {
						//console.log('attack card, must add moat');
						kingdom.addCard(cardsByName['Moat']);
						
					} else { //If its the last card and no moat, draw another non-attack
						while(card['isAttack']) {
							//console.log('last is attack, redraw');
							card = getRandom(setList);
						}
					}

				}
			}
			//console.log('adding ' + card.name);
			kingdom.addCard(card);			
		}
		
		//Require bane
		if(kingdom.hasCard('Young Witch')) {
			kingdom.addBane();
		}
		console.log(kingdom);
	}


	function outputKingdom() {
		testDeck();
		validateDeck();

		//console.log('kingdom has buys: ', kingdom.hasType('buys'));

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

	function fulfillsRequirement(card, type) {
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







	function testDeck() {
		for(var prop in kingdom.requirements) {
			if(kingdom.requirements[prop]) {
				//console.log('Kingdom has ' + prop + ': ', kingdom.hasType(prop));				
			}
		}
	}

	function validateDeck() {
		for(var prop in kingdom.requirements) {

			if(kingdom.requirements[prop] && !kingdom.hasType(prop)) {
				//console.log('requirement true: ', prop);
				//console.log('kingdom has type: ', kingdom.hasType(prop));
				//console.log('Deck not valid, missing: ', prop);
			}
		} 
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