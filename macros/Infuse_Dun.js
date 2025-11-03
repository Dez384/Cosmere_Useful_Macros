/**
 * This macro turns all 'Dun' currency loot items to 'spheres' currency loot items for all selected tokens
 **/
 
export async function Infuse_Dun_Spheres(){

	let allTokens = canvas.tokens.controlled;
	
	if (allTokens.length <1) {
		ui.notifications.warn(game.i18n.localize('CUM.NoToken'));
	} else {
		allTokens.forEach(token => {
			// filter actor's item for all loot items
			let allLoot = token.actor.items.filter(i=> i.type === "loot");

			// filter loot items for all dun currency
			let allDun = allLoot.filter(j=> j.system.price.currency === "dun");

			// update each dun currency to be spheres
			allDun.forEach(dunLoot => {
				dunLoot.update({
					"system.price.currency": "spheres",
					"system.price.unit": "spheres.mark"
				});
			});

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
		});
	} // end else
};