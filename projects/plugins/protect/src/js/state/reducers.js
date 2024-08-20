import { combineReducers } from '@wordpress/data';
import {
	SET_INSTALLED_PLUGINS,
	SET_INSTALLED_THEMES,
	SET_WP_VERSION,
	SET_MODAL,
	SET_NOTICE,
	CLEAR_NOTICE,
	SET_ONBOARDING_PROGRESS,
	SET_WAF_IS_SEEN,
	SET_WAF_UPGRADE_IS_SEEN,
	SET_WAF_IS_ENABLED,
	SET_WAF_IS_UPDATING,
	SET_WAF_IS_TOGGLING,
	SET_WAF_CONFIG,
	SET_WAF_STATS,
} from './actions';

const installedPlugins = ( state = {}, action ) => {
	switch ( action.type ) {
		case SET_INSTALLED_PLUGINS:
			return action.plugins;
	}
	return state;
};

const installedThemes = ( state = {}, action ) => {
	switch ( action.type ) {
		case SET_INSTALLED_THEMES:
			return action.themes;
	}
	return state;
};

const wpVersion = ( state = {}, action ) => {
	switch ( action.type ) {
		case SET_WP_VERSION:
			return action.version;
	}
	return state;
};

const modal = ( state = {}, action ) => {
	switch ( action.type ) {
		case SET_MODAL:
			return { ...state, ...action.payload };
	}
	return state;
};

const notice = ( state = {}, action ) => {
	switch ( action.type ) {
		case SET_NOTICE:
			return { ...state, ...action.payload };
		case CLEAR_NOTICE:
			return {};
	}
	return state;
};

const onboardingProgress = ( state = null, action ) => {
	switch ( action.type ) {
		case SET_ONBOARDING_PROGRESS:
			return action.progress;
	}
	return state;
};

const defaultWaf = {
	wafSupported: null,
	bruteForceSupported: null,
	isSeen: false,
	upgradeIsSeen: false,
	isEnabled: false,
	isUpdating: false,
	isToggling: false,
	config: undefined,
	stats: undefined,
};
const waf = ( state = defaultWaf, action ) => {
	switch ( action.type ) {
		case SET_WAF_IS_SEEN:
			return { ...state, isSeen: action.isSeen };
		case SET_WAF_UPGRADE_IS_SEEN:
			return { ...state, upgradeIsSeen: action.upgradeIsSeen };
		case SET_WAF_IS_ENABLED:
			return { ...state, isEnabled: action.isEnabled };
		case SET_WAF_CONFIG:
			return { ...state, config: action.config };
		case SET_WAF_STATS:
			return { ...state, stats: action.stats };
		case SET_WAF_IS_UPDATING:
			return { ...state, isUpdating: action.isUpdating };
		case SET_WAF_IS_TOGGLING:
			return { ...state, isToggling: action.isToggling };
	}
	return state;
};

const reducers = combineReducers( {
	installedPlugins,
	installedThemes,
	wpVersion,
	modal,
	notice,
	onboardingProgress,
	waf,
} );

export default reducers;
