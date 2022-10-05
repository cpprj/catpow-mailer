﻿Catpow.SelectNumber=(props)=>{
	const {className='cmf-component-selectnumber',min=1,max=10,label,step=1,value,onChange}=props;
	const {useState,useMemo}=React;
	
	const selections=useMemo(()=>{
		const selections=[];
		for(let i=parseInt(min);i<=parseInt(max);i+=parseInt(step)){
			selections.push(i);
		}
		return selections;
	},[min,max,step]);
	
	return (
		<select className={className} onChange={(e)=>{onChange(e.currentTarget.value);}}>
			{label && <option selected={value===undefined}>{label}</option>}
			{selections.map((i)=>(<option value={i} selected={value===i} key={i}>{i}</option>))}
		</select>
	);
}