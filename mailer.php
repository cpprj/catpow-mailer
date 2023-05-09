<?php
mb_internal_encoding("UTF-8");
mb_http_output("UTF-8");
require_once(__DIR__.'/vendor/autoload.php');
define('MAILER_DIR',__DIR__);
define('MAILER_URI',dirname($_SERVER['REQUEST_URI']));
define('FORM_DIR',dirname(__DIR__));
define('FORM_URI',dirname(MAILER_URI));
define('LOG_DIR',FORM_DIR.'/log');
define('UPLOADS_DIR',FORM_DIR.'/log/uploads');
spl_autoload_register(function($class){
	$path=str_replace('\\','/',$class);
	if(file_exists($f=FORM_DIR.'/classes/'.$path.'.php')){include($f);}
	if(file_exists($f=MAILER_DIR.'/classes/'.$path.'.php')){include($f);}
});
global $res,$form;
$form=Catpow\MailForm::get_instance();
if($_SERVER['REQUEST_METHOD']=='GET'){
	$form->refresh();
	header("Content-Type: text/javascript; charset=utf-8");
	readfile(MAILER_DIR.'/js/script.js');
	$form->render_nonce_register_script();
	$form->render_ui_register_script();
	die();
}
$res=new Catpow\REST_Response();
while(ob_get_level()){
	if(!empty($maybe_error_message=ob_get_clean())){
		$res['status']=500;
		$res['error']=array('@form'=>$maybe_error_message);
		echo $res;
		die();
	}
}
ob_start();
$action=preg_replace('/\W/','',$_POST['action']);
try{
	$form->verify_nonce();
	$f=FORM_DIR.'/form/'.$action.'.php';
	if(!file_exists($f)){throw new Exception('Forbidden',403);}
	include MAILER_DIR.'/functions.php';
	include $f;
	$res['status']='200';
	$res['html']=ob_get_clean();
}
catch(Catpow\MailFormException $e){
	ob_end_clean();
	$res['error']=$e->errors;
}
catch(Throwable $e){
	ob_end_clean();
	$res['status']=$e->getCode();
	$res['error']=array('@form'=>$e->getMessage());
}
header("Content-Type: application/json; charset=utf-8");
echo $res;