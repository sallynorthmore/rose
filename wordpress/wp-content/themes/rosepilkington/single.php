<?php get_header(); ?>
<?php get_sidebar(); ?>

<?php if (have_posts()) : while (have_posts()) : the_post();?>
<section id="main" role="main" class="Project">
	<div class="Project-inner">
		<div class="Project-button">
			<div class="Close">
				<a href="/archives/category/work" title="close" class="Close-inner">close</a>
			</div>
		</div>

		<div class="Project-client">
			<?php the_meta(); ?>
		</div>
		<h1 class="Project-title">
			<?php the_title(); ?>
		</h1>

		<article id="post_<?php the_ID(); ?>" class="Project-content">
				<?php the_content(); ?>
		</article>
	</div>
</section>
<?php endwhile; ?>
<?php endif; ?>
