import { ThemeProvider } from '@automattic/jetpack-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as WPElement from '@wordpress/element';
import { HashRouter } from 'react-router-dom';
import { EmailsAdmin } from '.';

/**
 * Render function
 */
const render = () => {
	const queryClient = new QueryClient();

	const container = document.getElementById( 'jetpack-crm-emails-root' );

	if ( null === container ) {
		return;
	}

	// @todo: Remove fallback when we drop support for WP 6.1
	const component = (
		<HashRouter>
			<ThemeProvider>
				<QueryClientProvider client={ queryClient }>
					<EmailsAdmin />
				</QueryClientProvider>
			</ThemeProvider>
		</HashRouter>
	);

	if ( WPElement.createRoot ) {
		WPElement.createRoot( container ).render( component );
	} else {
		WPElement.render( component, container );
	}
};

render();
