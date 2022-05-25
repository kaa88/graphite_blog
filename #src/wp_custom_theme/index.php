<?php
	get_header();
	
	echo 'Index.php<br>';
	echo 'Здесь должны быть блоки if_search, if_archive(рубрики, метки, автор)';

	if ( is_search() ) {
		global $wp_query;
		
		if ( $wp_query->found_posts ) {
			print_r('<br>Найдено: ' . $wp_query->found_posts . ' совпадений');
		}
	}

	if ( have_posts() ) : while ( have_posts() ) : the_post();
	?>

		<section class="section">
			<div class="section__container container">
				<h2 style="font-size: 30px;font-weight: bold;"><?php the_title() ?></h2>
				<?php the_content() ?>
				<?php the_author_posts_link(); ?>
			</div>
		</section>

	<?php endwhile; else : ?>
		<p>Записей нет.</p>
	<?php endif;


	get_footer();
?>
