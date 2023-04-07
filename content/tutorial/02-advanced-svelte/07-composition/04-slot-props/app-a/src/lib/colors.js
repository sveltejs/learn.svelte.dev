const data = [
	{ hex: '#f0f8ff', name: 'AliceBlue' },
	{ hex: '#faebd7', name: 'AntiqueWhite' },
	{ hex: '#00ffff', name: 'Aqua' },
	{ hex: '#7fffd4', name: 'Aquamarine' },
	{ hex: '#f0ffff', name: 'Azure' },
	{ hex: '#f5f5dc', name: 'Beige' },
	{ hex: '#ffe4c4', name: 'Bisque' },
	{ hex: '#000000', name: 'Black' },
	{ hex: '#ffebcd', name: 'BlanchedAlmond' },
	{ hex: '#0000ff', name: 'Blue' },
	{ hex: '#8a2be2', name: 'BlueViolet' },
	{ hex: '#a52a2a', name: 'Brown' },
	{ hex: '#deb887', name: 'BurlyWood' },
	{ hex: '#5f9ea0', name: 'CadetBlue' },
	{ hex: '#7fff00', name: 'Chartreuse' },
	{ hex: '#d2691e', name: 'Chocolate' },
	{ hex: '#ff7f50', name: 'Coral' },
	{ hex: '#6495ed', name: 'CornflowerBlue' },
	{ hex: '#fff8dc', name: 'Cornsilk' },
	{ hex: '#dc143c', name: 'Crimson' },
	{ hex: '#00ffff', name: 'Cyan' },
	{ hex: '#00008b', name: 'DarkBlue' },
	{ hex: '#008b8b', name: 'DarkCyan' },
	{ hex: '#b8860b', name: 'DarkGoldenRod' },
	{ hex: '#a9a9a9', name: 'DarkGray' },
	{ hex: '#a9a9a9', name: 'DarkGrey' },
	{ hex: '#006400', name: 'DarkGreen' },
	{ hex: '#bdb76b', name: 'DarkKhaki' },
	{ hex: '#8b008b', name: 'DarkMagenta' },
	{ hex: '#556b2f', name: 'DarkOliveGreen' },
	{ hex: '#ff8c00', name: 'DarkOrange' },
	{ hex: '#9932cc', name: 'DarkOrchid' },
	{ hex: '#8b0000', name: 'DarkRed' },
	{ hex: '#e9967a', name: 'DarkSalmon' },
	{ hex: '#8fbc8f', name: 'DarkSeaGreen' },
	{ hex: '#483d8b', name: 'DarkSlateBlue' },
	{ hex: '#2f4f4f', name: 'DarkSlateGray' },
	{ hex: '#2f4f4f', name: 'DarkSlateGrey' },
	{ hex: '#00ced1', name: 'DarkTurquoise' },
	{ hex: '#9400d3', name: 'DarkViolet' },
	{ hex: '#ff1493', name: 'DeepPink' },
	{ hex: '#00bfff', name: 'DeepSkyBlue' },
	{ hex: '#696969', name: 'DimGray' },
	{ hex: '#696969', name: 'DimGrey' },
	{ hex: '#1e90ff', name: 'DodgerBlue' },
	{ hex: '#b22222', name: 'FireBrick' },
	{ hex: '#fffaf0', name: 'FloralWhite' },
	{ hex: '#228b22', name: 'ForestGreen' },
	{ hex: '#ff00ff', name: 'Fuchsia' },
	{ hex: '#dcdcdc', name: 'Gainsboro' },
	{ hex: '#f8f8ff', name: 'GhostWhite' },
	{ hex: '#ffd700', name: 'Gold' },
	{ hex: '#daa520', name: 'GoldenRod' },
	{ hex: '#808080', name: 'Gray' },
	{ hex: '#808080', name: 'Grey' },
	{ hex: '#008000', name: 'Green' },
	{ hex: '#adff2f', name: 'GreenYellow' },
	{ hex: '#f0fff0', name: 'HoneyDew' },
	{ hex: '#ff69b4', name: 'HotPink' },
	{ hex: '#cd5c5c', name: 'IndianRed' },
	{ hex: '#4b0082', name: 'Indigo' },
	{ hex: '#fffff0', name: 'Ivory' },
	{ hex: '#f0e68c', name: 'Khaki' },
	{ hex: '#e6e6fa', name: 'Lavender' },
	{ hex: '#fff0f5', name: 'LavenderBlush' },
	{ hex: '#7cfc00', name: 'LawnGreen' },
	{ hex: '#fffacd', name: 'LemonChiffon' },
	{ hex: '#add8e6', name: 'LightBlue' },
	{ hex: '#f08080', name: 'LightCoral' },
	{ hex: '#e0ffff', name: 'LightCyan' },
	{ hex: '#fafad2', name: 'LightGoldenRodYellow' },
	{ hex: '#d3d3d3', name: 'LightGray' },
	{ hex: '#d3d3d3', name: 'LightGrey' },
	{ hex: '#90ee90', name: 'LightGreen' },
	{ hex: '#ffb6c1', name: 'LightPink' },
	{ hex: '#ffa07a', name: 'LightSalmon' },
	{ hex: '#20b2aa', name: 'LightSeaGreen' },
	{ hex: '#87cefa', name: 'LightSkyBlue' },
	{ hex: '#778899', name: 'LightSlateGray' },
	{ hex: '#778899', name: 'LightSlateGrey' },
	{ hex: '#b0c4de', name: 'LightSteelBlue' },
	{ hex: '#ffffe0', name: 'LightYellow' },
	{ hex: '#00ff00', name: 'Lime' },
	{ hex: '#32cd32', name: 'LimeGreen' },
	{ hex: '#faf0e6', name: 'Linen' },
	{ hex: '#ff00ff', name: 'Magenta' },
	{ hex: '#800000', name: 'Maroon' },
	{ hex: '#66cdaa', name: 'MediumAquaMarine' },
	{ hex: '#0000cd', name: 'MediumBlue' },
	{ hex: '#ba55d3', name: 'MediumOrchid' },
	{ hex: '#9370db', name: 'MediumPurple' },
	{ hex: '#3cb371', name: 'MediumSeaGreen' },
	{ hex: '#7b68ee', name: 'MediumSlateBlue' },
	{ hex: '#00fa9a', name: 'MediumSpringGreen' },
	{ hex: '#48d1cc', name: 'MediumTurquoise' },
	{ hex: '#c71585', name: 'MediumVioletRed' },
	{ hex: '#191970', name: 'MidnightBlue' },
	{ hex: '#f5fffa', name: 'MintCream' },
	{ hex: '#ffe4e1', name: 'MistyRose' },
	{ hex: '#ffe4b5', name: 'Moccasin' },
	{ hex: '#ffdead', name: 'NavajoWhite' },
	{ hex: '#000080', name: 'Navy' },
	{ hex: '#fdf5e6', name: 'OldLace' },
	{ hex: '#808000', name: 'Olive' },
	{ hex: '#6b8e23', name: 'OliveDrab' },
	{ hex: '#ffa500', name: 'Orange' },
	{ hex: '#ff4500', name: 'OrangeRed' },
	{ hex: '#da70d6', name: 'Orchid' },
	{ hex: '#eee8aa', name: 'PaleGoldenRod' },
	{ hex: '#98fb98', name: 'PaleGreen' },
	{ hex: '#afeeee', name: 'PaleTurquoise' },
	{ hex: '#db7093', name: 'PaleVioletRed' },
	{ hex: '#ffefd5', name: 'PapayaWhip' },
	{ hex: '#ffdab9', name: 'PeachPuff' },
	{ hex: '#cd853f', name: 'Peru' },
	{ hex: '#ffc0cb', name: 'Pink' },
	{ hex: '#dda0dd', name: 'Plum' },
	{ hex: '#b0e0e6', name: 'PowderBlue' },
	{ hex: '#800080', name: 'Purple' },
	{ hex: '#663399', name: 'RebeccaPurple' },
	{ hex: '#ff0000', name: 'Red' },
	{ hex: '#bc8f8f', name: 'RosyBrown' },
	{ hex: '#4169e1', name: 'RoyalBlue' },
	{ hex: '#8b4513', name: 'SaddleBrown' },
	{ hex: '#fa8072', name: 'Salmon' },
	{ hex: '#f4a460', name: 'SandyBrown' },
	{ hex: '#2e8b57', name: 'SeaGreen' },
	{ hex: '#fff5ee', name: 'SeaShell' },
	{ hex: '#a0522d', name: 'Sienna' },
	{ hex: '#c0c0c0', name: 'Silver' },
	{ hex: '#87ceeb', name: 'SkyBlue' },
	{ hex: '#6a5acd', name: 'SlateBlue' },
	{ hex: '#708090', name: 'SlateGray' },
	{ hex: '#708090', name: 'SlateGrey' },
	{ hex: '#fffafa', name: 'Snow' },
	{ hex: '#00ff7f', name: 'SpringGreen' },
	{ hex: '#4682b4', name: 'SteelBlue' },
	{ hex: '#d2b48c', name: 'Tan' },
	{ hex: '#008080', name: 'Teal' },
	{ hex: '#d8bfd8', name: 'Thistle' },
	{ hex: '#ff6347', name: 'Tomato' },
	{ hex: '#40e0d0', name: 'Turquoise' },
	{ hex: '#ee82ee', name: 'Violet' },
	{ hex: '#f5deb3', name: 'Wheat' },
	{ hex: '#ffffff', name: 'White' },
	{ hex: '#f5f5f5', name: 'WhiteSmoke' },
	{ hex: '#ffff00', name: 'Yellow' },
	{ hex: '#9acd32', name: 'YellowGreen' }
];

export const colors = data.map(({ hex, name }) => {
	// calculate rgb
	let r = parseInt(hex.slice(1, 3), 16);
	let g = parseInt(hex.slice(3, 5), 16);
	let b = parseInt(hex.slice(5, 7), 16);

	const rgb = `rgb(${r}, ${g}, ${b})`;

	// calculate hsl
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);

	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (max > min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}

		h /= 6;
	}

	const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

	return {
		name,
		hex,
		rgb,
		hsl
	};
});