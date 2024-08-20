import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExternalLink } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import API from '../api';
import { PAID_PLUGIN_SUPPORT_URL } from '../constants';
import { STORE_ID } from '../state/store';
import { QUERY_HISTORY_KEY, QUERY_SCAN_STATUS_KEY } from './constants';

/**
 * Use Un-Ignore Threat Mutatation
 *
 * @return {object} Mutation object
 */
export default function useUnIgnoreThreatMutation(): object {
	const queryClient = useQueryClient();
	const { setNotice } = useDispatch( STORE_ID );

	return useMutation( {
		mutationFn: threatId => API.unIgnoreThreat( threatId ),
		onSuccess: () => {
			queryClient.invalidateQueries( { queryKey: [ QUERY_SCAN_STATUS_KEY ] } );
			queryClient.invalidateQueries( { queryKey: [ QUERY_HISTORY_KEY ] } );

			// Show a success notice.
			setNotice( {
				type: 'success',
				message: __( 'Threat is no longer ignored.', 'jetpack-protect' ),
			} );
		},
		onError: () => {
			// Show an error notice.
			setNotice( {
				type: 'error',
				message: createInterpolateElement(
					__(
						'An error occurred un-ignoring the threat. Please try again or <supportLink>contact support</supportLink>.',
						'jetpack-protect'
					),
					{
						supportLink: <ExternalLink href={ PAID_PLUGIN_SUPPORT_URL } />,
					}
				),
			} );
		},
	} );
}
