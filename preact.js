(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('preact'), require('path-parser')) :
	typeof define === 'function' && define.amd ? define(['exports', 'preact', 'path-parser'], factory) :
	(factory((global.routletPreact = {}),global.preact,global.Path));
}(this, (function (exports,preact,Path) { 'use strict';

Path = Path && Path.hasOwnProperty('default') ? Path['default'] : Path;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var routePool = [];

var FIRST_COMPONENT_HAS_MOUNTED = false;
var gotoDefault = function gotoDefault(_) {
  if (!FIRST_COMPONENT_HAS_MOUNTED) {
    if (!location.hash) setTimeout(navigate, 1, "/");
    FIRST_COMPONENT_HAS_MOUNTED = true;
  }
};

var transformHash = function transformHash(rawHash) {
  return rawHash.split("#").pop();
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

var PathLookup = function (_Component) {
  _inherits(PathLookup, _Component);

  function PathLookup() {
    _classCallCheck(this, PathLookup);

    return _possibleConstructorReturn(this, (PathLookup.__proto__ || Object.getPrototypeOf(PathLookup)).apply(this, arguments));
  }

  _createClass(PathLookup, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      gotoDefault();
      var path = location.hash ? transformHash(location.hash) : "/";
      this.setState({
        params: null,
        path: path,
        current: null
      });
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
      this.setState({ path: selectedRoute });
    }
  }, {
    key: "render",
    value: function render(_ref2, _ref3) {
      var shouldRender = _ref2.shouldRender,
          children = _ref2.children;
      var path = _ref3.path;

      return shouldRender(path) ? children[0] : null;
    }
  }]);

  return PathLookup;
}(preact.Component);

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
        return !!matcher.parser.test(selectedRoute);
      });
      this.setState({
        "params": selectedMatcher ? selectedMatcher.parser.test(selectedRoute) : null,
        "path": selectedRoute,
        "current": selectedMatcher ? selectedMatcher.comp : null
      });
    }
  }, {
    key: "render",
    value: function render(_ref4, _ref5) {
      var children = _ref4.children,
          _ref4$shouldRedirect = _ref4.shouldRedirect,
          shouldRedirect = _ref4$shouldRedirect === undefined ? function (_) {
        return false;
      } : _ref4$shouldRedirect,
          redirect = _ref4.redirect;
      var current = _ref5.current,
          params = _ref5.params,
          path = _ref5.path;

      var result = current ? preact.h(current, { params: params, path: path }) : children[0];

      if (shouldRedirect(path) && current) {
        navigate(redirect);
        return;
      }

      return result;
    }
  }]);

  return RouterOutlet;
}(PathLookup);

var Link = function Link(_ref6) {
  var href = _ref6.href,
      children = _ref6.children,
      props = _objectWithoutProperties(_ref6, ["href", "children"]);

  return preact.h("a", _extends({ href: "#" + href }, props), children);
};

exports.routePool = routePool;
exports.renderOnRoute = renderOnRoute;
exports.navigate = navigate;
exports.PathLookup = PathLookup;
exports.RouterOutlet = RouterOutlet;
exports.Link = Link;

Object.defineProperty(exports, '__esModule', { value: true });

})));
