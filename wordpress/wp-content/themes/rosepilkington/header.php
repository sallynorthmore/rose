<?php
/**
 * The template for displaying the header
 *
 * Displays all of the head element and everything up until the "site-content" div.
 *
 * @package WordPress
 * @subpackage rosepilkington
 * @since Rose Pilkington 1.0
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<title><?php bloginfo('title'); ?></title>
	<meta name="description" content="<?php echo $bloginfo; ?> ">
	<?php if ( is_singular() && pings_open( get_queried_object() ) ) : ?>
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<?php endif; ?>
	<!-- animsition.css -->
	<link rel="stylesheet" href="<?php bloginfo('stylesheet_url');?>">
	<!-- jQuery -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
	<!-- animsition.js -->
	<script src="<?php bloginfo('template_directory');?>/web/js/third-party/animsition/animsition.min.js"></script>


	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

		<?php if ( is_front_page() || is_home() ) : ?>

		<?php else : ?>
			<p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?> yah</a></p>
		<?php endif; ?>
