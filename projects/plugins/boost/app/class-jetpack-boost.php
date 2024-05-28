<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://automattic.com
 * @since      1.0.0
 * @package    automattic/jetpack-boost
 */

namespace Automattic\Jetpack_Boost;

use Automattic\Jetpack\Boost_Core\Lib\Transient;
use Automattic\Jetpack\Boost_Speed_Score\Speed_Score_History;
use Automattic\Jetpack\Config as Jetpack_Config;
use Automattic\Jetpack\Image_CDN\Image_CDN_Core;
use Automattic\Jetpack\My_Jetpack\Initializer as My_Jetpack_Initializer;
use Automattic\Jetpack\Plugin_Deactivation\Deactivation_Handler;
use Automattic\Jetpack_Boost\Admin\Admin;
use Automattic\Jetpack_Boost\Admin\Regenerate_Admin_Notice;
use Automattic\Jetpack_Boost\Data_Sync\Getting_Started_Entry;
use Automattic\Jetpack_Boost\Lib\Analytics;
use Automattic\Jetpack_Boost\Lib\CLI;
use Automattic\Jetpack_Boost\Lib\Connection;
use Automattic\Jetpack_Boost\Lib\Critical_CSS\Critical_CSS_State;
use Automattic\Jetpack_Boost\Lib\Critical_CSS\Critical_CSS_Storage;
use Automattic\Jetpack_Boost\Lib\Critical_CSS\Generator;
use Automattic\Jetpack_Boost\Lib\Setup;
use Automattic\Jetpack_Boost\Lib\Site_Health;
use Automattic\Jetpack_Boost\Lib\Status;
use Automattic\Jetpack_Boost\Modules\Modules_Index;
use Automattic\Jetpack_Boost\Modules\Modules_Setup;
use Automattic\Jetpack_Boost\Modules\Optimizations\Page_Cache\Page_Cache;
use Automattic\Jetpack_Boost\Modules\Optimizations\Page_Cache\Page_Cache_Setup;
use Automattic\Jetpack_Boost\Modules\Optimizations\Page_Cache\Pre_WordPress\Boost_Cache_Settings;
use Automattic\Jetpack_Boost\REST_API\Endpoints\List_Site_Urls;
use Automattic\Jetpack_Boost\REST_API\Endpoints\List_Source_Providers;
use Automattic\Jetpack_Boost\REST_API\REST_API;

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @author     Automattic <support@jetpack.com>
 */
class Jetpack_Boost {

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @var string The string used to uniquely identify this plugin.
	 */
	private $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @var string The current version of the plugin.
	 */
	private $version;

	/**
	 * The Jetpack Boost Connection manager instance.
	 *
	 * @since    1.0.0
	 * @access   public
	 * @var Connection The Jetpack Boost Connection manager instance.
	 */
	public $connection;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		$this->version     = JETPACK_BOOST_VERSION;
		$this->plugin_name = 'jetpack-boost';

		$this->connection = new Connection();
		$this->connection->init();

		// Require plugin features.
		$this->init_textdomain();

