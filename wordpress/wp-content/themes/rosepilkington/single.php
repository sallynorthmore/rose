<?php get_header(); ?>
<?php get_sidebar(); ?>

<?php if (have_posts()) : while (have_posts()) : the_post();?>
<section id="main" role="main" class="Project">
	<div class="Project-inner">
		<div class="Project-client">
			<?php
				$client = get_post_meta( $post->ID, 'Client', true );
				echo "Client: " . $client;
			?>
		</div>
		<h1 class="Project-title">
			<?php the_title(); ?>
		</h1>

		<article id="post_<?php the_ID(); ?>" class="Project-content" data-js="project">
				<?php the_content(); ?>
		</article>

		<div class="Project-button">
			<div class="Close">
				<a href="/work" title="Close project" class="Close-inner">Close project</a>
			</div>
		</div>
	</div>
</section>
<?php endwhile; ?>
<?php endif; ?>
<script>
	$(document).ready(function() {
		var $videos = $('[data-js="project"] iframe');

		// Wrap videos in div.Project-video
		$videos.each(function(){
			var $div = $("<div>", {id: "foo", "class": "Project-video"});
			var video = $(this);
			var wrapper = $(this).parent("p");

			video.appendTo($div);
			$div.insertAfter(wrapper);
		});

		// Remove WP <style> for gallerys
		var $style = $('[data-js="project"] style');

		$style.each(function(){
			$(this).remove();
		});
	});
</script>
<?php get_footer(); ?>
