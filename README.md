# Cosmere Useful Macros
This module is a collection of Macros that is intended to be used for the Cosmere RPG system on FoundryVTT. This module adds a Macro Compendium with macros that can be added to the FoundryVTT hotbar. Each macro calls functions from the module itself, so once imported, the macros will never need to be re-imported when the module updates.

## List of Macros
### 1. <ins>Token Disposition Picker</ins>
This macro will change the __token disposition__ of all selected tokens between _Neutral_, _Friendly_, or _Hostile_ depending on the option chosen in a pop-up dialog box. If this macro is used on a token from an official Cosmere RPG module, the color of the token ring will change to match the new disposition: gold for Neutral, Blue for Friendly, and red for Hostile.

https://github.com/user-attachments/assets/83d5259c-bf78-41fd-b864-e336242a178a

### 2. <ins>Infuse Dun Spheres</ins>
This macro will convert all loot items on a character from Dun Sphere currency (mk ○) to Infused Spheres currency (mk ●) for all selected tokens. For each selected token, a chat message will apear to say whether any dun spheres were infused. _This macro will only work when using the **Cosmere RPG** game system._

### 3. <ins>Mass Invisibility</ins>
This macro will add or remove the _Invisible_ condition from all selected tokens. 

https://github.com/user-attachments/assets/e897b6e1-e2b8-4439-a324-d5fb0c70ad60

### 4. <ins>See Invisibility</ins>
This macro will enable or disable the _See Invisibility_ vision mode for all selected tokens. When _See Invisibility_ is enabled by this macro, the vision mode of the token is changed to _Light Amplification_ as a visual indicator that the vision mode is enabled.

https://github.com/user-attachments/assets/d07aff25-69de-47ba-bc50-199459624eb4

### 5. <ins>Token Size Picker</ins>
This macro will change the _token height_ and _token width_ of all selected tokens depedning on the option chosen in a pop-up dialog box. The options in the dialog box are _Medium_, _Large_, _Huge_, _Gargantuan_, and _Small_ as the character sizes are defined by the Cosmere RPG.

https://github.com/user-attachments/assets/131a5581-148e-4b62-9a12-ffbd759dea1e

## Contributing
To contribute a macro to this repository:
1. Add the macro code in a function as a seperate `.js` file in the `/macros` folder
2. Add a line to `CUM-index.js` to import the function
3. Add the function to the object in `CUM-index.js` that gets globalized
4. Create a macro in FoundryVTT that calls the function and add it to the module's compendium.