		$this->register_deactivation_hook();

		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			$cli_instance = new CLI( $this );
			\WP_CLI::add_command( 'jetpack-boost', $cli_instance );
		}

		$modules_setup = new Modules_Setup();
		Setup::add( $modules_setup );

		// Initialize the Admin experience.
		$this->init_admin( $modules_setup );

		// Initiate jetpack sync.
		$this->init_sync();

		add_action( 'init', array( $this, 'init_textdomain' ) );

		add_action( 'jetpack_boost_critical_css_environment_changed', array( $this, 'handle_environment_change' ), 10, 2 );

		// Fired when plugin ready.
		do_action( 'jetpack_boost_loaded', $this );

		My_Jetpack_Initializer::init();

		Deactivation_Handler::init( $this->plugin_name, __DIR__ . '/admin/deactivation-dialog.php' );

		// Register the core Image CDN hooks.
		Image_CDN_Core::setup();

		// Setup Site Health panel functionality.
		Site_Health::init();
	}

	/**
	 * Register deactivation hook.
	 */
	private function register_deactivation_hook() {
		$plugin_file = trailingslashit( dirname( __DIR__ ) ) . 'jetpack-boost.php';
		register_deactivation_hook( $plugin_file, array( $this, 'deactivate' ) );
	}

	/**
	 * Add query args used by Boost to a list of allowed query args.
	 *
	 * @param array $allowed_query_args The list of allowed query args.
	 *
	 * @return array The modified list of allowed query args.
	 */
	public static function whitelist_query_args( $allowed_query_args ) {
		$allowed_query_args[] = Generator::GENERATE_QUERY_ACTION;
		$allowed_query_args[] = Modules_Index::DISABLE_MODULE_QUERY_VAR;
		return $allowed_query_args;
	}

	/**
	 * Plugin activation handler.
	 */
	public static function activate() {
		// Make sure user sees the "Get Started" when first time opening.
		( new Getting_Started_Entry() )->set( true );
		Analytics::record_user_event( 'activate_plugin' );

		$page_cache_status = new Status( Page_Cache::class );
		if ( $page_cache_status->is_enabled() && Boost_Cache_Settings::get_instance()->get_enabled() ) {
			Page_Cache_Setup::run_setup();
		}
	}

	/**
	 * Plugin deactivation handler. Clear cache, and reset admin notices.
	 */
	public function deactivate() {
		do_action( 'jetpack_boost_deactivate' );

		// Tell Minify JS/CSS to clean up.
		require_once JETPACK_BOOST_DIR_PATH . '/app/lib/minify/functions-helpers.php';
		jetpack_boost_page_optimize_deactivate();

		Regenerate_Admin_Notice::dismiss();
		Analytics::record_user_event( 'deactivate_plugin' );
		Page_Cache_Setup::deactivate();
	}

	/**
	 * Initialize the admin experience.
	 */
	public function init_admin( $modules_setup ) {
		REST_API::register( List_Site_Urls::class );
		REST_API::register( List_Source_Providers::class );
		$this->connection->ensure_connection();
		( new Admin() )->init( $modules_setup );
	}

	public function init_sync() {
		$jetpack_config = new Jetpack_Config();
		$jetpack_config->ensure(
			'sync',
			array(
				'jetpack_sync_callable_whitelist' => array(
					'boost_modules'                => array( new Modules_Setup(), 'get_status' ),
					'boost_sub_modules_state'      => array( new Modules_Setup(), 'get_all_sub_modules_state' ),
					'boost_latest_scores'          => array( new Speed_Score_History( get_home_url() ), 'latest' ),
					'boost_latest_no_boost_scores' => array( new Speed_Score_History( add_query_arg( Modules_Index::DISABLE_MODULE_QUERY_VAR, 'all', get_home_url() ) ), 'latest' ),
					'critical_css_state'           => array( new Critical_CSS_State(), 'get' ),
				),
			)
		);
	}

	/**
	 * Loads the textdomain.
	 */
	public function init_textdomain() {
		load_plugin_textdomain(
			'jetpack-boost',
			false,
			JETPACK_BOOST_DIR_PATH . '/languages/'
		);
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @return string The name of the plugin.
	 * @since     1.0.0
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @return string The version number of the plugin.
	 * @since     1.0.0
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Handle an environment change to set the correct status to the Critical CSS request.
	 * This is done here so even if the Critical CSS module is switched off we can
	 * still capture the change of environment event and flag Critical CSS for a rebuild.
	 */
	public function handle_environment_change( $is_major_change, $change_type ) {
		if ( $is_major_change ) {
			Regenerate_Admin_Notice::enable();
		}

		jetpack_boost_ds_set( 'critical_css_suggest_regenerate', $change_type );
	}

	/**
	 * Plugin uninstallation handler. Delete all settings and cache.
	 */
	public function uninstall() {
		global $wpdb;

		// When uninstalling, make sure all deactivation cleanups have run as well.
		$this->deactivate();

		// Delete all Jetpack Boost options.
		//phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
		$option_names = $wpdb->get_col(
			"
				SELECT `option_name`
				FROM   `$wpdb->options`
				WHERE  `option_name` LIKE 'jetpack_boost_%';
			"
		);
		//phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

		foreach ( $option_names as $option_name ) {
			delete_option( $option_name );
		}

		// Delete stored Critical CSS.
		( new Critical_CSS_Storage() )->clear();

		// Delete all transients created by boost.
		Transient::delete_by_prefix( '' );

		// Clear getting started value
		( new Getting_Started_Entry() )->set( false );

		Page_Cache_Setup::uninstall();
	}
}
