/**
 * This macro turns all 'Dun' currency loot items to 'spheres' currency loot items for all selected tokens
 **/
 
export async function Infuse_Dun_Spheres(){

	let allTokens = canvas.tokens.controlled;
	
	if (allTokens.length <1) {
		ui.notifications.warn(game.i18n.localize('CUM.NoToken'));
	} else {
		for (let token of allTokens) {

			// filter actor's item for all loot items
			let allLoot = token.actor.items.filter(i=> i.type === "loot");

			// filter loot items for all dun currency
			let allDun = allLoot.filter(j=> j.system.price.currency === "dun");

			//update dun currency to spheres
			for (let sphere of allDun) {

				//check for infused sphere and if not, make one
				let infName = sphere.name;
				if (sphere.name.indexOf("(Dun)")>0) {
					infName = sphere.name.slice(0, sphere.name.indexOf("(Dun)")-1);
				}
				let infSphere = token.actor.items.filter(k=> k.type === "loot" && k.system.price.currency === "spheres" && k.name == infName);
				console.log("First Check");
				console.log(infSphere);
				if (infSphere.length < 1) {
					let tempSphere = sphere.toObject();
					tempSphere.name = infName;
					tempSphere.system.price.currency = "spheres";
					tempSphere.system.quantity = 0;
					await token.actor.createEmbeddedDocuments("Item",[tempSphere]);
					infSphere = token.actor.items.filter(k=> k.type === "loot" && k.system.price.currency === "spheres" && k.name == infName);
				}
				//update sphere quantities
				let newQuant = Number(sphere.system.quantity)+Number(infSphere[0].system.quantity);
				infSphere[0].update({'system.quantity': newQuant});
				sphere.update({'system.quantity': 0});
				
			}//end for sphere

			// make a notification that spheres have been infused or not
			let chatNote = game.i18n.format('CUM.Infuse.failure',{NAME: token.document.name});
			if (allDun.length>0) {
				chatNote = game.i18n.format('CUM.Infuse.success',{NAME: token.document.name});
			}
			//output message to chat
			ChatMessage.create({
				content: chatNote,
				speaker: ChatMessage.getSpeaker({ token }),
				user: game.user.id,
			});
		}//end for token
	} // end else
};