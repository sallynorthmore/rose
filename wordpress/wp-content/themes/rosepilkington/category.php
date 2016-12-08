<?php
/*
Template Name: Category Page
*/
get_header(); ?>

<?php get_sidebar(); ?>

<section id="main" role="main" class="Work">
	<ul class="Work-items">
		<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

		<li class="Work-item">
			<div class="Work-itemInner">
				<a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>">
					<?php
						// Output large images only when an animated gif
							$url = wp_get_attachment_url( get_post_thumbnail_id( ) );
							$filetype = wp_check_filetype($url);
							if ($filetype[ext] == 'gif') {
									$imageSize = 'large';
							} else {
								$imageSize = 'medium';
							}
					?>
					<img class="lazy" data-original="<?php the_post_thumbnail_url( $imageSize ); ?>" title="<?php get_the_title(); ?>">
				</a>
				<h2 class="Work-title">
					<a class="Work-link" href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>">
						<div class="Work-linkOverlay"></div>
						<span class="Work-linkInner"><?php echo the_title(); ?></span>
					</a>
				</h2>
			</div>
		</li>
		<?php endwhile; ?>
		<?php else: ?>
		<li><p><?php _e('Sorry, there are no posts to show.'); ?></p></li>
		<?php endif; ?>
	</ul>
</section>
<script>
	$(document).ready(function(){
		var classes = ["Work-item--small", "Work-item--medium", "none"];
		$(".Work-item").each(function(){
				$(this).addClass(classes[~~(Math.random()*classes.length)]);
		});

		// Lazy load images
		$("img.lazy").lazyload();
	});
</script>
<?php get_footer(); ?>
