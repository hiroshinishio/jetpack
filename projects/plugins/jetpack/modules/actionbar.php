<?php
/**
 * Module Name: Action bar
 * Module Description: An easy to use way for visits to follow, like, and comment on your site.
 * Sort Order: 38
 * Recommendation Order: 16
 * First Introduced: $$next-version$$
 * Requires Connection: Yes
 * Auto Activate: No
 * Module Tags: Sharing
 * Feature: Sharing
 * Additional Search Queries: adminbar, actionbar
 *
 * @package automattic/jetpack
 */

use Automattic\Jetpack\Assets;

function jetpack_enqueue_action_bar() {
		wp_enqueue_script(
			'jetpack-action-bar',
			Assets::get_file_url_for_environment( '_inc/build/action-bar.min.js', '_inc/build/action-bar.js' ),
		);
}

add_action( 'wp_enqueue_scripts', 'jetpack_enqueue_action_bar' );
