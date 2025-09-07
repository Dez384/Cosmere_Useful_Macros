/**
 * This macro changes the disposition of all selected tokens to an input selected from a dialog.
 * The token image also changes color of its ring if using Metalworks tokens
 **/

 export async function Token_Disposition_Picker(){
	let allTokens = canvas.tokens.controlled;

	if (allTokens.length <1) {
		ui.notifications.warn(game.i18n.localize('CUM.NoToken'));
		
	} else {
		// Show dialog if a token is selected
		const result = await (new Promise((resolve, reject) => {
			foundry.applications.api.DialogV2.wait({
				window: {
					title: game.i18n.localize('CUM.Disposition.title'),
				},
				position: {
					width: 330
				},
				content: `
					<div class="form-group">
						<label>${game.i18n.localize('CUM.Disposition.label')}</label>
						<div class="form-field">
							<select name="NewDisp">
							   <option value=0 style="color: black;"> ${game.i18n.localize('CUM.Disposition.neutral')} </option>
							   <option value=1 style="color: black;"> ${game.i18n.localize('CUM.Disposition.friendly')} </option>
							   <option value=-1 style="color: black;"> ${game.i18n.localize('CUM.Disposition.hostile')} </option>
							</select>
						</div>
					</div>
				`,
				modal: true,
				buttons: [
					{
						label: game.i18n.localize('CUM.Disposition.button'),
						action: 'submit',
						callback: (event, button, html) => {
							const form = $(html).find('form')[0];

							const nextDisp = form.NewDisp.value;

							resolve({ nextDisp });
						}
					}
				],
			}).catch((err) => resolve(null));
		}));
		
		//update tokens with result of dialog
		for (const token of allTokens) {

			// update token disposition
			token.document.update({"disposition": result.nextDisp});
			console.log(game.i18n.format('CUM.Disposition.success1',{NAME: token.document.name}));
			
			// if using Metalworks tokens, change the token ring color based on dialog results
			// from dialog determine middle portion of file path
			let midPath = "/";
			switch (result.nextDisp) {
				case "1": 
					midPath = "/alt_tokens_blue/";
					break;
				case "-1": 
					midPath = "/alt_tokens_red/";
					break;
			}
			
			// get file name from current filepath
			let oldIMG = token.document.texture.src;
			let lastSlash = oldIMG.lastIndexOf("/");
			let suffix = oldIMG.substring(lastSlash+1,oldIMG.length);
			
			// determine first part of filepath and remove the alt tokens folder from it
			let prefix = oldIMG.substring(0,lastSlash);
			let altCheck = oldIMG.indexOf("alt_tokens");
			if (altCheck>0) {
				prefix = prefix.substring(0,altCheck-1);
			}
			
			// create a new file path for token image
			let newIMG = prefix+midPath+suffix;
			// verify that the new filepath points to a valid file, and if it does, change the token image
			let goodIMG = await srcExists(newIMG);
			if (goodIMG) {			
				token.document.update({"texture.src": newIMG});
				console.log(game.i18n.format('CUM.Disposition.success2',{NAME: token.document.name}));
			} else {
				console.warn(game.i18n.format('CUM.Disposition.warn',{NAME: token.document.name}));
			}
		

			

		} //end for..of loop

	}
 };
 
 /**
  async function checkIMG(filepath) {
	 let isGood = await srcExists(filepath);
	 console.log(isGood);
	 if (isGood) {return true;}
	 else {return false;}
	 //return isGood;
 }
 **/