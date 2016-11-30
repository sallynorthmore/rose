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
					<?php the_post_thumbnail('large'); ?>
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
