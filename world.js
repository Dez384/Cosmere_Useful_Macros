Hooks.once("init", () => {
  const effects = {
    invisible: {
      label: "invisible",
      icon: "icons/svg/invisible.svg"
    }
  };

  for (const [k, v] of Object.entries(effects)) {
    CONFIG.statusEffects.push({
      id: k,
      _id: `cond${k}`.padEnd(16, '0'),
      name: v.label,
      img: v.icon
    });
	CONFIG.COSMERE.conditions[k] = {label: v.label, icon: v.icon};
  }
});