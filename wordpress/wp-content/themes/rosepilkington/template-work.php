<?php
/*
	Template Name: Work page
*/
?>
<?php get_header(); ?>

<?php if (have_posts()) : while (have_posts()) : the_post();?>

<?php
	/*
	* If there are subcategories for item, for each, list the description and posts for that subcat
	*/
	$cat = 'item';
	$catID = get_cat_ID($cat);
	// 3,4
	$args = array(
	  'order' => 'desc',
	  'include' => '2',
	  'child_of' => $catID
	  );
	$subcats = get_categories($args);

?>

<div class="sub-menu" id="work-menu">
	<?php wp_nav_menu( array('theme_location' => 'extra-menu', 'sort_column' => 'menu_order', 'container' => false, 'menu_class' => 'submenu-items')); ?>
</div>

<section id="main" role="main">

	<?php foreach($subcats as $subcat): ?>
	<?php
		$str = $subcat->cat_name;
		$subcatName = strtolower($str);
	?>
	<div id="<?php echo $subcatName; ?>" name="<?php echo $subcat->cat_name; ?>" class="subcat">
	    <ul class="category-items">
			<?php
				$subcat_posts = get_posts('cat=' . $subcat->cat_ID . '&showposts=100');
			?>
		    <?php foreach($subcat_posts as $subcat_post): ?>
	     	<?php
		        $post_id = $subcat_post->ID;
			?>

			<li class="category-item">
				<a href="<?php echo get_permalink($post_id); ?>" rel="shadowbox[gallery]">
					<?php if ( has_post_thumbnail($post_id)): ?>
					<div class="FlexEmbed">
		              <div class="FlexEmbed-ratio FlexEmbed-ratio--8by5"></div>
		              <div class="FlexEmbed-content">
		                <?php echo get_the_post_thumbnail($post_id, 'original'); ?>
		              </div>
		            </div>
					<?php else: ?>
					<img src="<?php bloginfo('template_directory'); ?>/images/placeholder.jpg" width="320" height="200" />
					<?php endif; ?>
				</a>
				<h3 class="category-itemTitle"><?php echo get_the_title($post_id); ?></h3>
				<p class="category-itemSubtitle">
					<?php echo get_post_meta($post_id, 'subtitle', true); ?>
				</p>
				<?php
					$posttags = get_the_tags($post_id);
					if ($posttags): ?>
				<ul class="category-itemTags">
					<?php foreach($posttags as $tag) {
					    echo '<li>' . $tag->name . '<span>,&nbsp;&nbsp;</span></li>';
					 } ?>
				</ul>
				<?php endif; ?>
			</li>
			<?php endforeach; ?>
		</ul>
	</div>
	<?php endforeach; ?>

</section>

<?php endwhile; endif; ?>

<script src="<?php bloginfo('template_directory'); ?>/js/scrollTo.js"></script>
<script src="<?php bloginfo('template_directory'); ?>/js/work.js"></script>

<?php get_footer(); ?>
