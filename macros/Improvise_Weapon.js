/**
 * This macro creates a pop-up dialog and uses the result from the dialog to add a new improvised weapon to a selected token
 * The weapon forms list is drawn from the game world and either the Stormlight Handbook or Stormlight Starter rules
 * To add a weapon to the weapon list, it must exist in the game world in the items sidebar
 **/
 
 import { CUM_Helpers } from "../modules/CUM-helpers.js";
 
 export async function Improvise_Weapon(){

	//check for token selected
	let allTokens = canvas.tokens.controlled;

	if (allTokens.length <1) {
		ui.notifications.warn(game.i18n.localize('CUM.NoToken'));
		
	} else {
			
		//get all Stormlight Weapons from game world and core rules
		let all_weapons = await CUM_Helpers.getStormlightWeapons();
			
		//select for all non-special weapons, and remove improvised weapons
		all_weapons = await CUM_Helpers.nonSpecialWeapons(all_weapons);
			
		// remove duplicate items by name
		all_weapons =  await CUM_Helpers.orderAndReduce(all_weapons);
		
		//get HTML for the select options
		const selectHTML = await CUM_Helpers.makeOptions(all_weapons);
			
		// create HTML content for dialog
		let toHTML = `<div class="form-group">`;
		toHTML += `<label>${game.i18n.localize('CUM.Improvise_Weapon.label')}</label>`;
		toHTML += `<div class="form-field"><select name="Select" style="border: 1px solid #6e7b8b; border-radius: 4px;">`;
		toHTML += selectHTML;
		toHTML += `</select></div></div>`;
			
		//create the dialog
		const result = await (new Promise((resolve, reject) => {
			foundry.applications.api.DialogV2.wait({
				window: {
					title: game.i18n.localize('CUM.Improvise_Weapon.title'),
				},
				position: {
					width: 250
				},
				content: toHTML,
				modal: true,
				buttons: [
					{
						label: game.i18n.localize('CUM.Improvise_Weapon.button'),
						action: 'submit',
						callback: (event, button) => {
							
							let results = all_weapons[button.form.elements.Select.value];
							resolve({ results });
						}
					}
				],
			}).catch((err) => resolve(null));
		}));
				
		let chatNote ="";
		
		//use results from dialog to modify an improvised item
		let newForm = result.results;
		
		//create new item to the actor
		let newWep = (await fromUuid("Compendium.cosmere-rpg.items.Item.F11gb7uLyp1HYo3u")).toObject();
		newWep.name = game.i18n.localize('CUM.Improvise_Weapon.improvised')+" "+newForm.name;
		newWep.system.id = 'improvised';
		newWep.system.activation = newForm.system.activation;
		newWep.system.attack = newForm.system.attack;
		newWep.system.damage = newForm.system.damage;
		newWep.system.type = newForm.system.type;
		newWep.system.traits = newForm.system.traits;
		newWep.system.equip = newForm.system.equip;
		newWep.system.equipped = true;
		newWep.system.traits.fragile = newForm.system.traits.fragile;
		
		//create a new item on the actor with the modified improvised weapon
		let actor = allTokens[0].actor;
		await actor.createEmbeddedDocuments("Item",[newWep]);
				
		// create text of chatmessage
		chatNote +='<p>';
		chatNote += game.i18n.format('CUM.Improvise_Weapon.chat', {ACTOR: actor.name, NEW: newForm.name});
		chatNote +='</p>';
		
		//output message to chat
		ChatMessage.create({
			content: chatNote,
			speaker: ChatMessage.getSpeaker({ actor }),
			user: game.user.id
		});
	
	}//end no token selected else
	 
 }//end export function