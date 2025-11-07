/**
 * This macro allows the user to change the form of a radiant shardblade on a token to another weapon
 * An actor's shardblade must have the type "special_wpn" and include "(Radiant)" in the item name
 * The weapon forms list is drawn from the game world and either the Stormlight Handbook or Stormlight Starter rules
 * To add a weapon to the weapon list, it must exist in the game world in the items sidebar
 **/
 
 import { CUM_Helpers } from "../modules/CUM-helpers.js";
 
 export async function Change_Shardblade(){

	//check for token selected
	let allTokens = canvas.tokens.controlled;

	if (allTokens.length <1) {
		ui.notifications.warn(game.i18n.localize('CUM.NoToken'));
		
	} else {

		//check for radiant shardblade on selected token
		let shardblades = allTokens[0].actor.items.filter(i=>i.system.type=="special_wpn"&&i.name.includes("(Radiant)"));

		if (shardblades.length <1 ) {
			ui.notifications.warn(game.i18n.localize('CUM.Change_Shardblade.noBlade'));

		} else {
				
			//get default Radiant Shardblade stats if the Stormlight Handbook is enabled
			let aRadBlade = null;
			try {
				aRadBlade = await fromUuid(game.packs.filter(i=>i.metadata.id=="cosmere-rpg-stormlight-handbook.items")[0].index.filter(j=>j.name=="Shardblade (Radiant)")[0].uuid);
			} catch (error) {}
			
			//get all Stormlight Weapons from game world and core rules
			let all_weapons = await CUM_Helpers.getStormlightWeapons();
			
			//select for all melee and non-special weapons, and remove improvised weapons
			all_weapons = await CUM_Helpers.nonSpecialMelee(all_weapons);
			
			//add back in Shardblade because it should be a form Option
			if (aRadBlade != null) {
				all_weapons.push(aRadBlade);
			}

			// remove duplicate items by name
			all_weapons =  await CUM_Helpers.orderAndReduce(all_weapons);
			
			// create HTML content for dialog
			let toHTML = `<table>`;
			for (let j=0;j<shardblades.length;j++) {
				//get HTML for the select options
				const selectHTML = await CUM_Helpers.makeOptions(all_weapons, shardblades[j].system.id);
				//build each table row
				const selectName = "Select"+j;
				toHTML += `<tr>`;
				toHTML += `<td width="83"><img src="${shardblades[j].img}" width="48" height="48"></td>`
				toHTML += `<td width="176"><label>${shardblades[j].name}</label></td>`;
				toHTML += `<td width="176">${game.i18n.localize('CUM.Change_Shardblade.midText')}</td>`;
				toHTML += `<td width="176"><select name="${selectName}" style="border: 1px solid #6e7b8b; border-radius: 4px;">`;
				toHTML += selectHTML;
				toHTML += `</select></td></tr>`;

			}//end for j<shardblades.length
			toHTML += "</table>";
			
			//create the dialog
			const result = await (new Promise((resolve, reject) => {
					foundry.applications.api.DialogV2.wait({
						window: {
							title: game.i18n.localize('CUM.Change_Shardblade.title'),
						},
						position: {
							width: 620
						},
						content: toHTML,
						modal: true,
						buttons: [
							{
								label: game.i18n.localize('CUM.Change_Shardblade.button'),
								action: 'submit',
								callback: (event, button) => {
									
									let results = [];
									for (let k=0;k<shardblades.length;k++) {
										const selectName = "Select"+k;
										results.push(all_weapons[button.form.elements[selectName].value]);
									}
									resolve({ results });
								}
							}
						],
					}).catch((err) => resolve(null));
				}));
				
			let chatNote ="";
			
			//use results from dialog to update the radiant shardblade(s)
			let m = 0;
			for (const blade of shardblades) {
				
				//set default traits for a radiant shardblade
				let blankTraits = {};
				if (aRadBlade != null) {blankTraits = aRadBlade.system.traits;}
				else {
					for (let p of blade.system.traits) {
						let active = false;
						if (p == "deadly" || p == "unique") {active = true;}
						blankTraits[p] = {
							"defaultActive": active,
							"defaultValue": null,
							"value": null,
							"active": active,
							"expertise": {
								"toggleActive": false,
								"value": null
							}
						};

					}
				}

				await blade.update ({'system.traits': blankTraits});
				
				let ogName = blade.name;
				
				//get new form of weapon and extract damage die, and double it if not a shardblade
				let newForm = result.results[m];
				let dmg = newForm.system.damage.formula;
				let numDice = Number(dmg.slice(0,dmg.indexOf("d")));
				if (newForm.system.id != "shardblade") {numDice = numDice*2;}
				let newFormula = numDice+dmg.slice(dmg.indexOf("d"));
				
				//change name of shardblade
				let newName = blade.name.slice(0,blade.name.lastIndexOf(")")+1);
				if (newForm.system.id != "shardblade") {newName += " ["+newForm.name+"]";}
				
				//update shardblade
				await blade.update({
					'name': newName,
					'system.activation': newForm.system.activation,
					'system.damage.formula': newFormula,
					'system.id': newForm.system.id,
					'system.traits': newForm.system.traits
				});

				// create text of chatmessage
				chatNote +='<p>';
				chatNote += game.i18n.format('CUM.Change_Shardblade.chat', {ACTOR: allTokens[0].actor.name, SHARD: ogName, NEW: newForm.name});
				chatNote +='</p>';
					
				m++;
			}//end for blades of shardblades
			
			//output message to chat
			let actor = allTokens[0].actor;
			ChatMessage.create({
				content: chatNote,
				speaker: ChatMessage.getSpeaker({ actor }),
				user: game.user.id
			});
			
		}//end no shardblades else
	
	}//end no token selected else
	 
 }//end export function