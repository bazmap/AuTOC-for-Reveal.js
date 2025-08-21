
<div align="center">
<h1>AuTOC for Reveal.js</h1>
  <p>
    An Automatic Table of Content for your Reveal.js presentations
  </p>
  <!-- Badges -->
	<p>
		<a href="https://github.com/bazmap/AuTOC-for-Reveal.js/graphs/contributors">
			<img src="https://img.shields.io/github/contributors/bazmap/AuTOC-for-Reveal.js" alt="contributors" />
		</a>
		<a href="">
			<img src="https://img.shields.io/github/last-commit/bazmap/AuTOC-for-Reveal.js" alt="last update" />
		</a>
	</p>
	<p>
		<a href="https://github.com/bazmap/AuTOC-for-Reveal.js/network/members">
			<img src="https://img.shields.io/github/forks/bazmap/AuTOC-for-Reveal.js" alt="forks" />
		</a>
		<a href="https://github.com/bazmap/AuTOC-for-Reveal.js/stargazers">
			<img src="https://img.shields.io/github/stars/bazmap/AuTOC-for-Reveal.js" alt="stars" />
		</a>
	</p>
	<p>
		<a href="https://github.com/bazmap/AuTOC-for-Reveal.js/issues/">
			<img src="https://img.shields.io/github/issues/bazmap/AuTOC-for-Reveal.js" alt="open issues" />
		</a>
		<a href="https://github.com/bazmap/AuTOC-for-Reveal.js/blob/master/LICENSE">
			<img src="https://img.shields.io/github/license/bazmap/AuTOC-for-Reveal.js.svg" alt="license" />
		</a>
	</p>
</div>



## 📔 Table of Contents

- [📔 Table of Contents](#-table-of-contents)
- [🌟 What is AuTOC](#-what-is-autoc)
- [📖 User documentation](#-user-documentation)
	- [🚀 Installation](#-installation)
	- [🧰 Configuration](#-configuration)
	- [🎨 Style](#-style)
	- [⚡️ How to use](#️-how-to-use)
- [👋 Contributing](#-contributing)
- [📜 Licence](#-licence)



## 🌟 What is AuTOC
AuTOC stand for "Automatic Table Of Content". It creates a dynamic TOC into your Reveal.js presentation.  
It's based on specific elements into the presentation like `h1`, `h2` or `h3` and structured as a menu with clickable elements to jump to a specific part of the presentation.  
Part of the TOC is highlighted to see the progress.

Vertical - boxed layout :  

![til](./assets/demo_vertical_box.gif)

Vertical - plain layout :  

![til](./assets/vertical_plain.png)

Horizontal - plain layout :  

![til](./assets/demo_horizontal_plain.gif)

Horizontal - boxed layout :  

![til](./assets/horizontal_box.png)



## 📖 User documentation
### 🚀 Installation
Follow these 3 simple steps :
1. Copy the `plugin\AuTOC` directory content from this repository into the `plugin\AuTOC` directory of your Reveal.js presentation.

2. Include the script into your presentation file :
```html
<script src="/plugin/AuTOC/AuTOC.js"></script>
```

3. Include the plugin into the `Reveal.initialize` :
```javascript
Reveal.initialize({
	plugins: [ 
		AuTOC
	]
});
```


### 🧰 Configuration
AuTOC support multiple parameter to change the layout.  
Just add the `AuTOC` key into the `Reveal.initialize` :
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



### 🎨 Style
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

Colors are defined up to 6 level of depth. If you want to define more or redefine it, use these selectors (here for level 1, just change the level number) :

```css
#AuTOC.box ul li.tagOrder-1 > a,
#AuTOC.vertical.plain li.tagOrder-1,
#AuTOC.horizontal.plain #tagOrder-1.menu-level {
	background-color: color-mix(in oklab, var(--autoc-main-color) 100%, rgb(35, 35, 35));
	font-size: 1.2em;
	font-weight: bold;
}
```


### ⚡️ How to use
To use the plugin, just follow your presentation, the part displayed will be highlighted.
You can click on an item to jump to the linked part.

> [!TIP]
> Press the `a` key to disable/enable the AuTOC.


## 👋 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

> [!IMPORTANT]
> For major changes, please open an issue first to discuss what you would like to change.

🧑‍💻 to install your environment, you can use Docker 🐳
1. Clone this repository
2. Run `docker compose up --build`
3. Connect to `http://localhost:8000`

All modifications can be done into `plugin/AuTOC`.


## 📜 Licence
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)  
More info in the [associated file](licence)

