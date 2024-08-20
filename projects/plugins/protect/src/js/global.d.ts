declare module '*.scss';

interface JetpackProtectInitialState {
	status?: object;
	scanHistory?: object;
	credentials?: object;
	hasRequiredPlan?: boolean;
	jetpackScan?: object;
}

interface Window {
	jetpackProtectInitialState?: JetpackProtectInitialState;
}
