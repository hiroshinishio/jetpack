import { Button } from '@automattic/jetpack-components';
import { __ } from '@wordpress/i18n';
import React, { forwardRef } from 'react';
import { SCAN_IN_PROGRESS_STATUSES } from '../../constants';
import useScanStatusQuery from '../../data/use-scan-status-query';
import useStartScanMutator from '../../data/use-start-scan-mutation';

const ScanButton = forwardRef( ( { variant = 'secondary', children, ...props }, ref ) => {
	const { data: status } = useScanStatusQuery();
	const startScanMutation = useStartScanMutator();

	const handleScanClick = () => {
		return event => {
			event.preventDefault();
			startScanMutation.mutate();
		};
	};

	return (
		<Button
			ref={ ref }
			variant={ variant }
			isLoading={ SCAN_IN_PROGRESS_STATUSES.includes( status?.status ) }
			onClick={ handleScanClick() }
			{ ...props }
		>
			{ children ?? __( 'Scan now', 'jetpack-protect' ) }
		</Button>
	);
} );

export default ScanButton;
