/********************************************************
*                                                       *
* Javascript for the AuTOC plugin for Reveal.js         *
*                                                       *
* Author: Arthur Bazin                                  *
*                                                       *
* License: GPL v3                                       *
* http://www.gnu.org/copyleft/gpl.html                  *
*                                                       *
********************************************************/


/* AuTOC object */

var AuTOC = {
	id: 'AuTOC'
};



// Initialize the plugin
AuTOC.init = function(deck) {

	// Get user define config
	const config = deck.getConfig().AuTOC || {};
	this.visibleInit = config.visibleInit ?? true; // TOC visible at start - boolean - Default to true
	this.layout = config.layout || 'vertical'; // Menu layout - string : 'vertical', 'horizontal' - Default to 'vertical'
	this.style = config.style || 'box';  // Menu style - string : 'box', 'plain' - Default to 'box'
	this.subAlwaysVisible = config.subAlwaysVisible ?? false; // All sub-elements are always displayed - boolean - Default to false
	this.horizontalPosition = config.horizontalPosition || 'left'; // TOC position in the page - string : 'left', 'right' - Default to left
	this.verticalPosition = config.verticalPosition || 'top'; // TOC position in the page - string : 'top', 'bottom' - Default to top
	this.linksAlign = config.linksAlign || 'center'; // Links alignment - string : 'left', 'right', 'center' - Default to center
	this.linksLeftPadded = config.linksLeftPadded ?? true; // In vertical layout only, Links have a left padding - Default to true

	this.tagList = (config.tagList || 'h1,h2,h3') // DOM elements to use for the table of contents - string of elements separated by comma - default to 'h1,h2,h3'
		.split(',')
		.map(t => t.trim().toLowerCase());

	this.tagOrderMap = {};
	this.tagList.forEach((tag, index) => {
		this.tagOrderMap[tag] = index + 1;
	});



	// CSS
	// Try to determine path to CSS by replacing "js" with "css".
	// Use hard-coded string as fallback.
	var path="plugin/AuTOC/AuTOC.css";
	var script;
	if (document.currentScript && document.currentScript.src) {
		script = document.currentScript;
	} else {
		script = document.querySelector('script[src$="/AuTOC.js"]');
	}
	if (script) {
		path = script.src.slice(0, -2) + "css";
	}

	var link=document.createElement("link");
	link.href=path;
	link.type="text/css";
	link.rel="stylesheet";
	document.getElementsByTagName("head")[0].appendChild(link);



	// Capture 'q' key to toggle the display of the TOC-Progress footer
	deck.addKeyBinding(
		{ 
			keyCode: 65, 
			key: 'a',
			description: 'Toggle AuTOC'
		}, 
		() => {
			this.toggle();
		}
	);



	// Create the TOC
	this.titleList = this.generateListTitles(deck);
	this.titleHierarchy = this.buildHierarchy();
	this.titleHierarchyFlat = this.flattenHierarchy();
	if (this.layout === 'horizontal') {
		this.HTMLContent = this.generateHTMLHorizontalList();
	} else {
		this.HTMLContent = this.generateHTMLVerticalList();
	};
	this.addTOC(this.HTMLContent, deck);



	// Add event listener for slide changes
	// On change, update the active class on the TOC li elements
	deck.on('slidechanged', (event) => {
		this.activeElement(deck, event.indexh, event.indexv);
	});
};



AuTOC.generateListTitles = function(deck) {

	// List all titles in the presentation
	const titleList = [];

	deck.getSlides().forEach((slide) => {

		const indices = Reveal.getIndices(slide);

		// Don't get top parent slide which contains all children slides
		if (
			indices.v === undefined
			&& slide.querySelector('section')
		) {
			return;
		}



		slide.querySelectorAll(this.tagList.join(',')).forEach(element => {
			const tagName = element.tagName.toLowerCase();
			titleList.push({
				tag: tagName,
				tagOrder: this.tagOrderMap[tagName],
				indices: {
					h: indices.h,
					v: indices.v || 0
				},
				html: element.innerHTML.trim()
			});
		});

	});

	return titleList;

};



// Create a hierarchy from the title list
AuTOC.buildHierarchy = function() {
	const items = this.titleList;
	const root = [];
	const parents = {};
	var id = 1;
	var childId = 1;

	items.forEach(item => {
		const node = { ...item, children: [], parent_id: id };

		if (item.tagOrder === 1) {
			root.push(node);
			id++;
		} else {
			const parent = parents[item.tagOrder - 1];
			if (parent) {
				node.parent_id = parent.parent_id + "-" + childId++;
				parent.children.push(node);
			}
		}

		parents[item.tagOrder] = node;
	});
	
	return root;
};



