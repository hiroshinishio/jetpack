import { useConnection } from '@automattic/jetpack-connection';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

/**
 * Registration Watcher Hook
 *
 * When the user connects their site to Jetpack, ensure all queries are invalidated.
 */
const useRegistrationWatcher = () => {
	const queryClient = useQueryClient();
	const { isRegistered } = useConnection();

	useEffect( () => {
		if ( isRegistered ) {
			queryClient.invalidateQueries();
		}
	}, [ isRegistered, queryClient ] );
};

export default useRegistrationWatcher;
