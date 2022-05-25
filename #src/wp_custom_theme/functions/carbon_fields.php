<?php
/* ШПАРГАЛКА
get_field('field')
the_field('field')
the_field('button_link', 'link')
echo get_template_directory_uri()
echo carbon_get_theme_option('field')
echo home_url()
...
проверка:
<?php
	$fields = [
		get_field('footer_email_link', 'theme'),
		get_field('footer_email_text', 'theme'),
	];
	if (check_fields($fields)):
?>
	// html... <?php echo $fields[0] ?>
<?php endif; ?>
...
картинка:
	<?php 
		$image = get_field('clients_item1_img');
		if ($image) echo '<img src="' . $image . '" alt="" loading="lazy">';
	?>
...
цикл:
	$list = get_field('list');
	if ($list) {
		for ($i = 0; $i < count($list); $i++) {
			echo '<img src="' . $list[$i]['img'] .'">';
		}
	}
		// или:
		foreach ($list as $item) {
			echo '<img src="' . $item['img'] .'">';
		}
	// или:
	<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
	<?php endwhile; endif; ?>
*/

/////////////////////////////////////////////////////////////////////////

use Carbon_Fields\Container;
use Carbon_Fields\Field;

// Functions "get_field" and "the_field" allow easy switch between Cabron Fields and ACF.
function get_field($name, $type = 'default') {
	if ($type == 'theme')
		return carbon_get_theme_option($name);
	if ($type == 'link')
		return get_permalink(carbon_get_the_post_meta($name)[0]['id']);
	else
		return carbon_get_the_post_meta($name);
}
function the_field($name, $type = 'default') {
	if ($type == 'theme')
		echo carbon_get_theme_option($name);
	if ($type == 'link')
		echo get_permalink(carbon_get_the_post_meta($name)[0]['id']);
	else
		echo carbon_get_the_post_meta($name);
}
function check_fields($arr = []) {
	if (count($arr) == 0) return false;
	foreach ($arr as $v) {
		if (!$v) return false;
	}
	return true;
}

/////////////////////////////////////////////////////////////////////////

