"use strict";(self.webpackChunkhopital_availabilty_frontend=self.webpackChunkhopital_availabilty_frontend||[]).push([[105],{51580:function(e,t,r){var n=r(64836),a=r(18698);Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.NurseCards=void 0;var s=n(r(56690)),i=n(r(89728)),o=n(r(61655)),c=n(r(94993)),l=n(r(73808)),u=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!==a(e)&&"function"!=typeof e)return{default:e};var r=y(t);if(r&&r.has(e))return r.get(e);var n={},s=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if("default"!==i&&Object.prototype.hasOwnProperty.call(e,i)){var o=s?Object.getOwnPropertyDescriptor(e,i):null;o&&(o.get||o.set)?Object.defineProperty(n,i,o):n[i]=e[i]}return n.default=e,r&&r.set(e,n),n}(r(67294)),d=r(73727),f=n(r(85245)),p=r(19498),h=n(r(46703)),v=n(r(27370)),m=r(71900),x=r(85893);function y(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(y=function(e){return e?r:t})(e)}function j(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,l.default)(e);if(t){var a=(0,l.default)(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return(0,c.default)(this,r)}}var b=function(e){(0,o.default)(r,e);var t=j(r);function r(e){var n;return(0,s.default)(this,r),(n=t.call(this,e)).setState({open:!1}),n}return(0,i.default)(r,[{key:"render",value:function(){return(0,x.jsx)("div",{className:"my-1 doctor-card ",children:(0,x.jsx)(d.Link,{style:{textDecoration:"none"},to:"/nurse/".concat(this.props.model.id),children:(0,x.jsx)("div",{children:(0,x.jsxs)("div",{children:[(0,x.jsxs)("div",{children:[(0,x.jsx)("img",{className:"Doc-icon",src:this.props.model.image||f.default,alt:"",width:"80px",height:"80px"}),(0,x.jsx)("div",{className:"nunito-black-ebony-clay-16px",children:this.props.model.name}),(0,x.jsx)("div",{className:"nunito-black-lynch-12px",children:this.props.model.availability?"Available":"Unavailable"})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)("img",{src:h.default,alt:"star"})," ",this.props.model.rating||0," (",(this.props.model.reviews||[]).length," reviews)"]})]})})})})}}]),r}(u.default.Component);t.default=b;var g=function(e){(0,o.default)(r,e);var t=j(r);function r(){return(0,s.default)(this,r),t.apply(this,arguments)}return(0,i.default)(r,[{key:"render",value:function(){return(0,x.jsxs)("div",{children:[this.props.models.length?(0,x.jsxs)(d.Link,{to:"/searchnurse",className:"searchbar d-flex flex-row mb-3",children:[(0,x.jsx)("img",{alt:"Search Icon",className:"col-2 pr-0",src:v.default,width:"22px",height:"22px"}),(0,x.jsx)("div",{className:"search-for-doctors col-10 text-left pl-0",children:"Search For Doctors"})]}):null,(0,x.jsxs)(p.Container,{className:"doc-container",children:[(0,x.jsx)("div",{className:"doc-subc",children:this.props.models.map((function(e,t){return(0,x.jsx)(b,{model:e},t)}))}),(0,x.jsx)(d.Link,{to:"/addnurse",children:(0,x.jsx)(m.BigBlueButton,{text:"Add Nurse"})})]})]})}}]),r}(u.Component);t.NurseCards=g},72105:function(e,t,r){var n=r(64836);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=n(r(64687)),s=n(r(17156)),i=n(r(56690)),o=n(r(89728)),c=n(r(66115)),l=n(r(61655)),u=n(r(94993)),d=n(r(73808)),f=n(r(38416)),p=n(r(87153)),h=n(r(45095)),v=r(14795),m=n(r(87418)),x=n(r(42761)),y=n(r(61634)),j=n(r(96540)),b=r(23624),g=r(5977),O=r(41559),w=n(r(51580)),k=r(85893);function N(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function P(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?N(Object(r),!0).forEach((function(t){(0,f.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):N(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var C=(0,v.styled)("div")((function(e){return{position:"relative",backgroundColor:"rgba(107, 119, 154, 0.05);",marginRight:e.theme.spacing(2),marginLeft:0,width:"100%",borderRadius:"10px"}})),R=(0,v.styled)("div")((function(e){return{margin:"0",padding:e.theme.spacing(0,0,0,2),height:"100%",position:"absolute",pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center"}})),S=(0,v.styled)(m.default)((function(e){var t=e.theme;return{color:"inherit","& .MuiInputBase-input":(0,f.default)({padding:t.spacing(1,1,1,0),transition:t.transitions.create("width"),width:"100%"},t.breakpoints.up("md"),{width:"100%"})}})),_=function(e){(0,l.default)(m,e);var t,r,n,v=(r=m,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=(0,d.default)(r);if(n){var a=(0,d.default)(this).constructor;e=Reflect.construct(t,arguments,a)}else e=t.apply(this,arguments);return(0,u.default)(this,e)});function m(e){var t;return(0,i.default)(this,m),t=v.call(this,e),(0,f.default)((0,c.default)(t),"editSearchTerm",(function(e){t.setState({searchTerm:e},(function(){t.getNurses()}))})),t.state=P(P({},t.state),{},{searchTerm:""}),t.getNurses(),t}return(0,o.default)(m,[{key:"getNurses",value:(t=(0,s.default)(a.default.mark((function e(){var t=this;return a.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:O.Nurse.filter({search:this.state.searchTerm}).then((function(e){var r=e.next,n=e.results;t.setState({nurses:n,next:r})}));case 1:case"end":return e.stop()}}),e,this)}))),function(){return t.apply(this,arguments)})},{key:"render",value:function(){var e=this;return(0,k.jsxs)("div",{className:"mx-2 pt-4 mb-5 pb-4",children:[(0,k.jsxs)("div",{className:"d-flex justify-content-between align-items-center",children:[(0,k.jsx)(p.default,{onClick:function(){return e.props.history.goBack()}}),(0,k.jsx)("p",{className:"m-0",children:(0,k.jsx)("b",{children:"Nurses"})}),(0,k.jsx)("img",{src:h.default,alt:"filter"})]}),(0,k.jsx)("div",{className:"mt-2",children:(0,k.jsxs)(C,{children:[(0,k.jsx)(R,{children:(0,k.jsx)(x.default,{})}),(0,k.jsx)(S,{placeholder:"Search for Nurses",inputProps:{"aria-label":"search"},type:"text",value:this.state.searchTerm,onChange:function(t){return e.editSearchTerm(t.target.value)}})]})}),(0,k.jsx)("div",{className:"d-flex justify-content-around flex-wrap mt-3 px-0 p-0",children:this.state.nurses&&this.state.nurses.map((function(e,t){return(0,k.jsx)(w.default,{model:e},t)}))}),(0,k.jsx)(y.default,{onClick:function(){return e.props.history.push("/addnurse")},sx:{position:"fixed",bottom:80,right:16},color:"primary","aria-label":"add",children:(0,k.jsx)(j.default,{})})]})}}]),m}(b.AuthComponent),B=(0,g.withRouter)(_);t.default=B}}]);
//# sourceMappingURL=chunk-105.6137edfd89fad61026a5.js.map