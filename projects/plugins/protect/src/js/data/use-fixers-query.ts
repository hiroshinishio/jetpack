import { useQuery } from '@tanstack/react-query';
import API from '../api';
import { QUERY_FIXERS_KEY } from './constants';

/**
 * Use Fixers Query
 *
 * @param {object}  args            - Object argument
 * @param {Array}   args.threatIds  - Threat IDs
 * @param {boolean} args.usePolling - Use polling
 * @return {object} Query object
 */
export default function useFixersQuery( {
	threatIds,
	usePolling,
}: {
	threatIds: string[];
	usePolling?: boolean;
} ) {
	return useQuery( {
		queryKey: [ QUERY_FIXERS_KEY, ...threatIds ],
		queryFn: () => API.getFixersStatus( threatIds ),
		initialData: null, // to do: provide initial data in window.jetpackProtectInitialState
		refetchInterval( query ) {
			if ( ! usePolling || ! query.state.data ) {
				return false;
			}

			if ( query.state.data.some( ( { status } ) => status === 'in_progress' ) ) {
				return 5_000;
			}
		},
	} );
}
