import { useQuery } from '@tanstack/react-query';
import API from '../api';
import { SCAN_IN_PROGRESS_STATUSES, SCAN_STATUS_IDLE } from '../constants';
import { QUERY_SCAN_STATUS_KEY } from './constants';

/**
 * Use Scan Status Query
 *
 * @param {object}  args            - Object argument
 * @param {boolean} args.usePolling - Use polling
 * @return {object} Query object
 */
export default function useScanStatusQuery( { usePolling }: { usePolling?: boolean } = {} ) {
	return useQuery( {
		queryKey: [ QUERY_SCAN_STATUS_KEY ],
		queryFn: API.getScanStatus,
		initialData: window?.jetpackProtectInitialState?.status,
		refetchInterval( query ) {
			if ( ! usePolling ) {
				return false;
			}

			if ( ! query.state.data.status ) {
				return false;
			}

			const interval = query.state.dataUpdateCount < 5 ? 5_000 : 15_000;

			// if there has never been a scan, and the scan status is idle, then we must still be getting set up
			const scanIsInitializing =
				! query.state.data.last_checked && SCAN_STATUS_IDLE === query.state.data?.status;

			const scanIsInProgress = SCAN_IN_PROGRESS_STATUSES.indexOf( query.state.data?.status ) >= 0;

			if ( scanIsInitializing || scanIsInProgress ) {
				return interval;
			}
		},
	} );
}
