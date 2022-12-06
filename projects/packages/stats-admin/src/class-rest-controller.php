<?php
/**
 * The Stats Rest Controller class.
 * Registers the REST routes for Calypso Stats.
 *
 * @package automattic/jetpack-stats-admin
 */

namespace Automattic\Jetpack\Stats_Admin;

use Automattic\Jetpack\Connection\Client;
use Automattic\Jetpack\Stats\WPCOM_Stats;
use Jetpack_Options;
use WP_Error;
use WP_Query;
use WP_REST_Server;

/**
 * Registers the REST routes for Stats.
 * It bascially forwards the requests to the WordPress.com REST API.
 */
class REST_Controller {
	/**
	 * Namespace for the REST API.
	 *
	 * @var string
	 */
	public static $namespace = 'jetpack/v4/stats-app';

	/**
	 * Hold an instance of WPCOM_Stats.
	 *
	 * @var WPCOM_Stats
	 */
	protected $wpcom_stats;

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->wpcom_stats = new WPCOM_Stats();
	}

	/**
	 * Registers the REST routes for Calypso Stats.
	 *
	 * The Calypso Stats is built from `wp-calypso`, which leverages the `public-api.wordpress.com` API.
	 * The current Site ID is added as part of the route, so that the front end doesn't have to handle the differences.
	 *
	 * @access public
	 * @static
	 */
	public function register_rest_routes() {
		// Stats for single resource type.
		register_rest_route(
			static::$namespace,
			sprintf( '/sites/%d/stats/(?P<resource>[\-\w]+)/(?P<resource_id>[\d]+)', Jetpack_Options::get_option( 'id' ) ),
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_single_resource_stats' ),
				'permission_callback' => array( $this, 'check_user_privileges_callback' ),
			)
		);

		// Stats for a resource type.
		register_rest_route(
			static::$namespace,
			sprintf( '/sites/%d/stats/(?P<resource>[\-\w]+)', Jetpack_Options::get_option( 'id' ) ),
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_stats_resource' ),
				'permission_callback' => array( $this, 'check_user_privileges_callback' ),
			)
		);

		// Single post info.
		register_rest_route(
			static::$namespace,
			sprintf( '/sites/%d/posts/(?P<resource_id>[\d]+)', Jetpack_Options::get_option( 'id' ) ),
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_single_post' ),
				'permission_callback' => array( $this, 'check_user_privileges_callback' ),
			)
		);

		// Single post info.
		register_rest_route(
			static::$namespace,
			sprintf( '/sites/%d/posts', Jetpack_Options::get_option( 'id' ) ),
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_posts' ),
				'permission_callback' => array( $this, 'check_user_privileges_callback' ),
			)
		);

		// Single post likes.
		register_rest_route(
			static::$namespace,
			sprintf( '/sites/%d/posts/(?P<resource_id>[\d]+)/likes', Jetpack_Options::get_option( 'id' ) ),
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_single_post_likes' ),
				'permission_callback' => array( $this, 'check_user_privileges_callback' ),
			)
		);

		// General stats for the site.
		register_rest_route(
			static::$namespace,
			sprintf( '/sites/%d/stats', Jetpack_Options::get_option( 'id' ) ),
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_site_stats' ),
				'permission_callback' => array( $this, 'check_user_privileges_callback' ),
			)
		);

		// Whether site has never published post / page.
		register_rest_route(
			static::$namespace,
			sprintf( '/sites/%d/site-has-never-published-post', Jetpack_Options::get_option( 'id' ) ),
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'site_has_never_published_post' ),
				'permission_callback' => array( $this, 'check_user_privileges_callback' ),
			)
		);
	}

	/**
	 * Only administrators or users with capability `view_stats` can access the API.
	 *
	 * @return bool|WP_Error True if a blog token was used to sign the request, WP_Error otherwise.
	 */
	public function check_user_privileges_callback() {
		if ( current_user_can( 'manage_options' ) || current_user_can( 'view_stats' ) ) {
			return true;
		}

		return $this->get_forbidden_error();
	}

	/**
	 * Stats resource endpoint.
	 *
	 * @param WP_REST_Request $req The request object.
	 * @return array
	 */
	public function get_stats_resource( $req ) {
		switch ( $req->get_param( 'resource' ) ) {
			case 'file-downloads':
				return $this->wpcom_stats->get_file_downloads( $req->get_params() );

			case 'video-plays':
				return $this->wpcom_stats->get_video_plays( $req->get_params() );

			case 'clicks':
				return $this->wpcom_stats->get_clicks( $req->get_params() );

			case 'search-terms':
				return $this->wpcom_stats->get_search_terms( $req->get_params() );

			case 'top-authors':
				return $this->wpcom_stats->get_top_authors( $req->get_params() );

			case 'country-views':
				return $this->wpcom_stats->get_views_by_country( $req->get_params() );

			case 'referrers':
				return $this->wpcom_stats->get_referrers( $req->get_params() );

			case 'top-posts':
				return $this->wpcom_stats->get_top_posts( $req->get_params() );

			case 'publicize':
				return $this->wpcom_stats->get_publicize_followers( $req->get_params() );

			case 'followers':
				return $this->wpcom_stats->get_followers( $req->get_params() );

			case 'tags':
				return $this->wpcom_stats->get_tags( $req->get_params() );

			case 'visits':
				return $this->wpcom_stats->get_visits( $req->get_params() );

			case 'comments':
				return $this->wpcom_stats->get_top_comments( $req->get_params() );

			case 'comment-followers':
				return $this->wpcom_stats->get_comment_followers( $req->get_params() );

			case 'streak':
				return $this->wpcom_stats->get_streak( $req->get_params() );

			case 'insights':
				return $this->wpcom_stats->get_insights( $req->get_params() );

			case 'highlights':
				return $this->wpcom_stats->get_highlights( $req->get_params() );

			default:
				return $this->get_forbidden_error();
		}

	}

	/**
	 * Return likes of a single post.
	 *
	 * @param WP_REST_Request $req The request object.
	 */
	public function get_single_post_likes( $req ) {
		return $this->get_single_post_likes_by_post_id( $req->get_param( 'resource_id' ) );
	}

	/**
	 * Site Stats Resource endpoint.
	 *
	 * @param WP_REST_Request $req The request object.
	 * @return array
	 */
	public function get_single_resource_stats( $req ) {
		switch ( $req->get_param( 'resource' ) ) {
			case 'post':
				return $this->wpcom_stats->get_post_views(
					intval( $req->get_param( 'resource_id' ) ),
					$req->get_params()
				);

			case 'video':
				return $this->wpcom_stats->get_video_details(
					intval( $req->get_param( 'resource_id' ) ),
					$req->get_params()
				);

			default:
				return $this->get_forbidden_error();
		}
	}

	/**
	 * Get brief information for a single post.
	 *
	 * @param WP_REST_Request $req The request object.
	 * @return array
	 */
	public function get_single_post( $req ) {
		$post = get_post( intval( $req->get_param( 'resource_id' ) ), 'OBJECT', 'display' );
		if ( is_wp_error( $post ) || empty( $post ) ) {
			return $post;
		}

		// It shouldn't be a problem because only title and ID are exposed.
		return array(
			'ID'    => $post->ID,
			'title' => $post->post_title,
			'URL'   => get_permalink( $post->ID ),
		);
	}

	/**
	 * This is only provides a capatible way for the front end to get the most recent post. It doesn't deal with any passed in params.
	 *
	 * @param WP_REST_Request $req The request object.
	 * @return array
	 */
	public function get_posts( $req ) {
		$args   = array(
			'posts_per_page' => 1,
			'order'          => 'DESC',
			'orderby'        => 'date',
			'post_type'      => 'post',
			'post_status'    => array( 'publish' ),
			'fields'         => 'ids',
		);
		$posts  = new WP_Query( $args );
		$return = array();
		foreach ( $posts->posts as $post_id ) {
			$post = get_post( $post_id );
			if ( ! is_wp_error( $post ) ) {
				$is_jetpack_likes_enabled = $this->is_jetpack_likes_enabled_for_post( (array) $post );
				$return[]                 = array(
					'ID'            => $post->ID,
					'title'         => $post->post_title,
					'post_type'     => $post->post_type,
					'URL'           => get_permalink( $post->ID ),
					'discussion'    => array(
						'comment_count' => $post->comment_count,
						'comments_open' => $post->comment_status,
					),
					'like_count'    => $is_jetpack_likes_enabled ? 0 : $this->get_single_post_like_count_by_post_id( $post_id ),
					'likes_enabled' => $is_jetpack_likes_enabled,
				);
			}
		}
		return array( 'posts' => $return );
	}

	/**
	 * Get site stats.
	 *
	 * @param WP_REST_Request $req The request object.
	 * @return array
	 */
	public function get_site_stats( $req ) {
		return $this->wpcom_stats->get_stats( $req->get_params() );
	}

	/**
	 * Whether site has never published post.
	 *
	 * @param WP_REST_Request $req The request object.
	 * @return array
	 */
	public function site_has_never_published_post( $req ) {
		return $this->request_as_blog_cached(
			sprintf(
				'/sites/%d/site-has-never-published-post?%s',
				Jetpack_Options::get_option( 'id' ),
				http_build_query(
					$req->get_params()
				)
			),
			'v2',
			array( 'timeout' => 5 ),
			null,
			'wpcom'
		);
	}

	/**
	 * Whether like is enabled for a post.
	 *
	 * @param array $post The post array.
	 */
	protected function is_jetpack_likes_enabled_for_post( $post ) {
		return function_exists( 'jetpack_post_likes_get_value' ) && jetpack_post_likes_get_value( (array) $post );
	}

	/**
	 * Returns like count of a post.
	 *
	 * @param int   $post_id The post id.
	 * @param array $params Additional parameters.
	 */
	protected function get_single_post_like_count_by_post_id( $post_id, $params = array() ) {
		$likes_response = $this->get_single_post_likes_by_post_id( $post_id, $params );
		if ( is_wp_error( $likes_response ) ) {
			return 0;
		}
		return isset( $likes_response['found'] ) ? $likes_response['found'] : 0;
	}

	/**
	 * Return likes of a single post.
	 *
	 * @param int   $post_id The post id.
	 * @param array $params Additional parameters.
	 */
	protected function get_single_post_likes_by_post_id( $post_id, $params = array() ) {
		$response = wp_remote_get(
			sprintf(
				'%s/rest/v1.2/sites/%d/posts/%d/likes?%s',
				JETPACK__WPCOM_JSON_API_BASE,
				Jetpack_Options::get_option( 'id' ),
				$post_id,
				http_build_query( $params )
			),
			array( 'timeout' => 5 )
		);

		$response_code = wp_remote_retrieve_response_code( $response );
		$response_body = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		if ( 200 !== $response_code ) {
			return new WP_Error(
				isset( $response_body['error'] ) ? 'remote-error-' . $response_body['error'] : 'remote-error',
				isset( $response_body['message'] ) ? $response_body['message'] : 'unknown remote error',
				array( 'status' => $response_code )
			);
		}

		return $response_body;
	}

	/**
	 * Query the WordPress.com REST API using the blog token
	 *
	 * @param String $path The API endpoint relative path.
	 * @param String $version The API version.
	 * @param array  $args Request arguments.
	 * @param String $body Request body.
	 * @param String $base_api_path (optional) the API base path override, defaults to 'rest'.
	 * @param bool   $use_cache (optional) default to true.
	 * @return array|WP_Error $response Data.
	 */
	protected function request_as_blog_cached( $path, $version = '1.1', $args = array(), $body = null, $base_api_path = 'rest', $use_cache = true ) {
		// Arrays are serialized without considering the order of objects, but it's okay atm.
		$cache_key = 'STATS_REST_RESP_' . md5( implode( '|', array( $path, $version, wp_json_encode( $args ), wp_json_encode( $body ), $base_api_path ) ) );

		if ( $use_cache ) {
			$response_body = get_transient( $cache_key );
			if ( false !== $response_body ) {
				return json_decode( $response_body, true );
			}
		}

		$response              = Client::wpcom_json_api_request_as_blog(
			$path,
			$version,
			$args,
			$body,
			$base_api_path
		);
		$response_code         = wp_remote_retrieve_response_code( $response );
		$response_body_content = wp_remote_retrieve_body( $response );
		$response_body         = json_decode( $response_body, true );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		if ( 200 !== $response_code ) {
			return new WP_Error(
				isset( $response_body['error'] ) ? 'remote-error-' . $response_body['error'] : 'remote-error',
				isset( $response_body['message'] ) ? $response_body['message'] : 'unknown remote error',
				array( 'status' => $response_code )
			);
		}

		// Cache the successful JSON response for 5 minutes.
		set_transient( $cache_key, $response_body_content, 5 * MINUTE_IN_SECONDS );
		return $response_body;
	}

	/**
	 * Return a WP_Error object with a forbidden error.
	 */
	protected function get_forbidden_error() {
		$error_msg = esc_html__(
			'You are not allowed to perform this action.',
			'jetpack-stats-admin'
		);

		return new WP_Error( 'rest_forbidden', $error_msg, array( 'status' => rest_authorization_required_code() ) );
	}
}
