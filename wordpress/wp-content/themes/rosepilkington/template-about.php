<?php
/*
Template Name: About Page
*/
?>
<?php get_header(); ?>

<?php get_sidebar(); ?>

<?php if (have_posts()) : while (have_posts()) : the_post();?>

<section id="main" class="Page" role="main">
	<div class="Page-inner">
			<div class="Content">
				<?php the_content(); ?>
			</div>
	</div>
</section>

<?php endwhile; endif; ?>
