<template>
	<div id="game-view-wrapper">
		<div id="game-menu-wrapper">
			<game-menu />
		</div>
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
				<score-goal-tool-tip
					:king-count="opponentKingCount"
					:points-to-win="opponentPointsToWin"
					:is-player="false"
				/>
			</h3>
		</div>
		<!-- Field -->
		<div
			id="field"
			class="d-flex justify-center align-center p-2 mx-auto"
		>
			<div id="field-left">
				<v-card
					id="deck"
					:class="{'reveal-top-two': resolvingSeven, 'my-turn': isPlayersTurn}"
					@click="drawCard"
				>
					<template v-if="!resolvingSeven">
						<v-img
							:src="require('../assets/logo_head.svg')"
							:width="deckLogoWidth"
							contain
						/>
						<v-card-actions>({{ deckLength }})</v-card-actions>
						<h1
							v-if="deckLength === 0"
							id="empty-deck-text"
						>
							PASS
						</h1>
					</template>

					<template v-if="resolvingSeven">
						<p class="mt-2">
							Play from Deck
						</p>
						<div class="d-flex">
							<card
								v-if="topCard"
								:suit="topCard.suit"
								:rank="topCard.rank"
								:data-top-card="`${topCard.rank}-${topCard.suit}`"
								:is-selected="topCardIsSelected"
								class="mb-4"
								@click="selectTopCard"
							/>
							<card
								v-if="secondCard"
								:suit="secondCard.suit"
								:rank="secondCard.rank"
								:data-second-card="`${secondCard.rank}-${secondCard.suit}`"
								:is-selected="secondCardIsSelected"
								class="mb-4"
								@click="selectSecondCard"
							/>
						</div>
					</template>
				</v-card>
				<div
					id="scrap"
					class="rounded"
					:class="{'valid-move': validMoves.includes('scrap')}"
					@click="playOneOff"
				>
					<v-overlay
						v-ripple
						:value="validMoves.includes('scrap')"
						absolute
						color="accent lighten-1"
						opacity=".6"
						class="d-flex flex-column align-center justify-center"
					>
						<p class="black--text">
							Scrap
						</p>
						<p
							class="black--text"
							style="text-align: center"
						>
							({{ scrap.length }})
						</p>
					</v-overlay>
					<p>Scrap</p>
					<p>({{ scrap.length }})</p>
				</div>
			</div>
			<div id="field-center">
				<div id="opponent-field">
					<div class="field-points">
						<div 
							v-for="(card, index) in opponent.points"
							:key="card.id"
							class="field-point-container"
						>
							<card 
								:suit="card.suit"
								:rank="card.rank"
								:is-valid-target="validMoves.includes(card.id)"
								:data-opponent-point-card="`${card.rank}-${card.suit}`"
								@click="targetOpponentPointCard(index)"
							/>
							<div class="jacks-container">
								<card 
									v-for="jack in card.attachments"
									:key="jack.id"
									:suit="jack.suit"
									:rank="jack.rank"
									:is-jack="true"
									:is-valid-target="validMoves.includes(jack.id)"
									:data-opponent-face-card="`${jack.rank}-${jack.suit}`"
									@click="targetOpponentFaceCard(-index-1)"
								/>
							</div>
						</div>
					</div>
					<div class="field-effects">
						<card 
							v-for="(card, index) in opponent.runes"
							:key="card.id"
							:suit="card.suit"
							:rank="card.rank"
							:is-glasses="card.rank === 8"
							:is-valid-target="validMoves.includes(card.id)"
							:data-opponent-face-card="`${card.rank}-${card.suit}`"
							@click="targetOpponentFaceCard(index)"
						/>
					</div>
				</div>
				<v-divider light />
				<div
					id="player-field"
					class="mb-4"
					:class="{'valid-move': validMoves.includes('field')}"
					@click="playToField"
				>
					<v-overlay
						v-ripple
						:value="validMoves.includes('field')"
						absolute
						color="accent lighten-1"
						opacity=".6"
					/>
					<div class="field-points">
						<div 
							v-for="card in player.points"
							:key="card.id"
							class="field-point-container"
						>
							<card
								:suit="card.suit"
								:rank="card.rank"
								:jacks="card.attachments"
								:data-player-point-card="`${card.rank}-${card.suit}`"
							/>
							<div class="jacks-container">
								<card 
									v-for="jack in card.attachments"
									:key="jack.id"
									:suit="jack.suit"
									:rank="jack.rank"
									:is-jack="true"
									:data-player-face-card="`${jack.rank}-${jack.suit}`"
								/>
							</div>
						</div>
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
					class="rounded d-flex flex-column justify-start"
				>
					<h3>History</h3>
					<v-divider />
					<div 
						id="history-logs" 
						ref="logsContainer" 
						class="d-flex flex-column justify-start mt-2 text-caption"
					>
						<p
							v-for="(log, index) in logs"
							:key="index"
						>
							{{ log }}
						</p>
					</div>
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
			>
				<span>POINTS: {{ playerPointTotal }}</span>
				<score-goal-tool-tip
					:king-count="playerKingCount"
					:points-to-win="playerPointsToWin"
					:is-player="true"
				/>
			</h3>

			<div
				id="player-hand-cards"
				class="d-flex justify-center align-start"
				:class="{'my-turn': isPlayersTurn}"
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
			id="waiting-for-opponent-counter-scrim"
			v-model="waitingForOpponentToCounter"
			opacity=".6"
		>
			<h1>
				Opponent May Counter
			</h1>
		</v-overlay>
		<v-overlay
			id="waiting-for-opponent-discard-scrim"
			v-model="waitingForOpponentToDiscard"
			opacity=".6"
		>
			<h1>Opponent Is Discarding</h1>
		</v-overlay>
		<v-overlay
			id="waiting-for-opponent-resolve-three-scrim"
			v-model="waitingForOpponentToPickFromScrap"
			opacity=".6"
		>
			<h1>
				Opponent Choosing Card from Scrap
			</h1>
		</v-overlay>
		<v-overlay
			id="waiting-for-opponent-play-from-deck-scrim"
			v-model="waitingForOpponentToPlayFromDeck"
			opacity=".6"
		>
			<h1>
				Opponent Playing from Deck
			</h1>
		</v-overlay>
		<counter-dialog
			v-model="showCounterDialog"
			:one-off="game.oneOff"
			:target="game.oneOffTarget"
			:twos-in-hand="twosInHand"
			@resolve="resolve"
			@counter="counter($event)"
		/>
		<cannot-counter-dialog
			v-model="showCannotCounterDialog"
			:one-off="game.oneOff"
			:target="game.oneOffTarget"
			@resolve="resolve"
		/>
		<four-dialog
			v-model="discarding"
			@discard="discard"
		/>
		<three-dialog
			v-model="pickingFromScrap"
			:one-off="game.oneOff"
			:scrap="scrap"
			@resolveThree="resolveThree($event)"
		/>
		<eight-overlay
			v-if="(selectedCard && selectedCard.rank === 8) || (cardSelectedFromDeck && cardSelectedFromDeck.rank === 8)"
			v-model="showEightOverlay"
			:card="selectedCard || cardSelectedFromDeck"
			@points="playPoints"
			@glasses="playFaceCard"
			@cancel="clearSelection"
		/>
		<nine-overlay
			v-if="showNineOverlay"
			v-model="showNineOverlay"
			:nine="selectedCard"
			:target="nineTarget"
			@scuttle="scuttle(nineTargetIndex)"
			@one-off="playTargetedOneOff(nineTargetIndex, targetType)"
			@cancel="clearSelection"
		/>
		<game-over-dialog
			v-model="gameIsOver"
			:player-wins="playerWins"
			:stalemate="stalemate"
		/>
		<reauthenticate-dialog
			v-model="mustReauthenticate"
			@reauthenticated="reconnectToGame"
		/>
	</div>
