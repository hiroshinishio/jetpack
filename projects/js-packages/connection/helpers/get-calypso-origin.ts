import { getScriptData } from '@automattic/jetpack-script-data';

/**
 * Get the Calypso origin based on the development environment.
 *
 * @return {string} The Calypso url origin.
 */
export default function getCalypsoOrigin() {
	const calypsoEnv = (
		( typeof window !== 'undefined' && window?.JP_CONNECTION_INITIAL_STATE ) ||
		getScriptData()?.connection
	)?.calypsoEnv;

	switch ( calypsoEnv ) {
		case 'development':
			return 'http://calypso.localhost:3000/';
		case 'wpcalypso':
			return 'https://wpcalypso.wordpress.com/';
		case 'horizon':
			return 'https://horizon.wordpress.com/';
		default:
			return 'https://wordpress.com/';
	}
}
