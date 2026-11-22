<?php

/**
 * The goal of this file is to allow developers a location
 * where they can overwrite core procedural functions and
 * replace them with their own. This file is loaded during
 * the bootstrap process and is called during the framework's
 * execution.
 *
 * This can be looked at as a `master helper` file that is
 * loaded early on, and may also contain additional functions
 * that you'd like to use throughout your entire application
 *
 * @see: https://codeigniter.com/user_guide/extending/common.html
 */

if (! function_exists('jwt_secret')) {
    /**
     * The JWT signing key. Refuses to run with a missing or weak key rather
     * than silently falling back to a guessable default.
     */
    function jwt_secret(): string
    {
        $secret = (string) env('JWT_SECRET', '');
        if (strlen($secret) < 32) {
            throw new RuntimeException('JWT_SECRET must be set to at least 32 characters.');
        }

        return $secret;
    }
}
