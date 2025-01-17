import * as connectionDataSelectors from './connection-data';
import jetpackSettingSelectors from './jetpack-settings';
import siteDataSelectors from './site-data';
import socialImageGeneratorSettingsSelectors from './social-image-generator-settings';

const selectors = {
	...siteDataSelectors,
	...connectionDataSelectors,
	...jetpackSettingSelectors,
	...socialImageGeneratorSettingsSelectors,
	userConnectionUrl: state => state.userConnectionUrl,
	useAdminUiV1: state => state.useAdminUiV1,
	featureFlags: state => state.featureFlags,
	hasPaidFeatures: state => state.hasPaidFeatures,
};

export default selectors;
