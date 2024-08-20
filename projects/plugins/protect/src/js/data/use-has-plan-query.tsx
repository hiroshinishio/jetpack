import { useQuery } from '@tanstack/react-query';
import API from '../api';
import { QUERY_HAS_PLAN_KEY } from './constants';

/**
 * Credentials Query Hook
 *
 * @return {object} useQuery Hook
 */
export default function usePlanQuery() {
	return useQuery( {
		queryKey: [ QUERY_HAS_PLAN_KEY ],
		queryFn: API.checkPlan,
		initialData: !! window?.jetpackProtectInitialState?.hasRequiredPlan,
	} );
}
