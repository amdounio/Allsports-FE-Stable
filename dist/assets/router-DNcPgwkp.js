import{r as s,R as ce}from"./react-vendor-Bkz_NVCf.js";/**
 * @remix-run/router v1.21.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function B(){return B=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},B.apply(this,arguments)}var P;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(P||(P={}));const z="popstate";function fe(e){e===void 0&&(e={});function t(r,a){let{pathname:l,search:i,hash:u}=r.location;return W("",{pathname:l,search:i,hash:u},a.state&&a.state.usr||null,a.state&&a.state.key||"default")}function n(r,a){return typeof a=="string"?a:T(a)}return de(t,n,null,e)}function v(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function ee(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function he(){return Math.random().toString(36).substr(2,8)}function A(e,t){return{usr:e.state,key:e.key,idx:t}}function W(e,t,n,r){return n===void 0&&(n=null),B({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?L(t):t,{state:n,key:t&&t.key||r||he()})}function T(e){let{pathname:t="/",search:n="",hash:r=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),r&&r!=="#"&&(t+=r.charAt(0)==="#"?r:"#"+r),t}function L(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let r=e.indexOf("?");r>=0&&(t.search=e.substr(r),e=e.substr(0,r)),e&&(t.pathname=e)}return t}function de(e,t,n,r){r===void 0&&(r={});let{window:a=document.defaultView,v5Compat:l=!1}=r,i=a.history,u=P.Pop,o=null,f=h();f==null&&(f=0,i.replaceState(B({},i.state,{idx:f}),""));function h(){return(i.state||{idx:null}).idx}function c(){u=P.Pop;let d=h(),x=d==null?null:d-f;f=d,o&&o({action:u,location:m.location,delta:x})}function p(d,x){u=P.Push;let E=W(m.location,d,x);f=h()+1;let C=A(E,f),R=m.createHref(E);try{i.pushState(C,"",R)}catch(U){if(U instanceof DOMException&&U.name==="DataCloneError")throw U;a.location.assign(R)}l&&o&&o({action:u,location:m.location,delta:1})}function y(d,x){u=P.Replace;let E=W(m.location,d,x);f=h();let C=A(E,f),R=m.createHref(E);i.replaceState(C,"",R),l&&o&&o({action:u,location:m.location,delta:0})}function g(d){let x=a.location.origin!=="null"?a.location.origin:a.location.href,E=typeof d=="string"?d:T(d);return E=E.replace(/ $/,"%20"),v(x,"No window.location.(origin|href) available to create URL for href: "+E),new URL(E,x)}let m={get action(){return u},get location(){return e(a,i)},listen(d){if(o)throw new Error("A history only accepts one active listener");return a.addEventListener(z,c),o=d,()=>{a.removeEventListener(z,c),o=null}},createHref(d){return t(a,d)},createURL:g,encodeLocation(d){let x=g(d);return{pathname:x.pathname,search:x.search,hash:x.hash}},push:p,replace:y,go(d){return i.go(d)}};return m}var K;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(K||(K={}));function pe(e,t,n){return n===void 0&&(n="/"),me(e,t,n,!1)}function me(e,t,n,r){let a=typeof t=="string"?L(t):t,l=M(a.pathname||"/",n);if(l==null)return null;let i=te(e);ve(i);let u=null;for(let o=0;u==null&&o<i.length;++o){let f=Ue(l);u=be(i[o],f,r)}return u}function te(e,t,n,r){t===void 0&&(t=[]),n===void 0&&(n=[]),r===void 0&&(r="");let a=(l,i,u)=>{let o={relativePath:u===void 0?l.path||"":u,caseSensitive:l.caseSensitive===!0,childrenIndex:i,route:l};o.relativePath.startsWith("/")&&(v(o.relativePath.startsWith(r),'Absolute route path "'+o.relativePath+'" nested under path '+('"'+r+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),o.relativePath=o.relativePath.slice(r.length));let f=b([r,o.relativePath]),h=n.concat(o);l.children&&l.children.length>0&&(v(l.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+f+'".')),te(l.children,t,h,f)),!(l.path==null&&!l.index)&&t.push({path:f,score:we(f,l.index),routesMeta:h})};return e.forEach((l,i)=>{var u;if(l.path===""||!((u=l.path)!=null&&u.includes("?")))a(l,i);else for(let o of ne(l.path))a(l,i,o)}),t}function ne(e){let t=e.split("/");if(t.length===0)return[];let[n,...r]=t,a=n.endsWith("?"),l=n.replace(/\?$/,"");if(r.length===0)return a?[l,""]:[l];let i=ne(r.join("/")),u=[];return u.push(...i.map(o=>o===""?l:[l,o].join("/"))),a&&u.push(...i),u.map(o=>e.startsWith("/")&&o===""?"/":o)}function ve(e){e.sort((t,n)=>t.score!==n.score?n.score-t.score:Pe(t.routesMeta.map(r=>r.childrenIndex),n.routesMeta.map(r=>r.childrenIndex)))}const ge=/^:[\w-]+$/,ye=3,xe=2,Ce=1,Ee=10,Re=-2,q=e=>e==="*";function we(e,t){let n=e.split("/"),r=n.length;return n.some(q)&&(r+=Re),t&&(r+=xe),n.filter(a=>!q(a)).reduce((a,l)=>a+(ge.test(l)?ye:l===""?Ce:Ee),r)}function Pe(e,t){return e.length===t.length&&e.slice(0,-1).every((r,a)=>r===t[a])?e[e.length-1]-t[t.length-1]:0}function be(e,t,n){let{routesMeta:r}=e,a={},l="/",i=[];for(let u=0;u<r.length;++u){let o=r[u],f=u===r.length-1,h=l==="/"?t:t.slice(l.length)||"/",c=G({path:o.relativePath,caseSensitive:o.caseSensitive,end:f},h),p=o.route;if(!c&&f&&n&&!r[r.length-1].route.index&&(c=G({path:o.relativePath,caseSensitive:o.caseSensitive,end:!1},h)),!c)return null;Object.assign(a,c.params),i.push({params:a,pathname:b([l,c.pathname]),pathnameBase:Ie(b([l,c.pathnameBase])),route:p}),c.pathnameBase!=="/"&&(l=b([l,c.pathnameBase]))}return i}function G(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[n,r]=Se(e.path,e.caseSensitive,e.end),a=t.match(n);if(!a)return null;let l=a[0],i=l.replace(/(.)\/+$/,"$1"),u=a.slice(1);return{params:r.reduce((f,h,c)=>{let{paramName:p,isOptional:y}=h;if(p==="*"){let m=u[c]||"";i=l.slice(0,l.length-m.length).replace(/(.)\/+$/,"$1")}const g=u[c];return y&&!g?f[p]=void 0:f[p]=(g||"").replace(/%2F/g,"/"),f},{}),pathname:l,pathnameBase:i,pattern:e}}function Se(e,t,n){t===void 0&&(t=!1),n===void 0&&(n=!0),ee(e==="*"||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were '+('"'+e.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+e.replace(/\*$/,"/*")+'".'));let r=[],a="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(i,u,o)=>(r.push({paramName:u,isOptional:o!=null}),o?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(r.push({paramName:"*"}),a+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?a+="\\/*$":e!==""&&e!=="/"&&(a+="(?:(?=\\/|$))"),[new RegExp(a,t?void 0:"i"),r]}function Ue(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return ee(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+t+").")),e}}function M(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,r=e.charAt(n);return r&&r!=="/"?null:e.slice(n)||"/"}function Le(e,t){t===void 0&&(t="/");let{pathname:n,search:r="",hash:a=""}=typeof e=="string"?L(e):e;return{pathname:n?n.startsWith("/")?n:Oe(n,t):t,search:Ne(r),hash:Te(a)}}function Oe(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(a=>{a===".."?n.length>1&&n.pop():a!=="."&&n.push(a)}),n.length>1?n.join("/"):"/"}function k(e,t,n,r){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(r)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function Be(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function V(e,t){let n=Be(e);return t?n.map((r,a)=>a===n.length-1?r.pathname:r.pathnameBase):n.map(r=>r.pathnameBase)}function D(e,t,n,r){r===void 0&&(r=!1);let a;typeof e=="string"?a=L(e):(a=B({},e),v(!a.pathname||!a.pathname.includes("?"),k("?","pathname","search",a)),v(!a.pathname||!a.pathname.includes("#"),k("#","pathname","hash",a)),v(!a.search||!a.search.includes("#"),k("#","search","hash",a)));let l=e===""||a.pathname==="",i=l?"/":a.pathname,u;if(i==null)u=n;else{let c=t.length-1;if(!r&&i.startsWith("..")){let p=i.split("/");for(;p[0]==="..";)p.shift(),c-=1;a.pathname=p.join("/")}u=c>=0?t[c]:"/"}let o=Le(a,u),f=i&&i!=="/"&&i.endsWith("/"),h=(l||i===".")&&n.endsWith("/");return!o.pathname.endsWith("/")&&(f||h)&&(o.pathname+="/"),o}const b=e=>e.join("/").replace(/\/\/+/g,"/"),Ie=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),Ne=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,Te=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function _e(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}const re=["post","put","patch","delete"];new Set(re);const je=["get",...re];new Set(je);/**
 * React Router v6.28.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function I(){return I=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},I.apply(this,arguments)}const J=s.createContext(null),ke=s.createContext(null),S=s.createContext(null),j=s.createContext(null),w=s.createContext({outlet:null,matches:[],isDataRoute:!1}),ae=s.createContext(null);function We(e,t){let{relative:n}=t===void 0?{}:t;O()||v(!1);let{basename:r,navigator:a}=s.useContext(S),{hash:l,pathname:i,search:u}=oe(e,{relative:n}),o=i;return r!=="/"&&(o=i==="/"?r:b([r,i])),a.createHref({pathname:o,search:u,hash:l})}function O(){return s.useContext(j)!=null}function N(){return O()||v(!1),s.useContext(j).location}function le(e){s.useContext(S).static||s.useLayoutEffect(e)}function ie(){let{isDataRoute:e}=s.useContext(w);return e?Ye():$e()}function $e(){O()||v(!1);let e=s.useContext(J),{basename:t,future:n,navigator:r}=s.useContext(S),{matches:a}=s.useContext(w),{pathname:l}=N(),i=JSON.stringify(V(a,n.v7_relativeSplatPath)),u=s.useRef(!1);return le(()=>{u.current=!0}),s.useCallback(function(f,h){if(h===void 0&&(h={}),!u.current)return;if(typeof f=="number"){r.go(f);return}let c=D(f,JSON.parse(i),l,h.relative==="path");e==null&&t!=="/"&&(c.pathname=c.pathname==="/"?t:b([t,c.pathname])),(h.replace?r.replace:r.push)(c,h.state,h)},[t,r,i,l,e])}function ft(){let{matches:e}=s.useContext(w),t=e[e.length-1];return t?t.params:{}}function oe(e,t){let{relative:n}=t===void 0?{}:t,{future:r}=s.useContext(S),{matches:a}=s.useContext(w),{pathname:l}=N(),i=JSON.stringify(V(a,r.v7_relativeSplatPath));return s.useMemo(()=>D(e,JSON.parse(i),l,n==="path"),[e,i,l,n])}function Fe(e,t){return Me(e,t)}function Me(e,t,n,r){O()||v(!1);let{navigator:a}=s.useContext(S),{matches:l}=s.useContext(w),i=l[l.length-1],u=i?i.params:{};i&&i.pathname;let o=i?i.pathnameBase:"/";i&&i.route;let f=N(),h;if(t){var c;let d=typeof t=="string"?L(t):t;o==="/"||(c=d.pathname)!=null&&c.startsWith(o)||v(!1),h=d}else h=f;let p=h.pathname||"/",y=p;if(o!=="/"){let d=o.replace(/^\//,"").split("/");y="/"+p.replace(/^\//,"").split("/").slice(d.length).join("/")}let g=pe(e,{pathname:y}),m=Ae(g&&g.map(d=>Object.assign({},d,{params:Object.assign({},u,d.params),pathname:b([o,a.encodeLocation?a.encodeLocation(d.pathname).pathname:d.pathname]),pathnameBase:d.pathnameBase==="/"?o:b([o,a.encodeLocation?a.encodeLocation(d.pathnameBase).pathname:d.pathnameBase])})),l,n,r);return t&&m?s.createElement(j.Provider,{value:{location:I({pathname:"/",search:"",hash:"",state:null,key:"default"},h),navigationType:P.Pop}},m):m}function Ve(){let e=Xe(),t=_e(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,a={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return s.createElement(s.Fragment,null,s.createElement("h2",null,"Unexpected Application Error!"),s.createElement("h3",{style:{fontStyle:"italic"}},t),n?s.createElement("pre",{style:a},n):null,null)}const De=s.createElement(Ve,null);class Je extends s.Component{constructor(t){super(t),this.state={location:t.location,revalidation:t.revalidation,error:t.error}}static getDerivedStateFromError(t){return{error:t}}static getDerivedStateFromProps(t,n){return n.location!==t.location||n.revalidation!=="idle"&&t.revalidation==="idle"?{error:t.error,location:t.location,revalidation:t.revalidation}:{error:t.error!==void 0?t.error:n.error,location:n.location,revalidation:t.revalidation||n.revalidation}}componentDidCatch(t,n){console.error("React Router caught the following error during render",t,n)}render(){return this.state.error!==void 0?s.createElement(w.Provider,{value:this.props.routeContext},s.createElement(ae.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function ze(e){let{routeContext:t,match:n,children:r}=e,a=s.useContext(J);return a&&a.static&&a.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(a.staticContext._deepestRenderedBoundaryId=n.route.id),s.createElement(w.Provider,{value:t},r)}function Ae(e,t,n,r){var a;if(t===void 0&&(t=[]),n===void 0&&(n=null),r===void 0&&(r=null),e==null){var l;if(!n)return null;if(n.errors)e=n.matches;else if((l=r)!=null&&l.v7_partialHydration&&t.length===0&&!n.initialized&&n.matches.length>0)e=n.matches;else return null}let i=e,u=(a=n)==null?void 0:a.errors;if(u!=null){let h=i.findIndex(c=>c.route.id&&(u==null?void 0:u[c.route.id])!==void 0);h>=0||v(!1),i=i.slice(0,Math.min(i.length,h+1))}let o=!1,f=-1;if(n&&r&&r.v7_partialHydration)for(let h=0;h<i.length;h++){let c=i[h];if((c.route.HydrateFallback||c.route.hydrateFallbackElement)&&(f=h),c.route.id){let{loaderData:p,errors:y}=n,g=c.route.loader&&p[c.route.id]===void 0&&(!y||y[c.route.id]===void 0);if(c.route.lazy||g){o=!0,f>=0?i=i.slice(0,f+1):i=[i[0]];break}}}return i.reduceRight((h,c,p)=>{let y,g=!1,m=null,d=null;n&&(y=u&&c.route.id?u[c.route.id]:void 0,m=c.route.errorElement||De,o&&(f<0&&p===0?(g=!0,d=null):f===p&&(g=!0,d=c.route.hydrateFallbackElement||null)));let x=t.concat(i.slice(0,p+1)),E=()=>{let C;return y?C=m:g?C=d:c.route.Component?C=s.createElement(c.route.Component,null):c.route.element?C=c.route.element:C=h,s.createElement(ze,{match:c,routeContext:{outlet:h,matches:x,isDataRoute:n!=null},children:C})};return n&&(c.route.ErrorBoundary||c.route.errorElement||p===0)?s.createElement(Je,{location:n.location,revalidation:n.revalidation,component:m,error:y,children:E(),routeContext:{outlet:null,matches:x,isDataRoute:!0}}):E()},null)}var se=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(se||{}),_=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(_||{});function Ke(e){let t=s.useContext(J);return t||v(!1),t}function qe(e){let t=s.useContext(ke);return t||v(!1),t}function Ge(e){let t=s.useContext(w);return t||v(!1),t}function ue(e){let t=Ge(),n=t.matches[t.matches.length-1];return n.route.id||v(!1),n.route.id}function Xe(){var e;let t=s.useContext(ae),n=qe(_.UseRouteError),r=ue(_.UseRouteError);return t!==void 0?t:(e=n.errors)==null?void 0:e[r]}function Ye(){let{router:e}=Ke(se.UseNavigateStable),t=ue(_.UseNavigateStable),n=s.useRef(!1);return le(()=>{n.current=!0}),s.useCallback(function(a,l){l===void 0&&(l={}),n.current&&(typeof a=="number"?e.navigate(a):e.navigate(a,I({fromRouteId:t},l)))},[e,t])}const X={};function He(e,t){X[t]||(X[t]=!0,console.warn(t))}const Y=(e,t,n)=>He(e,"⚠️ React Router Future Flag Warning: "+t+". "+("You can use the `"+e+"` future flag to opt-in early. ")+("For more information, see "+n+"."));function Qe(e,t){e!=null&&e.v7_startTransition||Y("v7_startTransition","React Router will begin wrapping state updates in `React.startTransition` in v7","https://reactrouter.com/v6/upgrading/future#v7_starttransition"),!(e!=null&&e.v7_relativeSplatPath)&&!t&&Y("v7_relativeSplatPath","Relative route resolution within Splat routes is changing in v7","https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath")}function ht(e){let{to:t,replace:n,state:r,relative:a}=e;O()||v(!1);let{future:l,static:i}=s.useContext(S),{matches:u}=s.useContext(w),{pathname:o}=N(),f=ie(),h=D(t,V(u,l.v7_relativeSplatPath),o,a==="path"),c=JSON.stringify(h);return s.useEffect(()=>f(JSON.parse(c),{replace:n,state:r,relative:a}),[f,c,a,n,r]),null}function Ze(e){v(!1)}function et(e){let{basename:t="/",children:n=null,location:r,navigationType:a=P.Pop,navigator:l,static:i=!1,future:u}=e;O()&&v(!1);let o=t.replace(/^\/*/,"/"),f=s.useMemo(()=>({basename:o,navigator:l,static:i,future:I({v7_relativeSplatPath:!1},u)}),[o,u,l,i]);typeof r=="string"&&(r=L(r));let{pathname:h="/",search:c="",hash:p="",state:y=null,key:g="default"}=r,m=s.useMemo(()=>{let d=M(h,o);return d==null?null:{location:{pathname:d,search:c,hash:p,state:y,key:g},navigationType:a}},[o,h,c,p,y,g,a]);return m==null?null:s.createElement(S.Provider,{value:f},s.createElement(j.Provider,{children:n,value:m}))}function dt(e){let{children:t,location:n}=e;return Fe($(t),n)}new Promise(()=>{});function $(e,t){t===void 0&&(t=[]);let n=[];return s.Children.forEach(e,(r,a)=>{if(!s.isValidElement(r))return;let l=[...t,a];if(r.type===s.Fragment){n.push.apply(n,$(r.props.children,l));return}r.type!==Ze&&v(!1),!r.props.index||!r.props.children||v(!1);let i={id:r.props.id||l.join("-"),caseSensitive:r.props.caseSensitive,element:r.props.element,Component:r.props.Component,index:r.props.index,path:r.props.path,loader:r.props.loader,action:r.props.action,errorElement:r.props.errorElement,ErrorBoundary:r.props.ErrorBoundary,hasErrorBoundary:r.props.ErrorBoundary!=null||r.props.errorElement!=null,shouldRevalidate:r.props.shouldRevalidate,handle:r.props.handle,lazy:r.props.lazy};r.props.children&&(i.children=$(r.props.children,l)),n.push(i)}),n}/**
 * React Router DOM v6.28.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function F(){return F=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},F.apply(this,arguments)}function tt(e,t){if(e==null)return{};var n={},r=Object.keys(e),a,l;for(l=0;l<r.length;l++)a=r[l],!(t.indexOf(a)>=0)&&(n[a]=e[a]);return n}function nt(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function rt(e,t){return e.button===0&&(!t||t==="_self")&&!nt(e)}const at=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],lt="6";try{window.__reactRouterVersion=lt}catch{}const it="startTransition",H=ce[it];function pt(e){let{basename:t,children:n,future:r,window:a}=e,l=s.useRef();l.current==null&&(l.current=fe({window:a,v5Compat:!0}));let i=l.current,[u,o]=s.useState({action:i.action,location:i.location}),{v7_startTransition:f}=r||{},h=s.useCallback(c=>{f&&H?H(()=>o(c)):o(c)},[o,f]);return s.useLayoutEffect(()=>i.listen(h),[i,h]),s.useEffect(()=>Qe(r),[r]),s.createElement(et,{basename:t,children:n,location:u.location,navigationType:u.action,navigator:i,future:r})}const ot=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",st=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,mt=s.forwardRef(function(t,n){let{onClick:r,relative:a,reloadDocument:l,replace:i,state:u,target:o,to:f,preventScrollReset:h,viewTransition:c}=t,p=tt(t,at),{basename:y}=s.useContext(S),g,m=!1;if(typeof f=="string"&&st.test(f)&&(g=f,ot))try{let C=new URL(window.location.href),R=f.startsWith("//")?new URL(C.protocol+f):new URL(f),U=M(R.pathname,y);R.origin===C.origin&&U!=null?f=U+R.search+R.hash:m=!0}catch{}let d=We(f,{relative:a}),x=ut(f,{replace:i,state:u,target:o,preventScrollReset:h,relative:a,viewTransition:c});function E(C){r&&r(C),C.defaultPrevented||x(C)}return s.createElement("a",F({},p,{href:g||d,onClick:m||l?r:E,ref:n,target:o}))});var Q;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(Q||(Q={}));var Z;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(Z||(Z={}));function ut(e,t){let{target:n,replace:r,state:a,preventScrollReset:l,relative:i,viewTransition:u}=t===void 0?{}:t,o=ie(),f=N(),h=oe(e,{relative:i});return s.useCallback(c=>{if(rt(c,n)){c.preventDefault();let p=r!==void 0?r:T(f)===T(h);o(e,{replace:p,state:a,preventScrollReset:l,relative:i,viewTransition:u})}},[f,o,h,r,a,n,e,l,i,u])}export{pt as B,mt as L,ht as N,dt as R,ie as a,ft as b,Ze as c,N as u};
//# sourceMappingURL=router-DNcPgwkp.js.map
