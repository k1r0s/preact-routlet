import React from "react";
import Path from 'path-parser';

export const routePool = [];

let FIRST_COMPONENT_HAS_MOUNTED = false;
const gotoDefault = _ => {
  if(!FIRST_COMPONENT_HAS_MOUNTED) {
    if(!location.hash) setTimeout(navigate, 1, "/");
    FIRST_COMPONENT_HAS_MOUNTED = true;
  }
}

const transformHash = rawHash => rawHash.split("#").pop();

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
    const path = location.hash ? transformHash(location.hash): "/";
    this.setState({
      params: null,
      path,
      current: null
    })
    this.hashChange(path);
  }

  componentDidMount() {
    window.addEventListener("hashchange", ({ newURL }) =>
      this.hashChange(transformHash(newURL || location.hash)));
  }

  hashChange(selectedRoute) {
    this.setState({ path: selectedRoute });
  }

  render() {
    return this.props.shouldRender(this.state.path) ? this.props.children: null;
  }
}

export class RouterOutlet extends PathLookup {

  hashChange(selectedRoute) {
    const selectedMatcher = routePool.find(matcher => !!matcher.parser.test(selectedRoute));
    this.setState({
      "params": selectedMatcher ? selectedMatcher.parser.test(selectedRoute): null,
      "path": selectedRoute,
      "current": selectedMatcher ? selectedMatcher.comp: null
    });
  }

  render() {
    const result = this.state.current ? React.createElement(this.state.current, { params: this.state.params, path: this.state.path }): this.props.children;

    if(this.props.shouldRedirect && this.props.shouldRedirect(this.state.path) && this.state.current) {
      navigate(this.props.redirect);
      return null;
    }

    return result;
  }
}

export const Link = ({ href, children, ...props }) =>
  React.createElement("a", { href: `#${href}`, ...props }, children);
