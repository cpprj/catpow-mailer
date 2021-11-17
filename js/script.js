/* global console gtag ga Catpow*/
window.Catpow=window.Catpow || {};

Catpow.MailFormUrl=document.scripts[document.scripts.length-1].src;
Catpow.MailForm=function(form){
	var cmf=this;
	form.addEventListener('submit',function(e){e.preventDefault();});
	window.addEventListener('popstate',function(e){
		if(e.state.html){
			form.innerHTML=e.state.html;
			cmf.reset();
			cmf.focus();
		}
	});
	cmf.focus=function(){
		var bnd=form.getBoundingClientRect();
		window.scrollBy({top:bnd.top-100,behavior:'smooth'});
	}
	cmf.focusAlert=function(){
		var bnd=form.querySelector('.cmf-input.is-error').getBoundingClientRect();
		window.scrollBy({top:bnd.top-200,behavior:'smooth'});
	}
	cmf.send=function(data,focus=true){
		var xhr=new XMLHttpRequest();
		xhr.responseType='text';
		xhr.onload=function(){
			if(xhr.readyState===4 && xhr.status===200){
				var res=JSON.parse(xhr.response);
				if(res.error){
					Object.keys(res.error).map(function(key){
						if(key==='@form'){cmf.alert(res.error[key]);}
						else{cmf.inputs[key].alert(res.error[key]);}
					});
					cmf.focusAlert();
					return;
				}
				if(res.html){
					form.innerHTML=res.html;
					cmf.reset();
					if(focus){cmf.focus();}
				}
				if(focus && res.uri){
					history.pushState(res,null,res.uri);
					if(window.gtag){
						gtag('set','page_path',res.uri);
						gtag('event','page_view');
					}
					if(window.ga){
						ga('send','pageview',res.uri);
					}
				}
			}
		};
		xhr.open('POST',Catpow.MailFormUrl);
		xhr.setRequestHeader('X-CMF-NONCE',Catpow.MailFormNonce);
		xhr.send(data);
	};
	cmf.alert=function(text){
		var alert=form.querySelector('.cmf-form__alert');
		if(!alert){
			alert=document.createElement('div');
			alert.className='cmf-form__alert';
			form.insertBefore(alert,form.firstChild);
		}
		alert.innerHTML=text;
	};
	cmf.reset=function(){
		cmf.inputs={};
		Array.prototype.forEach.call(form.querySelectorAll('.cmf-input'),function(input){
			cmf.inputs[input.dataset.input]=new Catpow.MailFormInput(input);
		});
		Array.prototype.forEach.call(form.querySelectorAll('.cmf-button'),function(button){
			button.addEventListener('click',function(){
				var fd=new FormData(form);
				fd.append('action',button.dataset.action);
				cmf.send(fd);
			});
		});
	};
	cmf.init=function(){
		var fd=new FormData(form);
		fd.append('action','init');
		Object.keys(form.dataset).map(function(key){
			fd.append(key,form.dataset[key]);
		});
		cmf.send(fd,false);
	};
	cmf.init();
	return cmf;
}
Catpow.MailFormInput=function(input){
	this.el=input;
	this.alert=function(text){
		var alert=input.querySelector('.cmf-input__alert');
		if(!alert){
			alert=document.createElement('span');
			alert.className='cmf-input__alert';
			input.insertBefore(alert,input.firstChild);
		}
		alert.innerHTML=text;
		input.className='cmf-input is-error';
	}
	this.hideAlert=function(){
		input.className='cmf-input';
	}
	input.addEventListener('change',this.hideAlert);
	return this;
}

window.addEventListener('DOMContentLoaded',function(){
	Array.prototype.forEach.call(document.querySelectorAll('form.cmf-form'),Catpow.MailForm);
});