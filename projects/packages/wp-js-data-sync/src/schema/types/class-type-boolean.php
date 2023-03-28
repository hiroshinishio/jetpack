<?php

namespace Automattic\Jetpack\WP_JS_Data_Sync\Schema\Types;

use Automattic\Jetpack\WP_JS_Data_Sync\Schema\Schema_Type;

class Type_Boolean implements Schema_Type {
	public function parse( $value ) {
		if ( is_bool( $value ) ) {
			return $value;
		}

		$loose_values = array( 'true', '1', 'false', '0', 0, 1 );
		if ( ! in_array( $value, $loose_values, true ) ) {
			throw new \Error( 'Invalid boolean value' );
		}
		return filter_var( $value, FILTER_VALIDATE_BOOLEAN );
	}

}
