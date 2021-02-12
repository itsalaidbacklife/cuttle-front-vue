export function hasValidSuitAndRank(card) {
    if (!Object.prototype.hasOwnProperty.call(card, 'rank')) return false;
    if (!Object.prototype.hasOwnProperty.call(card, 'suit')) return false;
    if (!Number.isInteger(card.rank)) return false;
    if (!Number.isInteger(card.suit)) return false;
    if (card.rank < 1 || card.rank > 13) return false;
    if (card.suit < 0 || card.suit > 3) return false;
    return true;
}
/**
 * @returns string name of card
 * @param {suit: number, rank: number} card 
 */
export function printCard(card) {
    if (!hasValidSuitAndRank(card)) {
        throw new Error('Cannot print object not shaped like card');
    }
    let res = '';
    switch (card.rank) {
        case 1:
            res += 'Ace'
            break;
        case 2:
            res += 'Two'
            break;
        case 3:
            res += 'Three'
            break;
        case 4:
            res += 'Four'
            break;
        case 5:
            res += 'Five'
            break;
        case 6:
            res += 'Six'
            break;
        case 7:
            res += 'Seven'
            break;
        case 8:
            res += 'Eight'
            break;
        case 9:
            res += 'Nine'
            break;
        case 10:
            res += 'Ten'
            break;
        case 11:
            res += 'Jack'
            break;
        case 12:
            res += 'Queen'
            break;
        case 13:
            res += 'King'
            break;
    }
    res += ' of ';
    const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
    res += suits[card.suit];
    return res;
}
export function printCardList(cards) {
    return cards.map(printCard).join(', ');
}
export function cardsMatch(card1, card2) {
	return card1.rank === card2.rank && card1.suit === card2.suit;
}

/**
 * @param game: game obj from $store
 * @param suitAndRankList: {suit: number, rank: number}[]
 * @returns lit of ids of specified cards
 */
export function getCardIds(game, suitAndRankList) {
	return suitAndRankList.map((card) => {
		if (cardsMatch(card, game.topCard)) return game.topCard.id;
		if (cardsMatch(card, game.secondCard)) return game.secondCard.id;

		const foundInScrap = game.scrap.find((scrapCard) => cardsMatch(card, scrapCard));
		if (foundInScrap) return foundInScrap.id;
		
		const foundInP0Hand = game.players[0].hand.find((handCard) => cardsMatch(card, handCard));
		if (foundInP0Hand) return foundInP0Hand.id;

		const foundInP1Hand = game.players[1].hand.find((handCard) => cardsMatch(card, handCard));
		if (foundInP1Hand) return foundInP1Hand.id;

		const foundInDeck = game.deck.find((deckCard) => cardsMatch(card, deckCard));
		if (foundInDeck) return foundInDeck.id;
		
		throw new Error(`Could not find desired card ${card.rank} of ${card.suit} in deck, scrap, or either player's hand`);
	});
}

function cardSortComparator(card1, card2) {
	let res = card1.rank - card2.rank;
	if (res === 0) res = card1.suit - card2.suit;
	return res;
}
export function cardListsMatch(list1, list2) {
	if (list1.length != list2.length) {
		return false;
	}
	list1.sort(cardSortComparator);
	list2.sort(cardSortComparator);
	for (let i = 0; i < list1.length; i++) {
		if (!cardsMatch(list1[i], list2[i])) {
			return false;
		}
    }
	return true;
}
/**
 * @returns whether store's game state matches fixture specification
 * @param fixture
 * {
 * 	 p0Hand: {suit: number, rank: number}[],
 *   p0Points: {suit: number, rank: number}[],
 *   p0FaceCards: {suit: number, rank: number}[],
 *   p1Hand: {suit: number, rank: number}[],
 *   p1Points: {suit: number, rank: number}[],
 *   p1FaceCards: {suit: number, rank: number}[],
 * }
 */
export function assertGameState(fixture) {
	cy
		.window()
		.its('app.$store.state.game')
		.then((game) => {
            // Player 0
            expect(cardListsMatch(game.players[0].hand, fixture.p0Hand)).to.eq(true, 'P0 Hand should match fixture');
            expect(cardListsMatch(game.players[0].points, fixture.p0Points)).to.eq(true, 'P0 Points should match fixture');
            expect(cardListsMatch(game.players[0].runes, fixture.p0FaceCards)).to.eq(true, 'P0 Face Cards should match fixture');
            // Player 1
            expect(cardListsMatch(game.players[1].hand, fixture.p1Hand)).to.eq(true, `P1 Hand should match fixture -- actual: ${printCardList(game.players[1].hand)} did not match ficture: ${printCardList(fixture.p1Hand)}`);
            expect(cardListsMatch(game.players[1].points, fixture.p1Points)).to.eq(true, 'P1 Points should match fixture');
            expect(cardListsMatch(game.players[1].runes, fixture.p1FaceCards)).to.eq(true, 'P1 Face Cards should match fixture');
		});
}