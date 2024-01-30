/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _packages_pages_page_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./packages/pages/page.js */ \"./packages/pages/page.js\");\n\n\nnew _packages_pages_page_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](document.querySelector('#app'));\n\n//# sourceURL=webpack://custom/./index.js?");

/***/ }),

/***/ "./packages/core/index.js":
/*!********************************!*\
  !*** ./packages/core/index.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Component)\n/* harmony export */ });\nclass Component {\n    $target;\n    props;\n    state;\n    $components;\n  \n    constructor($target, props) {\n      this.$target = $target;\n      this.props = props;\n      // this.$components = new Proxy({}, {\n      //   set(target, prop, value, receiver){\n      //       return true;\n      //     }\n      // });\n      this.setup();\n      this.setEvent();\n      this.render();\n      // this.renderChildComponent();\n    }\n    setup() {}\n    template() {\n      return \"\";\n    }\n    render() {\n      const asdfadsf = this.createElementFromHTML(this.template());\n  \n      this.renderTets(asdfadsf, this.$target);\n      this.renderChildComponent(asdfadsf);\n  \n      this.mounted();\n    }\n  \n    mounted() {\n      // this.$components.test = 5\n    }\n  \n    // private\n    renderChildComponent(elements) {\n      if (this.$components) {\n        Object.keys(this.$components).forEach((key) => {\n          const findComponent = elements.children.find(\n            (element) => element.type === key\n          );\n  \n          const $selector = document.querySelector(`${key}`);\n          // const props = this.createElementFromHTML(this.template());\n  \n          new this.$components[key]($selector, {\n            ...this.utilsPropsPick(findComponent.props)\n          });\n        });\n      }\n    }\n  \n    utilsPropsPick(findComponentProps) {\n      let temp = {};\n      Object.keys(findComponentProps).forEach((key) => {\n        const func = this[findComponentProps[key]];\n        if (typeof func === \"function\") {\n          // 함수\n          temp[key] = func.bind(this);\n        } else {\n          temp[key] = func;\n        }\n      });\n      return temp;\n    }\n  \n    setEvent() {}\n    setState(newState) {\n      this.state = { ...this.state, ...newState };\n      this.render();\n    }\n    addEvent(eventType, selector, callback) {\n      const children = [...this.$target.querySelectorAll(selector)];\n      this.$target.addEventListener(eventType, (event) => {\n        if (!event.target.closest(selector)) return false;\n        callback(event);\n      });\n    }\n  \n    parser(html) {\n      return html;\n    }\n  \n    // createElement 함수는 앞서 구현한 것을 사용합니다.\n    createElement(type, props, ...children) {\n      return {\n        type,\n        props: props || {},\n        children: children.length ? children : null\n      };\n    }\n  \n    createElementFromHTML(html) {\n      let enter = html.replace(/\\n/g, \"\");\n  \n      const parser = new DOMParser();\n      const doc = parser.parseFromString(enter, \"text/html\");\n  \n      function traverse(element) {\n        const type = element.tagName.toLowerCase();\n        const props = {};\n        const children = [];\n  \n        for (const { name, value } of element.attributes) {\n          const result = name.replace(/-([a-z])/g, (_, match) =>\n            match.toUpperCase()\n          );\n          props[result] = value;\n        }\n  \n        for (const childNode of element.childNodes) {\n          if (childNode.nodeType === Node.TEXT_NODE) {\n            children.push(childNode.textContent.trim());\n          } else if (childNode.nodeType === Node.ELEMENT_NODE) {\n            children.push(traverse.call(this, childNode));\n          }\n        }\n        return this.createElement(type, props, ...children);\n      }\n      return traverse.call(this, doc.body.firstChild);\n    }\n  \n    renderTets(element, container) {\n      // 문자열 이면 바로 화면에 뿌려줌\n      if (typeof element.children === \"string\") {\n        const createCurrentElement = document.createElement(element.type);\n  \n        const childStr = document.createTextNode(element.children);\n        createCurrentElement.appendChild(childStr);\n        container.appendChild(createCurrentElement);\n        return;\n      }\n  \n      const { type, props, children } = element;\n      // element 추가 로직\n      const el = document.createElement(type);\n  \n      for (let key in props) {\n        if (key.startsWith(\"on\")) {\n          if (this.$target) {\n          }\n          // onClick=\"methode\"\n          // onClick=\"this.props.methode\"\n  \n          const convertPropsStr = props[key].replace(\n            /this\\.props\\['(.*?)'\\]/,\n            \"$1\"\n          );\n          // debugger\n          const componentFunction = this[props[key]] || this.props[convertPropsStr]\n          console.log(el, 'elelel', this, 'thisthis')\n          el.addEventListener(\n            key.substring(2).toLowerCase(),\n            componentFunction.bind(this)\n          );\n        } else if (\n          key === \"classname\" ||\n          key === \"id\" ||\n          key === \"type\" ||\n          key === \"placeholder\"\n        ) {\n          el.setAttribute(key, props[key]);\n        } else if (key) {\n          // props 를 어떻게 처리할까 고민되네\n          el.setAttribute(key, props[key]);\n        }\n      }\n  \n      if (children) {\n        children.forEach((child) => {\n          if (typeof child === \"string\") {\n            el.appendChild(document.createTextNode(child));\n          } else if (this.$components) {\n            if (Object.keys(this.$components).includes(child.type)) {\n              // Component 생성을 위한 태그\n              // debugger\n              const el = document.createElement(child.type);\n  \n              container.appendChild(el);\n            }\n          } else {\n            // component 는 여기서 뿌려주는게 아니야\n            this.renderTets(child, el);\n          }\n        });\n      }\n      // debugger\n      container.appendChild(el);\n    }\n  }\n  \n\n//# sourceURL=webpack://custom/./packages/core/index.js?");

/***/ }),

