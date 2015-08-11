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

		
	function mobileWrap() {
		$('.sets label').wrap('<div></div>');
	}

	function mobileUnwrap() {
		$('.sets div label').unwrap();
	}



	function eventHandler() {
		
		$('input[value="all"]').change(function(){
			if(this.checked) {
				$('.sets input').prop('checked', true);				
			} else {
				$('.sets input').not('[value="base"]').prop('checked', false);
			}
		});


		$('.get-cards').click(function() {
			
			if( canRun() ) {
				console.log('true yo');
				var sets = getSets();
				var cards = getCards(sets);
				
				if($(window).width() >= 800) {
					
					mobileOutput(cards);
					// outputCards(cards);					
				} else {
					mobileOutput(cards);
				}

			} else {
				
				var msg = $('<p>');
				msg.text('Please select at least one set.');

				$('.output').empty().append(msg);
			}

		});
	}

	function canRun() {
		var selected = false;

		$('.sets input[type="checkbox"]').each(function() {
			if(this.checked) {
				console.log(this);
				selected = true;
				console.log(selected);
			} 
		});
		return selected;
	}

	function getSets() {
		var setsToUse = [];
		console.log('selected: ', setsToUse);

		$('.sets input[type="checkbox"]').not('[value="all"]').each(function() {
			
			if(this.checked) {
				var set = this.value;
				console.log('value: ', this.value);
				setsToUse = setsToUse.concat(cardList[set]);				
			}
		});
		console.log('sets: ', setsToUse);
		return setsToUse;		
	}

	function getCards(sets) {
		var cardsToUse = {
			"kingdom" : [],
			"bane": null
		};

		console.log('moat: ', $('input[name="moat"]')[0].checked);

		for(var i = 0; i < 10; i++) {
			var card = getRandom(sets);
			console.log('card ', i, 'is ', card);
			while(cardsToUse.kingdom.indexOf(card) > -1) {
				console.log('draw new card');
				card = getRandom(sets);
			}


			//Add Moat if attack cards in supply
			if( $('input[name="moat"]')[0].checked ) {
					
				if(cardsToUse.kingdom.indexOf('Moat') == -1) {
					
					if(attackCards.indexOf(card) > -1 ) {
						console.log('we have an attack card: ', card);

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


		//Check if bane card needed
		if(cardsToUse.kingdom.indexOf('Young Witch') > -1) {
			var bane = getRandom(sets);
			while(cardsToUse.kingdom.indexOf(bane) > -1) {
				bane = getRandom(sets);
			}
			cardsToUse.bane = bane;
		}
		console.log(cardsToUse);

		return cardsToUse;
	}

	function outputCards(cards) {
		clearOutputArea();

		var output = '<h2>Kingdom Cards</h2>';
		output += '<div class="row">';
		for(var i = 0; i < cards.kingdom.length; i++) {
			var card = '<div class="col-1"><div class="card"><p>' + cards.kingdom[i] + '</p></div></div>';


			
			//new row after 5 cards
			if(i == 4) {
				card += '</div><div class="row">';
			}
			output += card;
		}
		output += '</div>'; //end row

		//ADD BANE PILE
		if(cards.bane) {
			var bane = '<div class="col-1"><div class="card"><p>' + cards.bane + '</p></div></div>';

			// var bane = '<div class="col-1"><div class="card bane"><p>Bane</p></div></div>' +
						// '<div class="col-1"><div class="card"><p>' + cards.bane + '</p></div></div>';

			output += '<h2>Bane Card</h2>';
			output += '<div class="row">' + bane + '</div>';
		}

		$('.output').append(output);

		$('html, body').animate({
    		scrollTop: $('.output').offset().top
		}, 1000);
	}

	function mobileOutput(cards) {
		var output='<h2>Kingdom Cards</h2>';
		for(var i = 0; i < cards.kingdom.length; i++) {
			output += '<p>' + cards.kingdom[i] + '</p>';
		}

		if(cards.bane) {
			output += '<h2>Bane Card</h2>';
			output += '<p>' + cards.bane + '</p>'; 
		}

		$('.output').empty().append(output);

		// $('html, body').animate({
  //   		scrollTop: $('.output').offset().top
		// }, 1000);
	}

	function clearOutputArea() {
		$('.output').empty();
	}

	function getRandom(items) {
		var item = items[Math.floor(Math.random() * items.length)];
		return item;
	}

})();