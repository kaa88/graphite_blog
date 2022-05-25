<?php

// CLEANING //
require_once 'functions/wp_clean.php';
// Manually delete readme.html


// Site styles & scripts
add_action('wp_enqueue_scripts', function() {
	// wp_enqueue_style('dashicons'); // WP icons

	wp_enqueue_style(
		'main-style', // идентификатор
		get_template_directory_uri() . '/css/website.style.css',  // URL
		[], // зависимости
		'1' // версия
	);
	wp_enqueue_script(
		'main-script', // идентификатор
		get_template_directory_uri() . '/js/website.script.js',  // URL
		[], // зависимости
		'1', // версия
		true // в футере
	);
	// wp_add_inline_script(
	// 	'admin-bar',
	// 	'document.querySelector(".header").style.top = "46px";'
	// );
});

add_action('after_setup_theme', function() {
	// Supports
	add_theme_support('title-tag'); // сам заполняет title при wp_head()
	add_theme_support('admin-bar', ['callback'=>'__return_false']); // убирает верхний отступ админ-бара
	add_theme_support('post-thumbnails'); // поддержка миниатюр для постов
	add_theme_support('html5', [ // поддержка html5
		'comment-list','comment-form','search-form','gallery','caption','script','style',
	]);

	// Области Меню
	register_nav_menus([
		'header-menu' => 'Шапка',
		// 'footer-menu' => 'Подвал',
	]);
});

// Carbon fields
// require_once 'functions/carbon_fields.php';
// add_action('carbon_fields_register_fields', 'add_custom_fields');


// WP Term Image - поддержка миниатюр для таксономий
require_once __DIR__ . '/functions/wp_term_image.php';
add_action( 'admin_init', 'kama_wp_term_image' );
function kama_wp_term_image(){
	// Укажем для какой таксономии нужна возможность устанавливать картинки.
	// Можно не указывать, тогда возможность будет автоматом добавлена для всех публичных таксономий.
	\Kama\WP_Term_Image::init( [
		// 'taxonomies' => [ 'post_tag' ],
	] );
};


// New taxonomy
// add_action( 'init', function(){
// 	register_taxonomy( 'portfolio_type', [ 'portfolio' ], [
// 		'labels' => [
// 			'name'              => 'Виды работ',
// 			'singular_name'     => 'Вид работы',
// 			'menu_name'         => 'Виды работ',
// 			'search_items'      => 'Искать виды работ',
// 			'all_items'         => 'Все виды работ',
// 			'view_item'         => 'Смотреть вид работы',
// 			'edit_item'         => 'Редактирование вида работы',
// 			'add_new_item'      => 'Добавление вида работы',
// 			'new_item_name'     => 'Новый вид работы',
// 			'back_to_items'     => 'Назад к видам',
// 		],
// 		'public'               => true,
// 		// 'hierarchical'         => false,
// 	] );
// });


// New post type
// add_action('init', function() {
// 	register_post_type('portfolio', [
// 		'labels' => [
// 			'name'               => 'Портфолио', // основное название для типа записи
// 			'singular_name'      => 'Портфолио', // название для одной записи этого типа
// 			'menu_name'          => 'Портфолио', // название меню
// 			'add_new'            => 'Добавить работу', // для добавления новой записи
// 			'add_new_item'       => 'Добавление работы', // заголовка у вновь создаваемой записи в админ-панели.
// 			'edit_item'          => 'Редактирование работы', // для редактирования типа записи
// 			'new_item'           => 'Новая работа', // текст новой записи
// 			'view_item'          => 'Смотреть работу', // для просмотра записи этого типа.
// 			'search_items'       => 'Искать работу', // для поиска по этим типам записи
// 			'not_found'          => 'Не найдено', // если в результате поиска ничего не было найдено
// 			'not_found_in_trash' => 'Не найдено в корзине', // если не было найдено в корзине
// 		],
// 		'public'              => true,
// 		'menu_position'       => 5,
// 		'menu_icon'           => 'dashicons-carrot',
// 		'supports'            => ['title', 'editor','thumbnail','excerpt'], // 'title','editor','author','thumbnail','excerpt','trackbacks','custom-fields','comments','revisions','page-attributes','post-formats'
// 		'has_archive'         => true,
// 	]);
// });


