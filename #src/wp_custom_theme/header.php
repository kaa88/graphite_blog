<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<!-- <title>
		<?php
			// $title_str = get_field('head_title');
			// $title_str = str_replace('%pagename%', single_post_title(null, false), $title_str);
			// $title_str = str_replace('%sitename%', get_bloginfo('name'), $title_str);
			// echo $title_str;
		?>
	</title> -->
	<!-- <meta name="description" content="<?php //the_field('head_description') ?>"> -->
	<!-- <meta name="keywords" content="<?php //the_field('head_keywords') ?>"> -->

	<?php wp_head() ?>
</head>
<body>
<?php wp_body_open(); ?>

<noscript>
	<div class="noscript-alert">
		<p>For full functionality of this site it is necessary to enable JavaScript.<br>Here are the <a href="https://www.enable-javascript.com/">instructions how to enable JavaScript in your web browser</a>.</p><br>
		<p>Для полной функциональности этого сайта необходимо включить JavaScript.<br>Вот <a href="https://www.enable-javascript.com/ru/">инструкции, как включить JavaScript в вашем браузере</a>.</p>
	</div>
</noscript>


<header class="header">
	<div class="header-menu-turn-off-area"></div>
	<div class="header__print-address-qr">QR</div>
	<div class="header__print-address">address.com</div>

	<div class="header-level header-level--mobile scroll-lock-item-p">
		<div class="container">

			<div class="header-level__logo logo">
				<a class="logo__link" href="index.html">
					LOGO
				</a>
			</div>
			<div class="header-menu-open-btn"><span>MENU</span></div>

		</div>
	</div>

	<div class="header-menu-hide-wrapper">
		<div class="header-menu-close-btn"><span>X</span></div>

		<div class="header-level header-level--top scroll-lock-item-pm">
			<div class="container">
				<nav class="header-level__account-nav account-nav">
					<a class="account-nav__link" href="#">Sign in</a>
					<a class="account-nav__link" href="#">My Account</a>
					<a class="account-nav__link" href="#">Order Status</a>
					<a class="account-nav__link" href="#">Help</a>
				</nav>
			</div>
		</div>

		<div class="header-level header-level--middle scroll-lock-item-pm">
			<div class="container">
				<span class="header-level__search search">search</span>
				<span class="header-level__cart cart">cart</span>
				<span class="header-level__wishlist wishlist">wishlist</span>
			</div>
		</div>

		<div class="header-level header-level--bottom scroll-lock-item-pm">
			<div class="container">
				<nav class="header-level__header-menu header-menu">
					<ul class="header-menu__items">
						<!-- список всех ссылок, можно сортировать скриптом в html -->
						<li class="header-menu__item" data-name="home">
							<a class="header-menu__link submenu-drop-link" href="index.html">Home</a>
							<!-- submenu вставить сюда -->
							<!-- в header-menu-link добавить класс submenu-drop-link -->
						</li>
						<li class="header-menu__item" data-name="products">
							<a class="header-menu__link" href="#">Products</a>
						</li>
						<li class="header-menu__item" data-name="about">
							<a class="header-menu__link" href="#">About</a>
						</li>
						<li class="header-menu__item" data-name="contacts">
							<a class="header-menu__link" href="#">Contacts</a>
						</li>
					</ul>

					<!-- submenu общий тут или вставить в каждый пункт -->
					<div class="header-submenu-hide-wrapper">
						<div class="header-submenu-back-btn"><span>&larr;</span></div>
						<div class="container">
							<nav class="header-level__header-submenu header-submenu">
								<ul class="header-submenu__items">
									<li class="header-submenu__item" data-name="round">
										<a class="header-submenu__link" href="#">Round</a>
									</li>
									<li class="header-submenu__item" data-name="square">
										<a class="header-submenu__link" href="#">Square</a>
									</li>
									<li class="header-submenu__item" data-name="triangle">
										<a class="header-submenu__link" href="#">Triangle</a>
									</li>
									<li class="header-submenu__item" data-name="star">
										<a class="header-submenu__link" href="#">Star</a>
									</li>
								</ul>
							</nav>
						</div>
					</div>
						
				</nav>
			</div>
		</div>

	</div>
</header>
<script id="header-menu-options">
	// список пунктов меню в _header.html
	// наличие и порядок устанавливаются в массиве 'links'
	// 'activeLink' добавляет класс 'this-page'
	// тег 'script' можно удалить
	
	// let headerMenuOptions = {
	// 	links: ['home','products','about','contacts'],
	// 	activeLink: 'home'
	// }
</script>











			<?php 
				// if (has_nav_menu('header-menu')) {
				// 	wp_nav_menu([
				// 		'theme_location' => 'header-menu',
				// 		'container' => 'nav',
				// 		'container_class' => 'header__menu menu',
				// 		'menu_class' => 'menu__items',
				// 		'items_wrap' => '<div class="menu__menu-open-btn"><span></span></div><div class="menu__container"><ul class="%2$s">%3$s</ul></div>',
				// 		'depth' => 1,
				// 		// Defaults:
				// 		// 'menu'                 => '', // название блока меню
				// 		// 'theme_location'       => '', // расположение блока меню
				// 		// 'container'            => 'div', // тег контейнера (div или nav)
				// 		// 'container_class'      => '', // имя класса контейнера
				// 		// 'container_id'         => '', // id контейнера
				// 		// 'container_aria_label' => '', // aria атрибут
				// 		// 'menu_class'           => 'menu', // имя класса меню (тег ul)
				// 		// 'menu_id'              => '', // id меню
				// 		// 'echo'                 => true, // сразу выводит меню при объявлении wp_nav_menu
				// 		// 'fallback_cb'          => 'wp_page_menu', // колбэк, если меню не найдено
				// 		// 'before'               => '', // добавляет что-то перед тегом li
				// 		// 'after'                => '', // добавляет что-то после тега li
				// 		// 'link_before'          => '', // добавляет что-то в начало ссылки (например, иконку)
				// 		// 'link_after'           => '', // добавляет что-то в конец ссылки
				// 		// 'items_wrap'           => '<ul id="%1$s" class="%2$s">%3$s</ul>', // схема элементов
				// 		// 'item_spacing'         => 'preserve', // переносы строк в html коде (preserve / discard)
				// 		// 'depth'                => 0, // уровень вложенности меню (0 = все)
				// 		// 'walker'               => '', // php-класс для построения меню (особая конструкция)
				// 	]);
				// }
			?>

<?php 

// $someVar = [
// 	'item' => 'item value'
// ];

// print_r($someVar['item']);

?>