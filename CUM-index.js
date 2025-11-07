// This is where new macros are added:
// list of macro names where the key is the filename and the value is the function name
const CUMlist = { 
	master: "Master_Macro",
	Disposition: "Token_Disposition_Picker",
	Config_Senses: "Config_Senses",
	Bar_Brawl: "Config_Bar_Brawl",
	Group_LR: "Group_Long_Rest",
	Infuse_Dun: "Infuse_Dun_Spheres",
	Use_Skill: "Use_Skill",
	Size_Pick: "Size_Picker",
	Nonlethal_Defeat: "Nonlethal_Defeat",
	Mass_Invis: "Mass_Invisibility",
	See_Invis: "See_Invisibility",
	Change_Shardblade: "Change_Shardblade",
	Improvise_Weapon: "Improvise_Weapon",
	Drain_Spheres: "Drain_Spheres"
	};

//import all of the macros and assign them to an object
const CUMmacros = {};
for (let macro in CUMlist ){
	let path = "./macros/"+macro+".js";
	//import { CUMmacros[macro] } from `${path}`;
	await import (`./macros/${macro}.js`)
		.then(module=> {
			CUMmacros[macro] = module[CUMlist[macro]];
		});
}
	
// create an object that is the title of each macro
const CUMlabels = {};
for (let macro in CUMlist ){
	CUMlabels[macro] = `CUM.macroLabels.${macro}`;
}

// In the initialization hook, globally expose the object of macros
// Init Hook
Hooks.once("init", async () => {
	console.info(game.i18n.localize('CUM.Initialize'));

	globalThis.CUM = Object.assign({ 
		macros: CUMmacros,
		labels: CUMlabels
	});

}); //end init hook