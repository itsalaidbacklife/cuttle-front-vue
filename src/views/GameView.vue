<template>
	<div id="game-view-wrapper">
		<!-- Opponent Hand -->
		<div 
			id="opponent-hand"
			class="d-flex flex-column justify-start align-center px-2 pb-2 mx-auto" 
		>
			<div 
				id="opponent-hand-cards"
				class="d-flex justify-center align-start"
			>
				<div
					v-if="hasGlassesEight"
					id="opponent-hand-glasses"
					class="opponent-hand-wrapper"
				>
					<card
						v-for="card in opponent.hand"
						:key="card.id"
						:suit="card.suit"
						:rank="card.rank"
						:data-opponent-hand-card="`${card.rank}-${card.suit}`"
						class="opponent-hand-card-revealed"
					/>
				</div>
				<div
					v-else
					class="opponent-hand-wrapper"
				>
					<div
						v-for="card in opponent.hand"
						:key="card.id"
						class="opponent-card-back mx-2"
						data-opponent-hand-card
					/>
				</div>
			</div>
			<h3
				id="opponent-score"
				class="mt-2"
			>
				<span>POINTS: {{ opponentPointTotal }}</span>
				<span class="ml-4">TARGET: {{ opponentPointsToWin }}</span>
			</h3>
		</div>
		<!-- Field -->
		<div
			id="field"
			class="d-flex justify-center align-center p-2 mx-auto"
		>
			<div id="field-left">
				<div
					id="deck"
					@click="drawCard"
				>
					<p>Deck</p>
					<p>({{ deck.length }})</p>
				</div>
				<div
					id="scrap"
					:class="{'valid-move': validMoves.includes('scrap')}"
					@click="playOneOff"
				>
					<p>Scrap</p>
					<p>({{ scrap.length }})</p>
				</div>
			</div>
			<div id="field-center">
				<div id="opponent-field">
					<div class="field-points">
						<card 
							v-for="(card, index) in opponent.points"
							:key="card.id"
							:suit="card.suit"
							:rank="card.rank"
							:is-valid-target="validMoves.includes(card.id)"
							:data-opponent-point-card="`${card.rank}-${card.suit}`"
							@click="targetOpponentPointCard(index)"
						/>
					</div>
					<div class="field-effects">
						<card 
							v-for="card in opponent.runes"
							:key="card.id"
							:suit="card.suit"
							:rank="card.rank"
							:is-glasses="card.rank === 8"
							:data-opponent-face-card="`${card.rank}-${card.suit}`"
						/>
					</div>
				</div>
				<v-divider light />
				<div
					id="player-field"
					:class="{'valid-move': validMoves.includes('field')}"
					@click="playToField"
				>
					<div class="field-points">
						<card 
							v-for="card in player.points"
							:key="card.id"
							:suit="card.suit"
							:rank="card.rank"
							:data-player-point-card="`${card.rank}-${card.suit}`"
						/>
					</div>
					<div class="field-effects">
						<card
							v-for="card in player.runes"
							:key="card.id"
							:suit="card.suit"
							:rank="card.rank"
							:is-glasses="card.rank === 8"
							:data-player-face-card="`${card.rank}-${card.suit}`"
						/>
					</div>
				</div>
			</div>
			<div id="field-right">
				<div 
					v-if="selectedCard === null"
					id="history"
				>
					History
				</div>
				<div 
					v-if="selectedCard !== null"
					id="card-preview"	
				>
					<card 
						:suit="selectedCard.suit"
						:rank="selectedCard.rank"
					/>
					<p>{{ selectedCard.ruleText }}</p>
				</div>
			</div>
		</div>
		<!-- Player Hand -->
		<div
			id="player-hand"
			class="d-flex flex-column justify-end align-center px-2 pt-2 mx-auto"
		>
			<h3
				id="player-score"
				class="mb-2"
			>
				<span>POINTS: {{ playerPointTotal }}</span>
				<span 
					class="ml-4"
					data-cy="player-points-to-win"
				>
					TARGET: {{ playerPointsToWin }}
				</span>
			</h3>

			<div
				id="player-hand-cards"
				class="d-flex justify-center align-start"
			> 
				<card
					v-for="(card, index) in player.hand"
					:key="card.id"
					:suit="card.suit"
					:rank="card.rank"
					:is-selected="selectedCard && card.id === selectedCard.id"
					class="mt-8"
					:data-player-hand-card="`${card.rank}-${card.suit}`"
					@click="selectCard(index)"
				/>
			</div>
		</div>
		<v-snackbar
			v-model="showSnack"
			:color="snackColor"
			content-class="d-flex justify-space-between align-center"
			data-cy="game-snackbar"
		>
			{{ snackMessage }}
			<v-btn icon>
				<v-icon
					data-cy="close-snackbar"
					@click="clearSnackBar"
				>
					mdi-close
				</v-icon>
			</v-btn>
		</v-snackbar>
		<v-overlay
			id="waiting-for-opponent-scrim"
			v-model="waitingForOpponent"
			opacity=".6"
		>
			<h1>
				Waiting for Opponent
			</h1>
		</v-overlay>
		<counter-dialog
			v-model="showCounterDialog"
			:one-off="game.oneOff"
			:twos-in-hand="twosInHand"
			@resolve="resolve"
			@counter="counter($event)"
		/>
		<cannot-counter-dialog
			v-model="showCannotCounterDialog"
			:one-off="game.oneOff"
			@resolve="resolve"
		/>
		<eight-overlay
			v-if="selectedCard && selectedCard.rank === 8"
			v-model="showEightOverlay"
			:card="selectedCard"
			@points="playPoints"
			@glasses="playFaceCard"
			@cancel="clearOverlays"
		/>
	</div>
