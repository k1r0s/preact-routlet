import React from "react";
import Path from 'path-parser';

export const routePool = [];

let defaultPath = {path: "/", search: ""};

export const getPath = () => transformHash(location.hash);

export const setDefault = path => defaultPath = {path : path, ...defaultPath};

export const refresh = () => window.dispatchEvent(new HashChangeEvent("hashchange"));

let FIRST_COMPONENT_HAS_MOUNTED = false;
const gotoDefault = _ => {
  if(!FIRST_COMPONENT_HAS_MOUNTED) {
    if(!location.hash) setTimeout(navigate, 1, defaultPath);
    FIRST_COMPONENT_HAS_MOUNTED = true;
  }
}

const transformHash = rawHash => {
  const [path, qs] = rawHash.split("?");
  return {path: path.split("#").pop(), search: qs ? `?${qs}` : ''}
} 

export function renderOnRoute(path) {
  return function(comp) {
    routePool.push({
      path,
      parser: new Path(path),
      comp,
    });
    return comp;
  }
}

export const navigate = newUrl => location.hash = "#" + newUrl;

export class PathLookup extends React.Component {

  componentWillMount() {
    gotoDefault();
    const path = location.hash ? transformHash(location.hash): defaultPath;
    this.setState({
      params: null,
      ...path,
      current: null
    })
    this.hashChange(path);
  }

  componentDidMount() {
    window.addEventListener("hashchange", ({ newURL }) =>
      this.hashChange(transformHash(newURL || location.hash)));
  }

  hashChange(selectedRoute) {
    this.setState({ path: selectedRoute.path });
  }

  render() {
    return this.props.shouldRender(this.state.path) ? this.props.children: null;
  }
}

export class RouterOutlet extends PathLookup {

  hashChange(selectedRoute) {
    const selectedMatcher = routePool.find(matcher => !!matcher.parser.test(selectedRoute.path));
    this.setState({
      "params": selectedMatcher ? selectedMatcher.parser.test(selectedRoute.path): null,
      ...selectedRoute,
      "current": selectedMatcher ? selectedMatcher.comp: null
    });
  }

  render() {
    const result = this.state.current ? React.createElement(this.state.current, { params: this.state.params, path: this.state.path, search: this.state.search }): this.props.children;

    if(this.props.shouldRedirect && this.props.shouldRedirect(this.state.path) && this.state.current) {
      navigate(this.props.redirect);
      return null;
    }

    return result;
  }
}

export const Link = ({ href, children, ...props }) =>
  React.createElement("a", { href: `#${href}`, ...props }, children);
