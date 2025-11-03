/**
 * This macro allows the user to change the form of a radiant shardblade to another weapon
 * The weapon list is drawn from the game world and either the Stormlight Handbook or Stormlight Starter rules
 * To add a weapon to the weapon list, it must exist in the game world
 **/
 
 export async function Change_Shardblade(){
	 console.log("I'm Changin' my shardblade!");
	 //console.log(canvas.tokens.controlled[0].actor.items.filter(i=>i.name.includes("Shardblade")&&i.name.includes("(Radiant)")));
	 
	 // get all weapons from either Stormlight Handbook or Stormlight Starter rules
	 let compendium_index = [];
	 try {
		 compendium_index = game.packs.filter(i=>i.metadata.id=="cosmere-rpg-stormlight-handbook.items")[0].index.filter(j=>j.type=="weapon");
		 console.log("Weapons from Stormlight Handbook loaded");
	 }
	 catch (error) {
		 compendium_index = game.packs.filter(i=>i.metadata.id=="cosmere-rpg.items")[0].index.filter(j=>j.type=="weapon");
		 console.log("Weapons from Stormlight Starter rules loaded");
	 }
	 console.log(compendium_index);
	 
	 let compendium_weapons =[];

//	 compendium_index.forEach(m => {
	for (let m of compendium_index){
		 //let item_weapon = game.items.fromCompendium(m._id);
		 let item_weapon = await fromUuid(m.uuid);
//		 console.log(item_weapon);
		 compendium_weapons.push(item_weapon);
	}
//	 });

	 console.log(compendium_weapons);
	 
	 // get all weapons loaded in the game world
	 let world_weapons = game.items.filter(k=>k.type=="weapon");
	 console.log(world_weapons);
	 
	 //combine both weapons lists and filter for duplicates
	 let all_weapons = compendium_weapons.concat(world_weapons);
	 console.log(all_weapons);
	 
	 //select for all melee and non-special weapons, and remove improvised weapons
	 all_weapons = all_weapons.filter(n => n.system.type != "special_wpn" && n.system.attack.type == "melee" && !n.system.id.includes("improvised"));
	 
	 console.log(all_weapons);
	 
	 // alphabetize the list of weapons
	 all_weapons.sort(function (a, b) {
      let nameA = a.name.toUpperCase();
      let nameB = b.name.toUpperCase();
      return nameA.localeCompare(nameB);
    });
	 console.log(all_weapons);
	 
	 //remove items with duplicate names
	 let unique_forms = [all_weapons[0]];
	 for (let q=1; q < all_weapons.length; q++) {
		 if (all_weapons[q].name != all_weapons[q-1].name) {
			 unique_forms.push(all_weapons[q]);
		 }	 
	 }
	 
	 console.log(unique_forms);
	 
	 
	 
	 
 }//end export function