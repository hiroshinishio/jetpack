<?php
/**
 * Critical CSS Invalidator
 *
 * Reset critical CSS when existing critical css values are stale.
 */

namespace Automattic\Jetpack_Boost\Lib\Critical_CSS;

use Automattic\Jetpack_Boost\Lib\Boost_Health;
use Automattic\Jetpack_Boost\Lib\Critical_CSS\Source_Providers\Source_Providers;
use Automattic\Jetpack_Boost\Modules\Modules_Setup;
use Automattic\Jetpack_Boost\Modules\Optimizations\Cloud_CSS\Cloud_CSS;
use Automattic\Jetpack_Boost\Modules\Optimizations\Cloud_CSS\Cloud_CSS_Followup;

/**
 * Handler for invalidating Critical CSS; both Cloud and Local. Watches relevant
 * hooks and clears data when necessary. Also sends out its own action
 * (after_critical_css_invalidate) so that the Cloud or Local implementations of
 * Critical CSS can respond to the invalidation.
 */
class Critical_CSS_Invalidator {
	/**
	 * Register hooks.
	 */
	public static function init() {
		add_action( 'jetpack_boost_deactivate', array( __CLASS__, 'reset_data' ) );
		add_action( 'jetpack_boost_critical_css_environment_changed', array( __CLASS__, 'handle_environment_change' ) );
		add_filter( 'jetpack_boost_total_problem_count', array( __CLASS__, 'update_boost_problem_count' ) );
	}

	/**
	 * Reset Critical CSS data.
	 * For Cloud CSS, we need to make sure there are providers in the state,
	 * otherwise Cloud CSS cannot be stored after it is generated by the cloud.
	 */
	public static function reset_data() {
		$storage = new Critical_CSS_Storage();
		$storage->clear();

		$state = new Critical_CSS_State();
		$state->clear();

		if ( self::is_cloud_css() ) {
			$state->prepare_for_generation( ( new Source_Providers() )->get_provider_sources() );
			$state->save();

			// Clear the regenerate flag.
			// If we don't clear it, reverting to free will show the regenerate notice.
			jetpack_boost_ds_delete( 'critical_css_suggest_regenerate' );
		}

		Cloud_CSS_Followup::unschedule();
	}

	/**
	 * Respond to environment changes; deciding whether or not to clear Critical CSS data.
	 */
	public static function handle_environment_change( $is_major_change ) {
		if ( $is_major_change ) {
			self::reset_data();

			do_action( 'jetpack_boost_critical_css_invalidated' );
		}
	}

	public static function update_boost_problem_count( $count ) {
		$css_needs_regeneration = Boost_Health::critical_css_needs_regeneration();
		if ( $css_needs_regeneration ) {
			++$count;
		}

		return $count;
	}

	public static function is_cloud_css() {
		$optimizations = ( new Modules_Setup() )->get_status();
		return isset( $optimizations[ Cloud_CSS::get_slug() ] ) && $optimizations[ Cloud_CSS::get_slug() ];
	}
}