</template>

<script>
import Card from '@/components/GameView/Card.vue';
import CannotCounterDialog from '@/components/GameView/CannotCounterDialog.vue';
import CounterDialog from '@/components/GameView/CounterDialog.vue';
import EightOverlay from '@/components/GameView/EightOverlay.vue';

export default {
	name: 'GameView',
	components: {
		Card,
		CannotCounterDialog,
		CounterDialog,
		EightOverlay
	},
	data() {
		return {
			showSnack: false,
			snackMessage: '',
			snackColor: 'error',
			selectionIndex: null, // when select a card set this value
			showEightOverlay: false,
		}
	},
	computed: {
		//////////////////////////
		// Game, Deck and Scrap //
		//////////////////////////
		game() {
			return this.$store.state.game;
		},
		deck() {
			return this.game.deck;
		},
		scrap() {
			return this.game.scrap;
		},
		////////////////////
		// Player Objects //
		////////////////////
		player() {
			return this.game.players[this.$store.state.game.myPNum];
		},
		opponent() {
			return this.$store.getters.opponent;
		},
		//////////////////
		// Point Totals //
		//////////////////
		playerPointTotal() {
			return this.player.points.reduce((total, card)=> total + card.rank, 0) || 0;
		},
		opponentPointTotal() {
			return this.opponent.points.reduce((total, card)=> total + card.rank, 0) || 0;
		},
		///////////////////
		// Points to Win //
		///////////////////
		playerPointsToWin() {
			return this.pointsToWin(this.kingCount(this.player));
		},
		opponentPointsToWin() {
			return this.pointsToWin(this.kingCount(this.opponent));
		},
		//////////////////
		// Interactions //
		//////////////////
		selectedCard() {
			return this.selectionIndex !== null ? this.player.hand[this.selectionIndex]: null;
		},
		isPlayersTurn() {
			return this.game.turn % 2 === this.game.myPNum
		},
		waitingForOpponent() {
			return this.game.waitingForOpponent;
		},
		myTurnToCounter() {
			return this.game.myTurnToCounter;
		},
		twosInHand() {
			return this.player.hand.filter((card) => card.rank === 2);
		},
		hasTwoInHand() {
			return this.twosInHand.length > 0;
		},
		hasGlassesEight() {
			return this.player.runes
				.filter((card) => card.rank === 8)
				.length > 0;
		},
		showCannotCounterDialog() {
			return this.myTurnToCounter && !this.hasTwoInHand;
		},
		showCounterDialog() {
			return this.myTurnToCounter && this.hasTwoInHand;
		},
		validScuttleIds() {
			if (!this.selectedCard) return [];
			return this.opponent.points
				.filter((potentialTarget) => {
					return this.selectedCard.rank > potentialTarget.rank || 
						(
							this.selectedCard.rank === potentialTarget.rank && 
							this.selectedCard.suit > potentialTarget.suit
						);
				})
				.map((validTarget) => validTarget.id);			
		},
		validMoves() {
			let res = [];
			if (!this.selectedCard) return res;

			switch (this.selectedCard.rank) {
			case 1:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
				res.push('field');
				res.push('scrap');
				res = [...res, ...this.validScuttleIds];
				break;
			case 8:
			case 10:
				res.push('field');
				res = [...res, ...this.validScuttleIds];
				break;
			case 9:
				res.push('field');
				res = [...res, ...this.validScuttleIds];
				break;
			case 2:
				res.push('field');
				res = [...res, ...this.validScuttleIds];
				break;
			case 11:
				break;
			case 12:
			case 13:
				res.push('field');
				break;
			}
			return res;
		},
	},
	methods: {
		clearSnackBar() {
			this.snackMessage = '';
			this.showSnack = false;
		},
		handleError(err) {
			this.snackMessage = err;
			this.snackColor = 'error';
			this.showSnack = true;
			this.clearSelection();
		},
		clearOverlays() {
			this.showEightOverlay = false;
		},
		clearSelection() {
			this.selectionIndex = null;
		},
		selectCard(index) {
			if (index === this.selectionIndex){
				this.clearSelection();
			} else {
				this.selectionIndex = index;
			}
		},
		/**
		 * Returns number of kings a given player has
		 * @param player is the player object
		 */
		kingCount(player) {
			return player.runes.reduce((kingCount, card) => kingCount + (card.rank === 13 ? 1 : 0), 0);
		},
		/**
		 * Returns the number of points to win
		 * based on the number of kings a player has
		 * @param kingCount: int number of kings (expected 0-4)
		 */
		pointsToWin(kingCount) {
			switch(kingCount) {
			case 0:
				return 21;
			case 1:
				return 14;
			case 2:
				return 10;
			case 3:
				return 7;
			case 4:
				return 5;
			default:
				console.log(`Error: calculating pointsToWin and found invalid kingcount: ${kingCount}`);
				return 21;
			}
		},
		//////////////////
		// Player Moves //
		//////////////////
		drawCard() {
			this.$store.dispatch('requestDrawCard')
				.then(this.clearSelection())
				.catch((err) => {
					this.snackMessage = err;
					this.snackColor = 'error';
					this.showSnack = true;
					this.clearSelection();
				});
		},
		playPoints() {
			this.clearOverlays();
			this.$store.dispatch('requestPlayPoints', this.selectedCard.id)
				.then(this.clearSelection())
				.catch(this.handleError);
		},
		playFaceCard() {
			this.clearOverlays();
			this.$store.dispatch('requestPlayFaceCard', this.selectedCard.id)
				.then(this.clearSelection())
				.catch(this.handleError);
		},
		scuttle(targetIndex) {
			this.$store.dispatch('requestScuttle', {
				cardId: this.selectedCard.id,
				targetId: this.opponent.points[targetIndex].id,
			})
				.then(this.clearSelection())
				.catch(this.handleError);
		},
		playToField() {
			if (!this.selectedCard) return;

			switch (this.selectedCard.rank) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 9:
			case 10:
				this.playPoints();
				return;
			case 12:
			case 13:
				this.playFaceCard();
				return;
			case 8:
				// Ask whether to play as points or face card
				if (this.isPlayersTurn) {
					this.showEightOverlay = true;
				}
				else {
					this.handleError('It\'s not your turn!');
				}
				return;
			default:
				return;
			}
		}, // End playToField()
		targetOpponentPointCard(targetIndex) {
			if (!this.selectedCard) return;

			switch (this.selectedCard.rank) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 10:
				this.scuttle(targetIndex);
				return;
			case 11:
				return;
			case 9:
				// Determine whether to scuttle or play as one-off
				return;
			default:
				return;
			}
		},
		playOneOff() {
			if (!this.selectedCard) return;

			this.$store.dispatch('requestPlayOneOff', this.selectedCard.id)
				.then(this.clearSelection)
				.catch(this.handleError);
		},
		resolve() {
			this.$store.dispatch('requestResolve')
				.then(this.clearSelection)
				.catch(this.handleError);
		},
		counter(twoId) {
			this.$store.dispatch('requestCounter', twoId)
				.then(this.clearSelection)
				.catch(this.handleError);
		},
	},
}
</script>

