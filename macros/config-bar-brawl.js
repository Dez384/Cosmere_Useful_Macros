/**
 * This macro will change the resource bars on a token to a preset configuration if using the Bar Brawl module.
 * This macro can also reset the token's resource bars to the default state.
 **/

export async function Config_Bar_Brawl(){

	// custom resource bar configuration object
	const coolBars = {
		"bar1": {
			"order": 0,
			"id": "bar1",
			"attribute": "resources.hea",
			"mincolor": "#FF0000",
			"maxcolor": "#80FF00",
			"position": "bottom-inner",
			"otherVisibility": 0,
			"ownerVisibility": 35,
			"gmVisibility": -1,
			"hideFull": false,
			"hideEmpty": false,
			"hideCombat": false,
			"hideNoCombat": false,
			"hideHud": false,
			"indentLeft": null,
			"indentRight": null,
			"shareHeight": false,
			"style": "user",
			"label": "",
			"invert": false,
			"invertDirection": false,
			"subdivisions": null,
			"subdivisionsOwner": false,
			"fgImage": "",
			"bgImage": "",
			"opacity": null
		},
		"bar2": {
			"order": 1,
			"id": "bar2",
			"attribute": "resources.foc",
			"mincolor": "#281c4a",
			"maxcolor": "#6e45e4",
			"position": "bottom-outer",
			"otherVisibility": 0,
			"ownerVisibility": 35,
			"gmVisibility": -1,
			"hideFull": false,
			"hideEmpty": false,
			"hideCombat": false,
			"hideNoCombat": false,
			"hideHud": false,
			"indentLeft": null,
			"indentRight": null,
			"shareHeight": false,
			"style": "user",
			"label": "",
			"invert": false,
			"invertDirection": false,
			"subdivisions": null,
			"subdivisionsOwner": false,
			"fgImage": "",
			"bgImage": "",
			"opacity": null
		},
		"bar3": {
			"order": 2,
			"id": "bar3",
			"attribute": "resources.inv",
			"mincolor": "#3e6abb",
			"maxcolor": "#3e6abb",
			"position": "left-outer",
			"otherVisibility": 0,
			"ownerVisibility": 35,
			"gmVisibility": -1,
			"hideFull": false,
			"hideEmpty": false,
			"hideCombat": false,
			"hideNoCombat": false,
			"hideHud": false,
			"indentLeft": null,
			"indentRight": null,
			"shareHeight": false,
			"style": "user",
			"label": "",
			"invert": false,
			"invertDirection": false,
			"subdivisions": null,
			"subdivisionsOwner": false,
			"fgImage": "",
			"bgImage": "",
			"opacity": null
		}
	}

	// warning for if Bar Brawl is not installed
	let noMod = true;
	let modInactive = true;
	let modStatus = 'CUM.BarBrawl.stat2';
	let allMods = game.modules;
	allMods.forEach(check => {
		if (check.id == "barbrawl") {
			noMod = false;
			modStatus = 'CUM.BarBrawl.stat1';
			if (check.active) {
				modInactive = false;
			}
		}
	})
	if (noMod || modInactive) {ui.notifications.warn(game.i18n.format('CUM.BarBrawl.warning', {STATUS: game.i18n.localize(modStatus)}))};

	// get all tokens
	let allTokens = canvas.tokens.controlled;

	if (allTokens.length <1) {
		ui.notifications.warn(game.i18n.localize('CUM.NoToken'));
		
	} else {
		// Show dialog if a token is selected
		const result = await (new Promise((resolve, reject) => {
			foundry.applications.api.DialogV2.wait({
				window: {
					title: game.i18n.localize('CUM.BarBrawl.title'),
				},
				position: {
					width: 440
				},
				content: `
					<div class="form-group">
						<div class="form-field">
							<table>
								<tr><td>
								<input type="radio" id="only" value="only" name="tokenSelect" checked="true">
								<label for="only">${game.i18n.localize('CUM.BarBrawl.options.selected')} </label>
								</td><td>
								<input type="radio" id="proto" value="proto" name="tokenSelect">
								<label for="proto">${game.i18n.localize('CUM.BarBrawl.options.prototype')} </label>
								</td><tr style="background-color: transparent"><td>
								<input type="radio" id="apply" value="apply" name="changeDirection" checked="true">
								<label for="apply">${game.i18n.localize('CUM.BarBrawl.options.apply')} </label>
								</td><td>
								<input type="radio" id="remove" value="remove" name="changeDirection">
								<label for="remove">${game.i18n.localize('CUM.BarBrawl.options.remove')} </label>
								</td></tr>
							</table>
						</div>
					</div>
				`,
				modal: true,
				buttons: [
					{
						label: game.i18n.localize('CUM.BarBrawl.button'),
						action: 'submit',
						callback: (event, button) => {
							const optionSelect = button.form.elements.tokenSelect.value;
							const optionApply = button.form.elements.changeDirection.value;

							resolve({ optionSelect,optionApply });
						}
					}
				],
			}).catch((err) => resolve(null));
		})); //end dialogue box
		
		let opApply = true;
		if (result.optionApply == "remove") {opApply = false;}
		let opSelect = false;
		if (result.optionSelect == "proto") {opSelect = true;}
		let message = "";
		if (opSelect) {message = 'CUM.BarBrawl.success.2';}

		//update tokens with result of dialog

		for (const token of allTokens) {
		
			// if apply configuration
			if (opApply) {
				
				// add barbrawl to token
				await token.document.update({'flags.barbrawl.resourceBars': coolBars});				
				
				// if apply to prototype token
				if (opSelect){
					await token.document.actor.prototypeToken.update({'flags.barbrawl.resourceBars': coolBars});
				}

			console.log(game.i18n.format('CUM.BarBrawl.success.A',{NAME: token.document.name, AND: game.i18n.localize(message)}));
			}
	
			// if remove configuration			
			if (opApply == false) {				
					
				// to prevent BarBrawl default behavior, first add the custom bars
				await token.document.update({'flags.barbrawl.resourceBars': coolBars});
				// remove bars 2 and 3; bar 1 is already system default
				await token.document.update({
					'flags.barbrawl.resourceBars.bar2.attribute': null, 'flags.barbrawl.resourceBars.bar3.attribute': null
				});
				
				// revert bars
				await token.document.update({
					'bar1.attribute': 'resources.hea',
					'bar2.attribute': null,
					"displayBars": 20
				});					
				
				// if remove from prototype token
				if (opSelect) {
					// to prevent BarBrawl default behavior, first add the custom bars
					await token.document.actor.prototypeToken.update({'flags.barbrawl.resourceBars': coolBars});
					// remove barbrawl from token
					await token.document.actor.prototypeToken.update({
						'flags.barbrawl.resourceBars.bar2.attribute': null,
						'flags.barbrawl.resourceBars.bar3.attribute': null
					});
						
					// revert bars
					await token.document.actor.prototypeToken.update({
						'bar1.attribute': 'resources.hea',
						'bar2.attribute': null,
						"displayBars": 20
					});
				}
			console.log(game.i18n.format('CUM.BarBrawl.success.R',{NAME: token.document.name, AND: game.i18n.localize(message)}));
			}				
		} //end for allTokens
	} //end else from having tokens selected

}