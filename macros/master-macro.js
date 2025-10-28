/**
* This macro opens a dialog that has a button for every other macro in this module
**/

export async function Master_Macro() {
	
	//get an array that contains the keys for all macros in the module
	let macroList = Object.keys(CUM.macros);
	//remove this macro (the master macro) from the list
	macroList = macroList.filter(i => i !="master");
	
	//for foundry version >13
	if (foundry.utils.isNewerVersion(game.version,13)) {
		//iterate through macroList to create a list of DialogV2 buttons
		let buttons = [];
		for (let macro of macroList) {
			
			//make a new button object for each macro
			let newbutton = {
				action: macro,
				label: game.i18n.localize(CUM.labels[macro]),
				callback: CUM.macros[macro]
			}
			
			//push the new button object to the buttons array
			buttons.push(newbutton);

		}//end for macroList
		
		//create dialog with all the buttons	
		const popup = await foundry.applications.api.Dialog.wait({
		  window: {title: game.i18n.localize('CUM.Title')},
		  position: {width: 450},
		  content: "",
		  buttons,
		  form: {closeOnSubmit: false}
		});
	}
	
	//for Foundry version 12 and below
	else {
		let toHTML ="";
		for (let macro of macroList) {
		let command = "CUM.macros."+macro+"()";
		toHTML += `<button type="button" class="name" id="${macro}" onclick=${command}>${game.i18n.localize(CUM.labels[macro])}</button>`;
			
		}//end for macroList
		
		//create dialog with all the buttons
		const popup = await foundry.applications.api.DialogV2.prompt({
		  window: {title: game.i18n.localize('CUM.Title')},
		  position: {width: 250},
		  content: toHTML,
		  ok: { label: game.i18n.localize('CUM.useSkill.done') }
		});
			
	}
	
}//end function