import { __ } from '@wordpress/i18n';
import useProduct from '../../../data/products/use-product';
import { getMyJetpackWindowInitialState } from '../../../data/utils/get-my-jetpack-window-state';
import useMyJetpackConnection from '../../../hooks/use-my-jetpack-connection';
import { InfoTooltip } from '../../info-tooltip';
import ShieldInactive from './assets/shield-inactive.svg';
import ShieldOff from './assets/shield-off.svg';
import ShieldSuccess from './assets/shield-success.svg';
import { useProtectTooltipCopy } from './use-protect-tooltip-copy';
import type { ReactElement, PropsWithChildren } from 'react';

export const AutoFirewallStatus = () => {
	const slug = 'protect';
	const { detail } = useProduct( slug );
	const { isPluginActive = false } = detail || {};
	const { isSiteConnected } = useMyJetpackConnection();
	const {
		protect: { wafConfig: wafData },
	} = getMyJetpackWindowInitialState();
	const { jetpack_waf_automatic_rules: isAutoFirewallEnabled } = wafData || {};

	if ( isPluginActive && isSiteConnected ) {
		if ( isAutoFirewallEnabled ) {
			return <WafStatus status="active" />;
		}

		return <WafStatus status="inactive" />;
	}

	return <WafStatus status="off" />;
};

/**
 * WafStatus component
 *
 * @param {PropsWithChildren}             props        - The component props
 * @param {'active' | 'inactive' | 'off'} props.status - The status of the WAF
 *
 * @return {ReactElement} rendered component
 */
function WafStatus( { status }: { status: 'active' | 'inactive' | 'off' } ) {
	const slug = 'protect';
	const { detail } = useProduct( slug );
	const { hasPaidPlanForProduct = false } = detail || {};
	const tooltipContent = useProtectTooltipCopy();
	const { autoFirewallTooltip } = tooltipContent;

	if ( status === 'active' ) {
		return (
			<>
				<div>
					<img
						className="value-section__status-icon"
						src={ ShieldSuccess }
						alt={ __( 'Shield icon - Auto-Firewall Status: On', 'jetpack-my-jetpack' ) }
					/>
				</div>
				<div className="value-section__status-text">{ __( 'On', 'jetpack-my-jetpack' ) }</div>
			</>
		);
	}
	if ( status === 'inactive' ) {
		return (
			<>
				<div>
					<img
						className="value-section__status-icon"
						src={ ShieldInactive }
						alt={ __( 'Shield icon - Auto-Firewall Status: Inactive', 'jetpack-my-jetpack' ) }
					/>
				</div>
				<div className="value-section__status-text">{ __( 'Inactive', 'jetpack-my-jetpack' ) }</div>
				<InfoTooltip
					tracksEventName={ 'protect_card_tooltip_open' }
					tracksEventProps={ {
						location: 'auto-firewall',
						status: status,
						feature: 'jetpack-protect',
						has_paid_plan: hasPaidPlanForProduct,
					} }
				>
					<>
						<h3>{ autoFirewallTooltip.title }</h3>
						<p>{ autoFirewallTooltip.text }</p>
					</>
				</InfoTooltip>
			</>
		);
	}
	return (
		<>
			<div>
				<img
					className="value-section__status-icon"
					src={ ShieldOff }
					alt={ __( 'Shield icon - Auto-Firewall Status: Off', 'jetpack-my-jetpack' ) }
				/>
			</div>
			<div className="value-section__status-text">{ __( 'Off', 'jetpack-my-jetpack' ) }</div>
		</>
	);
}
