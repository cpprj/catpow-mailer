<?php
namespace Catpow\input;

class fax extends text{
	
	public function output(){
		$val=$this->value;
		if(empty($val)){return $val;}
		return sprintf('<span class="fax">%s</a>',$val);
	}
}
?>