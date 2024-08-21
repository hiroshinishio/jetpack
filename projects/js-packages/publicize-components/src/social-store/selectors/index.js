import * as connectionDataSelectors from './connection-data';
import jetpackSettingSelectors from './jetpack-settings';
import * as sharesData from './shares-data';
import siteDataSelectors from './site-data';
import socialImageGeneratorSettingsSelectors from './social-image-generator-settings';

const selectors = {
	...siteDataSelectors,
	...connectionDataSelectors,
	...jetpackSettingSelectors,
	...sharesData,
	...socialImageGeneratorSettingsSelectors,
	userConnectionUrl: state => state.userConnectionUrl,
	hasPaidFeatures: state => state.hasPaidFeatures,
};

export default selectors;
