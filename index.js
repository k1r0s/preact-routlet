import { h, Component } from "preact";
import Path from 'path-parser';

const ROUTE_LISTENER_POOL = [];
let FIRST_COMPONENT_HAS_MOUNTED = false;
const gotoDefault = _ => {
  if(!FIRST_COMPONENT_HAS_MOUNTED) {
    if(!location.hash) setTimeout(navigate, 1, "/");
    FIRST_COMPONENT_HAS_MOUNTED = true;
  }
}

const transformHash = rawHash => rawHash.split("#").pop();

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
    gotoDefault();
    this.setState({
      params: null,
      path: location.hash ? transformHash(location.hash): "/",
      current: null
    });
    this.hashChange(this.state.path);
  }

  componentDidMount() {
    window.addEventListener("hashchange", ({ newURL }) =>
      this.hashChange(transformHash(newURL)));
  }

  hashChange(selectedRoute) {
    this.setState({ path: selectedRoute });
  }

  render({ shouldRender, children }, { path }) {
    return shouldRender(path) ? children[0]: null;
  }
}

export class RouterOutlet extends PathLookup {

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

export const Link = ({ href, children, ...props }) =>
  h("a", { href: `#${href}`, ...props }, children);
