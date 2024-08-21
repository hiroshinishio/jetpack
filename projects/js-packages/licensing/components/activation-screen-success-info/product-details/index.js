import { getRedirectUrl } from '@automattic/jetpack-components';
import { createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import React from 'react';
import { getProductGroup } from '../../activation-screen/utils.js';

import './style.scss';

/**
 * The Jetpack Product Details component.
 *
 * @param {object} props            -- The properties.
 * @param {number} props.productId  -- The id of the product
 * @param {string} props.siteRawUrl -- The url of the site
 * @return {React.Component} The `JetpackProductDetails` component.
 */
const JetpackProductDetails = props => {
	const { productId, siteRawUrl } = props;

	const cloudDashboardBaseUrl = `https://cloud.jetpack.com/landing/${ siteRawUrl }`;

	const productGroup = getProductGroup( productId );

	const productInfoMap = {
		jetpack_anti_spam: {
			title: __( 'Jetpack Anti-spam is active!', 'jetpack' ),
			text: __(
				"We'll take care of everything from here. Now you can enjoy a spam-free site!",
				'jetpack'
			),
		},
		jetpack_backup: {
			title: __( 'Jetpack Backup is active!', 'jetpack' ),
			text: createInterpolateElement(
				__(
					'You can see your backups and restore your site on <a>cloud.jetpack.com</a>. If you ever lose access to your site, you can restore it there.',
					'jetpack'
				),
				{
					a: <a href={ cloudDashboardBaseUrl } />,
				}
			),
		},
		jetpack_complete: {
			title: __( 'Jetpack Complete is active!', 'jetpack' ),
			text: createInterpolateElement(
				__(
					'You can see your backups, security scans, and restore your site on <a>cloud.jetpack.com</a>. If you ever lose access to your site, you can restore it there.',
					'jetpack'
				),
				{
					a: <a href={ cloudDashboardBaseUrl } />,
				}
			),
		},
		jetpack_scan: {
			title: __( 'Jetpack Scan is active!', 'jetpack' ),
			text: createInterpolateElement(
				__( 'You can see your security scans on <a>cloud.jetpack.com</a>.', 'jetpack' ),
				{
					a: <a href={ cloudDashboardBaseUrl } />,
				}
			),
		},
		jetpack_search: {
			title: __( 'Jetpack Search is active!', 'jetpack' ),
			text: __(
				"Next, we'll help you customize the Search experience for your visitors.",
				'jetpack'
			),
		},
		jetpack_security: {
			title: __( 'Jetpack Security is active!', 'jetpack' ),
			text: createInterpolateElement(
				__(
					'You can see your backups, security scans, and restore your site on <a>cloud.jetpack.com</a>. If you ever lose access to your site, you can restore it there.',
					'jetpack'
				),
				{
					a: <a href={ cloudDashboardBaseUrl } />,
				}
			),
		},
		jetpack_videopress: {
			title: __( 'Jetpack VideoPress is active!', 'jetpack' ),
			text: __(
				'Experience high-quality, ad-free video built specifically for WordPress.',
				'jetpack'
			),
		},
		jetpack_social_advanced: {
			title: __( 'Jetpack Social Advanced is active!', 'jetpack' ),
			text: createInterpolateElement(
				__(
					'Create amazing link previews for your posts using Social Image Generator. Learn more <a>here</a>.<br/><br/>Learn how to make the most out of Jetpack Social <link>here</link>.<br/><br/>',
					'jetpack'
				),
				{
					a: (
						<a
							href={ getRedirectUrl( 'jetpack-social-sig-support-page' ) }
							target="_blank"
							rel="noreferrer"
						/>
					),
					br: <br />,
					link: (
						<a
							href={ getRedirectUrl( 'social-plugin-publicize-support-admin-page' ) }
							target="_blank"
							rel="noreferrer"
						/>
					),
				}
			),
		},
		jetpack_social_basic: {
			title: __( 'Jetpack Social Basic is active!', 'jetpack' ),
			text: createInterpolateElement(
				__(
					'Enjoy unlimited shares with Jetpack Social Basic. Learn how to make the most out of Jetpack Social <a>here</a>.',
					'jetpack'
				),
				{
					a: (
						<a
							href={ getRedirectUrl( 'social-plugin-publicize-support-admin-page' ) }
							target="_blank"
							rel="noreferrer"
						/>
					),
				}
			),
		},
		default: {
			title: __( 'Your product is active!', 'jetpack' ),
			text: __( "You're all set!", 'jetpack' ),
		},
	};

	return (
		<div className="jp-license-activation-screen-success-info--product-details">
			<h1>
				{ productInfoMap[ productGroup ].title }&nbsp;
				{ String.fromCodePoint( 0x1f389 ) /* Celebration emoji 🎉 */ }
			</h1>
			<p>{ productInfoMap[ productGroup ].text }</p>
		</div>
	);
};

JetpackProductDetails.propTypes = {
	dashboardUrl: PropTypes.string,
	productId: PropTypes.number,
};

export default JetpackProductDetails;
