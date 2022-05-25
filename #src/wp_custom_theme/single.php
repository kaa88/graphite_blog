<?php

get_header();

if ( have_posts() ) : while ( have_posts() ) : the_post();

?>

	<section class="section">
		<div class="section__container container">
			<h2 style="font-size: 30px;font-weight: bold;"><?php the_title() ?></h2>
			<?php the_content() ?>
		</div>
	</section>

<?php endwhile; else : ?>
	<p>Записей нет.</p>
<?php endif; ?>


<?php get_footer(); ?>
