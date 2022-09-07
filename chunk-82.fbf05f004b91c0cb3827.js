"use strict";(self.webpackChunkhopital_availabilty_frontend=self.webpackChunkhopital_availabilty_frontend||[]).push([[82],{20082:function(e,t,n){var r=n(64836),a=n(18698);Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.GiveHelp=void 0;var i=r(n(64687)),s=r(n(17156)),o=r(n(56690)),l=r(n(89728)),c=r(n(66115)),u=r(n(61655)),d=r(n(94993)),f=r(n(73808)),p=r(n(38416)),h=n(41559),m=n(23624),g=n(5977);!function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!==a(e)&&"function"!=typeof e)return{default:e};var n=k(t);if(n&&n.has(e))return n.get(e);var r={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var s in e)if("default"!==s&&Object.prototype.hasOwnProperty.call(e,s)){var o=i?Object.getOwnPropertyDescriptor(e,s):null;o&&(o.get||o.set)?Object.defineProperty(r,s,o):r[s]=e[s]}r.default=e,n&&n.set(e,r)}(n(67294)),n(78549);var b=r(n(92453)),x=r(n(74589)),A=r(n(20402)),v=r(n(75646)),j=n(72132),y=n(19498),C=r(n(50594)),B=n(85893);function k(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(k=function(e){return e?n:t})(e)}function w(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function O(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?w(Object(n),!0).forEach((function(t){(0,p.default)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):w(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var F=function(e){(0,u.default)(a,e);var t,n,r=(t=a,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,r=(0,f.default)(t);if(n){var a=(0,f.default)(this).constructor;e=Reflect.construct(r,arguments,a)}else e=r.apply(this,arguments);return(0,d.default)(this,e)});function a(e){var t;return(0,o.default)(this,a),t=r.call(this,e),(0,p.default)((0,c.default)(t),"styles",[{background:"linear-gradient(180deg, #0338B9 0%, #3E64FF 100%)",color:"white",margin:0,fontSize:"16px",borderRadius:"10px"},{background:"#F0F0F0",margin:0,fontSize:"16px",borderRadius:"10px"}]),(0,p.default)((0,c.default)(t),"tab_name",["Requests","Helped by you"]),(0,p.default)((0,c.default)(t),"getgender",(function(e){return"M"===e?(0,B.jsx)("img",{src:b.default,alt:""}):"F"===e?(0,B.jsx)("img",{src:x.default,alt:""}):"NB"===e?(0,B.jsx)("img",{src:A.default,alt:""}):"NP"===e?(0,B.jsx)("img",{src:v.default,alt:""}):void 0})),(0,p.default)((0,c.default)(t),"givehelp",function(){var e=(0,s.default)(i.default.mark((function e(t){return i.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t.modify("help/");case 3:j.toast.success("Thank you for helping out",{position:"bottom-center"}),e.next=10;break;case 6:e.prev=6,e.t0=e.catch(0),console.error(e.t0),j.toast.error(e.t0.details,{position:"bottom-center"});case 10:case"end":return e.stop()}}),e,null,[[0,6]])})));return function(t){return e.apply(this,arguments)}}()),(0,p.default)((0,c.default)(t),"fields",(function(){var e;if(0===t.state.currenttab?e=t.state.models:1===t.state.currenttab&&(e=t.state.helped_models),console.log(e),e)return(0,B.jsx)(y.Container,{className:"maincont",children:e.map((function(e,n){var r,a,i;return(0,B.jsx)("div",{children:(0,B.jsx)("div",{className:"mx-1",children:(0,B.jsxs)("div",{className:"maincard ",children:[(0,B.jsx)("div",{className:"card-heading",children:(i=e.request_type,("M"===i?"Medical":"FI"===i?"Financial":"B"===i?"Blood":"O"===i?"Other":void 0)+" request")}),(0,B.jsxs)("div",{className:"d-flex flex-row justify-content-between ",children:[(0,B.jsxs)("div",{className:"lefttxt",children:[(0,B.jsxs)("h1",{className:"title m-0",children:[e.Name,t.getgender(e.gender)]}),(0,B.jsx)("div",{className:"subtitle",children:(0,B.jsxs)("div",{children:["Language:",null===(r=t.state.user)||void 0===r||null===(a=r.tokens.language)||void 0===a?void 0:a.map((function(e){return e.name})).join(", ")]})}),(0,B.jsx)("div",{className:"subtitle",children:(0,B.jsxs)("div",{children:["Description :",e.reason]})})]}),(0,B.jsx)("div",{className:" subtitle  pt-4 ",children:(0,B.jsx)(y.Button,{onClick:function(){return t.props.history.push("/help/".concat(1===t.state.currenttab?"me/":"").concat(e.id))},sx:{borderRadius:"10px",marginBottom:"1rem",textTransform:"none",paddingX:"1.25rem",paddingY:".25rem",marginTop:".5rem"},className:"helpbutn",variant:"contained",children:"View"})})]})]})})},n)}))})})),(0,p.default)((0,c.default)(t),"handleChange",(function(){t.setState({currenttab:t.state.currenttab+1})})),t.state=O(O({},t.state),{},{currenttab:0,isLoading:!0}),t}return(0,l.default)(a,[{key:"componentDidMount",value:function(){var e=this;h.Patient.action_general("all",{},!0).then((function(t){var n=t.results;e.setState({models:n})})),h.Patient.action_general("help",{},!0).then((function(t){var n=t.results;e.setState({helped_models:n})})),this.setState({isLoading:!1})}},{key:"render",value:function(){var e=this;return this.state.auth?(console.log(this.state),(0,B.jsxs)("div",{className:"mb-3 ",children:[(0,B.jsxs)(y.Container,{className:" tophead fixed-top d-flex justify-content-between p-3 ",children:[(0,B.jsx)(C.default,{className:"d-flex align-self-center",onClick:function(){return e.props.history.goBack()}}),(0,B.jsx)("p",{className:"align-self-center m-0 p-0 text-left flex-grow-1 pl-4",children:(0,B.jsx)("b",{children:"Give Help"})})]}),"22.5",(0,B.jsx)("div",{className:" mb-4 mt-4 pt-4 pb-2"}),(0,B.jsx)(y.ListItem,{className:"d-flex justify-content-around",value:this.state.currenttab,children:this.tab_name.map((function(t,n){return(0,B.jsx)("div",{className:"d-flex",children:(0,B.jsx)(y.Chip,{className:"",label:t,onClick:function(){return e.setState({currenttab:n})},sx:e.styles[e.state.currenttab===n?0:1]})},n)}))}),this.fields()]})):(this.performAuth(),(0,B.jsx)(B.Fragment,{}))}}]),a}(m.AuthComponent);t.GiveHelp=F;var N=(0,g.withRouter)(F);t.default=N},51636:function(e,t,n){var r=n(87537),a=n.n(r),i=n(23645),s=n.n(i)()(a());s.push([e.id,".maincard{background:#fff;border-radius:20px;box-shadow:0 10px 60px rgba(0,0,0,.063);margin-top:1.5rem;padding:10px 0}.card-heading{font-weight:700;width:100%}.tophead{background:#fff;box-shadow:0 10px 60px rgba(0,0,0,.063)}.title{color:#222b45;font-size:16px}.subtitle{color:#606267;font-size:12px;padding-right:1rem}.helpbutn{background:linear-gradient(180deg,#0338b9,#3e64ff)}.lefttxt{line-height:1.5rem;padding-left:1rem;padding-top:1rem;text-align:left}","",{version:3,sources:["webpack://./src/components/GiveHelp/GiveHelp.css"],names:[],mappings:"AAAA,UACI,eAAmB,CAEnB,kBAAmB,CADnB,uCAA6C,CAE7C,iBAAiB,CACjB,cAEJ,CAEA,cAEI,eAAgB,CADhB,UAEJ,CAEA,SACI,eAAmB,CACnB,uCAEJ,CACA,OAEI,aAAc,CADd,cAEJ,CACA,UAEI,aAAc,CADd,cAAe,CAEf,kBACJ,CACA,UACI,kDACJ,CAEA,SAGI,kBAAmB,CADnB,iBAAkB,CAElB,gBAAiB,CAHjB,eAIJ",sourcesContent:[".maincard {\n    background: #FFFFFF;\n    box-shadow: 0 10px 60px rgba(0, 0, 0, 0.0625);\n    border-radius: 20px;\n    margin-top:1.5rem;\n    padding: 10px 0 10px 0;\n\n}\n\n.card-heading{\n    width: 100%;\n    font-weight: 700;\n}\n\n.tophead {\n    background: #FFFFFF;\n    box-shadow: 0 10px 60px rgba(0, 0, 0, 0.0625);\n\n}\n.title {\n    font-size: 16px;\n    color: #222B45;\n}\n.subtitle {\n    font-size: 12px;\n    color: #606267;\n    padding-right: 1rem;\n}\n.helpbutn {\n    background: linear-gradient(180deg, #0338B9 0%, #3E64FF 100%);\n}\n\n.lefttxt {\n    text-align: left;\n    padding-left: 1rem;\n    line-height: 1.5rem;\n    padding-top: 1rem;\n}\n"],sourceRoot:""}]),t.Z=s},78549:function(e,t,n){n.r(t);var r=n(93379),a=n.n(r),i=n(7795),s=n.n(i),o=n(90569),l=n.n(o),c=n(3565),u=n.n(c),d=n(19216),f=n.n(d),p=n(44589),h=n.n(p),m=n(51636),g={};g.styleTagTransform=h(),g.setAttributes=u(),g.insert=l().bind(null,"head"),g.domAPI=s(),g.insertStyleElement=f(),a()(m.Z,g),t.default=m.Z&&m.Z.locals?m.Z.locals:void 0}}]);
//# sourceMappingURL=chunk-82.fbf05f004b91c0cb3827.js.map