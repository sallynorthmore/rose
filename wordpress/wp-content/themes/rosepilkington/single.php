<?php get_header(); ?>
<?php get_sidebar(); ?>

<?php if (have_posts()) : while (have_posts()) : the_post();?>
<section id="main" role="main" class="Project">

	<div class="Project-button">
		<div class="Close">
			<a href="/archives/category/work" title="close" class="Close-inner">close</a>
		</div>
	</div>

	<article id="post_<?php the_ID(); ?>" class="Project-content">

		<h1 class="Project-title">
			<?php the_title(); ?>
		</h1>

		<div class="Project-body">
			<?php the_content(); ?>
		</div>
	</article>
</section>
<?php endwhile; ?>
<?php endif; ?>
