### Preact Routlet

This package contains routing functionalities for [preact](https://github.com/developit/preact) and, now from 0.3.0 `React` applications as well. Instead of using HTML5 history API it uses the oldie `/#/what-ever` hash routing (this will change in the future).

This project was created by exploring contextual ways to define routes rather than placing all the routes in a single file.

##### Usage:

Available imports:

```javascript
// if you're using React
import { renderOnRoute, navigate, RouterOutlet, PathLookup, routePool, Link } from "preact-routlet/react"
// if you're using Preact
import { renderOnRoute, navigate, RouterOutlet, PathLookup, routePool, Link } from "preact-routlet/preact"
```

Either `from "preact-routlet/preact"` or `from "preact-routlet/react"`

Place your RouterOutlet element somewhere in your JSX:
```html
<div>
  <RouterOutlet />
</div>
```

Plug `renderOnRoute` decorator on some component
```javascript
@renderOnRoute("/login")
export default class Login extends Component<any, any> {
  ...
}
```

Remember to import your class to evaluate your component
```javascript
import './components/login';
```
You dont need to instantiate it or declare it. Just import on your app index.

Best practice is to group your components by domain:

For example imagine the following `index` file:

```javascript
import { h, render } from "preact";
import Main from "./common/main";

/* domain */
import "./domain/access";
import "./domain/dashboard";

render(<Main />, document.querySelector("#root"));
```

Then you have some king of folder structure like this:

```
src/domain/
├── access
│   ├── index.tsx
│   ├── models
│   ├── pages
│   └── share
└── dashboard
    └── index.tsx
```
on each index you're imporing your components:

```
$ cat src/domain/access/index.tsx
import "./pages/login-page";
import "./pages/register-page";
import "./pages/forgot-password-page";
```

So basically you're registering all the components that listen to route changes in your app.

##### Features:

- 404 routes:
  If none of components are listening for some particular route
  ```html
    <div>
      <RouterOutlet>
        <ThisComponentWillBeRenderedOtherwise />
      </RouterOutlet>
    </div>
  ```
- Conditional rendering on route (declarative)
  ```html
    <PathLookup shouldRender={path => predicate}>
      <ComponentThatWillBeRenderedIfPredicateReturnsTrue />
    </PathLookup>
  ```

- Navigation (code)
  ```javascript
    ...
    navigate("/somewhere");
  ```
- Navigation (declarative)
  ```html
    <Link href="/somewhere">Go to somewhere</Link>
  ```
- Redirect if some condition was not fulfilled
```html
    <RouterOutlet redirect="/login" shouldRedirect={path => requireLogin(path) && !AuthService.isLogged()} />
```
