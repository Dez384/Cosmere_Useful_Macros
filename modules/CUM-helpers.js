/** 
 * A collection of functions that can be re-used between macros
 **/
 
 export class CUM_Helpers {
	 
	 // function for getting all items weapon items from the game world and the core Stormlight rules
	 static async getStormlightWeapons() {
		 
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
		// use the uuid to call the weapons as CosmereItems
		let compendium_weapons =[];
		for (let m of compendium_index){
			 let item_weapon = await fromUuid(m.uuid);

			 compendium_weapons.push(item_weapon);
		}
		
		// get all weapons loaded in the game world
		 let world_weapons = game.items.filter(k=>k.type=="weapon");
		 
		 //combine both weapons lists
		 let all_weapons = compendium_weapons.concat(world_weapons);

		// return the Array of CosmereItems
		return all_weapons;
		 
	 }//end getStormlightItems
	 
	 // function to remove special, ranged, and improvised weapons from a collection of CosmereItem weapons
	 static async nonSpecialMelee(weapons) {
		 
		 weapons = weapons.filter(n => n.system.type != "special_wpn" && n.system.attack.type == "melee" && !n.system.id.includes("improvised"));
		 
		 return weapons;
		 
	 }//end nonSpecialMelee
	 
	 // function to order a collection by name and remove any duplicates with the same name
	 static async orderAndReduce(aCollection) {
		// alphabetize the list of weapons
		aCollection.sort(function (a, b) {
		  let nameA = a.name.toUpperCase();
		  let nameB = b.name.toUpperCase();
		  return nameA.localeCompare(nameB);
		});
		 
		 //remove items with duplicate names
		 let unique_forms = [aCollection[0]];
		 for (let q=1; q < aCollection.length; q++) {
			 if (aCollection[q].name != aCollection[q-1].name) {
				 unique_forms.push(aCollection[q]);
			 }	 
		 } 
		 
		 return unique_forms;
	 }//end orderAndReduce
 
	 // function to create an HTML select input from a collection of items
	 static async makeOptions(aCollection, aDefault) {
		 let toHTML = "";
		 for (let i=0; i < aCollection.length; i++) {
			 toHTML += `<option `;
			 if (aCollection[i].system.id == aDefault){
				 toHTML += `selected `;
			 }
			 toHTML += `value=${[i]} style="color: black;"> ${aCollection[i].name} </option>`
		 }//end for loop
		 
		 return toHTML;
	 }//end makeSelect
	 
 }//end export class