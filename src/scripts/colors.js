// Runs in the head so a saved palette is applied before the page is painted.
(() => {
	const storageKey = 'allen:colors';
	const defaults = { bg: '#000000', text: '#ffffff', link: '#5eead4', swap: false };
	const keys = ['bg', 'text', 'link'];
	const normalize = (value) => {
		if (typeof value !== 'string') return null;
		const hex = value.trim().replace(/^#/, '');
		if (/^[0-9a-f]{3}$/i.test(hex)) return `#${[...hex].map((c) => c + c).join('')}`.toLowerCase();
		return /^[0-9a-f]{6}$/i.test(hex) ? `#${hex.toLowerCase()}` : null;
	};
	let palette = { ...defaults };
	try {
		const saved = JSON.parse(localStorage.getItem(storageKey));
		if (saved && typeof saved === 'object') {
			for (const key of keys) palette[key] = normalize(saved[key]) || defaults[key];
			palette.swap = saved.swap === true;
		}
	} catch { /* Storage may be unavailable or contain an invalid value. */ }

	function apply() {
		const bg = palette.swap ? palette.text : palette.bg;
		const text = palette.swap ? palette.bg : palette.text;
		const root = document.documentElement;
		root.style.setProperty('--bg-color', bg);
		root.style.setProperty('--text-color', text);
		root.style.setProperty('--link-color', palette.link);
		root.style.setProperty('--text-muted', bg === defaults.bg && text === defaults.text
			? '#9ca3af' : `color-mix(in srgb, ${text} 70%, ${bg})`);
		const rgb = bg.slice(1).match(/../g).map((part) => parseInt(part, 16) / 255);
		const linear = rgb.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
		const luminance = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
		// Keep the reset controls readable even if page text matches the background.
		root.style.setProperty('--controls-text', luminance > 0.179 ? '#000000' : '#ffffff');
		root.style.colorScheme = luminance > 0.179 ? 'light' : 'dark';
	}

	function save() {
		apply();
		try { localStorage.setItem(storageKey, JSON.stringify(palette)); } catch { /* Colors still work for this page. */ }
	}

	apply();
	document.addEventListener('DOMContentLoaded', () => {
		const editor = document.getElementById('color-editor');
		const toggle = document.getElementById('color-toggle');
		const controls = document.getElementById('color-controls');
		const swap = document.getElementById('color-swap');
		const error = document.getElementById('color-error');
		if (!editor || !toggle || !controls || !swap || !error) return;
		const pickers = Object.fromEntries(keys.map((key) => [key, editor.querySelector(`[data-picker="${key}"]`)]));
		const inputs = Object.fromEntries(keys.map((key) => [key, editor.querySelector(`[data-hex="${key}"]`)]));
		function updateError() {
			error.hidden = !editor.querySelector('[aria-invalid="true"]');
		}
		function sync() {
			for (const key of keys) {
				pickers[key].value = palette[key];
				inputs[key].value = palette[key].toUpperCase();
				inputs[key].removeAttribute('aria-invalid');
			}
			swap.checked = palette.swap;
			updateError();
		}
		function close() {
			controls.hidden = true;
			toggle.setAttribute('aria-expanded', 'false');
		}
		sync();
		editor.hidden = false;
		toggle.addEventListener('click', () => {
			controls.hidden = !controls.hidden;
			toggle.setAttribute('aria-expanded', String(!controls.hidden));
		});
		for (const key of keys) {
			pickers[key].addEventListener('input', () => {
				palette[key] = pickers[key].value;
				inputs[key].value = palette[key].toUpperCase();
				inputs[key].removeAttribute('aria-invalid');
				updateError();
				save();
			});
			inputs[key].addEventListener('input', () => {
				const value = normalize(inputs[key].value);
				if (!value) return; // Allow intermediate text while typing.
				palette[key] = value;
				pickers[key].value = value;
				inputs[key].removeAttribute('aria-invalid');
				updateError();
				save();
			});
			inputs[key].addEventListener('blur', () => {
				if (normalize(inputs[key].value)) inputs[key].value = palette[key].toUpperCase();
				else inputs[key].setAttribute('aria-invalid', 'true');
				updateError();
			});
		}
		swap.addEventListener('change', () => { palette.swap = swap.checked; save(); });
		document.getElementById('color-reset').addEventListener('click', () => {
			palette = { ...defaults };
			apply();
			sync();
			try { localStorage.removeItem(storageKey); } catch { /* Reset also works without storage. */ }
		});
		editor.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && !controls.hidden) { close(); toggle.focus(); }
		});
		document.addEventListener('click', (event) => {
			if (!editor.contains(event.target)) close();
		});
	});
})();
