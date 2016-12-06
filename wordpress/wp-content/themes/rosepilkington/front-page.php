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
				<div class="Homepage-nav">
					<?php wp_nav_menu( array('sort_column' => 'menu_order', 'container' => false, 'menu_class' => 'Homepage-items')); ?>
					<!-- <ul class="Homepage-items">
						<li class="Homepage-item">
							<a href="/work" class="Homepage-link">Work</a>
						</li>
						<li class="Homepage-item">
							<a href="/work" class="Homepage-link">About</a>
						</li>
						<li class="Homepage-item">
							<a href="/work" class="Homepage-link">Contact</a>
						</li>
					</ul> -->
				</div>
			</header>
		</div>
		<div class="Homepage-media" data-js="video"></div>
	</div>
</div>


<script>
	$(document).ready(function() {

		// Homepage video
		var isDesktop = $('html').hasClass('desktop'),
				$videoContainer = $('[data-js="video"]'),
				$video;

		if ( isDesktop && $videoContainer.length ) {
			$video = $('<video autoplay muted loop class="Homepage-video" id="intro" data-js="introVideo"><source src="<?php bloginfo('template_directory');?>/web/assets/home.mp4" type="video/mp4"></video>');
			$video.appendTo( $videoContainer );
		}

		// Homepage page transition
		$(".animsition").animsition({
			inClass: 'fade-in',
			inDuration: 1000,
			outDuration: 800
		});
	});
</script>

<?php get_footer(); ?>
