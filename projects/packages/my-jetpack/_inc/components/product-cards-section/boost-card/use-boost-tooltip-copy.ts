import { __ } from '@wordpress/i18n';
import React, { useMemo } from 'react';
import usePurchases from '../../../data/purchases/use-purchases';
import { useProduct } from '../../../hooks/use-product';

const JETPACK_BOOST_PRODUCTS = [
	'jetpack_boost_bi_yearly',
	'jetpack_boost_yearly',
	'jetpack_boost_monthly',
];

/**
 * Gets the tooltip copy based on the Boost letter grade and other factors.
 *
 * @param {string} speedLetterGrade - The Boost speed letter grade.
 * @returns {React.ReactElement | string} A translated JSX Element or string.
 */
export function useBoostTooltipCopy( { speedLetterGrade } ) {
	const slug = 'boost';
	const { data: purchases, isLoading } = usePurchases();
	const hasBoostPaidPlan = useMemo( () => {
		if ( isLoading ) {
			return false;
		}
		if ( ! purchases?.length ) {
			return false;
		}

		return (
			purchases.filter( purchase => JETPACK_BOOST_PRODUCTS.includes( purchase.product_slug ) )
				.length > 0
		);
	}, [ isLoading, purchases ] );

	const { detail } = useProduct( slug );
	const { isPluginActive } = detail;

	// Boost plugin is active
	if ( isPluginActive ) {
		//  Has a paid Boost plan
		if ( hasBoostPaidPlan ) {
			switch ( speedLetterGrade ) {
				case 'A':
					return __(
						'Your site is fast! Boost is working to enhance your performance with automated tools.',
						'jetpack-my-jetpack'
					);
				case 'B':
				case 'C':
				case 'D':
				case 'E':
				case 'F':
					return __(
						'Visit the Boost dashboard to view your historical speed scores and manage your product settings.',
						'jetpack-my-jetpack'
					);
				// This case is here to prevent build optimization minification breaking the build.
				default:
					return __(
						'Visit the Boost dashboard to view your site’s speed scores and manage your product settings.',
						'jetpack-my-jetpack'
					);
			}
		}
		// Has the Free Boost plan
		switch ( speedLetterGrade ) {
			case 'A':
				return __(
					'Your site is fast! But maintaining a high speed isn’t easy. Upgrade Boost to use automated CCS and image optimization tools to improve your performance on the go.',
					'jetpack-my-jetpack'
				);
			case 'B':
				return __(
					'You are one step away from making your site blazing fast. Upgrade Boost to use automated CCS and image optimization tools to improve your performance.',
					'jetpack-my-jetpack'
				);
			default:
				return __(
					'Improve your performance with automated CSS and image optimization tools by upgrading Boost.',
					'jetpack-my-jetpack'
				);
		}
	}
	// Boost plugin not active
	switch ( speedLetterGrade ) {
		case 'A':
			return __(
				'Your site is fast! But maintaining a high speed isn’t easy. Use Boost’s automated acceleration tools to optimize your performance on the go.',
				'jetpack-my-jetpack'
			);
		case 'B':
			return __(
				'You are one step away from making your site blazing fast. Install Boost to enhance your site’s performance like top websites, no developer needed.',
				'jetpack-my-jetpack'
			);
		default:
			return __(
				'Your site needs performance improvements. Make your site blazing fast with Boost’s simple dashboard and acceleration tools.',
				'jetpack-my-jetpack'
			);
	}
}