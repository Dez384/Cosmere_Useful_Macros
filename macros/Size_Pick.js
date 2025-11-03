/**
 * This macro changes the size of all selected tokens to an input selected from a dialog.
 **/
 export async function Size_Picker(){
	let allTokens = canvas.tokens.controlled;

	if (allTokens.length <1) {
		ui.notifications.warn(game.i18n.localize('CUM.NoToken'));
		
	} else {
		// Show dialog if a token is selected
		const result = await (new Promise((resolve, reject) => {
			foundry.applications.api.DialogV2.wait({
				window: {
					title: game.i18n.localize('CUM.SizeChange.title'),
				},
				position: {
					width: 330
				},
				content: `
					<div class="form-group">
						<label>${game.i18n.localize('CUM.SizeChange.label')}</label>
						<div class="form-field">
							<select name="NewSize">
							   <option value=1 style="color: black;"> ${game.i18n.localize('CUM.SizeChange.medium')} </option>
							   <option value=2 style="color: black;"> ${game.i18n.localize('CUM.SizeChange.large')} </option>
							   <option value=3 style="color: black;"> ${game.i18n.localize('CUM.SizeChange.huge')} </option>
							   <option value=4 style="color: black;"> ${game.i18n.localize('CUM.SizeChange.gargantuan')} </option>
							   <option value=0.5 style="color: black;"> ${game.i18n.localize('CUM.SizeChange.small')} </option>
							</select>
						</div>
					</div>
				`,
				modal: true,
				buttons: [
					{
						label: game.i18n.localize('CUM.SizeChange.button'),
						action: 'submit',
						callback: (event, button) => {
							const nextSize = button.form.elements.NewSize.value;

							resolve({ nextSize });
						}
					}
				],
			}).catch((err) => resolve(null));
		}));

		//update tokens with result of dialog
		allTokens.forEach(token => {
			let nextNumber = Number(result.nextSize);
			token.document.update({"width": nextNumber, "height": nextNumber});
		});

	}
 };