import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExternalLink } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import API from '../api';
import { PAID_PLUGIN_SUPPORT_URL } from '../constants';
import { STORE_ID } from '../state/store';
import { QUERY_FIXERS_KEY } from './constants';

/**
 * Use Fixers Mutatation
 *
 * @return {object} Mutation object
 */
export default function useFixersMutation() {
	const { setNotice } = useDispatch( STORE_ID );
	const queryClient = useQueryClient();
	return useMutation( {
		mutationFn: threatIds => API.fixThreats( threatIds ),
		onMutate: ( threatIds: string[] ) => {
			// Optimistically update the fixer status to 'in_progress' for the selected threats.
			queryClient.setQueryData(
				[ QUERY_FIXERS_KEY, ...threatIds ],
				( currentFixers: { threats: [] } ) => ( {
					...currentFixers,
					threats: {
						...currentFixers.threats,
						...threatIds.reduce( ( acc, threatId ) => {
							acc[ threatId ] = { status: 'in_progress' };
							return acc;
						}, {} ),
					},
				} )
			);
			// Show a success notice.
			setNotice( {
				type: 'success',
				message: __(
					"We're hard at work fixing this threat in the background. Please check back shortly.",
					'jetpack-protect'
				),
			} );
		},
		onError: () => {
			// Show an error notice.
			setNotice( {
				type: 'error',
				message: createInterpolateElement(
					__(
						'An error occurred fixing threats. Please try again or <supportLink>contact support</supportLink>.',
						'jetpack-protect'
					),
					{
						supportLink: <ExternalLink href={ PAID_PLUGIN_SUPPORT_URL } />,
					}
				),
			} );
		},
		onSettled: ( data, error, threatIds ) => {
			queryClient.invalidateQueries( { queryKey: [ QUERY_FIXERS_KEY, ...threatIds ] } );
		},
	} );
}
