// new conditions object; key=condition name; value=icon name
	const NewCon = {
		"invisible" : "invisible",
		"blind" : "blind",
		"burrow" : "mole",
		"defeated": "skull",
		"fly" : "wing",
		"hover" : "wingfoot"
	};

// Init Hook
Hooks.once("init", async () => {

	// Register Settings for new conditions
		await registerConditionSettings();
	// get list of new conditions and add them
		await addNewConditions();
}); //end init hook


// function for registering all the additional condition settings
async function registerConditionSettings() {
	let allSettings = Object.keys(NewCon);
	allSettings.forEach ((i)=>{
		let C = i.charAt(0).toUpperCase()+i.slice(1);
		console.log(C);
		game.settings.register('cosmere-useful-macros', `condition-${i}`, {
			name: `${C} Condition`,
			hint: `Enables the ${C} Condition.`,
			scope: 'world',
			config: true,
			type: new foundry.data.fields.BooleanField(),
			requiresReload: true
			}
		);	
	});
};

async function addNewConditions() {

	let newConditions = [];
	let conditionList = Object.keys(NewCon);
	conditionList.forEach((i)=> {
		if(game.settings.get('cosmere-useful-macros','condition-'+i)) {
		newConditions.push(i);
		}
	});	
	console.log("New Conditions are: "+newConditions);

	newConditions.forEach((i)=> {
		console.log("Current effect: "+i); 
		let capLabel = i.charAt(0).toUpperCase()+i.slice(1);
		let effects = {
			[i] : {
				label: capLabel,
				icon: "icons/svg/"+NewCon[i]+".svg"
			}
		};
		
		console.log(effects);

		for (const [k, v] of Object.entries(effects)) {
			CONFIG.statusEffects.push({
			  id: k,
			  _id: `cond${k}`.padEnd(16, '0'),
			  name: v.label,
			  img: v.icon
			});
		CONFIG.COSMERE.conditions[k] = {label: v.label, icon: v.icon};
	  };
	  
	});

};
