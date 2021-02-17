import Vue from 'vue';
import Vuetify from 'vuetify';
import { shallowMount, createLocalVue } from '@vue/test-utils'
import GameListItem from '@/components/GameListItem.vue';

Vue.use(Vuetify);
// Simulate v-app application wrapper element
const app = document.createElement('div');
app.setAttribute('data-app', true);
document.body.appendChild(app);
const localVue = createLocalVue();
let vuetify;
let wrapper;
const validProps = {
	name: 'Test Game',
	p0Ready: true,
	p1Ready: false,
	gameId: 0,
	status: true,
	numPlayers: 0,
};
describe('Prop config', () => {
	vuetify = new Vuetify();
	wrapper = shallowMount(GameListItem, {
		vuetify,
		propsData: validProps
	});
	const {name, p0ready, p1ready} = wrapper.vm.$options.props;
	it('Prop name defaults to empty string', () => {
		expect(name.default).toBe('');
	});
	it('Prop p0Ready defaults to 0', () => {
		expect(p0ready.default).toBe(0);
	});
	it('Prop p1Ready defaults to 0', () => {
		expect(p1ready.default).toBe(0);
	});
    
});

describe('Static Rendering', () => {
	beforeEach(() => {
		wrapper = shallowMount(GameListItem, {
			propsData: validProps
		});
	});
});

describe('Event Handling', () => {

});