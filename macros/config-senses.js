/**
 * This macro will quickly configure the sense for all selected tokens based off choices from a pop-up window
 **/
 
export async function Config_Senses(){

	let allTokens = canvas.tokens.controlled;

	if (allTokens.length <1) {
		ui.notifications.warn(game.i18n.localize('CUM.NoToken'));
		
	} else {
		
		// declare Objects
			// the tokenSenses keys need to match exactly to the foundry detection mode ids
			const tokenSenses = {
				"lightPerception": game.i18n.localize('CUM.configSense.options.main'),
				"basicSight": game.i18n.localize('CUM.configSense.options.senses'),
				"seeInvisibility": game.i18n.localize('CUM.configSense.options.invis'),
				"feelTremor": game.i18n.localize('CUM.configSense.options.tremor'),
				"senseAll": game.i18n.localize('CUM.configSense.options.senseAll')
			};

			const rangeOptions = {
				"infinite": {
					"value": null,
					"label": game.i18n.localize('CUM.configSense.options.infinite')
				},
				"senses": {
					"value": "senses",
					"label": game.i18n.localize('CUM.configSense.options.senses')
				},
				"disabled": {
					"value": false,
					"label": game.i18n.localize('CUM.configSense.options.disable')
				}
			};

		// create dialogue content
		let message = "<table>"
			//iterate through all senses in the senses object for table rows
			Object.keys(tokenSenses).forEach(key1 => {
				message = message+"<tr><td>"+tokenSenses[key1]+"</td>";
				
				//iterate through options in range object for each cell
				let i=0;
				Object.keys(rangeOptions).forEach(key2 => {
					
					message = message+"<td>";
					//input html
					message = message+"<input type='radio' id='"+key1+i+"' value="+rangeOptions[key2].value+" name='"+key1+"'";
					
					if (key1 == "lightPerception" && i==0) {message = message+" checked='true'";}
					else if (key1 == "basicSight" && i==1) {message = message+" checked='true'";}
					else if (key1 != "lightPerception" && key1 != "basicSight" && i==2) {message = message+" checked='true'";}
					
					message = message+">";
					//label html
					message = message+"<label for='"+key1+i+"'>"+rangeOptions[key2].label+"</label>";
					
					message = message+"</td>";
					i=i+1;
				})
				
				message = message+"</tr>";
			})
		
		message = message+"</table>";
		
		// Show dialog if a token is selected
		const result = await (new Promise((resolve, reject) => {
			foundry.applications.api.DialogV2.wait({
				window: {
					title: game.i18n.localize('CUM.configSense.title'),
				},
				position: {
					width: 540
				},
				content: `
					<div class="form-group">
						<div class="form-field">
							${message}
						</div>
					</div>
				`,
				modal: true,
				buttons: [
					{
						label: game.i18n.localize('CUM.configSense.button'),
						action: 'submit',
						callback: (event, button, html) => {
							const form = $(html).find('form')[0];
/**							const optionSelect = {
								"lightPerception": form.lightPerception.value,
								"basicSight": form.basicSight.value,
								"seeInvisibility": form.seeInvisibility.value,
								"feelTremor": form.feelTremor.value,
								"senseAll": form.senseAll.value
							};
**/
							let optionSelect = {};
							Object.keys(tokenSenses).forEach(j => {
								optionSelect[j] = form[j].value;
							})
							
							resolve({ optionSelect });
						}
					}
				],
			}).catch((err) => resolve(null));
		})); //end dialogue box

		//iterate through all selected tokens
		allTokens.forEach(token => {
			
			let detectionModes = token.document.detectionModes;
			
			//create object with which to update token
			Object.keys(result.optionSelect).forEach(k => {
				let needsMode = true;
				// if vision modes exist on token disable needsMode
				detectionModes.forEach(mode => {
					if (mode.id === k) {
						needsMode = false;
					}
				})
				// if option is disabled, set needsMode to false
				if (result.optionSelect[k] == "false") {needsMode = false;}
				//if needsMode is true, add to the detectionModes array
				if (needsMode) { 
					detectionModes.push({id: k, range: 0, enabled: true});
				}
				
				//AT THIS POINT, all necessary modes should exist
				detectionModes.forEach(mode2 => {
					if (mode2.id === k) {
						// enable or disable
						if (result.optionSelect[k] == "false") {
							
							mode2.enabled = false;
						}
						else { 
							mode2.enabled = true;
						}
						
						//if range is infinite, set range to null
						if (result.optionSelect[k] == "null") {
							mode2.range = null;
						}
						
						//if range is senses, set to senses
						if (result.optionSelect[k] == "senses") {
							if (token.actor.system.senses.range.useOverride) {
								mode2.range = token.actor.system.senses.range.override;
							} else {
								mode2.range = token.actor.system.senses.range.derived;
							}
						}
					}
					
					
					
				})
			})
	
			//update token
			token.document.update({"detectionModes": detectionModes});			
			
			//notify that vision has been changed
			console.log(game.i18n.format('CUM.configSense.success', {NAME: token.document.name}));
			ui.notifications.notify(game.i18n.format('CUM.configSense.success', {NAME: token.document.name}));
			
		}); //end for allTokens

	} //end else from having tokens selected
};