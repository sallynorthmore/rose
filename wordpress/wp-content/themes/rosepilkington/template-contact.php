<?php
/*
Template Name: Contact Page
*/
?>
<?php get_header(); ?>

<?php get_sidebar(); ?>

<?php if (have_posts()) : while (have_posts()) : the_post();?>

<section id="main" class="Page--contact" role="main">
	<div class="Page-inner">
			<div class="Content Content--contact">
				<?php the_content(); ?>
			</div>
			<!-- <div class="Page-footer">
				<p>
					Copyright &copy; All Images Rose Pilkington 2016
				</p>
			</div> -->
	</div>

</section>

<?php endwhile; endif; ?>

<?php get_footer(); ?>