// Flatten the title list
AuTOC.flattenHierarchy = function(items = this.titleHierarchy) {
	let flattenList = [];
	for (const node of items) {
		flattenList.push(node);
		if (node.children && node.children.length > 0) {
			flattenList = flattenList.concat(this.flattenHierarchy(node.children));
		}
	}
	return flattenList;
};



// Create HTML list from the hierarchy
AuTOC.generateHTMLVerticalList = function(items = this.titleHierarchy) {
	const ul = document.createElement('ul');
	if (items[0].tagOrder === 1) {
		ul.classList.add(`main`);
	}

	items.forEach(item => {

		const li = document.createElement('li');
		li.classList.add(`tagOrder-${item.tagOrder}`);
		li.classList.add(`parent-id-${item.parent_id}`);
		li.classList.add(`indice-h-${item.indices.h}`);
		li.classList.add(`indice-v-${item.indices.v}`);

		const a = document.createElement('a');
		a.href = `#/${item.indices.h}/${item.indices.v}`;
		for (let i = 2; i <= item.tagOrder; i++) {
			const span = document.createElement('span')
			span.classList.add('marge')
			a.appendChild(span)
		}
		a.insertAdjacentHTML('beforeend', item.html);
		li.appendChild(a);


		if (item.children.length > 0) {
			li.appendChild(this.generateHTMLVerticalList(item.children));
		}

		ul.appendChild(li);
	});

	return ul;
};



// Create HTML list from the hierarchy
AuTOC.generateHTMLHorizontalList = function() {

	const items = this.titleHierarchyFlat;

	// Get max tagOrder
	const maxTagOrder = Math.max(...items.map(item => item.tagOrder));

	// Create the main div container
	const divList = document.createElement('div');
	divList.classList.add(`container`);


	// tagOrder 1
	const divOrder1 = document.createElement('div');
	divOrder1.id = 'tagOrder-1';
	divOrder1.classList.add(`main`);
	divOrder1.classList.add(`menu-level`);

	const ul1 = document.createElement('ul');

	items.filter(n => n.tagOrder === 1).forEach(item => {
		const li = document.createElement('li');
		li.classList.add(`tagOrder-${item.tagOrder}`);
		li.classList.add(`parent-id-${item.parent_id}`);
		li.classList.add(`indice-h-${item.indices.h}`);
		li.classList.add(`indice-v-${item.indices.v}`);

		const a = document.createElement('a');
		a.href = `#/${item.indices.h}/${item.indices.v}`;
		a.innerHTML = item.html;
		li.appendChild(a);

		ul1.appendChild(li);
	});

	divOrder1.appendChild(ul1);
	divList.appendChild(divOrder1);

	// tagOrders 2 to maxTagOrder
	for (let tagOrder = 2; tagOrder <= maxTagOrder; tagOrder++) {
		const div = document.createElement('div');
		div.id = `tagOrder-${tagOrder}`;
		div.classList.add(`menu-level`);

		// Parents = tagOrder-1 with children
		const parents = items.filter(item => item.tagOrder === tagOrder - 1 && item.children && item.children.length);

		parents.forEach(parent => {
			const ul = document.createElement('ul');
			ul.classList.add(`indice-h-${parent.indices.h}`);
			ul.classList.add(`parent-id-${parent.parent_id}`);

			parent.children.forEach(child => {

				// Only add children with the current tagOrder
				if (child.tagOrder !== tagOrder) return;

				const li = document.createElement('li');
				li.classList.add(`tagOrder-${child.tagOrder}`);
				li.classList.add(`parent-id-${child.parent_id}`);
				li.classList.add(`indice-h-${child.indices.h}`);
				li.classList.add(`indice-v-${child.indices.v}`);

				const a = document.createElement('a');
				a.href = `#/${child.indices.h}/${child.indices.v}`;
				a.insertAdjacentHTML('beforeend', child.html);
				li.appendChild(a);

				ul.appendChild(li);
			});

			if (ul.children.length) {
				div.appendChild(ul);
			};
		});

		divList.appendChild(div);
	}

	return divList;
};



