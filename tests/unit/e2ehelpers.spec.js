import { cardsMatch, cardListsMatch } from '../e2e/support/helpers';

describe('e2e helpers - cardsMatch', () => {
	it('cardsMatch matches exact match', () => {
		const aceOfSpades = {suit: 3, rank: 1};
		const aceOfSpades2 = {suit: 3, rank: 1};
		expect(cardsMatch(aceOfSpades, aceOfSpades2)).toBe(true);
	});
	it('cardsMatch can match when one card has id and the other does not', () => {
		const fourOfSpades = {suit: 3, rank: 4};
		const fourOfSpadesWithId = {suit: 3, rank: 4, id: 4};
		expect(cardsMatch(fourOfSpades, fourOfSpadesWithId)).toBe(true);
	});
	it('cardsMatch can match when both cards have different ids', () => {
		const fiveOfDiamonds = {suit: 1, rank: 5, id: 9};
		const fiveOfDiamondsDifferentId = {suit: 1, rank: 5, id: 1};
		expect(cardsMatch(fiveOfDiamonds, fiveOfDiamondsDifferentId)).toBe(true);
	})
	it('cardsMatch matches when key/values provided in different order', () => {
		const threeOfHearts = {suit: 2, rank: 3};
		const reversedAttributeOrder = {rank: 3, suit: 2};
		expect(cardsMatch(threeOfHearts, reversedAttributeOrder)).toBe(true);
	});
	it('cardsMatch returns false when suit is different', () => {
		const twoOfClubs = {suit: 0, rank: 2};
		const twoOfHearts = {suit: 2, rank: 2};
		expect(cardsMatch(twoOfClubs, twoOfHearts)).toBe(false);
	});
	it('cardsMatch returns false when rank is different', () => {
		const tenOfDiamonds = {suit: 1, rank: 10};
		const nineOfDiamonds = {suit: 1, rank: 9};
		expect(cardsMatch(tenOfDiamonds, nineOfDiamonds)).toBe(false);
	});
	it('cardsMatch returns false when both suit and rank are different', () => {
		const tenOfDiamonds = {suit: 1, rank: 10};
		const nineOfspades = {suit: 3, rank: 9};
		expect(cardsMatch(tenOfDiamonds, nineOfspades)).toBe(false);
	});
});

describe('e2e helpers - cardListsMatch', () => {
	it('cardListsMatch returns true for two unsorted lists with same cards', () => {
		const list1 = [
			{ suit: 3, rank: 2 }, // 2 of spades
			{ suit: 0, rank: 1 }, // ace of clubs
			{ suit: 2, rank: 3 }, // 3 of hearts
			{ suit: 1, rank: 1 }, // ace of diamonds
			{ suit: 3, rank: 13 }, // king of spades
			{ suit: 2, rank: 11 }, // jack of hearts
			{ suit: 1, rank: 9 }, // 9 of diamonds
		]
		const list2 = [
			{ suit: 0, rank: 1 }, // ace of clubs
			{ suit: 1, rank: 1 }, // ace of diamonds
			{ suit: 2, rank: 3 }, // 3 of hearts
			{ suit: 3, rank: 2 }, // 2 of spades
			{ suit: 1, rank: 9 }, // 9 of diamonds
			{ suit: 2, rank: 11 }, // jack of hearts
			{ suit: 3, rank: 13 }, // king of spades
		]
		expect(cardListsMatch(list1, list2)).toBe(true);
	});
	it('cardListsMatch returns true when suit cards match and match, with different orders and extraneous attributes', () => {
		const list1 = [
			{ suit: 3, rank: 2, id: 4}, // 2 of spades
			{ suit: 1, rank: 5 }, // 5 of diamonds
			{ suit: 0, rank: 1, id: 3, foo: 'bar' }, // ace of clubs
		];
		const matchesList1 = [
			{ suit: 3, rank: 2, id: 1}, // 2 of spades
			{ suit: 0, rank: 1 }, // ace of clubs
			{ rank: 5, suit: 1 }, // 5 of diamonds
		];
		expect(cardListsMatch(list1, matchesList1)).toBe(true);
	});
	it('cardListsMatch returns false when one card has different suit', () => {
		const list1 = [
			{ suit: 3, rank: 2 }, // 2 of spades
			{ suit: 0, rank: 1 }, // ace of clubs
		];
		const doesNotMatchlist1 = [
			{ suit: 2, rank: 2 }, // 2 of diamonds - doesn't match
			{ suit: 0, rank: 1 }, // ace of clubs
		];
		expect(cardListsMatch(list1, doesNotMatchlist1)).toBe(false);
	});
	it('cardListsMatch returns false when one card has different rank', () => {
		const list1 = [
			{ suit: 3, rank: 2 }, // 2 of spades
			{ suit: 0, rank: 1 }, // ace of clubs
		];
		const doesNotMatchlist1 = [
			{ suit: 3, rank: 2, id: 4}, // 2 of spades 
			{ suit: 0, rank: 2 }, // 2 of clubs - doesn't match
		];
		expect(cardListsMatch(list1, doesNotMatchlist1)).toBe(false);
	});
});
