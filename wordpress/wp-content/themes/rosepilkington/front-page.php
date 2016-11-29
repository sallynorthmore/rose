<?php
	/*
	*  This is the custom home page
	*/
?>
<?php get_header(); ?>
<div class="Homepage">
	<div class="Homepage-inner">
		<header class="Homepage-header">
			<h1 class="Homepage-title">
				<a class="Homepage-titleInner" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
			</h1>
			<div class="Homepage-nav"></div>
		</header>
	</div>
	<div id="video" class="Homepage-media">
		<img src="/web/assets/home.png" class="Homepage-image" />
			<video autoplay loop>
<!-- 
				<source src="<?php bloginfo('template_directory');?>/web/assets/home.mp4"
				type="video/mp4"/> -->

				<!-- <source src="<?php bloginfo('template_directory');?>/web/assets/home.webm"
				type='video/webm;codecs="vp8, vorbis"'/>
				<source src="<?php bloginfo('template_directory');?>/web/assets/home.mp4"
				type='video/mp4;codecs="avc1.42E01E, mp4a.40.2"'/> -->
			</video>
	</div>
</div>
<?php get_footer(); ?>
