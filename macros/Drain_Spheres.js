/**
 * This macro will create a pop-up dialog prompting for a number of spheres to drain. The dialog result will be used to reduce the number of 'spheres' currency loot items and create an equivalent number of 'dun" currently loot items on the actor
 **/
 
import { CUM_Helpers } from "../modules/CUM-helpers.js";
 
export async function Drain_Spheres(){
	
	//get all selected tokens
	let allTokens = canvas.tokens.controlled;
	
	//make sure at least one target is selected
	if (allTokens.length <1) {
		ui.notifications.warn(game.i18n.localize('CUM.NoToken'));
		return;
	}
	//check for infused spheres on selected token
	const targetActor = allTokens[0].actor;
	let actSpheres = targetActor.items.filter(i=> i.type === "loot" && i.system.price.currency === "spheres");

	if (actSpheres.length <1) {
		ui.notifications.warn(game.i18n.localize('CUM.Drain_Spheres.noSpheres'));
		return;
	}
		console.log(actSpheres);
		
	//sort spheres alphabetically so dialog matches character sheet ordering
	actSpheres = await CUM_Helpers.orderOnly(actSpheres);
	
	console.log(actSpheres);
		
	// create HTML content for dialog
	let toHTML = `<div class="form-group" style="overflow: auto;"><table>`;
	for (let j=0;j<actSpheres.length;j++) {
		//get HTML for the select options
		const selectHTML = await CUM_Helpers.numberOptions(actSpheres[j].system.quantity);
		//build each table row
		const selectName = "Select"+j;
		toHTML += `<tr>`;
		toHTML += `<td width="88"><img src="${actSpheres[j].img}" width="48" height="48"></td>`
		toHTML += `<td><label>${actSpheres[j].name}</label></td>`;
		toHTML += `<td width="88"><select name="${selectName}" style="border: 1px solid #6e7b8b; border-radius: 4px;">`;
		toHTML += selectHTML;
		toHTML += `</select></td></tr>`;

	}//end for j<actSpheres.length
	toHTML += "</table></div>";
	
	let posHeight = "auto";
	if (actSpheres.length > 7) {posHeight = 600;}
	//create the dialog
	const result = await (new Promise((resolve, reject) => {
		foundry.applications.api.DialogV2.wait({
			window: {
				title: game.i18n.localize('CUM.Drain_Spheres.title')
			},
			position: {
				width: 325,
				height: posHeight
			},
			content: toHTML,
			modal: true,
			render: (_event, app) => {
				const html = app.element;
				html.querySelector("form").classList.add("scrollable");
			},
			buttons: [
				{
					label: game.i18n.localize('CUM.Drain_Spheres.button'),
					action: 'submit',
					callback: (event, button) => {
						
						let results = [];
						for (let k=0;k<actSpheres.length;k++) {
							const selectName = "Select"+k;
							results.push(button.form.elements[selectName].value);
						}
						resolve({ results });
					}
				}
			],
		}).catch((err) => resolve(null));
	}));

	let drained = result.results;
	let chatNote = game.i18n.format('CUM.Drain_Spheres.chat', {ACTOR: targetActor.name});
	let postChat = false;
	
	for ( let m=0; m<drained.length; m++) {
		
		//trigger if at least one sphere was drained
		let delta = drained[m];
		if (delta > 0) {
		
			//determine the new quantity and update loot object
			let newQuant = actSpheres[m].system.quantity - delta;
			actSpheres[m].update({'system.quantity': newQuant});
			
			//find a matching dun sphere object or make one if it doens't exist
			let dunSphere = targetActor.items.filter(k=> k.type === "loot" && k.system.price.currency === "dun" && k.name.includes(actSpheres[m].name));
			console.log(dunSphere);
			if (dunSphere.length<1) {
				let tempSphere = actSpheres[m].toObject();
				tempSphere.name += " (Dun)";
				tempSphere.system.price.currency = "dun";
				tempSphere.system.quantity = 0;
				await targetActor.createEmbeddedDocuments("Item",[tempSphere]);
				dunSphere = targetActor.items.filter(k=> k.type === "loot" && k.system.price.currency === "dun" && k.name.includes(actSpheres[m].name));
			}
			// update dun sphere quantity
			let dunQuant = Number(dunSphere[0].system.quantity) + Number(delta);
			dunSphere[0].update({'system.quantity': dunQuant});
			
			//add to chat message
			if (postChat == false) {postChat = true;}
			chatNote += "<p>"+delta+" "+actSpheres[m].name;
			if (delta>1) {chatNote += "s";}			
			chatNote +="</p>";
		
		}//end if delta>0
		
	}//end for m loop
	
	//post message to chat if any spheres were infused
	if (postChat) {
				ChatMessage.create({
				content: chatNote,
				speaker: ChatMessage.getSpeaker({ targetActor }),
				user: game.user.id,
			});
	}

};