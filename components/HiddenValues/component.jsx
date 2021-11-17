﻿Catpow.Components.HiddenValues=(props)=>{
	const {useCallback}=React;
	const hiddenInput=useCallback((name,val)=>{
		if(val instanceof Object){
			return Object.keys(val).map(k=>hiddenInput(name+'['+k+']',val[k]));
		}
		else{
			return <input type="hidden" name={name} value={val}/>;
		}
	},[props]);
	return (
		<div className={'hiddenValues'}>
			{hiddenInput(props.name,props.value)}
		</div>
	);
}
