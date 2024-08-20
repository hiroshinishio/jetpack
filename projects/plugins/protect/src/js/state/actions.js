const SET_INSTALLED_PLUGINS = 'SET_INSTALLED_PLUGINS';
const SET_INSTALLED_THEMES = 'SET_INSTALLED_THEMES';
const SET_WP_VERSION = 'SET_WP_VERSION';
const SET_PRODUCT_DATA = 'SET_PRODUCT_DATA';
const SET_MODAL = 'SET_MODAL';
const SET_NOTICE = 'SET_NOTICE';
const CLEAR_NOTICE = 'CLEAR_NOTICE';
const SET_ONBOARDING_PROGRESS = 'SET_ONBOARDING_PROGRESS';

const SET_WAF_IS_SEEN = 'SET_WAF_IS_SEEN';
const SET_WAF_UPGRADE_IS_SEEN = 'SET_WAF_UPGRADE_IS_SEEN';
const SET_WAF_IS_ENABLED = 'SET_WAF_IS_ENABLED';
const SET_WAF_IS_UPDATING = 'SET_WAF_IS_UPDATING';
const SET_WAF_IS_TOGGLING = 'SET_WAF_IS_TOGGLING';
const SET_WAF_CONFIG = 'SET_WAF_CONFIG';
const SET_WAF_STATS = 'SET_WAF_STATS';

const setInstalledPlugins = plugins => {
	return { type: SET_INSTALLED_PLUGINS, plugins };
};

const setInstalledThemes = themes => {
	return { type: SET_INSTALLED_THEMES, themes };
};

const setwpVersion = version => {
	return { type: SET_WP_VERSION, version };
};

/**
 * Set Modal
 *
 * @param {object}      modal       - The modal payload to set in state.
 * @param {null|string} modal.type  - The modal slug, or null to display no modal.
 * @param {object}      modal.props - The props to pass to the modal component.
 * @return {object} The modal action object.
 */
const setModal = modal => {
	return { type: SET_MODAL, payload: modal };
};

const setNotice = notice => {
	return { type: SET_NOTICE, payload: notice };
};

const clearNotice = () => {
	return { type: CLEAR_NOTICE };
};

const setOnboardingProgress = progress => {
	return { type: SET_ONBOARDING_PROGRESS, progress };
};

const setWafIsEnabled = isEnabled => {
	return { type: SET_WAF_IS_ENABLED, isEnabled };
};

const setWafIsSeen = isSeen => {
	return { type: SET_WAF_IS_SEEN, isSeen };
};

const setWafUpgradeIsSeen = upgradeIsSeen => {
	return { type: SET_WAF_UPGRADE_IS_SEEN, upgradeIsSeen };
};

const setWafIsUpdating = isUpdating => {
	return { type: SET_WAF_IS_UPDATING, isUpdating };
};

const setWafIsToggling = isToggling => {
	return { type: SET_WAF_IS_TOGGLING, isToggling };
};

const setWafConfig = config => {
	return { type: SET_WAF_CONFIG, config };
};

const setWafStats = stats => {
	return { type: SET_WAF_STATS, stats };
};

const actions = {
	setInstalledPlugins,
	setInstalledThemes,
	setwpVersion,
	setModal,
	setNotice,
	clearNotice,
	setOnboardingProgress,
	setWafIsEnabled,
	setWafIsSeen,
	setWafUpgradeIsSeen,
	setWafIsUpdating,
	setWafIsToggling,
	setWafConfig,
	setWafStats,
};

export {
	SET_INSTALLED_PLUGINS,
	SET_INSTALLED_THEMES,
	SET_WP_VERSION,
	SET_PRODUCT_DATA,
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
	actions as default,
};
