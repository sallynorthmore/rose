<?php

/*
*
*  Add editable site navigation
*
*/
	function register_my_menus() {
	  register_nav_menus(
	    array(
	      'header-menu' => __( 'Header Menu' ),
	      'extra-menu' => __( 'Extra Menu' )
	    )
	  );
	}
	add_action( 'init', 'register_my_menus' );

/*
*
*  Register dynamic sidebar
*
*/
if ( function_exists('register_sidebar') )
    register_sidebar();

if ( function_exists('register_sidebar') )
    register_sidebar(array(
        'before_widget' => '',
        'after_widget' => '',
        'before_title' => '<div class="title">',
        'after_title' => '</div>',
    ));

/*
*
*  Add support for post feature images (thumbnails)
*
*/
	add_theme_support( 'post-thumbnails' );
	set_post_thumbnail_size( 320, 200, true ); // Normal post thumbnails
	//add_image_size( 'single-post-thumbnail', 400, 9999 ); // Permalink thumbnail size

/*
*
*  Exclude post feature images from post gallery
*
*/
function exclude_thumbnail_from_gallery($null, $attr)
{
    if (!$thumbnail_ID = get_post_thumbnail_id())
        return $null; // no point carrying on if no thumbnail ID

    // temporarily remove the filter, otherwise endless loop!
    remove_filter('post_gallery', 'exclude_thumbnail_from_gallery');

    // pop in our excluded thumbnail
    if (!isset($attr['exclude']) || empty($attr['exclude']))
        $attr['exclude'] = array($thumbnail_ID);
    elseif (is_array($attr['exclude']))
        $attr['exclude'][] = $thumbnail_ID;

    // now manually invoke the shortcode handler
    $gallery = gallery_shortcode($attr);

    // add the filter back
    add_filter('post_gallery', 'exclude_thumbnail_from_gallery', 10, 2);

    // return output to the calling instance of gallery_shortcode()
    return $gallery;
}
add_filter('post_gallery', 'exclude_thumbnail_from_gallery', 10, 2);


/*
*
*  Add "last item" class on menus
*
*/
	function nav_menu_add_classes( $items ) {
	 $pos = strrpos($items, 'class="menu-item', -1);
	 $items=substr_replace($items, 'menu-item-last ', $pos+7, 0);
	 $pos = strpos($items, 'class="menu-item');
	 $items=substr_replace($items, 'menu-item-first ', $pos+7, 0);
	 return $items;
	}

	add_filter( 'wp_nav_menu_items', 'nav_menu_add_classes' );
?>
