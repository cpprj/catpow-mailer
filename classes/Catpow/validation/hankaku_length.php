<?php
namespace Catpow\validation;

class hankaku_length extends validation{
	public static $message_keys=array('length');
	
	public static function is_valid(&$val,$input){
		return preg_match(sprintf('/^[a-zA-Z0-9]{%d}$/',$input->conf['length']),$val);
	}
	public static function get_message_format($conf){
		return __('%d文字の半角英数で入力してください');
	}
}

?>