import { useQuery } from '@tanstack/react-query';
import API from '../api';
import { QUERY_HISTORY_KEY } from './constants';

/**
 * Use History Query
 *
 * @return {object} Query object
 */
export default function useHistoryQuery(): object {
	return useQuery( {
		queryKey: [ QUERY_HISTORY_KEY ],
		queryFn: () => API.getScanHistory(),
		initialData: window.jetpackProtectInitialState?.scanHistory,
	} );
}
