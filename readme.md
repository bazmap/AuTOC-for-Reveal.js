
<div align="center">
<h1>AuTOC for Reveal.js</h1>
  <p>
    An Automatic Table of Content for your Reveal.js presentations
  </p>
</div>



## 📔 Table of Contents

- [📔 Table of Contents](#-table-of-contents)
- [🌟 What is AuTOC](#-what-is-autoc)
- [📖 How to use](#-how-to-use)
	- [🚀 Installation](#-installation)
	- [🧰 Configuration](#-configuration)
	- [🖌️ Style](#️-style)
	- [Use](#use)
- [📝Licence](#licence)



## 🌟 What is AuTOC
What is it with images



## 📖 How to use
### 🚀 Installation
Copy the `plugin\AuTOC` directory content from this repository into the `plugin\AuTOC` directory of your Reveal.js presentation.

Include the script into your presentation file :
```html
<script src="/plugin/AuTOC/AuTOC.js"></script>
```

Include the plugin into the `Reveal.initialize` :
```javascript
Reveal.initialize({
	plugins: [ 
		AuTOC
	]
});
```


### 🧰 Configuration
To change the configuration, add the AuTOC key into the `Reveal.initialize` :
```javascript
Reveal.initialize({
	plugins: [ 
		AuTOC
	],
	AuTOC: {
		tagList: 'h1,h2,h3', // DOM elements to use for the table of contents - string of elements separated by comma - default to 'h1,h2,h3'
		visibleInit: true, // TOC visible at start - boolean - Default to true
		layout: 'vertical', // Menu layout - string : 'vertical', 'horizontal' - Default to 'vertical'
		style: 'box',  // Menu style - string : 'box', 'plain' - Default to 'box'
		subAlwaysVisible: false, // in vertical layout, all sub-elements are always displayed - boolean - Default to false
		horizontalPosition: 'left', // TOC position in the page only when layout = vertical - string : 'left', 'right' - Default to left
		verticalPosition: 'bottom', // TOC position in the page - string : 'top', 'bottom' - Default to top for layout = vertical and bottom for layout = horizontal
		linksAlign: 'center', // Links alignment - string : 'left', 'right', 'center' - Default to center
	}
});
```

The following parameters can be used :
- `tagList` : string 
  - DOM elements to use for the table of contents
  - String of elements separated by comma
  - Default to `'h1,h2,h3'`
- `visibleInit` : boolean
  - TOC visible at start
  - Default to `true`
- `layout` : string
  - Menu layout in `'vertical'`, `'horizontal'`
  - Default to `'vertical'`
- `style` : string
  - Menu style in `'box'`, `'plain'`
  - Default to `'box'`
- `subAlwaysVisible` : boolean
  - In vertical layout, all sub-elements are always displayed
  - Default to `false`
- `horizontalPosition` : string
  - TOC position in the page only when layout = vertical in `'left'`, `'right'`
  - Default to `'left'`
- `verticalPosition` : string
  - TOC position in the page - string : `'top'`, `'bottom'`
  - Default :
    - for layout = vertical : `'top'`
    - for layout = horizontal : `'bottom'`
- `linksAlign` : string
  - Links alignment in `'left'`, `'right'`, `'center'` 
  - Default to `'center'`



### 🖌️ Style
CSS can be modify, thoses variables are used :

```css
#AuTOC {
	--autoc-main-color: #0088FF;
	--autoc-active-color:#ff0000;
	--autoc-text-color: #fff;
	--autoc-text-size: 13px;
	--autoc-border-radius: 3px;
	--autoc-max-width: 150px; /* Can be max-content to fit the content */
}
```

Colors are defined up to 6 level of depth. If you want to define more or redefine, use these selectors (here for level 1, just change the level number) :

```css
#AuTOC.box ul li.tagOrder-1 > a,
#AuTOC.vertical.plain li.tagOrder-1,
#AuTOC.horizontal.plain #tagOrder-1.menu-level {
	background-color: color-mix(in oklab, var(--autoc-main-color) 100%, rgb(35, 35, 35));
	font-size: 1.2em;
	font-weight: bold;
}
```


### Use
To use the plugin, just follow your presentation
Pressing the q key causes the Reveal.js-TOC-Progress footer to disappear. Pressing the q key again creates it again.


## 📝Licence
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)  
More info in the [associated file](licence)

