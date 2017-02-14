import { expect } from 'chai';

import {
	reducer as searchReducer
} from '../reducer';

describe( 'Search reducer', () => {

	describe( 'term property', () => {
		it( 'should get set on the respective event', () => {
			const stateIn = {};
			const action = {
				type: 'JETPACK_SEARCH_TERM',
				term: 'Something'
			};
			let stateOut = searchReducer( stateIn, action );
			expect( stateOut.searchTerm ).to.equal( action.term );
		} );

		it( 'should not change on any other events', () => {
			const stateIn = {
				searchTerm: 'initial state'
			};

			const action =  {
				type: 'JETPACK_SOME_EVENT',
				term: 'This should not get in'
			};
			let stateOut = searchReducer( stateIn, action );
			expect( stateOut.searchTerm ).to.equal( stateIn.searchTerm );
		} );
	} );

	describe( 'focus property', () => {
		it( 'should get set on the respective event', () => {
			const stateIn = {};
			const action = {
				type: 'JETPACK_SEARCH_FOCUS',
			};
			let stateOut = searchReducer( stateIn, action );
			expect( stateOut.searchFocus ).to.be.true;
		} );

		it( 'should get unset on the respective event', () => {
			const stateIn = {};
			const action = {
				type: 'JETPACK_SEARCH_BLUR',
			};
			let stateOut = searchReducer( stateIn, action );
			expect( stateOut.searchFocus ).to.be.false;
		} );

		it( 'should not change on any other events', () => {
			const stateIn = {};

			const action =  {
				type: 'JETPACK_SOME_EVENT'
			};
			let stateOut = searchReducer( stateIn, action );
			expect( stateOut.searchFocus ).to.be.false;
		} );
	} );
} );