<style lang="scss" scoped>
#game-view-wrapper {
	color: #FFF;
	width: 100%;
	height: 100%;
	background: linear-gradient(180deg, #6202EE 14.61%, #FD6222 100%), #C4C4C4;
}

.valid-move {
	background-color: var(--v-accent-lighten1);
	opacity: .6;
	cursor: pointer;
}

#opponent-hand {
	min-width: 50%;
	height: 20vh;
}

#opponent-hand-cards {
	height: 80%;
	background: rgba(0, 0, 0, 0.46);

	& #opponent-hand-glasses {
		margin-top: -48px;
		.opponent-hand-card-revealed {
			transform: scale(.8);
		}
	}

	& .opponent-hand-wrapper {
		display: flex;
		position: relative;
		height: 100%;

		& .opponent-card-back {
			height: 90%;
			width: 10vw;
			display: inline-block;
			position: relative;
			background: conic-gradient(from 259.98deg at 49.41% 65.83%, #6020EE 0deg, #FD6222 360deg), #858585;
			transform: rotate(180deg);
		}
	}

}
#field {
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 50vh;
}
#field-left {
	width: 20%;
	& #deck {
		cursor: pointer;
	}
	& #deck, & #scrap{
		width: 80%;
		height: 80%;
		margin: 10px;
		border: 1px solid #FFF;
		height: 29vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
}
#field-center {
	width: 60%;
}
#field-right {
	height: 100%;
	width: 20%;

	#history, #card-preview {
		margin: 0 auto;
		padding: 5px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border: 1px solid #FFF;
		width: 80%;
		max-width: 80%;
		height: 100%;
	}
}
#field-left,#field-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
#opponent-field,#player-field {
	width: 100%;
	height: 29vh;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.field-points {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 50%
}
.field-effects {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 50%
}

#player-hand-cards {
	width: 100%;
	height: 80%;
	background: rgba(0, 0, 0, 0.46);
}

#player-hand {
	min-width: 50%;
	height: 30vh;
	& #player-hand-cards {
		height: 80%;
		background: rgba(0, 0, 0, 0.46);
		overflow-y: hidden;
	}
}
</style>
