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

	<!-- <link rel="shortcut icon" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon.png" /> -->
	<link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_stylesheet_directory_uri(); ?>/apple-touch-icon.png">
	<link rel="icon" type="image/png" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon-32x32.png" sizes="32x32">
	<link rel="icon" type="image/png" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon-16x16.png" sizes="16x16">
	<link rel="manifest" href="<?php echo get_stylesheet_directory_uri(); ?>/manifest.json">
	<link rel="mask-icon" href="<?php echo get_stylesheet_directory_uri(); ?>/safari-pinned-tab.svg" color="#5bbad5">
	<meta name="theme-color" content="#cccccc">

	<title><?php bloginfo('title'); ?></title>

	<meta name="description" content="<?php echo get_bloginfo('description'); ?>">
	<?php if ( is_singular() && pings_open( get_queried_object() ) ) : ?>
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<?php endif; ?>

	<link rel="stylesheet" href="<?php bloginfo('stylesheet_url');?>">

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
	<script src="<?php bloginfo('template_directory');?>/web/js/third-party/device/device.js"></script>
	<script src="<?php bloginfo('template_directory');?>/web/js/third-party/animsition/animsition.min.js"></script>
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

		<?php if ( is_front_page() || is_home() ) : ?>

		<?php else : ?>
			<header class="Header">
				<div class="Header-inner">
					<h2 class="Header-title">
						<a class="Header-titleInner" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
					</h2>
					<nav class="Header-nav">
						<ul class="Header-items">
							<li class="Header-item">
								<a href="/about" class="Header-link">About</a>
							</li>
							<li class="Header-item">
								<a href="/contact" class="Header-link">Contact</a>
							</li>
							<li class="Header-item">
								<a href="/work" class="Header-link">Work</a>
							</li>
						</ul>
					</nav>
				</div>
			</header>
		<?php endif; ?>