/***/ "./packages/pages/page.js":
/*!********************************!*\
  !*** ./packages/pages/page.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var _core_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/index.js */ \"./packages/core/index.js\");\n\n\nclass App extends _core_index_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  setup() {\n    this.$components = {\n      // \"item-appender\": ItemAppender,\n      // \"item-filter\": ItemFilter,\n      // \"items-component\": Items\n    };\n\n    this.state = {\n      isFilter: 0,\n      items: [\n        {\n          seq: 1,\n          contents: \"item1\",\n          active: false\n        },\n        {\n          seq: 2,\n          contents: \"item2\",\n          active: true\n        }\n      ]\n    };\n  }\n\n  get filteredItems() {\n    console.log(\"hi\");\n    const { isFilter, items } = this.state;\n    return items.filter(\n      ({ active }) =>\n        (isFilter === 1 && active) ||\n        (isFilter === 2 && !active) ||\n        isFilter === 0\n    );\n  }\n\n  addItem(contents) {\n    console.log(\"pass\");\n    const { items } = this.state;\n    const seq = Math.max(0, ...items.map((v) => v.seq)) + 1;\n    const active = false;\n    this.setState({\n      items: [...items, { seq, contents, active }]\n    });\n  }\n\n  deleteItem() {\n    console.log(\"hi\");\n  }\n\n  toggleItem(seq) {\n    console.log(seq, \"asdfasdfasdfasdfadsf\");\n    const items = [...this.state.items];\n    const index = items.findIndex((v) => v.seq === seq);\n    items[index].active = !items[index].active;\n    this.setState({ items });\n  }\n\n  filterItem(isFilter) {\n    console.log(\"hi\");\n    // this.setState({ isFilter });\n  }\n\n  testFunction() {\n    console.log(\"ss\");\n  }\n\n  testInput(e) {\n    console.log(e.target.value);\n  }\n\n  template() {\n    return `\n      <div>\n        <div>안녕하세요</div>\n      </div>\n        `;\n  }\n}\n\n\n//# sourceURL=webpack://custom/./packages/pages/page.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;