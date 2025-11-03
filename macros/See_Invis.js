/**
 * Toggles on or off the `See Invisibility` Detection mode for all selected tokens
 **/
 
export async function See_Invisibility(){

	let allTokens = canvas.tokens.controlled;

	if (allTokens.length <1) {
		ui.notifications.warn(game.i18n.localize('CUM.NoToken'));
		
	} else {

		allTokens.forEach(token => {
			const src = token.document.toObject();
			const detectionModes = src.detectionModes;
	   
			let needsMode = true;
		
			detectionModes.forEach(mode => {
				if (mode.id === "seeInvisibility") {
					needsMode = false;
					mode.enabled = !mode.enabled;
				}
			});

			if (needsMode) {
				detectionModes.push({id: "seeInvisibility", range: null, enabled: true});
			}

			const sight = src.sight;

			if (sight.visionMode === "basic"||sight.visionMode === "darkvision"||sight.visionMode === "sense") 
				{sight.visionMode = "lightAmplification"; }
			else if (sight.visionMode === "lightAmplification")
				{sight.visionMode = "sense"; }

			token.document.update({
				"detectionModes": detectionModes,
				"sight" : sight
			});

		});
	}
};