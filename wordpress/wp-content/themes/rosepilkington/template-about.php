<?php
/*
Template Name: About Page
*/
?>
<?php get_header(); ?>

<?php get_sidebar(); ?>

<?php if (have_posts()) : while (have_posts()) : the_post();?>

<section id="main" class="about-page" role="main">
	<?php the_content(); ?>
</section>

<?php endwhile; endif; ?>
