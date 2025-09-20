<?php
/*
Plugin Name: CF7 Generic Confirmation Addon
Description: ContactForm7の確認画面追加用
Version:     1.0
Author:      
*/

if ( ! defined( 'ABSPATH' ) ) exit;

// CF7 のフォームを含むページでだけ読み込む
function cc_enqueue_confirm_assets() {
    if ( function_exists('wpcf7_enqueue_scripts') ) {
        wp_enqueue_style(  'cc-confirm-css',  plugin_dir_url(__FILE__).'assets/css/confirm.css' );
        wp_enqueue_script( 'cc-confirm-js',   plugin_dir_url(__FILE__).'assets/js/confirm.js', ['jquery'], '1.0', true );
    }
}
add_action( 'wp_enqueue_scripts', 'cc_enqueue_confirm_assets' );