</template>

<script>
import Card from '@/components/GameView/Card.vue';
import CannotCounterDialog from '@/components/GameView/CannotCounterDialog.vue';
import CounterDialog from '@/components/GameView/CounterDialog.vue';
import FourDialog from '@/components/GameView/FourDialog.vue';
import ThreeDialog from '@/components/GameView/ThreeDialog.vue';
import EightOverlay from '@/components/GameView/EightOverlay.vue';
import NineOverlay from '@/components/GameView/NineOverlay.vue';
import GameOverDialog from '@/components/GameView/GameOverDialog.vue';
import GameMenu from '@/components/GameView/GameMenu.vue';
import ScoreGoalToolTip from '@/components/GameView/ScoreGoalToolTip.vue';
import ReauthenticateDialog from '@/components/GameView/ReauthenticateDialog.vue';

export default {
	name: 'GameView',
	components: {
		Card,
		CannotCounterDialog,
		CounterDialog,
		FourDialog,
		ThreeDialog,
		EightOverlay,
		NineOverlay,
		GameOverDialog,
		GameMenu,
		ScoreGoalToolTip,
		ReauthenticateDialog,
	},
	data() {
		return {
			showSnack: false,
			snackMessage: '',
			snackColor: 'error',
			selectionIndex: null, // when select a card set this value
			showFourDialog: false,
			showEightOverlay: false,
			showNineOverlay: false,
			nineTargetIndex: null,
			targetType: null,
			topCardIsSelected: false,
			secondCardIsSelected: false,
		}
	},
	computed: {
		//////////
		// Auth //
		//////////
		mustReauthenticate: {
			get() {
				return this.$store.state.auth.mustReauthenticate;
			},
			set(val) {
				this.$store.commit('setMustReauthenticate', val);
			},
		},
		////////////////////
		// Responsiveness //
		////////////////////
		deckLogoWidth() {
			switch (this.$vuetify.breakpoint.name) {
			case 'xs':
				return 50;
			case 'sm':
				return 70;
			case 'md':
			case 'lg':
			case 'xl':
			default:
				return 140;
			}
		},
		///////////////////////////////
		// Game, Deck, Log and Scrap //
		///////////////////////////////
		game() {
			return this.$store.state.game;
		},
		deck() {
			return this.game.deck;
		},
		scrap() {
			return this.game.scrap;
		},
		logs() {
			return this.game.log;
		},
		deckLength() {
			let res = this.deck.length;
			if (this.game.topCard) res++;
			if (this.game.secondCard) res++;
			return res;
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
		/////////////////
		// King Counts //
		/////////////////
		playerKingCount() {
			return this.kingCount(this.player);
		},
		opponentKingCount() {
			return this.kingCount(this.opponent);
		},
		///////////////////
		// Points to Win //
		///////////////////
		playerPointsToWin() {
			return this.pointsToWin(this.playerKingCount);
		},
		opponentPointsToWin() {
			return this.pointsToWin(this.opponentKingCount);
		},
		///////////////
		// Game Over //
		///////////////
		gameIsOver() {
			return this.$store.state.game.gameIsOver;
		},
		playerWins() {
			return this.$store.state.game.gameIsOver && this.$store.state.game.winnerPNum === this.$store.state.game.myPNum;
		},
		stalemate() {
			return this.$store.state.game.gameIsOver && this.$store.state.game.winnerPNum === null;
		},
		////////////
		// Queens //
		////////////
		playerQueenCount() {
			return this.queenCount(this.player);
		},
		opponentQueenCount() {
			return this.queenCount(this.opponent);
		},
		//////////////////
		// Interactions //
		//////////////////
		selectedCard() {
			return this.selectionIndex !== null ? this.player.hand[this.selectionIndex] : null;
		},
		isPlayersTurn() {
			return this.game.turn % 2 === this.game.myPNum
		},
		waitingForOpponentToDiscard() {
			return this.game.waitingForOpponentToDiscard;
		},
		waitingForOpponentToCounter() {
			return this.game.waitingForOpponentToCounter;
		},
		waitingForOpponentToPickFromScrap() {
			return this.game.waitingForOpponentToPickFromScrap;
		},
		waitingForOpponentToPlayFromDeck() {
			return this.$store.state.game.waitingForOpponentToPlayFromDeck;	
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
			return (this.myTurnToCounter && !this.hasTwoInHand) || (this.myTurnToCounter && this.hasTwoInHand && this.opponentQueenCount > 0);
		},
		showCounterDialog() {
			return this.myTurnToCounter && this.hasTwoInHand && this.opponentQueenCount === 0;
		},
		discarding() {
			return this.$store.state.game.discarding;
		},
		pickingFromScrap() {
			return this.$store.state.game.pickingFromScrap;
		},
		validScuttleIds() {
			let selectedCard;
			if (this.resolvingSeven) {
				if (!this.cardSelectedFromDeck) return [];
				selectedCard = this.cardSelectedFromDeck;
			}
			else {
				if (!this.selectedCard) return [];
				selectedCard = this.selectedCard;
			}
			return this.opponent.points
				.filter((potentialTarget) => {
					return selectedCard.rank > potentialTarget.rank || 
						(
							selectedCard.rank === potentialTarget.rank && 
							selectedCard.suit > potentialTarget.suit
						);
				})
				.map((validTarget) => validTarget.id);			
		},
		validFaceCardTargetIds() {
			switch (this.opponentQueenCount) {
			case 0:
				const opponentRuneIds = this.opponent.runes.map((card) => card.id);
				const opponentJackIds = []
				this.opponent.points.forEach((card) => {
					if (card.attachments.length > 0){
						opponentJackIds.push(card.attachments[card.attachments.length - 1].id)
					}
				})
				return [...opponentRuneIds, ...opponentJackIds];
			case 1:
				return [this.opponent.runes.find((card) => card.rank === 12).id];
			default:
				return [];
			}
		},
		validMoves() {
			if (!this.isPlayersTurn) return [];

			let res = [];
			let cardRank;
			if (this.resolvingSeven) {
				if (!this.cardSelectedFromDeck) return [];
				cardRank = this.cardSelectedFromDeck.rank;
			}
			else {
				if (!this.selectedCard) return [];
				cardRank = this.selectedCard.rank;
			}

			switch (cardRank) {
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
				res = [...res, ...this.validScuttleIds, ...this.validFaceCardTargetIds];
				break;
			case 2:
				res.push('field');
				res = [...res, ...this.validScuttleIds, ...this.validFaceCardTargetIds];
				break;
			case 11:
				res = this.opponent.points.map(validTarget => validTarget.id);
				break;
			case 12:
			case 13:
				res.push('field');
				break;
			}
			return res;
		},
		nineTarget() {
			switch(this.targetType) {
			case 'point':
				return this.nineTargetIndex !== null ? this.opponent.points[this.nineTargetIndex] : null;
			case 'rune':
				this.nineTargetIndex !== null ? this.opponent.runes[this.nineTargetIndex] : null;
			default:
				return null;
			}
		},
		// Sevens
		playingFromDeck() {
			return this.$store.state.game.playingFromDeck;
		},
		resolvingSeven() {
			return this.playingFromDeck || this.waitingForOpponentToPlayFromDeck;
		},
		topCard() {
			return this.$store.state.game.topCard;
		},
		secondCard() {
			return this.$store.state.game.secondCard;
		},
		cardSelectedFromDeck() {
			if (this.topCardIsSelected) return this.topCard;
			if (this.secondCardIsSelected) return this.secondCard;
			return null;
		},
	},
	watch: {
		logs: function() {
			this.$nextTick(function() {
				var container = this.$refs.logsContainer;
				container.scrollTop = container.scrollHeight + 120;
			});
		},
	},
	methods: {
		reconnectToGame() {
			thie.$store.commit('setMustReauthenticate', false);
		},
		clearSnackBar() {
			this.snackMessage = '';
			this.showSnack = false;
		},
		handleError(err) {
			console.log(err);
			this.snackMessage = err;
			this.snackColor = 'error';
			this.showSnack = true;
			this.clearSelection();
		},
		clearOverlays() {
			this.showEightOverlay = false;
			this.showNineOverlay = false;
			this.nineTargetIndex = null;
			this.targetType = null;
		},
		clearSelection() {
			this.selectionIndex = null;
			this.clearOverlays();
		},
		selectCard(index) {
			if (index === this.selectionIndex){
				this.clearSelection();
			} else {
				this.selectionIndex = index;
			}
		},
		selectTopCard() {
			if (!this.waitingForOpponentToPlayFromDeck) {
				this.secondCardIsSelected = false;
				this.topCardIsSelected = !this.topCardIsSelected;
			}
		},
		selectSecondCard() {
			if (!this.waitingForOpponentToPlayFromDeck) {
				this.topCardIsSelected = false;
				this.secondCardIsSelected = !this.secondCardIsSelected;
			}
		},
		/**
		 * @returns number of queens a given player has
		 * @param player is the player object
		 */
		queenCount(player) {
			return player.runes.reduce((kingCount, card) => kingCount + (card.rank === 12 ? 1 : 0), 0);
		},
		/**
		 * @returns number of kings a given player has
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
			if (!this.resolvingSeven) {
				if (this.deckLength > 0) {
					this.$store.dispatch('requestDrawCard')
						.then(this.clearSelection())
						.catch((err) => {
							this.snackMessage = err;
							this.snackColor = 'error';
							this.showSnack = true;
							this.clearSelection();
						});
				} else {
					this.$store.dispatch('requestPass')
						.then(this.clearSelection())
						.catch((err) => {
							this.snackMessage = err;
							this.snackColor = 'error';
							this.showSnack = true;
							this.clearSelection();
						});			
				}
			}
		},
		playPoints() {
			this.clearOverlays();
			if (this.resolvingSeven) {
				const deckIndex = this.topCardIsSelected ? 0 : 1;
				this.$store.dispatch('requestPlayPointsSeven', {
					cardId: this.cardSelectedFromDeck.id,
					index: deckIndex,
				})
					.then(this.clearSelection())
					.catch(this.handleError);
			}
			else {
				this.$store.dispatch('requestPlayPoints', this.selectedCard.id)
					.then(this.clearSelection())
					.catch(this.handleError);
			}
		},
		playFaceCard() {
			this.clearOverlays();
			if (this.resolvingSeven){
				const deckIndex = this.topCardIsSelected ? 0 : 1;
				this.$store.dispatch('requestPlayFaceCardSeven', {
					cardId: this.cardSelectedFromDeck.id,
					index: deckIndex
				})
					.then(this.clearSelection())
					.catch(this.handleError);
			}else{
				this.$store.dispatch('requestPlayFaceCard', this.selectedCard.id)
					.then(this.clearSelection())
					.catch(this.handleError);
			}
		},
		scuttle(targetIndex) {
			if (this.resolvingSeven) {
				const deckIndex = this.topCardIsSelected ? 0 : 1;
				this.$store.dispatch('requestScuttleSeven', {
					cardId: this.cardSelectedFromDeck.id,
					targetId: this.opponent.points[targetIndex].id,
					index: deckIndex
				})
					.then(this.clearSelection())
					.catch(this.handleError);
			} else {
				this.$store.dispatch('requestScuttle', {
					cardId: this.selectedCard.id,
					targetId: this.opponent.points[targetIndex].id,
				})
					.then(this.clearSelection())
					.catch(this.handleError);
			}
		},
		playTargetedOneOff(targetIndex, targetType) {
			let target;
			let jackedPointId;
			switch (targetType) {
			case 'rune': 
				target = this.opponent.runes[targetIndex];
				break;
			case 'point':
				target = this.opponent.points[targetIndex];
				break;
			case 'jack':
				if(targetIndex < 0){ // targeting the last jack attached to a point card
					const targetJacks = this.opponent.points[-targetIndex-1].attachments
					target = targetJacks[targetJacks.length - 1]
					jackedPointId = this.opponent.points[-targetIndex-1].id
				}
				break;
			}
			if (this.resolvingSeven) {
				this.$store.dispatch('requestPlayTargetedOneOffSeven', {
					cardId: this.cardSelectedFromDeck.id,
					targetId: target.id,
					pointId: jackedPointId,
					targetType,
				})
					.then(this.clearSelection())
					.catch(this.handleError);
			}
			else {
				this.$store.dispatch('requestPlayTargetedOneOff', {
					cardId: this.selectedCard.id,
					targetId: target.id,
					pointId: jackedPointId,
					targetType,
				})
					.then(this.clearSelection())
					.catch(this.handleError);
			}
		},
		playJack(targetIndex) {
			const target = this.opponent.points[targetIndex];
			if (this.resolvingSeven) {
				const deckIndex = this.topCardIsSelected ? 0 : 1;
				this.$store.dispatch('requestPlayJackSeven', {
					cardId: this.cardSelectedFromDeck.id,
					index: deckIndex,
					targetId: target.id
				})
					.then(this.clearSelection())
					.catch(this.handleError);
			}else{
				
				this.$store.dispatch('requestPlayJack', {
					cardId: this.selectedCard.id,
					targetId: target.id,
				})
					.then(this.clearSelection())
					.catch(this.handleError);
			}
			
		},
		playToField() {
			let cardRank;
			if (this.resolvingSeven) {
				if (!this.cardSelectedFromDeck) return;
				cardRank = this.cardSelectedFromDeck.rank;
			}
			else {
				if (!this.selectedCard) return;
				cardRank = this.selectedCard.rank;
			}

			switch (cardRank) {
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
			if (!this.selectedCard && !this.topCardIsSelected && !this.secondCardIsSelected) return;
			let cardRank;
			if (this.resolvingSeven) {
				if (!this.cardSelectedFromDeck) return;
				cardRank = this.cardSelectedFromDeck.rank;
			}
			else {
				if (!this.selectedCard) return;
				cardRank = this.selectedCard.rank;
			}
			switch (cardRank) {
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
				this.playJack(targetIndex)
				return;
			case 9:
				// Determine whether to scuttle or play as one-off
				this.nineTargetIndex = targetIndex;
				this.showNineOverlay = true;
				this.targetType = 'point';
				return;
			default:
				return;
			}
		},
		targetOpponentFaceCard(targetIndex) {
			let cardToPlay = null;
			if (this.resolvingSeven) {
				if (!this.cardSelectedFromDeck) return;
				cardToPlay = this.cardSelectedFromDeck;
			}
			else {
				if (!this.selectedCard) return;
				cardToPlay = this.selectedCard;
			}

			const targetType = targetIndex < 0 ? 'jack' : 'rune'
			switch(cardToPlay.rank) {
			case 2:
				this.playTargetedOneOff(targetIndex, targetType);
				return;
			case 9:
				this.playTargetedOneOff(targetIndex, targetType);
			default:
				return;
			}
		},
		playOneOff() {
			if (this.resolvingSeven) {
				if (!this.cardSelectedFromDeck) return;

				const deckIndex = this.topCardIsSelected ? 0 : 1;
				this.$store.dispatch('requestPlayOneOffSeven', {
					cardId: this.cardSelectedFromDeck.id,
					index: deckIndex,
				})
					.then(this.clearSelection())
					.catch(this.handleError);
			}
			if (!this.selectedCard) return;

			this.$store.dispatch('requestPlayOneOff', this.selectedCard.id)
				.then(this.clearSelection())
				.catch(this.handleError);
		},
		resolve() {
			this.$store.dispatch('requestResolve')
				.then(this.clearSelection())
				.catch(this.handleError);
		},
		resolveThree(cardId) {
			this.$store.dispatch('requestResolveThree', cardId)
				.then(this.clearSelection())
				.catch(this.handleError)
		},
		counter(twoId) {
			this.$store.dispatch('requestCounter', twoId)
				.then(this.clearSelection())
				.catch(this.handleError);
		},
		discard(cardIds) {
			const cardId1 = cardIds[0];
			const cardId2 = cardIds.length > 1 ? cardIds[1] : null;
			this.$store.dispatch('requestDiscard', {
				cardId1,
				cardId2,
			});
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

#game-menu-wrapper {
	position: absolute;
	display: inline-block;
}

.valid-move {
	// background-color: var(--v-accent-lighten1);
	cursor: pointer;
}



#opponent-hand {
	min-width: 50%;
	height: 20vh;
	& #opponent-score {
		z-index: 1;
	}
	& #opponent-hand-cards {
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
		&.reveal-top-two {
			height: auto;
			align-self: start;
		}
		& #empty-deck-text {
			position: absolute;
		}
		&.my-turn {
			border: 4px solid var(--v-accent-base);
		}
	}
	& #deck, & #scrap{
		position: relative;
		margin: 10px;
		border: 1px solid #FFF;
		height: 29vh;
		width: calc(29vh / 1.3);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		transition: all .3 ease-in-out;

		&.reveal-top-two {
			width: calc(29vh * 1.5);
			max-width: 300px;
			z-index: 1;
		}
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
	#history {
		& #history-logs {
			height: 80%;
			overflow: auto;
		}
	}
}
#field-left,#field-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
#opponent-field,#player-field {
	position: relative;
	width: 100%;
	height: 29vh;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	border: 4px solid transparent;
	border-radius: 4px;
}
.field-points {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 50%;

	.field-point-container {
		display: flex;
		flex-direction: row;
		max-height: 20vh;
		width: calc(20vh / 1.45);
		margin: 3px;
		position: relative;

		.jacks-container {
			position: absolute;
			right: -20%;
			top: 0;
			width: auto;
			height: auto;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
		}
	}
}
.field-effects {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 50%
}

#player-hand {
	min-width: 50%;
	height: 30vh;
	& #player-hand-cards {
		width: 100%;
		height: 80%;
		background: rgba(0, 0, 0, 0.46);
		overflow-y: hidden;
		border-radius: 4px;

		&.my-turn {
			border: 4px solid var(--v-accent-base);
			
		}
		&:not(.my-turn) {
			border: 4px solid transparent;
		}
	}
}
</style>
