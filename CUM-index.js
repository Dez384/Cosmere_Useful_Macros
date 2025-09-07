// import all of the macros from their individual files
import { Mass_Invisibility } from "./macros/mass-invisibility.js";
import { See_Invisibility } from "./macros/see-invisibility.js";
import { Size_Picker } from "./macros/token-size-picker.js";
import { Token_Disposition_Picker } from "./macros/token-disposition.js";
import { Infuse_Dun_Spheres } from "./macros/infuse-dun.js";

// make an object of the macros
const CUMmacros = { 
	Mass_Invis: Mass_Invisibility,
	See_Invis: See_Invisibility,
	Size_Pick: Size_Picker,
	Disposition: Token_Disposition_Picker,
	Infuse_Dun: Infuse_Dun_Spheres
	};

// In the initialization hook, globally expose the object of macros
// Init Hook
Hooks.once("init", async () => {
	console.info(game.i18n.localize('CUM.Initialize'));

	globalThis.CUM = Object.assign({ macros: CUMmacros });

}); //end init hook