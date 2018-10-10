module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _server = __webpack_require__(2);

	var _app = __webpack_require__(3);

	var _app2 = _interopRequireDefault(_app);

	var _template = __webpack_require__(4);

	var _template2 = _interopRequireDefault(_template);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var express = __webpack_require__(5);
	var responseTime = __webpack_require__(6);
	var axios = __webpack_require__(7);
	var redis = __webpack_require__(8);

	var PORT = process.env.port || 3000;

	var app = express();
	var client = redis.createClient();

	// Print redis errors to the console
	client.on("error", function (err) {
	  console.log("Error " + err);
	});

	// use response-time as a middleware
	app.use(responseTime());
	app.use('/assets', express.static('assets'));

	// create an api/search route
	app.get("/search", function (req, res) {
	  if (!req.query.query) {
	    var title = "";
	    var initialState = { categoriesAmount: 0, imagesAmount: 0, title: "", pageId: "" };

	    var appString = (0, _server.renderToString)(_react2.default.createElement(_app2.default, initialState));

	    return res.send((0, _template2.default)({
	      body: appString,
	      title: "Result for " + title,
	      initialState: JSON.stringify(initialState)
	    }));
	  }

	  var query = req.query.query.trim();

	  callWiki(query, function (result) {
	    var initialState = {};
	    var title = "";

	    try {
	      var categoriesAmount = result.parse.categories.length || 0;
	      var imagesAmount = result.parse.images.length || 0;
	      title = result.parse.title || "";
	      var pageId = result.parse.pageid || "";

	      initialState = { categoriesAmount: categoriesAmount, imagesAmount: imagesAmount, title: title, pageId: pageId };
	    } catch (err) {
	      initialState = { categoriesAmount: 0, imagesAmount: 0, title: "", pageId: "" };
	    }

	    // res.status(200).json({status: "success", categoriesAmount, imagesAmount, title, pageId});

	    var appString = (0, _server.renderToString)(_react2.default.createElement(_app2.default, initialState));

	    res.send((0, _template2.default)({
	      body: appString,
	      title: "Result for " + title,
	      initialState: JSON.stringify(initialState)
	    }));
	  });
	});

	app.get('/', function (req, res) {
	  return res.render('404', { url: req.url });
	});

	app.listen(PORT, function () {
	  console.log("Server listening on port: ", PORT);
	});

	function callWiki(query, callback) {
	  var searchUrl = "https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=" + query;

	  // Try fetching the result from Redis first in case we have it cached
	  return client.get("wikipedia:" + query, function (err, result) {
	    if (result) return callback(JSON.parse(result));

	    // Key does not exist in Redis store
	    // Fetch directly from Wikipedia API
	    return axios.get(searchUrl).then(function (response) {
	      var responseJSON = response.data;

	      client.setex("wikipedia:" + query, 3600, JSON.stringify(_extends({ source: "Redis Cache" }, responseJSON)));

	      return callback(_extends({ source: "Wikipedia API" }, responseJSON));
	    }).catch(function (err) {
	      return callback(err);
	    });
	  });
	}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = require("react");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = require("react-dom/server");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var App = function (_Component) {
	  _inherits(App, _Component);

	  function App(props) {
	    _classCallCheck(this, App);

	    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

	    _this.state = {
	      query: ""
	    };
	    return _this;
	  }

	  _createClass(App, [{
	    key: "_search",
	    value: function _search(event) {
	      event.preventDefault();

	      var a = "comuter";
	      window.location.href = window.location.origin + "/search?query=" + this.state.query;
	    }
	  }, {
	    key: "_onChange",
	    value: function _onChange(event) {
	      this.setState({ query: event.target.value });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _props = this.props,
	          categoriesAmount = _props.categoriesAmount,
	          imagesAmount = _props.imagesAmount,
	          title = _props.title,
	          pageId = _props.pageId;


	      var content = null;
	      if (title) {
	        content = _react2.default.createElement(
	          "div",
	          null,
	          _react2.default.createElement(
	            "h1",
	            { style: { textAlign: "center" } },
	            "This is result page for ",
	            title
	          ),
	          _react2.default.createElement(
	            "h2",
	            null,
	            "Wiki page (page id - ",
	            pageId,
	            ") contains:"
	          ),
	          _react2.default.createElement(
	            "h3",
	            null,
	            categoriesAmount,
	            " categories"
	          ),
	          _react2.default.createElement(
	            "h3",
	            null,
	            imagesAmount,
	            " images"
	          )
	        );
	      }

	      return _react2.default.createElement(
	        "div",
	        null,
	        _react2.default.createElement(
	          "form",
	          { style: { textAlign: "center" }, onSubmit: this._search.bind(this) },
	          _react2.default.createElement("input", { onChange: this._onChange.bind(this) })
	        ),
	        content
	      );
	    }
	  }]);

	  return App;
	}(_react.Component);

	exports.default = App;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (_ref) {
	  var body = _ref.body,
	      title = _ref.title,
	      initialState = _ref.initialState;

	  return "\n      <!DOCTYPE html>\n      <html>\n        <head>\n          <script>window.__APP_INITIAL_STATE__ = " + initialState + "</script>\n\n          <title>" + title + "</title>\n          <link rel=\"stylesheet\" href=\"/assets/index.css\" />\n        </head>\n        \n        <body>\n          <div id=\"root\">" + body + "</div>\n        </body>\n        \n        <script src=\"/assets/bundle.js\"></script>\n      </html>\n    ";
	};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = require("express");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	module.exports = require("response-time");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	module.exports = require("axios");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = require("redis");

/***/ })
/******/ ]);