function add_custom_fields() {

	// Custom fields container
	Container::make('theme_options', 'Custom Fields')
		->set_page_menu_title('Кастомные поля')
		->set_icon('dashicons-align-right')

	// Header tab
		->add_tab('Шапка', [
			Field::make('image', 'header_logo_img', 'Иконка логотипа')->set_value_type('url'),
			Field::make('text', 'header_logo_text', 'Текст логотипа'),
		])

	// Footer tab
		->add_tab('Подвал', [
			Field::make('text', 'footer_address', 'Адрес'),
			Field::make('text', 'footer_phone_link', 'Телефон - ссылка')->set_width(50)
				->set_help_text('Формат телефона для ссылки: +79999999999'),
			Field::make('text', 'footer_phone_text', 'Телефон - отображаемый текст')->set_width(50),
			Field::make('text', 'footer_email_link', 'Email - ссылка')->set_width(50),
			Field::make('text', 'footer_email_text', 'Email - отображаемый текст')->set_width(50),

			Field::make('separator', 'separator_footer_socials', 'Соцсети:'),
			Field::make('complex', 'footer_socials', 'Соцсети')
				->add_fields([
					Field::make('select', 'name', 'Выберите')->set_width(50)
						->set_options([
							'twitter' => 'Twitter',
							'facebook' => 'Facebook',
							'pinterest' => 'Pinterest',
							'google-plus' => 'Google+'
						]),
					Field::make('text', 'link', 'Ссылка')->set_width(50)
						->set_help_text('Введите адрес полностью, начиная с https://'),
				]),

		])

	// Metrics tab
		->add_tab('Метрики', [
			Field::make('header_scripts', 'metrics', 'HTML-код метрик и счетчиков поисковых систем')
				->set_default_value('<!-- Здесь будут метрики поисковых систем -->')
				->set_rows(20)
		]);

/////////////////////////////////////////////////////////////////////////
	// Editor fields:

	// Banner section
		Container::make('post_meta', 'Banner')
			->where('post_id', '=', 15)
			->set_priority('core')
			->add_fields([
				Field::make('text', 'banner_title', 'Заголовок'),
				Field::make('text', 'banner_text', 'Текст'),

				Field::make('text', 'banner_button_text', 'Кнопка - текст'),
				Field::make('association', 'banner_button_link', 'Кнопка - ссылка')
					->set_max(1)
					->set_types([[
						'type' => 'post',
						'post_type' => 'page'
					]]),

				Field::make('image', 'banner_bg_dt', 'Background desktop')
					->set_value_type('url')
					->set_width(50),
				Field::make('image', 'banner_bg_mob', 'Background mobile')
					->set_value_type('url')
					->set_width(50),
			]);

	// Services section
		Container::make('post_meta', 'Services')
			->where('post_id', '=', 15)
			->or_where('post_id', '=', 16)
			->set_priority('core')
			->add_fields([
				Field::make('text', 'services_title', 'Заголовок'),
				Field::make('text', 'services_subtitle', 'Подзаголовок'),

				Field::make('text', 'services_item1_title', 'Заголовок элемента 1')->set_width(50),
				Field::make('textarea', 'services_item1_text', 'Текст элемента 1')->set_width(50),
				Field::make('text', 'services_item2_title', 'Заголовок элемента 2')->set_width(50),
				Field::make('textarea', 'services_item2_text', 'Текст элемента 2')->set_width(50),
				Field::make('text', 'services_item3_title', 'Заголовок элемента 3')->set_width(50),
				Field::make('textarea', 'services_item3_text', 'Текст элемента 3')->set_width(50),
			]);

	// Double-block section
		Container::make('post_meta', 'Double-block')
			->where('post_id', '=', 15)
			->set_priority('core')
			->add_fields([
				Field::make('text', 'double_block_title', 'Заголовок'),
				Field::make('text', 'double_block_text', 'Текст'),

				Field::make('text', 'double_block_item1_text', 'Текст элемента 1')->set_width(33),
				Field::make('text', 'double_block_item2_text', 'Текст элемента 2')->set_width(33),
				Field::make('text', 'double_block_item3_text', 'Текст элемента 3')->set_width(33),

				Field::make('text', 'double_block_button_text', 'Кнопка - текст'),
				Field::make('association', 'double_block_button_link', 'Кнопка - ссылка')
					->set_max(1)
					->set_types([[
						'type' => 'post',
						'post_type' => 'page'
					]]),

				Field::make('image', 'double_block_bg_dt', 'Background desktop')
					->set_value_type('url')
					->set_width(50),
				Field::make('image', 'double_block_bg_mob', 'Background mobile')
					->set_value_type('url')
					->set_width(50),
			]);

	// Latest section
		Container::make('post_meta', 'Latest')
			->where('post_id', '=', 15)
			->or_where('post_id', '=', 16)
			->set_priority('core')
			->add_fields([
				Field::make('text', 'latest_title', 'Заголовок в шапке'),
				Field::make('text', 'latest_subtitle', 'Подзаголовок в шапке'),

				Field::make('text', 'latest_content_title', 'Заголовок параграфа'),
				Field::make('text', 'latest_content_p1', 'Текст параграфа 1'),
				Field::make('text', 'latest_content_p2', 'Текст параграфа 2'),

				Field::make('complex', 'latest_items', 'Список')
					->add_fields([
						Field::make('image', 'img', 'Картинка элемента')->set_width(33)->set_value_type('url'),
						Field::make('text', 'title', 'Заголовок элемента')->set_width(33),
						Field::make('textarea', 'text', 'Текст элемента')->set_width(33),
					]),

				Field::make('text', 'latest_button_text', 'Кнопка - текст'),
				Field::make('association', 'latest_button_link', 'Кнопка - ссылка')
					->set_max(1)
					->set_types([[
						'type' => 'post',
						'post_type' => 'page'
					]]),

				Field::make('image', 'latest_bg', 'Background')
					->set_value_type('url'),
			]);

	// Values section
		Container::make('post_meta', 'Values')
			->where('post_id', '=', 15)
			->or_where('post_id', '=', 16)
			->set_priority('core')
			->add_fields([
				Field::make('text', 'values_title', 'Заголовок'),
				Field::make('text', 'values_subtitle', 'Подзаголовок'),

				Field::make('text', 'values_item1_title', 'Заголовок элемента 1')->set_width(50),
				Field::make('textarea', 'values_item1_text', 'Текст элемента 1')->set_width(50),
				Field::make('text', 'values_item2_title', 'Заголовок элемента 2')->set_width(50),
				Field::make('textarea', 'values_item2_text', 'Текст элемента 2')->set_width(50),
				Field::make('text', 'values_item3_title', 'Заголовок элемента 3')->set_width(50),
				Field::make('textarea', 'values_item3_text', 'Текст элемента 3')->set_width(50),
			]);

	// Clients section
		Container::make('post_meta', 'Clients')
			->where('post_id', '=', 15)
			->or_where('post_id', '=', 18)
			->set_priority('core')
			->add_fields([
				Field::make('text', 'clients_title', 'Заголовок'),
				Field::make('text', 'clients_subtitle', 'Подзаголовок'),

				Field::make('textarea', 'clients_item1_quote', 'Текст элемента 1')->set_width(33),
				Field::make('text', 'clients_item1_author', 'Автор элемента 1')->set_width(33),
				Field::make('image', 'clients_item1_img', 'Фото элемента 1')->set_width(33)
					->set_value_type('url'),
				Field::make('textarea', 'clients_item2_quote', 'Текст элемента 2')->set_width(33),
				Field::make('text', 'clients_item2_author', 'Автор элемента 2')->set_width(33),
				Field::make('image', 'clients_item2_img', 'Фото элемента 2')->set_width(33)
					->set_value_type('url'),
			]);

	// Action section
		Container::make('post_meta', 'Custom fields - Action')
			->where('post_id', '=', 15)
			->or_where('post_id', '=', 16)
			->or_where('post_id', '=', 18)
			->or_where('post_id', '=', 19)
			->set_priority('core')
			->add_fields([
				Field::make('text', 'action_title', 'Заголовок'),
				Field::make('text', 'action_button_text', 'Кнопка - текст'),
				Field::make('text', 'action_button_link', 'Кнопка - ссылка'),
			]);

	// Logos section
		Container::make('post_meta', 'Logos')
			->where('post_id', '=', 15)
			->or_where('post_id', '=', 16)
			->or_where('post_id', '=', 18)
			->set_priority('core')
			->add_fields([
				Field::make('complex', 'logos_items', 'Картинки')
					->add_fields([
						Field::make('image', 'img', 'Изображение')->set_value_type('url')->set_width(33),
						Field::make('text', 'alt', 'Название (не обязательно)')->set_width(33),
						Field::make('text', 'title', 'Всплывающая подсказка (не обязательно)')->set_width(33),
					]),
			]);

} // end add_custom_fields()