// Add the TOC to the reveal element
AuTOC.addTOC = function(HTMLContent, deck) {

	// TOC Container
	const tocContainer = document.createElement('div');
	tocContainer.id = 'AuTOC';
	tocContainer.classList.add(this.layout);

	if (this.style === 'plain') {
		tocContainer.classList.add('plain');
	} else {
		tocContainer.classList.add('box');
	};

	if (
		this.visibleInit
		&& this.layout === 'vertical'
	) {
		tocContainer.style.display = 'block';
	} else if (
		this.visibleInit
		&& this.layout === 'horizontal'
	) {
		tocContainer.style.display = 'flex';
	} else {
		tocContainer.style.display = 'none';
	};

	if (this.subAlwaysVisible) {
		tocContainer.classList.add('sub-always-visible');
	};

	if (this.linksAlign === 'right') {
		tocContainer.classList.add('links-align-right');
	} else if (this.linksAlign === 'left') {
		tocContainer.classList.add('links-align-left');
	} else {
		tocContainer.classList.add('links-align-center');
	};

	if (this.linksLeftPadded) {
		tocContainer.classList.add('links-left-padded');
	};

	if (this.horizontalPosition === 'right') {
		tocContainer.classList.add('horizontal-position-right');
	} else {
		tocContainer.classList.add('horizontal-position-left');
	};

	if (this.verticalPosition === 'bottom') {
		tocContainer.classList.add('vertical-position-bottom');
	} else {
		tocContainer.classList.add('vertical-position-top');
	};
	
	tocContainer.appendChild(HTMLContent);

	// Add the TOC container to the reveal element
	deck.on('ready', event => {
		deck.getRevealElement().appendChild(tocContainer);
		this.activeElement(deck, deck.getIndices().h, deck.getIndices().v);
	});

}



// Toggle the display of the TOC element
AuTOC.toggle = function() {
	const toc = document.getElementById('AuTOC');

	if (
		toc.style.display === 'none'
		&& this.layout === 'vertical'
	) {
		toc.style.display = 'block';
	} else if (
		toc.style.display === 'none'
		&& this.layout === 'horizontal'
	) {
		toc.style.display = 'flex';
	} else {
		toc.style.display = 'none';
	}

};



AuTOC.activeElement = function(deck, indexh, indexv) {

	const titleHierarchyFlat = this.titleHierarchyFlat;

	// Don't process if titleHierarchyFlat is undefined
	if (titleHierarchyFlat == undefined) {
		return;
	}


	// Remove active classes from all elements
	deck.getRevealElement().querySelectorAll('#AuTOC li').forEach(liElement => {
		liElement.classList.remove('active');
		liElement.classList.remove('active-parent');
	});
	deck.getRevealElement().querySelectorAll('#AuTOC ul').forEach(ulElement => {
		ulElement.classList.remove('active');
		ulElement.classList.remove('active-parent');
	});



	// Add the active class of all links that points for the same slide
	deck.getRevealElement().querySelectorAll(`#AuTOC ul li.indice-h-${indexh}.indice-v-${indexv}`).forEach(liElement => {
		liElement.classList.add('active');
	});



	// Identify the closest tag element of the slide
	const parentItem = titleHierarchyFlat
		.filter(item => item.indices.h === indexh && item.indices.v <= indexv)
		.sort((a, b) => {
			const diffV = b.indices.v - a.indices.v;
			if (diffV !== 0) return diffV;

			const pa = a.parent_id.split('-').map(Number);
			const pb = b.parent_id.split('-').map(Number);
			const len = Math.min(pa.length, pb.length);

			for (let i = 0; i < len; i++) {
				if (pa[i] !== pb[i]) return pb[i] - pa[i];
			}

			return pb.length - pa.length;
		})[0] || null;

	if (parentItem) {
		parentId = parentItem.parent_id;
	} else {
		parentId = null; 
	}



	// Add the active class to the parent elements
	if (deck.getRevealElement().querySelector('#AuTOC ul li.parent-id-'+parentId)) {
		deck.getRevealElement().querySelector('#AuTOC ul li.parent-id-'+parentId).classList.add('active');
	};



	if (this.layout === 'vertical') {
		function getLiWithParents(liElement) {
			const result = [];
			let current = liElement;

			while (current && current.tagName === 'LI') {
				result.push(current);

				const parentUl = current.parentElement;
				if (!parentUl || !(parentUl instanceof HTMLUListElement)) break;
				current = parentUl.closest('li');
			}

			return result;
		}

		// Get all ancestors
		const liFamillyChain = getLiWithParents(
			deck.getRevealElement().querySelector('#AuTOC ul li.parent-id-'+parentId)
		);

		liFamillyChain.forEach(liElement => {
			liElement.classList.add('active-parent');
		});

	} else if (this.layout === 'horizontal') {
	
		const selectors = [];

		if (/^\d+$/.test(parentId)) {
			selectors.push(`.parent-id-${parentId}`);
		} else if (parentId) {
			
			const idParts = parentId.split('-');

			for (let i = 1; i <= idParts.length; i++) {
				const id = idParts.slice(0, i).join('-');
				selectors.push(`.parent-id-${id}`);
			}
		};

		// On sélectionne tous les éléments correspondants
		const elements = deck.getRevealElement().querySelectorAll(selectors.join(', ')).forEach(liElement => {
			liElement.classList.add('active-parent');
		});
	};

};