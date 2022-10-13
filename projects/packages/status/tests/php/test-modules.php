<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Tests for Automattic\Jetpack\Status\Modules methods
 *
 * @package automattic/jetpack-status
 */

namespace Automattic\Jetpack;

use Brain\Monkey;
use Brain\Monkey\Functions;
use PHPUnit\Framework\TestCase;

/**
 * Status test suite.
 */
class Test_Modules extends TestCase {

	/**
	 * Test setup.
	 *
	 * @before
	 */
	public function set_up() {
		parent::setUp();
		Monkey\setUp();

		// Resetting the static property to avoid using PHPUnit's serialization of properties.
		$reflection = new \ReflectionProperty( '\Automattic\Jetpack\Modules', 'enforced_modules' );
		$reflection->setAccessible( true );
		$reflection->setValue( array() );

		Functions\when( 'is_multisite' )->justReturn( false );
	}

	/**
	 * Test teardown.
	 *
	 * @after
	 */
	public function tear_down() {
		parent::tearDown();

		$container = \Mockery::getContainer();
		if ( $container ) {
			$this->addToAssertionCount(
				$container->mockery_getExpectationCount()
			);
		}

		Monkey\tearDown();
		\Mockery::close();
	}

	/**
	 * Tests that there are no enforced modules by default
	 */
	public function test_no_enforced_modules() {
		Functions\when( 'get_option' )->justReturn( array() );

		$enforced_modules = \Jetpack_Options::get_option( 'active_modules_enforced' );
		$this->assertEmpty( $enforced_modules );
	}

	/**
	 * Testing garbage input.
	 *
	 * @dataProvider provider_unfiltered_module_arrays
	 * @param Array $enforced Enforced module list.
	 * @param Array $filtered Module list to be filtered.
	 */
	public function test_garbage_input( $enforced, $filtered ) {
		$modules = new Modules();
		$modules->enforce( 'garbage' );

		// The filter should not change anything when garbage is passed
		$this->assertEquals(
			array_values( array_filter( $filtered ) ),
			$modules->filter_active_modules( $filtered )
		);

		$this->assertFalse(
			has_filter(
				'jetpack_active_modules',
				array( $modules, 'filter_active_modules' )
			)
		);
	}

	/**
	 * Testing the main filtering logic.
	 *
	 * @dataProvider provider_unfiltered_module_arrays
	 * @param Array $enforced Enforced module list.
	 * @param Array $filtered Module list to be filtered.
	 * @param Array $result   The list after being filtered.
	 */
	public function test_modules_get_enforced_by_filter( $enforced, $filtered, $result ) {
		Functions\when( 'get_option' )->justReturn( array() );
		Functions\when( 'update_option' )->justReturn( true );

		$modules = \Mockery::mock( '\Automattic\Jetpack\Modules[activate]' );
		$modules->shouldReceive( 'activate' );
		$modules->enforce( $enforced );

		$this->assertEquals(
			10,
			has_filter(
				'jetpack_active_modules',
				array( $modules, 'filter_active_modules' )
			)
		);

		$this->assertEquals(
			$result,
			$modules->filter_active_modules( $filtered )
		);

		$modules2 = \Mockery::mock( '\Automattic\Jetpack\Modules[activate]' );
		$modules2->shouldReceive( 'activate' );
		$modules2->enforce( array( 'infinite-scroll' ) );

		$this->assertEquals(
			array_merge( $result, array( 'infinite-scroll' ) ),
			$modules->filter_active_modules( $filtered )
		);
	}

	/**
	 * Testing the option handling.
	 *
	 * @dataProvider provider_unfiltered_module_arrays
	 * @param Array $enforced Enforced module list to be passed as an argument.
	 */
	public function test_module_enforcement_adds_option( $enforced ) {
		$modules = \Mockery::mock( '\Automattic\Jetpack\Modules[activate]' );
		$modules->shouldReceive( 'activate' );

		Functions\when( 'get_option' )->justReturn( array() );
		Functions\expect( 'update_option' )
			->once()
			->with( 'jetpack_active_modules_enforced', $enforced, true );

		$modules->enforce( $enforced );
	}

	/**
	 * Testing the removal of enforced option.
	 *
	 * @dataProvider provider_unfiltered_module_arrays
	 * @param Array $enforced Enforced module list.
	 * @param Array $filtered Module list to be filtered.
	 * @param Array $result   The list after being filtered.
	 */
	public function test_module_ceasing_to_enforce_removes_option( $enforced, $filtered, $result ) {
		$modules = \Mockery::mock( '\Automattic\Jetpack\Modules[activate]' );

		// Going backwards - returning the result that we expected when adding enforced modules.
		Functions\when( 'get_option' )->justReturn( $result );
		Functions\expect( 'update_option' )
			->once()
			->with(
				'jetpack_active_modules_enforced',
				array_values( array_filter( $filtered ) ),
				true
			);

		$modules->stop_enforcing( $enforced );
	}

	/**
	 * Testing the option handling.
	 *
	 * @dataProvider provider_unfiltered_module_arrays
	 * @param Array $enforced Enforced module list to be passed as an argument.
	 */
	public function test_module_enforcement_combines_with_existing_option_value( $enforced ) {
		$modules  = \Mockery::mock( '\Automattic\Jetpack\Modules[activate]' );
		$existing = array( 'infinite-scroll' );
		$result   = array_merge( $existing, $enforced );

		Functions\when( 'get_option' )->justReturn( $existing );
		Functions\expect( 'update_option' )
			->once()
			->with( 'jetpack_active_modules_enforced', $result, true );

		foreach ( $enforced as $slug ) {
			$modules
				->shouldReceive( 'activate' )
				->with( $slug )
				->times( 1 );
		}

		$modules->enforce( $enforced );
	}

	/**
	 * Provides three arguments:
	 * - the enforced array
	 * - the filtered array
	 * - the resulting array
	 * */
	public function provider_unfiltered_module_arrays() {
		return array(
			array(
				array( 'publicize' ),
				array( '' ),
				array( 'publicize' ),
			),
			array(
				array( 'publicize', 'sharing' ),
				array( '' ),
				array( 'publicize', 'sharing' ),
			),
			array(
				array( 'publicize', 'sharing', 'stats' ),
				array( 'monitor' ),
				array( 'monitor', 'publicize', 'sharing', 'stats' ),
			),
			array(
				array( '' ),
				array( 'stats' ),
				array( 'stats' ),
			),
			array(
				array( 'sharing' ),
				array( 'publicize' ),
				array( 'publicize', 'sharing' ),
			),
		);
	}
}
