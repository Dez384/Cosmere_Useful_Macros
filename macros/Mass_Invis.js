/**
 * Toggles the Invisible condition on or off for all selected tokens
 **/
 
export async function Mass_Invisibility(){

	let allTokens = canvas.tokens.controlled;
	
	if (allTokens.length <1) {
		ui.notifications.warn(game.i18n.localize('CUM.NoToken'));
	} else {
		allTokens.forEach(token => {
			token.actor.toggleStatusEffect("invisible");
		});
	}
};