/**
* This macro opens a small window for the selected actor, listing all skills and their bonuses. Clicking a skill initiates a roll, the same as it would from the full character sheet.
**/

export async function Use_Skill() {

	let allTokens = canvas.tokens.controlled;
	
	if (allTokens.length <1) {
		ui.notifications.warn(game.i18n.localize('CUM.NoToken'));
	} else {

		let actor= allTokens[0].actor;
		let token= allTokens[0];
			
		const Physical = ['agi', 'ath', 'hwp', 'lwp', 'stl', 'thv'];
		const Cognitive = ['cra', 'ded', 'dis', 'inm', 'lor', 'med'];
		const Spiritual = ['dec', 'ins', 'lea', 'prc', 'prs', 'sur'];

		function getSkillList(actor) {
			let skills = {Physical: [], Cognitive: [], Spiritual: [], Invested: []};
			for (let skillKey in actor.system.skills) {
				let skill = actor.system.skills[skillKey];
				let skillValid = skill.unlocked == undefined || skill.unlocked == true || skill.rank > 0;
				if (skillValid) {
					let name = game.i18n.translations.COSMERE.Skill[skillKey];
					let list = game.i18n.localize('CUM.useSkill.invested');
					if (Physical.includes(skillKey)) list = game.i18n.localize('COSMERE.AttributeGroup.Physical.long');
					if (Cognitive.includes(skillKey)) list = game.i18n.localize('COSMERE.AttributeGroup.Cognitive.long');
					if (Spiritual.includes(skillKey)) list = game.i18n.localize('COSMERE.AttributeGroup.Spiritual.long');
					skills[list].push( {key:skillKey, name:name, skill:skill});
				}
			}
			return skills;
		}

		async function getDialog(token, actor) {
			let skills = getSkillList(actor);
			let toHtml = "";
		toHtml += '<div class="flexrow" style="align-items: flex-start">'
			for (let category in skills) {
				let skillList = skills[category];

				if (skillList.length > 0) {
					toHtml +='<div class="flexcol">';
					toHtml += `<h4>${category}</strong></h4>`;
					for (let skill of skillList) {
						toHtml += `<a class="name" id="${skill.key}" onclick="game.actors.get('${actor._id}').rollSkill('${skill.key}')">${skill.name} (+${actor.getSkillMod(skill.key)})</a>`;
					}
					toHtml += '</div>';
				}
			}
			toHtml +='</div>';
			let dialogObject = {
				window: {title: game.i18n.format('CUM.useSkill.title',{NAME: token.name})},
				position: {width: 600},
				content: toHtml,
				ok: { label: game.i18n.localize('CUM.useSkill.done') }
			}
			return await foundry.applications.api.DialogV2.prompt(dialogObject);
		}
		if (actor == null) {
			ui.notifications.warn(game.i18n.localize('CUM.NoToken'));
			}
			else {
				getDialog(token, actor);
			}

	} //end no token else
		
}// end export function