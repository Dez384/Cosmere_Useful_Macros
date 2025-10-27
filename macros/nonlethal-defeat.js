/**
 * This macro flags the selected tokens as "Defeated" if it is in combat and applies an Unconscious condition that overlays the whole token. Using it again will remove the conditions.
**/

export async function Nonlethal_Defeat() {

	let allTokens = canvas.tokens.controlled;
	
	if (allTokens.length <1) {
		ui.notifications.warn(game.i18n.localize('CUM.NoToken'));
	} else {
		
		for (let token of allTokens) {
			
			//if token is in combat, toggle defeated 
			if (token.inCombat) {
				let isDefeated = token.combatant.defeated;
				await token.combatant.update({'defeated': !isDefeated});
			}
			
			//apply or remove the unconscious condition
			let isKO = token.actor.statuses.has("unconscious");
			await token.actor.toggleStatusEffect('unconscious', {active:!isKO, overlay:true});
			
		} // end for allTokens
			
	} // end no tokens else
		
};
