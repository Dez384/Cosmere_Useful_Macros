/**
 * This macro will provide a long rest for all selected actors
 * The dialog pop-up will allow options for which actors are in scope of the macro
 * The dialog pop-up will allow options for reducing exhaustion, reducting injury duration, and refilling investiture
 **/
 
export async function Group_Long_Rest(){

	// Show dialog to get inputs
	const result = await (new Promise((resolve, reject) => {
		foundry.applications.api.DialogV2.wait({
			window: {
				title: game.i18n.localize('CUM.GroupRest.title'),
			},
			position: {
				width: 440
			},
			content: `
				<div class="form-group">
					<div class="form-field">
						<table>
						<tr><td>
						Which actors to Long Rest?
						</td><td>
						<select name="actorScope">
							<option value=0 style="color: black;">${game.i18n.localize('CUM.GroupRest.options.tokens')}</option>
							<option value=1 style="color: black;">${game.i18n.localize('CUM.GroupRest.options.characters')}</option>
							<option value=2 style="color: black;">${game.i18n.localize('CUM.GroupRest.options.actors')}</option>
						</td></tr>
						<tr><td>
						<label for="exhaust">${game.i18n.localize('CUM.GroupRest.options.exhaust')}</label>				
						</td><td>
						<input type="checkbox" id="exhaust" name="exhaust" checked>
						</td></tr>
						<tr><td>
						<label for="injury">${game.i18n.localize('CUM.GroupRest.options.injury')}</label>				
						</td><td>
						<input type="checkbox" id="injury" name="injury" checked>
						</td></tr>
						<tr><td>
						<label for="invest">${game.i18n.localize('CUM.GroupRest.options.invest')}</label>
						</td><td>
						<input type="checkbox" id="invest" name="invest" checked>
						</td></tr>
						</table>
					</div>
				</div>
			`,
			modal: true,
			buttons: [
				{
					label: game.i18n.localize('CUM.GroupRest.button'),
					action: 'submit',
					callback: (event, button, html) => {
						const form = $(html).find('form')[0];

						let optionSelect = {
							"scope": form.actorScope.value,
							"injury": form.injury.checked,
							"invest": form.invest.checked,
							"exhaust": form.exhaust.checked
						}							

						resolve({ optionSelect });
					}
				}
			],
		}).catch((err) => resolve(null));
	})); //end dialogue box

	//determine scope of actors
	let targetActors=[];
		// if scope=2, all actors in game
		if (result.optionSelect.scope == "2") {
			targetActors = game.actors;
		}
		// if scope=1, all player characters in game
		else if (result.optionSelect.scope == "1") {
			targetActors = game.actors.filter(i=> i.type==="character");
		}
		// if scope=0 or defaults, only selected tokens
		else {
			//targetActors = canvas.tokens.controlled;
			canvas.tokens.controlled.forEach(token => {
				targetActors.push(token.actor);
			})
			//if not tokens, warn and end
			if (targetActors.length <1) {
				ui.notifications.warn(game.i18n.localize('CUM.NoToken'));
				return;
			}
		}

	//cycle through actors and perform long Rest
	for (let actor of targetActors) {
		//start chat message
		let chatNote = "<p>"+game.i18n.format('CUM.GroupRest.longrest',{NAME: actor.name})+"</p>";
		
		//Perform system long rest (Restore HP and Focus)
		await actor.longRest({dialog:false});
		
		//Remove 1 level of exhaustion if checked
		if (result.optionSelect.exhaust) {
			let exh = actor.appliedEffects.filter(x => x.name.substring(0,9) == "Exhausted");
			if (exh.length >0) {
				for (let eff of exh) {
					let newStacks = eff.stacks-1;
					if (newStacks == 0) {
						actor.toggleStatusEffect("exhausted", {active:false});
						chatNote += "<p>"+game.i18n.format('CUM.GroupRest.exhaust.clear',{NAME: actor.name})+"</p>";
						}
					else {
						await eff.update({'system.stacks': newStacks});
						chatNote += "<p>"+game.i18n.format('CUM.GroupRest.exhaust.reduce',{NAME: actor.name, STAT: newStacks})+"</p>";
					}
				}
			}
		}

		//Decrease injury level by 1 if checked
		if (result.optionSelect.injury) {
			let allInjuries = actor.items.filter(i=> i.type === "injury" && i.system.duration.remaining >0);
			if (allInjuries.length >0){
				allInjuries.forEach(j=> {
					let newRemain = j.system.duration.remaining - 1;
					j.update({'system.duration.remaining': newRemain});
					chatNote += "<p>"+game.i18n.format('CUM.GroupRest.injury.reduce',{NAME: actor.name, INJURY: j.name, STAT: newRemain})+"</p>";
				})
			}
		}
		
		//Restore Investiture if checked
		if (result.optionSelect.invest) {
			if (actor.system.resources.inv.value < actor.system.resources.inv.max.value) {
				await actor.update({
					'system.resources.inv.value': actor.system.resources.inv.max.value
				});
				chatNote += "<p>"+game.i18n.format('CUM.GroupRest.invest',{NAME: actor.name})+"</p>";
			}
		}
		
		//output message to chat
		ChatMessage.create({
			content: chatNote,
			speaker: ChatMessage.getSpeaker({ actor }),
			user: game.user.id,
		});
		
	} //end for actor loop












}// end function


/**
////////////////////////original submission
  //This triggers a Long Rest for all actors, plus refills Investiture to full.
		for (actor of game.actors) {
			await actor.longRest({dialog:false});
			await actor.update({
				'system.resources.inv.value': actor.system.resources.inv.max.value
				});
				let exh = actor.appliedEffects.filter(x => x.name.substring(0,9) == "Exhausted");
				for (eff of exh) 
					let newStacks = eff.stacks-1;
						if (newStacks == 0) actor.toggleStatusEffect("exhausted", {active:false});
							else await eff.update({'system.stacks': newStacks});
							}
							ui.notifications.info("Everyone has a long rest!");
							
**/