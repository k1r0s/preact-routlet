(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('path-parser')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'path-parser'], factory) :
	(factory((global.routletReact = {}),global.React,global.Path));
}(this, (function (exports,React,Path) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;
Path = Path && Path.hasOwnProperty('default') ? Path['default'] : Path;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var routePool = [];

var defaultPath = { path: "/", search: "" };

var getPath = function getPath() {
  return transformHash(location.hash);
};

var setDefault = function setDefault(path) {
  return defaultPath = _extends({ path: path }, defaultPath);
};

var refresh = function refresh() {
  return window.dispatchEvent(new HashChangeEvent("hashchange"));
};

var FIRST_COMPONENT_HAS_MOUNTED = false;
var gotoDefault = function gotoDefault(_) {
  if (!FIRST_COMPONENT_HAS_MOUNTED) {
    if (!location.hash) setTimeout(navigate, 1, defaultPath);
    FIRST_COMPONENT_HAS_MOUNTED = true;
  }
};

var transformHash = function transformHash(rawHash) {
  var _rawHash$split = rawHash.split("?"),
      _rawHash$split2 = _slicedToArray(_rawHash$split, 2),
      path = _rawHash$split2[0],
      qs = _rawHash$split2[1];

  return { path: path.split("#").pop(), search: qs ? "?" + qs : '' };
};

function renderOnRoute(path) {
  return function (comp) {
    routePool.push({
      path: path,
      parser: new Path(path),
      comp: comp
    });
    return comp;
  };
}

var navigate = function navigate(newUrl) {
  return location.hash = "#" + newUrl;
};

var PathLookup = function (_React$Component) {
  _inherits(PathLookup, _React$Component);

  function PathLookup() {
    _classCallCheck(this, PathLookup);

    return _possibleConstructorReturn(this, (PathLookup.__proto__ || Object.getPrototypeOf(PathLookup)).apply(this, arguments));
  }

  _createClass(PathLookup, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      gotoDefault();
      var path = location.hash ? transformHash(location.hash) : defaultPath;
      this.setState(_extends({
        params: null
      }, path, {
        current: null
      }));
      this.hashChange(path);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      window.addEventListener("hashchange", function (_ref) {
        var newURL = _ref.newURL;
        return _this2.hashChange(transformHash(newURL || location.hash));
      });
    }
  }, {
    key: "hashChange",
    value: function hashChange(selectedRoute) {
      this.setState({ path: selectedRoute.path });
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.shouldRender(this.state.path) ? this.props.children : null;
    }
  }]);

  return PathLookup;
}(React.Component);

var RouterOutlet = function (_PathLookup) {
  _inherits(RouterOutlet, _PathLookup);

  function RouterOutlet() {
    _classCallCheck(this, RouterOutlet);

    return _possibleConstructorReturn(this, (RouterOutlet.__proto__ || Object.getPrototypeOf(RouterOutlet)).apply(this, arguments));
  }

  _createClass(RouterOutlet, [{
    key: "hashChange",
    value: function hashChange(selectedRoute) {
      var selectedMatcher = routePool.find(function (matcher) {
        return !!matcher.parser.test(selectedRoute.path);
      });
      this.setState(_extends({
        "params": selectedMatcher ? selectedMatcher.parser.test(selectedRoute.path) : null
      }, selectedRoute, {
        "current": selectedMatcher ? selectedMatcher.comp : null
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var result = this.state.current ? React.createElement(this.state.current, { params: this.state.params, path: this.state.path, search: this.state.search }) : this.props.children;

      if (this.props.shouldRedirect && this.props.shouldRedirect(this.state.path) && this.state.current) {
        navigate(this.props.redirect);
        return null;
      }

      return result;
    }
  }]);

  return RouterOutlet;
}(PathLookup);

var Link = function Link(_ref2) {
  var href = _ref2.href,
      children = _ref2.children,
      props = _objectWithoutProperties(_ref2, ["href", "children"]);

  return React.createElement("a", _extends({ href: "#" + href }, props), children);
};

exports.routePool = routePool;
exports.getPath = getPath;
exports.setDefault = setDefault;
exports.refresh = refresh;
exports.renderOnRoute = renderOnRoute;
exports.navigate = navigate;
exports.PathLookup = PathLookup;
exports.RouterOutlet = RouterOutlet;
exports.Link = Link;

Object.defineProperty(exports, '__esModule', { value: true });

})));
