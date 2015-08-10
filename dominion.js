(function() {
	'use strict';

	handler();

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

	function handler() {
		$('.get-cards').click(function() {
			console.log(canRun());
			if( canRun() ) {
				console.log('true yo');
				var sets = getSets();
				var cards = getCards(sets);
				outputCards(cards);				
			} else {
				
				var msg = $('<p>');
				msg.text('Please select at least one set.');

				$('.output').empty().append(msg);
			}

		});
	}

	function canRun() {
		var selected = false;

		$('input[type="checkbox"]').each(function() {
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

		$('input[type="checkbox"]').each(function() {
			
			if(this.checked) {
				var set = this.value;
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

		for(var i = 0; i < 10; i++) {
			var card = getRandom(sets);
			console.log('card is ', card);
			while(cardsToUse.kingdom.indexOf(card) > -1) {
				console.log('draw new card');
				card = getRandom(sets);
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

		var output = '<div class="row">';
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
			var bane = '<div class="col-1"><div class="card bane"><p>Bane</p></div></div>' +
						'<div class="col-1"><div class="card"><p>' + cards.bane + '</p></div></div>';

			output += '<div class="row">' + bane + '</div>';
		}

		$('.output').append(output);

		$('html, body').animate({
    		scrollTop: $('.output').offset().top
		}, 1000);
	}

	function clearOutputArea() {
		$('.output').empty();
	}

	function getRandom(items) {
		var item = items[Math.floor(Math.random() * items.length)];
		return item;
	}

})();