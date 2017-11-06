import { h, Component } from "preact";
import Path from 'path-parser';

const ROUTE_LISTENER_POOL = [];
let FIRST_COMPONENT_HAS_MOUNTED = false;
const gotoDefault = _ => {
  if(!FIRST_COMPONENT_HAS_MOUNTED) {
    setTimeout(navigate, 1, "/");
    FIRST_COMPONENT_HAS_MOUNTED = true;
  }
}

export function renderOnRoute(path) {
  return function(fun) {
    ROUTE_LISTENER_POOL.push({
      parser: new Path(path),
      comp: fun
    });
    return fun;
  }
}

export const navigate = newUrl => location.hash = "#" + newUrl;

export class PathLookup extends Component {

  componentWillMount() {
    this.setState({ path: "/" });
  }

  componentDidMount() {
    window.addEventListener("hashchange", ({ newURL }) =>
      this.hashChange(newURL.split("#").pop()));
    gotoDefault();
  }

  hashChange(selectedRoute) {
    this.setState({ path: selectedRoute });
  }

  render({ shouldRender, children }, { path }) {
    return shouldRender(path) ? children[0]: null;
  }
}

export class RouterOutlet extends PathLookup {

  componentWillMount() {
    this.setState({
      params: null,
      path: "/",
      current: null
    });
	}

  hashChange(selectedRoute) {
    const selectedMatcher = ROUTE_LISTENER_POOL.find(matcher => !!matcher.parser.test(selectedRoute));
    this.setState({
      "params": selectedMatcher ? selectedMatcher.parser.test(selectedRoute): null,
      "path": selectedRoute,
      "current": selectedMatcher ? selectedMatcher.comp: null
    });
  }

  render({ children, shouldRedirect = _ => false, redirect }, { current, params, path }) {
    const result = current ? h(current, { params, path }): children[0];

    if(shouldRedirect(path) && current) {
      navigate(redirect);
      return;
    }

    return result;
  }
}

export const Link = props => {
  props["href"] = "#" + props.href;
  return h("a", props, props.children);
};
