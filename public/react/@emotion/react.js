import{r as _,R as U}from"../vendor.js";function je(e){if(e.sheet)return e.sheet;for(var r=0;r<document.styleSheets.length;r++)if(document.styleSheets[r].ownerNode===e)return document.styleSheets[r]}function Ve(e){var r=document.createElement("style");return r.setAttribute("data-emotion",e.key),e.nonce!==void 0&&r.setAttribute("nonce",e.nonce),r.appendChild(document.createTextNode("")),r.setAttribute("data-s",""),r}var qe=function(){function e(t){var n=this;this._insertTag=function(s){var a;n.tags.length===0?n.insertionPoint?a=n.insertionPoint.nextSibling:n.prepend?a=n.container.firstChild:a=n.before:a=n.tags[n.tags.length-1].nextSibling,n.container.insertBefore(s,a),n.tags.push(s)},this.isSpeedy=t.speedy===void 0?!0:t.speedy,this.tags=[],this.ctr=0,this.nonce=t.nonce,this.key=t.key,this.container=t.container,this.prepend=t.prepend,this.insertionPoint=t.insertionPoint,this.before=null}var r=e.prototype;return r.hydrate=function(n){n.forEach(this._insertTag)},r.insert=function(n){this.ctr%(this.isSpeedy?65e3:1)===0&&this._insertTag(Ve(this));var s=this.tags[this.tags.length-1];if(this.isSpeedy){var a=je(s);try{a.insertRule(n,a.cssRules.length)}catch{}}else s.appendChild(document.createTextNode(n));this.ctr++},r.flush=function(){this.tags.forEach(function(n){return n.parentNode&&n.parentNode.removeChild(n)}),this.tags=[],this.ctr=0},e}(),w="-ms-",J="-moz-",o="-webkit-",Ae="comm",pe="rule",ye="decl",De="@import",Re="@keyframes",Be=Math.abs,Q=String.fromCharCode,He=Object.assign;function Ke(e,r){return(((r<<2^$(e,0))<<2^$(e,1))<<2^$(e,2))<<2^$(e,3)}function Te(e){return e.trim()}function Ye(e,r){return(e=r.exec(e))?e[0]:e}function f(e,r,t){return e.replace(r,t)}function he(e,r){return e.indexOf(r)}function $(e,r){return e.charCodeAt(r)|0}function j(e,r,t){return e.slice(r,t)}function M(e){return e.length}function me(e){return e.length}function H(e,r){return r.push(e),e}function Ze(e,r){return e.map(r).join("")}var X=1,z=1,Me=0,C=0,p=0,G="";function ee(e,r,t,n,s,a,i){return{value:e,root:r,parent:t,type:n,props:s,children:a,line:X,column:z,length:i,return:""}}function W(e,r){return He(ee("",null,null,"",null,null,0),e,{length:-e.length},r)}function Ue(){return p}function Je(){return p=C>0?$(G,--C):0,z--,p===10&&(z=1,X--),p}function E(){return p=C<Me?$(G,C++):0,z++,p===10&&(z=1,X++),p}function P(){return $(G,C)}function K(){return C}function D(e,r){return j(G,e,r)}function V(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function Oe(e){return X=z=1,Me=M(G=e),C=0,[]}function Pe(e){return G="",e}function Y(e){return Te(D(C-1,le(e===91?e+2:e===40?e+1:e)))}function Qe(e){for(;(p=P())&&p<33;)E();return V(e)>2||V(p)>3?"":" "}function Xe(e,r){for(;--r&&E()&&!(p<48||p>102||p>57&&p<65||p>70&&p<97););return D(e,K()+(r<6&&P()==32&&E()==32))}function le(e){for(;E();)switch(p){case e:return C;case 34:case 39:e!==34&&e!==39&&le(p);break;case 40:e===41&&le(e);break;case 92:E();break}return C}function er(e,r){for(;E()&&e+p!==47+10;)if(e+p===42+42&&P()===47)break;return"/*"+D(r,C-1)+"*"+Q(e===47?e:E())}function rr(e){for(;!V(P());)E();return D(e,C)}function tr(e){return Pe(Z("",null,null,null,[""],e=Oe(e),0,[0],e))}function Z(e,r,t,n,s,a,i,c,d){for(var S=0,m=0,x=i,I=0,N=0,k=0,h=1,v=1,y=1,g=0,R="",B=s,F=a,T=n,l=R;v;)switch(k=g,g=E()){case 40:if(k!=108&&l.charCodeAt(x-1)==58){he(l+=f(Y(g),"&","&\f"),"&\f")!=-1&&(y=-1);break}case 34:case 39:case 91:l+=Y(g);break;case 9:case 10:case 13:case 32:l+=Qe(k);break;case 92:l+=Xe(K()-1,7);continue;case 47:switch(P()){case 42:case 47:H(nr(er(E(),K()),r,t),d);break;default:l+="/"}break;case 123*h:c[S++]=M(l)*y;case 125*h:case 59:case 0:switch(g){case 0:case 125:v=0;case 59+m:N>0&&M(l)-x&&H(N>32?Se(l+";",n,t,x-1):Se(f(l," ","")+";",n,t,x-2),d);break;case 59:l+=";";default:if(H(T=we(l,r,t,S,m,s,c,R,B=[],F=[],x),a),g===123)if(m===0)Z(l,r,T,T,B,a,x,c,F);else switch(I){case 100:case 109:case 115:Z(e,T,T,n&&H(we(e,T,T,0,0,s,c,R,s,B=[],x),F),s,F,x,c,n?B:F);break;default:Z(l,T,T,T,[""],F,0,c,F)}}S=m=N=0,h=y=1,R=l="",x=i;break;case 58:x=1+M(l),N=k;default:if(h<1){if(g==123)--h;else if(g==125&&h++==0&&Je()==125)continue}switch(l+=Q(g),g*h){case 38:y=m>0?1:(l+="\f",-1);break;case 44:c[S++]=(M(l)-1)*y,y=1;break;case 64:P()===45&&(l+=Y(E())),I=P(),m=x=M(R=l+=rr(K())),g++;break;case 45:k===45&&M(l)==2&&(h=0)}}return a}function we(e,r,t,n,s,a,i,c,d,S,m){for(var x=s-1,I=s===0?a:[""],N=me(I),k=0,h=0,v=0;k<n;++k)for(var y=0,g=j(e,x+1,x=Be(h=i[k])),R=e;y<N;++y)(R=Te(h>0?I[y]+" "+g:f(g,/&\f/g,I[y])))&&(d[v++]=R);return ee(e,r,t,s===0?pe:c,d,S,m)}function nr(e,r,t){return ee(e,r,t,Ae,Q(Ue()),j(e,2,-2),0)}function Se(e,r,t,n){return ee(e,r,t,ye,j(e,0,n),j(e,n+1,-1),n)}function Ie(e,r){switch(Ke(e,r)){case 5103:return o+"print-"+e+e;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return o+e+e;case 5349:case 4246:case 4810:case 6968:case 2756:return o+e+J+e+w+e+e;case 6828:case 4268:return o+e+w+e+e;case 6165:return o+e+w+"flex-"+e+e;case 5187:return o+e+f(e,/(\w+).+(:[^]+)/,o+"box-$1$2"+w+"flex-$1$2")+e;case 5443:return o+e+w+"flex-item-"+f(e,/flex-|-self/,"")+e;case 4675:return o+e+w+"flex-line-pack"+f(e,/align-content|flex-|-self/,"")+e;case 5548:return o+e+w+f(e,"shrink","negative")+e;case 5292:return o+e+w+f(e,"basis","preferred-size")+e;case 6060:return o+"box-"+f(e,"-grow","")+o+e+w+f(e,"grow","positive")+e;case 4554:return o+f(e,/([^-])(transform)/g,"$1"+o+"$2")+e;case 6187:return f(f(f(e,/(zoom-|grab)/,o+"$1"),/(image-set)/,o+"$1"),e,"")+e;case 5495:case 3959:return f(e,/(image-set\([^]*)/,o+"$1$`$1");case 4968:return f(f(e,/(.+:)(flex-)?(.*)/,o+"box-pack:$3"+w+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+o+e+e;case 4095:case 3583:case 4068:case 2532:return f(e,/(.+)-inline(.+)/,o+"$1$2")+e;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(M(e)-1-r>6)switch($(e,r+1)){case 109:if($(e,r+4)!==45)break;case 102:return f(e,/(.+:)(.+)-([^]+)/,"$1"+o+"$2-$3$1"+J+($(e,r+3)==108?"$3":"$2-$3"))+e;case 115:return~he(e,"stretch")?Ie(f(e,"stretch","fill-available"),r)+e:e}break;case 4949:if($(e,r+1)!==115)break;case 6444:switch($(e,M(e)-3-(~he(e,"!important")&&10))){case 107:return f(e,":",":"+o)+e;case 101:return f(e,/(.+:)([^;!]+)(;|!.+)?/,"$1"+o+($(e,14)===45?"inline-":"")+"box$3$1"+o+"$2$3$1"+w+"$2box$3")+e}break;case 5936:switch($(e,r+11)){case 114:return o+e+w+f(e,/[svh]\w+-[tblr]{2}/,"tb")+e;case 108:return o+e+w+f(e,/[svh]\w+-[tblr]{2}/,"tb-rl")+e;case 45:return o+e+w+f(e,/[svh]\w+-[tblr]{2}/,"lr")+e}return o+e+w+e+e}return e}function L(e,r){for(var t="",n=me(e),s=0;s<n;s++)t+=r(e[s],s,e,r)||"";return t}function sr(e,r,t,n){switch(e.type){case De:case ye:return e.return=e.return||e.value;case Ae:return"";case Re:return e.return=e.value+"{"+L(e.children,n)+"}";case pe:e.value=e.props.join(",")}return M(t=L(e.children,n))?e.return=e.value+"{"+t+"}":""}function ar(e){var r=me(e);return function(t,n,s,a){for(var i="",c=0;c<r;c++)i+=e[c](t,n,s,a)||"";return i}}function ir(e){return function(r){r.root||(r=r.return)&&e(r)}}function cr(e,r,t,n){if(e.length>-1&&!e.return)switch(e.type){case ye:e.return=Ie(e.value,e.length);break;case Re:return L([W(e,{value:f(e.value,"@","@"+o)})],n);case pe:if(e.length)return Ze(e.props,function(s){switch(Ye(s,/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":return L([W(e,{props:[f(s,/:(read-\w+)/,":"+J+"$1")]})],n);case"::placeholder":return L([W(e,{props:[f(s,/:(plac\w+)/,":"+o+"input-$1")]}),W(e,{props:[f(s,/:(plac\w+)/,":"+J+"$1")]}),W(e,{props:[f(s,/:(plac\w+)/,w+"input-$1")]})],n)}return""})}}function or(e){var r=Object.create(null);return function(t){return r[t]===void 0&&(r[t]=e(t)),r[t]}}var fr=function(r,t,n){for(var s=0,a=0;s=a,a=P(),s===38&&a===12&&(t[n]=1),!V(a);)E();return D(r,C)},ur=function(r,t){var n=-1,s=44;do switch(V(s)){case 0:s===38&&P()===12&&(t[n]=1),r[n]+=fr(C-1,t,n);break;case 2:r[n]+=Y(s);break;case 4:if(s===44){r[++n]=P()===58?"&\f":"",t[n]=r[n].length;break}default:r[n]+=Q(s)}while(s=E());return r},dr=function(r,t){return Pe(ur(Oe(r),t))},ve=new WeakMap,hr=function(r){if(!(r.type!=="rule"||!r.parent||r.length<1)){for(var t=r.value,n=r.parent,s=r.column===n.column&&r.line===n.line;n.type!=="rule";)if(n=n.parent,!n)return;if(!(r.props.length===1&&t.charCodeAt(0)!==58&&!ve.get(n))&&!s){ve.set(r,!0);for(var a=[],i=dr(t,a),c=n.props,d=0,S=0;d<i.length;d++)for(var m=0;m<c.length;m++,S++)r.props[S]=a[d]?i[d].replace(/&\f/g,c[m]):c[m]+" "+i[d]}}},lr=function(r){if(r.type==="decl"){var t=r.value;t.charCodeAt(0)===108&&t.charCodeAt(2)===98&&(r.return="",r.value="")}},pr=[cr],yr=function(r){var t=r.key;if(t==="css"){var n=document.querySelectorAll("style[data-emotion]:not([data-s])");Array.prototype.forEach.call(n,function(h){var v=h.getAttribute("data-emotion");v.indexOf(" ")!==-1&&(document.head.appendChild(h),h.setAttribute("data-s",""))})}var s=r.stylisPlugins||pr,a={},i,c=[];i=r.container||document.head,Array.prototype.forEach.call(document.querySelectorAll('style[data-emotion^="'+t+' "]'),function(h){for(var v=h.getAttribute("data-emotion").split(" "),y=1;y<v.length;y++)a[v[y]]=!0;c.push(h)});var d,S=[hr,lr];{var m,x=[sr,ir(function(h){m.insert(h)})],I=ar(S.concat(s,x)),N=function(v){return L(tr(v),I)};d=function(v,y,g,R){m=g,N(v?v+"{"+y.styles+"}":y.styles),R&&(k.inserted[y.name]=!0)}}var k={key:t,sheet:new qe({key:t,container:i,nonce:r.nonce,speedy:r.speedy,prepend:r.prepend,insertionPoint:r.insertionPoint}),nonce:r.nonce,inserted:a,registered:{},insert:d};return k.sheet.hydrate(c),k},Ne={exports:{}},u={};/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var b=typeof Symbol=="function"&&Symbol.for,be=b?Symbol.for("react.element"):60103,xe=b?Symbol.for("react.portal"):60106,re=b?Symbol.for("react.fragment"):60107,te=b?Symbol.for("react.strict_mode"):60108,ne=b?Symbol.for("react.profiler"):60114,se=b?Symbol.for("react.provider"):60109,ae=b?Symbol.for("react.context"):60110,ge=b?Symbol.for("react.async_mode"):60111,ie=b?Symbol.for("react.concurrent_mode"):60111,ce=b?Symbol.for("react.forward_ref"):60112,oe=b?Symbol.for("react.suspense"):60113,mr=b?Symbol.for("react.suspense_list"):60120,fe=b?Symbol.for("react.memo"):60115,ue=b?Symbol.for("react.lazy"):60116,br=b?Symbol.for("react.block"):60121,xr=b?Symbol.for("react.fundamental"):60117,gr=b?Symbol.for("react.responder"):60118,wr=b?Symbol.for("react.scope"):60119;function A(e){if(typeof e=="object"&&e!==null){var r=e.$$typeof;switch(r){case be:switch(e=e.type,e){case ge:case ie:case re:case ne:case te:case oe:return e;default:switch(e=e&&e.$$typeof,e){case ae:case ce:case ue:case fe:case se:return e;default:return r}}case xe:return r}}}function Fe(e){return A(e)===ie}u.AsyncMode=ge;u.ConcurrentMode=ie;u.ContextConsumer=ae;u.ContextProvider=se;u.Element=be;u.ForwardRef=ce;u.Fragment=re;u.Lazy=ue;u.Memo=fe;u.Portal=xe;u.Profiler=ne;u.StrictMode=te;u.Suspense=oe;u.isAsyncMode=function(e){return Fe(e)||A(e)===ge};u.isConcurrentMode=Fe;u.isContextConsumer=function(e){return A(e)===ae};u.isContextProvider=function(e){return A(e)===se};u.isElement=function(e){return typeof e=="object"&&e!==null&&e.$$typeof===be};u.isForwardRef=function(e){return A(e)===ce};u.isFragment=function(e){return A(e)===re};u.isLazy=function(e){return A(e)===ue};u.isMemo=function(e){return A(e)===fe};u.isPortal=function(e){return A(e)===xe};u.isProfiler=function(e){return A(e)===ne};u.isStrictMode=function(e){return A(e)===te};u.isSuspense=function(e){return A(e)===oe};u.isValidElementType=function(e){return typeof e=="string"||typeof e=="function"||e===re||e===ie||e===ne||e===te||e===oe||e===mr||typeof e=="object"&&e!==null&&(e.$$typeof===ue||e.$$typeof===fe||e.$$typeof===se||e.$$typeof===ae||e.$$typeof===ce||e.$$typeof===xr||e.$$typeof===gr||e.$$typeof===wr||e.$$typeof===br)};u.typeOf=A;Ne.exports=u;var _e=Ne.exports,Sr={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},vr={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},Le={};Le[_e.ForwardRef]=Sr;Le[_e.Memo]=vr;var $r=!0;function Nr(e,r,t){var n="";return t.split(" ").forEach(function(s){e[s]!==void 0?r.push(e[s]+";"):n+=s+" "}),n}var Cr=function(r,t,n){var s=r.key+"-"+t.name;(n===!1||$r===!1)&&r.registered[s]===void 0&&(r.registered[s]=t.styles)},kr=function(r,t,n){Cr(r,t,n);var s=r.key+"-"+t.name;if(r.inserted[t.name]===void 0){var a=t;do r.insert(t===a?"."+s:"",a,r.sheet,!0),a=a.next;while(a!==void 0)}};function Er(e){for(var r=0,t,n=0,s=e.length;s>=4;++n,s-=4)t=e.charCodeAt(n)&255|(e.charCodeAt(++n)&255)<<8|(e.charCodeAt(++n)&255)<<16|(e.charCodeAt(++n)&255)<<24,t=(t&65535)*1540483477+((t>>>16)*59797<<16),t^=t>>>24,r=(t&65535)*1540483477+((t>>>16)*59797<<16)^(r&65535)*1540483477+((r>>>16)*59797<<16);switch(s){case 3:r^=(e.charCodeAt(n+2)&255)<<16;case 2:r^=(e.charCodeAt(n+1)&255)<<8;case 1:r^=e.charCodeAt(n)&255,r=(r&65535)*1540483477+((r>>>16)*59797<<16)}return r^=r>>>13,r=(r&65535)*1540483477+((r>>>16)*59797<<16),((r^r>>>15)>>>0).toString(36)}var Ar={animationIterationCount:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1},Rr=/[A-Z]|^ms/g,Tr=/_EMO_([^_]+?)_([^]*?)_EMO_/g,ze=function(r){return r.charCodeAt(1)===45},$e=function(r){return r!=null&&typeof r!="boolean"},de=or(function(e){return ze(e)?e:e.replace(Rr,"-$&").toLowerCase()}),Ce=function(r,t){switch(r){case"animation":case"animationName":if(typeof t=="string")return t.replace(Tr,function(n,s,a){return O={name:s,styles:a,next:O},s})}return Ar[r]!==1&&!ze(r)&&typeof t=="number"&&t!==0?t+"px":t};function q(e,r,t){if(t==null)return"";if(t.__emotion_styles!==void 0)return t;switch(typeof t){case"boolean":return"";case"object":{if(t.anim===1)return O={name:t.name,styles:t.styles,next:O},t.name;if(t.styles!==void 0){var n=t.next;if(n!==void 0)for(;n!==void 0;)O={name:n.name,styles:n.styles,next:O},n=n.next;var s=t.styles+";";return s}return Mr(e,r,t)}case"function":{if(e!==void 0){var a=O,i=t(e);return O=a,q(e,r,i)}break}}if(r==null)return t;var c=r[t];return c!==void 0?c:t}function Mr(e,r,t){var n="";if(Array.isArray(t))for(var s=0;s<t.length;s++)n+=q(e,r,t[s])+";";else for(var a in t){var i=t[a];if(typeof i!="object")r!=null&&r[i]!==void 0?n+=a+"{"+r[i]+"}":$e(i)&&(n+=de(a)+":"+Ce(a,i)+";");else if(Array.isArray(i)&&typeof i[0]=="string"&&(r==null||r[i[0]]===void 0))for(var c=0;c<i.length;c++)$e(i[c])&&(n+=de(a)+":"+Ce(a,i[c])+";");else{var d=q(e,r,i);switch(a){case"animation":case"animationName":{n+=de(a)+":"+d+";";break}default:n+=a+"{"+d+"}"}}}return n}var ke=/label:\s*([^\s;\n{]+)\s*(;|$)/g,O,Ge=function(r,t,n){if(r.length===1&&typeof r[0]=="object"&&r[0]!==null&&r[0].styles!==void 0)return r[0];var s=!0,a="";O=void 0;var i=r[0];i==null||i.raw===void 0?(s=!1,a+=q(n,t,i)):a+=i[0];for(var c=1;c<r.length;c++)a+=q(n,t,r[c]),s&&(a+=i[c]);ke.lastIndex=0;for(var d="",S;(S=ke.exec(a))!==null;)d+="-"+S[1];var m=Er(a)+d;return{name:m,styles:a,next:O}},We=_.exports.createContext(typeof HTMLElement<"u"?yr({key:"css"}):null);We.Provider;var Or=function(r){return _.exports.forwardRef(function(t,n){var s=_.exports.useContext(We);return r(t,s,n)})},Pr=_.exports.createContext({});U["useInsertionEffect"]&&U["useInsertionEffect"];var Ee=U["useInsertionEffect"]?U["useInsertionEffect"]:_.exports.useLayoutEffect,Fr=Or(function(e,r){var t=e.styles,n=Ge([t],void 0,_.exports.useContext(Pr)),s=_.exports.useRef();return Ee(function(){var a=r.key+"-global",i=new r.sheet.constructor({key:a,nonce:r.sheet.nonce,container:r.sheet.container,speedy:r.sheet.isSpeedy}),c=!1,d=document.querySelector('style[data-emotion="'+a+" "+n.name+'"]');return r.sheet.tags.length&&(i.before=r.sheet.tags[0]),d!==null&&(c=!0,d.setAttribute("data-emotion",a),i.hydrate([d])),s.current=[i,c],function(){i.flush()}},[r]),Ee(function(){var a=s.current,i=a[0],c=a[1];if(c){a[1]=!1;return}if(n.next!==void 0&&kr(r,n.next,!0),i.tags.length){var d=i.tags[i.tags.length-1].nextElementSibling;i.before=d,i.flush()}r.insert("",n,i,!1)},[r,n.name]),null});function _r(){for(var e=arguments.length,r=new Array(e),t=0;t<e;t++)r[t]=arguments[t];return Ge(r)}export{Fr as G,_r as a,yr as c,Nr as g,kr as i,Ge as s};
