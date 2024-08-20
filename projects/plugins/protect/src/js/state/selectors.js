const selectors = {
	getInstalledPlugins: state => state.installedPlugins || {},
	getInstalledThemes: state => state.installedThemes || {},
	getWpVersion: state => state.wpVersion || '',
	getModalType: state => state.modal?.type || null,
	getModalProps: state => state.modal?.props || {},
	getNotice: state => state.notice || null,
	getOnboardingProgress: state => state.onboardingProgress || null,
	getWaf: state => state.waf,
};

export default selectors;
