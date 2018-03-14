(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('path-parser')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'path-parser'], factory) :
	(factory((global.routletReact = {}),global.React,global.Path));
}(this, (function (exports,React,Path) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;
Path = Path && Path.hasOwnProperty('default') ? Path['default'] : Path;

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

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

var PathLookup = function (_React$Component) {
  inherits(PathLookup, _React$Component);

  function PathLookup() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, PathLookup);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = PathLookup.__proto__ || Object.getPrototypeOf(PathLookup)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      params: null,
      path: location.hash ? transformHash(location.hash) : "/",
      current: null
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  createClass(PathLookup, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      gotoDefault();
      this.hashChange(this.state.path);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      window.addEventListener("hashchange", function (_ref2) {
        var newURL = _ref2.newURL;
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
    value: function render() {
      return this.props.shouldRender(this.state.path) ? this.props.children : null;
    }
  }]);
  return PathLookup;
}(React.Component);

var RouterOutlet = function (_PathLookup) {
  inherits(RouterOutlet, _PathLookup);

  function RouterOutlet() {
    classCallCheck(this, RouterOutlet);
    return possibleConstructorReturn(this, (RouterOutlet.__proto__ || Object.getPrototypeOf(RouterOutlet)).apply(this, arguments));
  }

  createClass(RouterOutlet, [{
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
    value: function render() {
      var result = this.state.current ? React.createElement(this.state.current, { params: this.state.params, path: this.state.path }) : this.props.children;

      if (this.props.shouldRedirect && this.props.shouldRedirect(this.state.path) && this.state.current) {
        navigate(this.props.redirect);
        return null;
      }

      return result;
    }
  }]);
  return RouterOutlet;
}(PathLookup);

var Link = function Link(_ref3) {
  var href = _ref3.href,
      children = _ref3.children,
      props = objectWithoutProperties(_ref3, ["href", "children"]);
  return React.createElement("a", _extends({ href: "#" + href }, props), children);
};

exports.routePool = routePool;
exports.renderOnRoute = renderOnRoute;
exports.navigate = navigate;
exports.PathLookup = PathLookup;
exports.RouterOutlet = RouterOutlet;
exports.Link = Link;

Object.defineProperty(exports, '__esModule', { value: true });

})));
