<?php
	/*
	*  This is the custom home page
	*/
?>
<?php get_header(); ?>
<div class="animsition">
	<div class="Homepage">
		<div class="Homepage-inner">
			<header class="Homepage-header">
				<h1 class="Homepage-title">
					<a class="Homepage-titleInner" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
				</h1>
				<?php
					$description = get_bloginfo( 'description', 'display' );
					if ( $description || is_customize_preview() ) :
				?>
					<p class="Homepage-tagline site-description"><?php echo $description; ?></p>
				<?php endif; ?>
				<div class="Homepage-nav"></div>
			</header>
		</div>
		<div id="video" class="Homepage-media">
			<!--
				<video autoplay loop class="Homepage-video">
					<source src="<?php bloginfo('template_directory');?>/web/assets/home.mp4"
					type="video/mp4"/>
					<source src="<?php bloginfo('template_directory');?>/web/assets/home-mobile.webm"
					type='video/webm;codecs="vp8, vorbis"'/>
					<source src="<?php bloginfo('template_directory');?>/web/assets/home.mp4"
					type='video/mp4;codecs="avc1.42E01E, mp4a.40.2"'/>
				</video>
			-->
		</div>
	</div>
</div>
<script>
	$(document).ready(function() {
		$(".animsition").animsition({
			// inClass: 'fade-in',
			// outClass: 'fade-out',
			// inDuration: 1500,
			// outDuration: 800,
			// linkElement: '.animsition-link',
			// // e.g. linkElement: 'a:not([target="_blank"]):not([href^="#"])'
			// loading: true,
			// loadingParentElement: 'body', //animsition wrapper element
			// loadingClass: 'animsition-loading',
			// loadingInner: '', // e.g '<img src="loading.svg" />'
			// timeout: false,
			// timeoutCountdown: 5000,
			// onLoadEvent: true,
			// browser: [ 'animation-duration', '-webkit-animation-duration'],
			// // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
			// // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
			// overlay : false,
			// overlayClass : 'animsition-overlay-slide',
			// overlayParentElement : 'body',
			// transition: function(url){ window.location.href = url; }
		});
	});
</script>

<?php get_footer(); ?>
