//Version 1.0

//Add more options later

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


	eventHandler();

	var cardList = {
		'base' : ['Cellar', 'Chapel', 'Moat', 'Chancellor', 'Village', 'Woodcutter', 'Workshop', 
				'Bureaucrat', 'Feast', 'Gardens', 'Militia', 'Moneylender', 'Remodel', 'Smithy', 'Spy',
				'Thief', 'Throne Room', 'Council Room', 'Festival', 'Laboratory', 'Library', 'Market', 'Mine',
				'Witch', 'Adventurer'],

		'intrigue' : ['Courtyard', 'Pawn', 'Secret Chamber', 'Great Hall', 'Masquerade', 'Shanty Town', 
					'Steward', 'Swindler', 'Wishing Well', 'Baron', 'Bridge', 'Conspirator', 'Coppersmith',
					'Ironworks', 'Mining Village', 'Scout', 'Duke', 'Minion', 'Saboteur', 'Torturer', 
					'Trading Post', 'Tribute', 'Upgrade', 'Harem','Nobles'],

		'seaside' : ['Embargo', 'Haven', 'Lighthouse', 'Native Village', 'Pearl Diver', 'Ambassador',
					'Fishing Village', 'Lookout', 'Smugglers', 'Warehouse', 'Caravan', 'Cutpurse',
					'Island', 'Navigator', 'Pirate Ship', 'Salvager', 'Sea Hag', 'Treasure Map', 
					'Bazaar', 'Explorer', 'Ghost Ship', 'Merchant Ship', 'Outpost', 'Tactician', 'Treasury',
					'Wharf'],

		'alchemy' : ['Herbalist', 'Apprentice', 'Transmute', 'Vineyard', 'Apothecary', 'Scrying Pool',
					'University', 'Alchemist', 'Familiar', 'Philosopher\'s Stone', 'Golem', 'Possession'],

		'prosperity' : ['Loan', 'Trade Route', 'Watchtower', 'Bishop', 'Monument', 'Quarry', 'Talisman',
						'Worker\'s Village', 'City', 'Contraband', 'Counting House', 'Mint', 'Mountebank',
						'Rabble', 'Royal Seal', 'Vault', 'Venture', 'Goons', 'Grand Market', 'Hoard', 'Bank',
						'Expand', 'Forge', 'King\'s Court', 'Peddler'],

		'cornucopia' : ['Hamlet', 'Fortune Teller', 'Menagerie', 'Farming Village', 'Horse Traders', 'Remake', 
						'Tournament', 'Young Witch', 'Harvest', 'Horn of Plenty', 'Hunting Party', 'Jester',
						'Fairgrounds'],

		'hinterlands' : ['Crossroads', 'Duchess', 'Fool\'s Gold', 'Develop', 'Oasis', 'Oracle', 'Scheme', 
						'Tunnel', 'Jack of all Trades', 'Noble Brigand', 'Nomad Camp', 'Silk Road', 
						'Spice Merchant', 'Trader', 'Cache', 'Cartographer', 'Embassy', 'Haggler', 'Highway', 
						'Ill-Gotten Gains', 'Inn', 'Mandarin', 'Margrave', 'Stables', 'Border Village',
						 'Farmland'],

		'dark ages' : ['Poor House', 'Beggar', 'Squire', 'Vagrant', 'Forager', 'Hermit', 'Market Square', 
						'Sage', 'Storeroom', 'Urchin', 'Armory', 'Death Cart', 'Feodum', 'Fortress', 
						'Ironmonger', 'Marauder', 'Procession', 'Rats', 'Scavenger', 'Wandering Minstrel', 
						'Band of Misfits', 'Bandit Camp', 'Catacombs', 'Count', 'Counterfeit', 'Cultist', 
						'Graverobber', 'Junk Dealer', 'Knights', 'Mystic', 'Pillage', 'Rebuild', 'Rogue', 
						'Altar', 'Hunting Grounds'],

		'guilds' : ['Candlestick Maker', 'Stonemason', 'Doctor', 'Masterpiece', 'Advisor', 'Plaza', 'Taxman', 
					'Herald', 'Baker', 'Butcher', 'Journeyman', 'Merchant Guild', 'Soothsayer'],

		'adventures' : ['Coin of the Realm', 'Page', 'Peasant', 'Ratcatcher', 'Raze', 'Amulet', 'Caravan Guard',
						'Dungeon', 'Gear', 'Guide', 'Duplicate', 'Magpie', 'Messenger', 'Miser', 'Port', 'Ranger',
						'Transmogrify', 'Artificer', 'Bridge Troll', 'Distant Lands', 'Giant', 'Haunted Woods',
						'Lost City', 'Relic', 'Royal Carriage', 'Storyteller', 'Swamp Hag', 'Treasure Trove',
						' Wine Merchant', 'Hireling'],

		'promo' : ['Envoy', 'Black Market', 'Stash', 'Walled Village', 'Governor', 'Prince']
	}

	var attackCards = ['Bureaucrat', 'Militia', 'Spy', 'Thief', 'Witch', 'Swindler', 'Minion', 'Saboteur',
				'Torturer', 'Ambassador', 'Cutpurse', 'Pirate Ship', 'Sea Hag', 'Ghost Ship', 'Scrying Pool',
				'Familiar', 'Mountebank', 'Rabble', 'Goons', 'Fortune Teller', 'Young Witch', 'Jester',
				'Followers', 'Oracle', 'Noble Brigand', 'Margrave', 'Urchin', 'Mercenary', 'Marauder',
				'Cultist', 'Knights', 'Pillage', 'Rogue', 'Taxman', 'Soothsayer', 'Warrior', 'Solider',
				'Bridge Troll', 'Giant', 'Haunted Woods', 'Swamp Hag', 'Relic'];

	//Wraps labels in div so each appears on own line
	function mobileWrap() {
		$('.sets label').wrap('<div></div>');
	}

	//Unwraps labels when resized from small to large screen
	function mobileUnwrap() {
		$('.sets div label').unwrap();
	}

	//Attaches event handers to checkboxes and button
	function eventHandler() {

		//Check all checkboxes		
		$('input[value="all"]').change(function(){
			if(this.checked) {
				$('.sets input').prop('checked', true);				
			} else {
				$('.sets input').not('[value="base"]').prop('checked', false);
			}
		});

		//Get kingdom cards on button click
		$('.get-cards').click(function() {
			
			if( canRun() ) { //At least one checkbox selected
				var sets = getSets();
				var cards = getCards(sets);
				outputCards(cards);

			} else { //No checkboxes checked				
				var msg = $('<p>');
				msg.text('Please select at least one set.');
				$('.output').empty().append(msg);
			}

		});
	}

	//Checks that at least one set checkbox is checked
	function canRun() {
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

			//Add Moat if attack cards in supply
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


		//Add bane if Young Witch in supply
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
		var output='<h2>Kingdom Cards</h2>';
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

})();