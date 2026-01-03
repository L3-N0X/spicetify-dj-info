// @ts-nocheck
// NAME: DJ Info
// AUTHOR: L3N0X
// VERSION: 2.2.1
// DESCRIPTION: BPM and Energy display for each song

/// <reference path="../globals.d.ts" />

// protobuf.min.js embbedded
// This was added to remove external dependencies and the step to execute "npm install protobufjs"

/*!
 * protobuf.js v8.0.0 (c) 2016, daniel wirtz
 * compiled tue, 16 dec 2025 22:00:06 utc
 * licensed under the bsd-3-clause license
 * see: https://github.com/dcodeio/protobuf.js for details
 */
// prettier-ignore
/* eslint-disable */
// #region Protobuf Library (Do not format)
!function(g){"use strict";!function(r,e,t){var i=function t(i){var n=e[i];return n||r[i][0].call(n=e[i]={exports:{}},t,n,n.exports),n.exports}(t[0]);i.util.global.protobuf=i,"function"==typeof define&&define.amd&&define(["long"],function(t){return t&&t.isLong&&(i.util.Long=t,i.configure()),i}),"object"==typeof module&&module&&module.exports&&(module.exports=i)}({1:[function(t,i,n){i.exports=function(t,i){var n=Array(arguments.length-1),s=0,r=2,o=!0;for(;r<arguments.length;)n[s++]=arguments[r++];return new Promise(function(r,e){n[s]=function(t){if(o)if(o=!1,t)e(t);else{for(var i=Array(arguments.length-1),n=0;n<i.length;)i[n++]=arguments[n];r.apply(null,i)}};try{t.apply(i||null,n)}catch(t){o&&(o=!1,e(t))}})}},{}],2:[function(t,i,n){n.length=function(t){var i=t.length;if(!i)return 0;for(var n=0;1<--i%4&&"="==(t[0|i]||"");)++n;return Math.ceil(3*t.length)/4-n};for(var f=Array(64),h=Array(123),r=0;r<64;)h[f[r]=r<26?r+65:r<52?r+71:r<62?r-4:r-59|43]=r++;n.encode=function(t,i,n){for(var r,e=null,s=[],o=0,u=0;i<n;){var h=t[i++];switch(u){case 0:s[o++]=f[h>>2],r=(3&h)<<4,u=1;break;case 1:s[o++]=f[r|h>>4],r=(15&h)<<2,u=2;break;case 2:s[o++]=f[r|h>>6],s[o++]=f[63&h],u=0}8191<o&&((e=e||[]).push(String.fromCharCode.apply(String,s)),o=0)}return u&&(s[o++]=f[r],s[o++]=61,1===u&&(s[o++]=61)),e?(o&&e.push(String.fromCharCode.apply(String,s.slice(0,o))),e.join("")):String.fromCharCode.apply(String,s.slice(0,o))};var c="invalid encoding";n.decode=function(t,i,n){for(var r,e=n,s=0,o=0;o<t.length;){var u=t.charCodeAt(o++);if(61==u&&1<s)break;if((u=h[u])===g)throw Error(c);switch(s){case 0:r=u,s=1;break;case 1:i[n++]=r<<2|(48&u)>>4,r=u,s=2;break;case 2:i[n++]=(15&r)<<4|(60&u)>>2,r=u,s=3;break;case 3:i[n++]=(3&r)<<6|u,s=0}}if(1===s)throw Error(c);return n-e},n.test=function(t){return/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(t)}},{}],3:[function(t,i,n){function a(i,n){"string"==typeof i&&(n=i,i=g);var h=[];function f(t){if("string"!=typeof t){var i=c();if(a.verbose&&console.log("codegen: "+i),i="return "+i,t){for(var n=Object.keys(t),r=Array(n.length+1),e=Array(n.length),s=0;s<n.length;)r[s]=n[s],e[s]=t[n[s++]];return r[s]=i,Function.apply(null,r).apply(null,e)}return Function(i)()}for(var o=Array(arguments.length-1),u=0;u<o.length;)o[u]=arguments[++u];if(u=0,t=t.replace(/%([%dfijs])/g,function(t,i){var n=o[u++];switch(i){case"d":case"f":return""+ +(""+n);case"i":return""+Math.floor(n);case"j":return JSON.stringify(n);case"s":return""+n}return"%"}),u!==o.length)throw Error("parameter count mismatch");return h.push(t),f}function c(t){return"function "+(t||n||"")+"("+(i&&i.join(",")||"")+"){\n  "+h.join("\n  ")+"\n}"}return f.toString=c,f}(i.exports=a).verbose=!1},{}],4:[function(t,i,n){function r(){this.t={}}(i.exports=r).prototype.on=function(t,i,n){return(this.t[t]||(this.t[t]=[])).push({fn:i,ctx:n||this}),this},r.prototype.off=function(t,i){if(t===g)this.t={};else if(i===g)this.t[t]=[];else for(var n=this.t[t],r=0;r<n.length;)n[r].fn===i?n.splice(r,1):++r;return this},r.prototype.emit=function(t){var i=this.t[t];if(i){for(var n=[],r=1;r<arguments.length;)n.push(arguments[r++]);for(r=0;r<i.length;)i[r].fn.apply(i[r++].ctx,n)}return this}},{}],5:[function(t,i,n){i.exports=u;var s=t(1),o=t(7)("fs");function u(n,r,e){return r="function"==typeof r?(e=r,{}):r||{},e?!r.xhr&&o&&o.readFile?o.readFile(n,function(t,i){return t&&"undefined"!=typeof XMLHttpRequest?u.xhr(n,r,e):t?e(t):e(null,r.binary?i:i.toString("utf8"))}):u.xhr(n,r,e):s(u,this,n,r)}u.xhr=function(t,n,r){var e=new XMLHttpRequest;e.onreadystatechange=function(){if(4!==e.readyState)return g;if(0!==e.status&&200!==e.status)return r(Error("status "+e.status));if(n.binary){if(!(t=e.response))for(var t=[],i=0;i<e.responseText.length;++i)t.push(255&e.responseText.charCodeAt(i));return r(null,"undefined"!=typeof Uint8Array?new Uint8Array(t):t)}return r(null,e.responseText)},n.binary&&("overrideMimeType"in e&&e.overrideMimeType("text/plain; charset=x-user-defined"),e.responseType="arraybuffer"),e.open("GET",t),e.send()}},{1:1,7:7}],6:[function(t,i,n){function r(t){function i(t,i,n,r){var e=i<0?1:0;t(0===(i=e?-i:i)?0<1/i?0:2147483648:isNaN(i)?2143289344:34028234663852886e22<i?(e<<31|2139095040)>>>0:i<11754943508222875e-54?(e<<31|Math.round(i/1401298464324817e-60))>>>0:(e<<31|127+(t=Math.floor(Math.log(i)/Math.LN2))<<23|8388607&Math.round(i*Math.pow(2,-t)*8388608))>>>0,n,r)}function n(t,i,n){t=t(i,n),i=2*(t>>31)+1,n=t>>>23&255,t&=8388607;return 255==n?t?NaN:1/0*i:0==n?1401298464324817e-60*i*t:i*Math.pow(2,n-150)*(8388608+t)}function r(t,i,n){u[0]=t,i[n]=h[0],i[n+1]=h[1],i[n+2]=h[2],i[n+3]=h[3]}function e(t,i,n){u[0]=t,i[n]=h[3],i[n+1]=h[2],i[n+2]=h[1],i[n+3]=h[0]}function s(t,i){return h[0]=t[i],h[1]=t[i+1],h[2]=t[i+2],h[3]=t[i+3],u[0]}function o(t,i){return h[3]=t[i],h[2]=t[i+1],h[1]=t[i+2],h[0]=t[i+3],u[0]}var u,h,f,c,a;function l(t,i,n,r,e,s){var o,u=r<0?1:0;0===(r=u?-r:r)?(t(0,e,s+i),t(0<1/r?0:2147483648,e,s+n)):isNaN(r)?(t(0,e,s+i),t(2146959360,e,s+n)):17976931348623157e292<r?(t(0,e,s+i),t((u<<31|2146435072)>>>0,e,s+n)):r<22250738585072014e-324?(t((o=r/5e-324)>>>0,e,s+i),t((u<<31|o/4294967296)>>>0,e,s+n)):(t(4503599627370496*(o=r*Math.pow(2,-(r=1024===(r=Math.floor(Math.log(r)/Math.LN2))?1023:r)))>>>0,e,s+i),t((u<<31|r+1023<<20|1048576*o&1048575)>>>0,e,s+n))}function d(t,i,n,r,e){i=t(r,e+i),t=t(r,e+n),r=2*(t>>31)+1,e=t>>>20&2047,n=4294967296*(1048575&t)+i;return 2047==e?n?NaN:1/0*r:0==e?5e-324*r*n:r*Math.pow(2,e-1075)*(n+4503599627370496)}function v(t,i,n){f[0]=t,i[n]=c[0],i[n+1]=c[1],i[n+2]=c[2],i[n+3]=c[3],i[n+4]=c[4],i[n+5]=c[5],i[n+6]=c[6],i[n+7]=c[7]}function b(t,i,n){f[0]=t,i[n]=c[7],i[n+1]=c[6],i[n+2]=c[5],i[n+3]=c[4],i[n+4]=c[3],i[n+5]=c[2],i[n+6]=c[1],i[n+7]=c[0]}function p(t,i){return c[0]=t[i],c[1]=t[i+1],c[2]=t[i+2],c[3]=t[i+3],c[4]=t[i+4],c[5]=t[i+5],c[6]=t[i+6],c[7]=t[i+7],f[0]}function y(t,i){return c[7]=t[i],c[6]=t[i+1],c[5]=t[i+2],c[4]=t[i+3],c[3]=t[i+4],c[2]=t[i+5],c[1]=t[i+6],c[0]=t[i+7],f[0]}return"undefined"!=typeof Float32Array?(u=new Float32Array([-0]),h=new Uint8Array(u.buffer),a=128===h[3],t.writeFloatLE=a?r:e,t.writeFloatBE=a?e:r,t.readFloatLE=a?s:o,t.readFloatBE=a?o:s):(t.writeFloatLE=i.bind(null,m),t.writeFloatBE=i.bind(null,w),t.readFloatLE=n.bind(null,g),t.readFloatBE=n.bind(null,j)),"undefined"!=typeof Float64Array?(f=new Float64Array([-0]),c=new Uint8Array(f.buffer),a=128===c[7],t.writeDoubleLE=a?v:b,t.writeDoubleBE=a?b:v,t.readDoubleLE=a?p:y,t.readDoubleBE=a?y:p):(t.writeDoubleLE=l.bind(null,m,0,4),t.writeDoubleBE=l.bind(null,w,4,0),t.readDoubleLE=d.bind(null,g,0,4),t.readDoubleBE=d.bind(null,j,4,0)),t}function m(t,i,n){i[n]=255&t,i[n+1]=t>>>8&255,i[n+2]=t>>>16&255,i[n+3]=t>>>24}function w(t,i,n){i[n]=t>>>24,i[n+1]=t>>>16&255,i[n+2]=t>>>8&255,i[n+3]=255&t}function g(t,i){return(t[i]|t[i+1]<<8|t[i+2]<<16|t[i+3]<<24)>>>0}function j(t,i){return(t[i]<<24|t[i+1]<<16|t[i+2]<<8|t[i+3])>>>0}i.exports=r(r)},{}],7:[function(t,i,n){function r(t){try{var i=eval("require")(t);if(i&&(i.length||Object.keys(i).length))return i}catch(t){}return null}i.exports=r},{}],8:[function(t,i,n){var e=n.isAbsolute=function(t){return/^(?:\/|\w+:)/.test(t)},r=n.normalize=function(t){var i=(t=t.replace(/\\/g,"/").replace(/\/{2,}/g,"/")).split("/"),n=e(t),t="";n&&(t=i.shift()+"/");for(var r=0;r<i.length;)".."===i[r]?0<r&&".."!==i[r-1]?i.splice(--r,2):n?i.splice(r,1):++r:"."===i[r]?i.splice(r,1):++r;return t+i.join("/")};n.resolve=function(t,i,n){return n||(i=r(i)),!e(i)&&(t=(t=n?t:r(t)).replace(/(?:\/|^)[^/]+$/,"")).length?r(t+"/"+i):i}},{}],9:[function(t,i,n){i.exports=function(i,n,t){var r=t||8192,e=r>>>1,s=null,o=r;return function(t){if(t<1||e<t)return i(t);r<o+t&&(s=i(r),o=0);t=n.call(s,o,o+=t);return 7&o&&(o=1+(7|o)),t}}},{}],10:[function(t,i,n){n.length=function(t){for(var i,n=0,r=0;r<t.length;++r)(i=t.charCodeAt(r))<128?n+=1:i<2048?n+=2:55296==(64512&i)&&56320==(64512&t.charCodeAt(r+1))?(++r,n+=4):n+=3;return n},n.read=function(t,i,n){if(n-i<1)return"";for(var r,e=null,s=[],o=0;i<n;)(r=t[i++])<128?s[o++]=r:191<r&&r<224?s[o++]=(31&r)<<6|63&t[i++]:239<r&&r<365?(r=((7&r)<<18|(63&t[i++])<<12|(63&t[i++])<<6|63&t[i++])-65536,s[o++]=55296+(r>>10),s[o++]=56320+(1023&r)):s[o++]=(15&r)<<12|(63&t[i++])<<6|63&t[i++],8191<o&&((e=e||[]).push(String.fromCharCode.apply(String,s)),o=0);return e?(o&&e.push(String.fromCharCode.apply(String,s.slice(0,o))),e.join("")):String.fromCharCode.apply(String,s.slice(0,o))},n.write=function(t,i,n){for(var r,e,s=n,o=0;o<t.length;++o)(r=t.charCodeAt(o))<128?i[n++]=r:(r<2048?i[n++]=r>>6|192:(55296==(64512&r)&&56320==(64512&(e=t.charCodeAt(o+1)))?(++o,i[n++]=(r=65536+((1023&r)<<10)+(1023&e))>>18|240,i[n++]=r>>12&63|128):i[n++]=r>>12|224,i[n++]=r>>6&63|128),i[n++]=63&r|128);return n-s}},{}],11:[function(t,i,n){var l=t(14),d=t(33);function o(t,i,n,r){var e=!1;if(i.resolvedType)if(i.resolvedType instanceof l){t("switch(d%s){",r);for(var s=i.resolvedType.values,o=Object.keys(s),u=0;u<o.length;++u)s[o[u]]!==i.typeDefault||e||(t("default:")('if(typeof(d%s)==="number"){m%s=d%s;break}',r,r,r),i.repeated||t("break"),e=!0),t("case%j:",o[u])("case %i:",s[o[u]])("m%s=%j",r,s[o[u]])("break");t("}")}else t('if(typeof d%s!=="object")',r)("throw TypeError(%j)",i.fullName+": object expected")("m%s=types[%i].fromObject(d%s)",r,n,r);else{var h=!1;switch(i.type){case"double":case"float":t("m%s=Number(d%s)",r,r);break;case"uint32":case"fixed32":t("m%s=d%s>>>0",r,r);break;case"int32":case"sint32":case"sfixed32":t("m%s=d%s|0",r,r);break;case"uint64":h=!0;case"int64":case"sint64":case"fixed64":case"sfixed64":t("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j",r,r,h)('else if(typeof d%s==="string")',r)("m%s=parseInt(d%s,10)",r,r)('else if(typeof d%s==="number")',r)("m%s=d%s",r,r)('else if(typeof d%s==="object")',r)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)",r,r,r,h?"true":"");break;case"bytes":t('if(typeof d%s==="string")',r)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)",r,r,r)("else if(d%s.length >= 0)",r)("m%s=d%s",r,r);break;case"string":t("m%s=String(d%s)",r,r);break;case"bool":t("m%s=Boolean(d%s)",r,r)}}return t}function v(t,i,n,r){if(i.resolvedType)i.resolvedType instanceof l?t("d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s",r,n,r,r,n,r,r):t("d%s=types[%i].toObject(m%s,o)",r,n,r);else{var e=!1;switch(i.type){case"double":case"float":t("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s",r,r,r,r);break;case"uint64":e=!0;case"int64":case"sint64":case"fixed64":case"sfixed64":t('if(typeof m%s==="number")',r)("d%s=o.longs===String?String(m%s):m%s",r,r,r)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s",r,r,r,r,e?"true":"",r);break;case"bytes":t("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s",r,r,r,r,r);break;default:t("d%s=m%s",r,r)}}return t}n.fromObject=function(t){var i=t.fieldsArray,n=d.codegen(["d"],t.name+"$fromObject")("if(d instanceof this.ctor)")("return d");if(!i.length)return n("return new this.ctor");n("var m=new this.ctor");for(var r=0;r<i.length;++r){var e=i[r].resolve(),s=d.safeProp(e.name);e.map?(n("if(d%s){",s)('if(typeof d%s!=="object")',s)("throw TypeError(%j)",e.fullName+": object expected")("m%s={}",s)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){",s),o(n,e,r,s+"[ks[i]]")("}")("}")):e.repeated?(n("if(d%s){",s)("if(!Array.isArray(d%s))",s)("throw TypeError(%j)",e.fullName+": array expected")("m%s=[]",s)("for(var i=0;i<d%s.length;++i){",s),o(n,e,r,s+"[i]")("}")("}")):(e.resolvedType instanceof l||n("if(d%s!=null){",s),o(n,e,r,s),e.resolvedType instanceof l||n("}"))}return n("return m")},n.toObject=function(t){var i=t.fieldsArray.slice().sort(d.compareFieldsById);if(!i.length)return d.codegen()("return {}");for(var n=d.codegen(["m","o"],t.name+"$toObject")("if(!o)")("o={}")("var d={}"),r=[],e=[],s=[],o=0;o<i.length;++o)i[o].partOf||(i[o].resolve().repeated?r:i[o].map?e:s).push(i[o]);if(r.length){for(n("if(o.arrays||o.defaults){"),o=0;o<r.length;++o)n("d%s=[]",d.safeProp(r[o].name));n("}")}if(e.length){for(n("if(o.objects||o.defaults){"),o=0;o<e.length;++o)n("d%s={}",d.safeProp(e[o].name));n("}")}if(s.length){for(n("if(o.defaults){"),o=0;o<s.length;++o){var u,h=s[o],f=d.safeProp(h.name);h.resolvedType instanceof l?n("d%s=o.enums===String?%j:%j",f,h.resolvedType.valuesById[h.typeDefault],h.typeDefault):h.long?n("if(util.Long){")("var n=new util.Long(%i,%i,%j)",h.typeDefault.low,h.typeDefault.high,h.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n",f)("}else")("d%s=o.longs===String?%j:%i",f,h.typeDefault.toString(),h.typeDefault.toNumber()):h.bytes?(u="["+Array.prototype.slice.call(h.typeDefault).join(",")+"]",n("if(o.bytes===String)d%s=%j",f,String.fromCharCode.apply(String,h.typeDefault))("else{")("d%s=%s",f,u)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)",f,f)("}")):n("d%s=%j",f,h.typeDefault)}n("}")}for(var c=!1,o=0;o<i.length;++o){var h=i[o],a=t.i.indexOf(h),f=d.safeProp(h.name);h.map?(c||(c=!0,n("var ks2")),n("if(m%s&&(ks2=Object.keys(m%s)).length){",f,f)("d%s={}",f)("for(var j=0;j<ks2.length;++j){"),v(n,h,a,f+"[ks2[j]]")("}")):h.repeated?(n("if(m%s&&m%s.length){",f,f)("d%s=[]",f)("for(var j=0;j<m%s.length;++j){",f),v(n,h,a,f+"[j]")("}")):(n("if(m%s!=null&&m.hasOwnProperty(%j)){",f,h.name),v(n,h,a,f),h.partOf&&n("if(o.oneofs)")("d%s=%j",d.safeProp(h.partOf.name),h.name)),n("}")}return n("return d")}},{14:14,33:33}],12:[function(t,i,n){i.exports=function(t){for(var i=f.codegen(["r","l","e"],t.name+"$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor"+(t.fieldsArray.filter(function(t){return t.map}).length?",k,value":""))("while(r.pos<c){")("var t=r.uint32()")("if(t===e)")("break")("switch(t>>>3){"),n=0;n<t.fieldsArray.length;++n){var r=t.i[n].resolve(),e=r.resolvedType instanceof u?"int32":r.type,s="m"+f.safeProp(r.name);i("case %i: {",r.id),r.map?(i("if(%s===util.emptyObject)",s)("%s={}",s)("var c2 = r.uint32()+r.pos"),h.defaults[r.keyType]!==g?i("k=%j",h.defaults[r.keyType]):i("k=null"),h.defaults[e]!==g?i("value=%j",h.defaults[e]):i("value=null"),i("while(r.pos<c2){")("var tag2=r.uint32()")("switch(tag2>>>3){")("case 1: k=r.%s(); break",r.keyType)("case 2:"),h.basic[e]===g?i("value=types[%i].decode(r,r.uint32())",n):i("value=r.%s()",e),i("break")("default:")("r.skipType(tag2&7)")("break")("}")("}"),h.long[r.keyType]!==g?i('%s[typeof k==="object"?util.longToHash(k):k]=value',s):i("%s[k]=value",s)):r.repeated?(i("if(!(%s&&%s.length))",s,s)("%s=[]",s),h.packed[e]!==g&&i("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())",s,e)("}else"),h.basic[e]===g?i(r.delimited?"%s.push(types[%i].decode(r,undefined,((t&~7)|4)))":"%s.push(types[%i].decode(r,r.uint32()))",s,n):i("%s.push(r.%s())",s,e)):h.basic[e]===g?i(r.delimited?"%s=types[%i].decode(r,undefined,((t&~7)|4))":"%s=types[%i].decode(r,r.uint32())",s,n):i("%s=r.%s()",s,e),i("break")("}")}for(i("default:")("r.skipType(t&7)")("break")("}")("}"),n=0;n<t.i.length;++n){var o=t.i[n];o.required&&i("if(!m.hasOwnProperty(%j))",o.name)("throw util.ProtocolError(%j,{instance:m})","missing required '"+o.name+"'")}return i("return m")};var u=t(14),h=t(32),f=t(33)},{14:14,32:32,33:33}],13:[function(t,i,n){i.exports=function(t){for(var i,n=a.codegen(["m","w"],t.name+"$encode")("if(!w)")("w=Writer.create()"),r=t.fieldsArray.slice().sort(a.compareFieldsById),e=0;e<r.length;++e){var s=r[e].resolve(),o=t.i.indexOf(s),u=s.resolvedType instanceof f?"int32":s.type,h=c.basic[u];i="m"+a.safeProp(s.name),s.map?(n("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){",i,s.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){",i)("w.uint32(%i).fork().uint32(%i).%s(ks[i])",(s.id<<3|2)>>>0,8|c.mapKey[s.keyType],s.keyType),h===g?n("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()",o,i):n(".uint32(%i).%s(%s[ks[i]]).ldelim()",16|h,u,i),n("}")("}")):s.repeated?(n("if(%s!=null&&%s.length){",i,i),s.packed&&c.packed[u]!==g?n("w.uint32(%i).fork()",(s.id<<3|2)>>>0)("for(var i=0;i<%s.length;++i)",i)("w.%s(%s[i])",u,i)("w.ldelim()"):(n("for(var i=0;i<%s.length;++i)",i),h===g?l(n,s,o,i+"[i]"):n("w.uint32(%i).%s(%s[i])",(s.id<<3|h)>>>0,u,i)),n("}")):(s.optional&&n("if(%s!=null&&Object.hasOwnProperty.call(m,%j))",i,s.name),h===g?l(n,s,o,i):n("w.uint32(%i).%s(%s)",(s.id<<3|h)>>>0,u,i))}return n("return w")};var f=t(14),c=t(32),a=t(33);function l(t,i,n,r){i.delimited?t("types[%i].encode(%s,w.uint32(%i)).uint32(%i)",n,r,(i.id<<3|3)>>>0,(i.id<<3|4)>>>0):t("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()",n,r,(i.id<<3|2)>>>0)}},{14:14,32:32,33:33}],14:[function(t,i,n){i.exports=s;var h=t(22),r=(((s.prototype=Object.create(h.prototype)).constructor=s).className="Enum",t(21)),e=t(33);function s(t,i,n,r,e,s){if(h.call(this,t,n),i&&"object"!=typeof i)throw TypeError("values must be an object");if(this.valuesById={},this.values=Object.create(this.valuesById),this.comment=r,this.comments=e||{},this.valuesOptions=s,this.n={},this.reserved=g,i)for(var o=Object.keys(i),u=0;u<o.length;++u)"number"==typeof i[o[u]]&&(this.valuesById[this.values[o[u]]=i[o[u]]]=o[u])}s.prototype.r=function(t){return t=this.e||t,h.prototype.r.call(this,t),Object.keys(this.values).forEach(t=>{var i=Object.assign({},this.o);this.n[t]=Object.assign(i,this.valuesOptions&&this.valuesOptions[t]&&this.valuesOptions[t].features)}),this},s.fromJSON=function(t,i){t=new s(t,i.values,i.options,i.comment,i.comments);return t.reserved=i.reserved,i.edition&&(t.e=i.edition),t.u="proto3",t},s.prototype.toJSON=function(t){t=!!t&&!!t.keepComments;return e.toObject(["edition",this.h(),"options",this.options,"valuesOptions",this.valuesOptions,"values",this.values,"reserved",this.reserved&&this.reserved.length?this.reserved:g,"comment",t?this.comment:g,"comments",t?this.comments:g])},s.prototype.add=function(t,i,n,r){if(!e.isString(t))throw TypeError("name must be a string");if(!e.isInteger(i))throw TypeError("id must be an integer");if(this.values[t]!==g)throw Error("duplicate name '"+t+"' in "+this);if(this.isReservedId(i))throw Error("id "+i+" is reserved in "+this);if(this.isReservedName(t))throw Error("name '"+t+"' is reserved in "+this);if(this.valuesById[i]!==g){if(!this.options||!this.options.allow_alias)throw Error("duplicate id "+i+" in "+this);this.values[t]=i}else this.valuesById[this.values[t]=i]=t;return r&&(this.valuesOptions===g&&(this.valuesOptions={}),this.valuesOptions[t]=r||null),this.comments[t]=n||null,this},s.prototype.remove=function(t){if(!e.isString(t))throw TypeError("name must be a string");var i=this.values[t];if(null==i)throw Error("name '"+t+"' does not exist in "+this);return delete this.valuesById[i],delete this.values[t],delete this.comments[t],this.valuesOptions&&delete this.valuesOptions[t],this},s.prototype.isReservedId=function(t){return r.isReservedId(this.reserved,t)},s.prototype.isReservedName=function(t){return r.isReservedName(this.reserved,t)}},{21:21,22:22,33:33}],15:[function(t,i,n){i.exports=o;var r,u=t(22),e=(((o.prototype=Object.create(u.prototype)).constructor=o).className="Field",t(14)),h=t(32),f=t(33),c=/^required|optional|repeated$/;function o(t,i,n,r,e,s,o){if(f.isObject(r)?(o=e,s=r,r=e=g):f.isObject(e)&&(o=s,s=e,e=g),u.call(this,t,s),!f.isInteger(i)||i<0)throw TypeError("id must be a non-negative integer");if(!f.isString(n))throw TypeError("type must be a string");if(r!==g&&!c.test(r=r.toString().toLowerCase()))throw TypeError("rule must be a string rule");if(e!==g&&!f.isString(e))throw TypeError("extend must be a string");this.rule=(r="proto3_optional"===r?"optional":r)&&"optional"!==r?r:g,this.type=n,this.id=i,this.extend=e||g,this.repeated="repeated"===r,this.map=!1,this.message=null,this.partOf=null,this.typeDefault=null,this.defaultValue=null,this.long=!!f.Long&&h.long[n]!==g,this.bytes="bytes"===n,this.resolvedType=null,this.extensionField=null,this.declaringField=null,this.comment=o}o.fromJSON=function(t,i){t=new o(t,i.id,i.type,i.rule,i.extend,i.options,i.comment);return i.edition&&(t.e=i.edition),t.u="proto3",t},Object.defineProperty(o.prototype,"required",{get:function(){return"LEGACY_REQUIRED"===this.o.field_presence}}),Object.defineProperty(o.prototype,"optional",{get:function(){return!this.required}}),Object.defineProperty(o.prototype,"delimited",{get:function(){return this.resolvedType instanceof r&&"DELIMITED"===this.o.message_encoding}}),Object.defineProperty(o.prototype,"packed",{get:function(){return"PACKED"===this.o.repeated_field_encoding}}),Object.defineProperty(o.prototype,"hasPresence",{get:function(){return!this.repeated&&!this.map&&(this.partOf||this.declaringField||this.extensionField||"IMPLICIT"!==this.o.field_presence)}}),o.prototype.setOption=function(t,i,n){return u.prototype.setOption.call(this,t,i,n)},o.prototype.toJSON=function(t){t=!!t&&!!t.keepComments;return f.toObject(["edition",this.h(),"rule","optional"!==this.rule&&this.rule||g,"type",this.type,"id",this.id,"extend",this.extend,"options",this.options,"comment",t?this.comment:g])},o.prototype.resolve=function(){var t;return this.resolved?this:((this.typeDefault=h.defaults[this.type])===g?(this.resolvedType=(this.declaringField||this).parent.lookupTypeOrEnum(this.type),this.resolvedType instanceof r?this.typeDefault=null:this.typeDefault=this.resolvedType.values[Object.keys(this.resolvedType.values)[0]]):this.options&&this.options.proto3_optional&&(this.typeDefault=null),this.options&&null!=this.options.default&&(this.typeDefault=this.options.default,this.resolvedType instanceof e&&"string"==typeof this.typeDefault&&(this.typeDefault=this.resolvedType.values[this.typeDefault])),this.options&&(this.options.packed===g||!this.resolvedType||this.resolvedType instanceof e||delete this.options.packed,Object.keys(this.options).length||(this.options=g)),this.long?(this.typeDefault=f.Long.fromNumber(this.typeDefault,"u"==(this.type[0]||"")),Object.freeze&&Object.freeze(this.typeDefault)):this.bytes&&"string"==typeof this.typeDefault&&(f.base64.test(this.typeDefault)?f.base64.decode(this.typeDefault,t=f.newBuffer(f.base64.length(this.typeDefault)),0):f.utf8.write(this.typeDefault,t=f.newBuffer(f.utf8.length(this.typeDefault)),0),this.typeDefault=t),this.map?this.defaultValue=f.emptyObject:this.repeated?this.defaultValue=f.emptyArray:this.defaultValue=this.typeDefault,this.parent instanceof r&&(this.parent.ctor.prototype[this.name]=this.defaultValue),u.prototype.resolve.call(this))},o.prototype.f=function(t){var i;return"proto2"!==t&&"proto3"!==t?{}:(t={},"required"===this.rule&&(t.field_presence="LEGACY_REQUIRED"),this.parent&&h.defaults[this.type]===g&&(i=this.parent.get(this.type.split(".").pop()))&&i instanceof r&&i.group&&(t.message_encoding="DELIMITED"),!0===this.getOption("packed")?t.repeated_field_encoding="PACKED":!1===this.getOption("packed")&&(t.repeated_field_encoding="EXPANDED"),t)},o.prototype.r=function(t){return u.prototype.r.call(this,this.e||t)},o.d=function(n,r,e,s){return"function"==typeof r?r=f.decorateType(r).name:r&&"object"==typeof r&&(r=f.decorateEnum(r).name),function(t,i){f.decorateType(t.constructor).add(new o(i,n,r,e,{default:s}))}},o.c=function(t){r=t}},{14:14,22:22,32:32,33:33}],16:[function(t,i,n){var r=i.exports=t(17);r.build="light",r.load=function(t,i,n){return(i="function"==typeof i?(n=i,new r.Root):i||new r.Root).load(t,n)},r.loadSync=function(t,i){return(i=i||new r.Root).loadSync(t)},r.encoder=t(13),r.decoder=t(12),r.verifier=t(36),r.converter=t(11),r.ReflectionObject=t(22),r.Namespace=t(21),r.Root=t(26),r.Enum=t(14),r.Type=t(31),r.Field=t(15),r.OneOf=t(23),r.MapField=t(18),r.Service=t(30),r.Method=t(20),r.Message=t(19),r.wrappers=t(37),r.types=t(32),r.util=t(33),r.ReflectionObject.c(r.Root),r.Namespace.c(r.Type,r.Service,r.Enum),r.Root.c(r.Type),r.Field.c(r.Type)},{11:11,12:12,13:13,14:14,15:15,17:17,18:18,19:19,20:20,21:21,22:22,23:23,26:26,30:30,31:31,32:32,33:33,36:36,37:37}],17:[function(t,i,n){var r=n;function e(){r.util.c(),r.Writer.c(r.BufferWriter),r.Reader.c(r.BufferReader)}r.build="minimal",r.Writer=t(38),r.BufferWriter=t(39),r.Reader=t(24),r.BufferReader=t(25),r.util=t(35),r.rpc=t(28),r.roots=t(27),r.configure=e,e()},{24:24,25:25,27:27,28:28,35:35,38:38,39:39}],18:[function(t,i,n){i.exports=s;var o=t(15),r=(((s.prototype=Object.create(o.prototype)).constructor=s).className="MapField",t(32)),u=t(33);function s(t,i,n,r,e,s){if(o.call(this,t,i,r,g,g,e,s),!u.isString(n))throw TypeError("keyType must be a string");this.keyType=n,this.resolvedKeyType=null,this.map=!0}s.fromJSON=function(t,i){return new s(t,i.id,i.keyType,i.type,i.options,i.comment)},s.prototype.toJSON=function(t){t=!!t&&!!t.keepComments;return u.toObject(["keyType",this.keyType,"type",this.type,"id",this.id,"extend",this.extend,"options",this.options,"comment",t?this.comment:g])},s.prototype.resolve=function(){if(this.resolved)return this;if(r.mapKey[this.keyType]===g)throw Error("invalid key type: "+this.keyType);return o.prototype.resolve.call(this)},s.d=function(n,r,e){return"function"==typeof e?e=u.decorateType(e).name:e&&"object"==typeof e&&(e=u.decorateEnum(e).name),function(t,i){u.decorateType(t.constructor).add(new s(i,n,r,e))}}},{15:15,32:32,33:33}],19:[function(t,i,n){i.exports=e;var r=t(35);function e(t){if(t)for(var i=Object.keys(t),n=0;n<i.length;++n)this[i[n]]=t[i[n]]}e.create=function(t){return this.$type.create(t)},e.encode=function(t,i){return this.$type.encode(t,i)},e.encodeDelimited=function(t,i){return this.$type.encodeDelimited(t,i)},e.decode=function(t){return this.$type.decode(t)},e.decodeDelimited=function(t){return this.$type.decodeDelimited(t)},e.verify=function(t){return this.$type.verify(t)},e.fromObject=function(t){return this.$type.fromObject(t)},e.toObject=function(t,i){return this.$type.toObject(t,i)},e.prototype.toJSON=function(){return this.$type.toObject(this,r.toJSONOptions)}},{35:35}],20:[function(t,i,n){i.exports=r;var f=t(22),c=(((r.prototype=Object.create(f.prototype)).constructor=r).className="Method",t(33));function r(t,i,n,r,e,s,o,u,h){if(c.isObject(e)?(o=e,e=s=g):c.isObject(s)&&(o=s,s=g),i!==g&&!c.isString(i))throw TypeError("type must be a string");if(!c.isString(n))throw TypeError("requestType must be a string");if(!c.isString(r))throw TypeError("responseType must be a string");f.call(this,t,o),this.type=i||"rpc",this.requestType=n,this.requestStream=!!e||g,this.responseType=r,this.responseStream=!!s||g,this.resolvedRequestType=null,this.resolvedResponseType=null,this.comment=u,this.parsedOptions=h}r.fromJSON=function(t,i){return new r(t,i.type,i.requestType,i.responseType,i.requestStream,i.responseStream,i.options,i.comment,i.parsedOptions)},r.prototype.toJSON=function(t){t=!!t&&!!t.keepComments;return c.toObject(["type","rpc"!==this.type&&this.type||g,"requestType",this.requestType,"requestStream",this.requestStream,"responseType",this.responseType,"responseStream",this.responseStream,"options",this.options,"comment",t?this.comment:g,"parsedOptions",this.parsedOptions])},r.prototype.resolve=function(){return this.resolved?this:(this.resolvedRequestType=this.parent.lookupType(this.requestType),this.resolvedResponseType=this.parent.lookupType(this.responseType),f.prototype.resolve.call(this))}},{22:22,33:33}],21:[function(t,i,n){i.exports=a;var s,o,u,r=t(22),h=(((a.prototype=Object.create(r.prototype)).constructor=a).className="Namespace",t(15)),f=t(33),c=t(23);function e(t,i){if(!t||!t.length)return g;for(var n={},r=0;r<t.length;++r)n[t[r].name]=t[r].toJSON(i);return n}function a(t,i){r.call(this,t,i),this.nested=g,this.a=null,this.l={},this.v=!0,this.b=!0}function l(t){t.a=null,t.l={};for(var i=t;i=i.parent;)i.l={};return t}a.fromJSON=function(t,i){return new a(t,i.options).addJSON(i.nested)},a.arrayToJSON=e,a.isReservedId=function(t,i){if(t)for(var n=0;n<t.length;++n)if("string"!=typeof t[n]&&t[n][0]<=i&&t[n][1]>i)return!0;return!1},a.isReservedName=function(t,i){if(t)for(var n=0;n<t.length;++n)if(t[n]===i)return!0;return!1},Object.defineProperty(a.prototype,"nestedArray",{get:function(){return this.a||(this.a=f.toArray(this.nested))}}),a.prototype.toJSON=function(t){return f.toObject(["options",this.options,"nested",e(this.nestedArray,t)])},a.prototype.addJSON=function(t){if(t)for(var i,n=Object.keys(t),r=0;r<n.length;++r)i=t[n[r]],this.add((i.fields!==g?s:i.values!==g?u:i.methods!==g?o:i.id!==g?h:a).fromJSON(n[r],i));return this},a.prototype.get=function(t){return this.nested&&this.nested[t]||null},a.prototype.getEnum=function(t){if(this.nested&&this.nested[t]instanceof u)return this.nested[t].values;throw Error("no such enum: "+t)},a.prototype.add=function(t){if(!(t instanceof h&&t.extend!==g||t instanceof s||t instanceof c||t instanceof u||t instanceof o||t instanceof a))throw TypeError("object must be a valid nested object");if(this.nested){var i=this.get(t.name);if(i){if(!(i instanceof a&&t instanceof a)||i instanceof s||i instanceof o)throw Error("duplicate name '"+t.name+"' in "+this);for(var n=i.nestedArray,r=0;r<n.length;++r)t.add(n[r]);this.remove(i),this.nested||(this.nested={}),t.setOptions(i.options,!0)}}else this.nested={};this.nested[t.name]=t,this instanceof s||this instanceof o||this instanceof u||this instanceof h||t.e||(t.e=t.u),this.v=!0,this.b=!0;for(var e=this;e=e.parent;)e.v=!0,e.b=!0;return t.onAdd(this),l(this)},a.prototype.remove=function(t){if(!(t instanceof r))throw TypeError("object must be a ReflectionObject");if(t.parent!==this)throw Error(t+" is not a member of "+this);return delete this.nested[t.name],Object.keys(this.nested).length||(this.nested=g),t.onRemove(this),l(this)},a.prototype.define=function(t,i){if(f.isString(t))t=t.split(".");else if(!Array.isArray(t))throw TypeError("illegal path");if(t&&t.length&&""===t[0])throw Error("path must be relative");for(var n=this;0<t.length;){var r=t.shift();if(n.nested&&n.nested[r]){if(!((n=n.nested[r])instanceof a))throw Error("path conflicts with non-namespace objects")}else n.add(n=new a(r))}return i&&n.addJSON(i),n},a.prototype.resolveAll=function(){if(this.b){this.p(this.e);var t=this.nestedArray,i=0;for(this.resolve();i<t.length;)t[i]instanceof a?t[i++].resolveAll():t[i++].resolve();this.b=!1}return this},a.prototype.p=function(i){return this.v&&(this.v=!1,i=this.e||i,r.prototype.p.call(this,i),this.nestedArray.forEach(t=>{t.p(i)})),this},a.prototype.lookup=function(t,i,n){if("boolean"==typeof i?(n=i,i=g):i&&!Array.isArray(i)&&(i=[i]),f.isString(t)&&t.length){if("."===t)return this.root;t=t.split(".")}else if(!t.length)return this;var r=t.join(".");if(""===t[0])return this.root.lookup(t.slice(1),i);var e=this.root.y&&this.root.y["."+r];if(e&&(!i||~i.indexOf(e.constructor)))return e;if((e=this.w(t,r))&&(!i||~i.indexOf(e.constructor)))return e;if(!n)for(var s=this;s.parent;){if((e=s.parent.w(t,r))&&(!i||~i.indexOf(e.constructor)))return e;s=s.parent}return null},a.prototype.w=function(t,i){if(Object.prototype.hasOwnProperty.call(this.l,i))return this.l[i];var n=this.get(t[0]),r=null;if(n)1===t.length?r=n:n instanceof a&&(t=t.slice(1),r=n.w(t,t.join(".")));else for(var e=0;e<this.nestedArray.length;++e)this.a[e]instanceof a&&(n=this.a[e].w(t,i))&&(r=n);return this.l[i]=r},a.prototype.lookupType=function(t){var i=this.lookup(t,[s]);if(i)return i;throw Error("no such type: "+t)},a.prototype.lookupEnum=function(t){var i=this.lookup(t,[u]);if(i)return i;throw Error("no such Enum '"+t+"' in "+this)},a.prototype.lookupTypeOrEnum=function(t){var i=this.lookup(t,[s,u]);if(i)return i;throw Error("no such Type or Enum '"+t+"' in "+this)},a.prototype.lookupService=function(t){var i=this.lookup(t,[o]);if(i)return i;throw Error("no such Service '"+t+"' in "+this)},a.c=function(t,i,n){s=t,o=i,u=n}},{15:15,22:22,23:23,33:33}],22:[function(t,i,n){(i.exports=c).className="ReflectionObject";const r=t(23);var e,o=t(33),s={enum_type:"OPEN",field_presence:"EXPLICIT",json_format:"ALLOW",message_encoding:"LENGTH_PREFIXED",repeated_field_encoding:"PACKED",utf8_validation:"VERIFY",enforce_naming_style:"STYLE2024",default_symbol_visibility:"EXPORT_TOP_LEVEL"},u={enum_type:"OPEN",field_presence:"EXPLICIT",json_format:"ALLOW",message_encoding:"LENGTH_PREFIXED",repeated_field_encoding:"PACKED",utf8_validation:"VERIFY",enforce_naming_style:"STYLE_LEGACY",default_symbol_visibility:"EXPORT_ALL"},h={enum_type:"CLOSED",field_presence:"EXPLICIT",json_format:"LEGACY_BEST_EFFORT",message_encoding:"LENGTH_PREFIXED",repeated_field_encoding:"EXPANDED",utf8_validation:"NONE",enforce_naming_style:"STYLE_LEGACY",default_symbol_visibility:"EXPORT_ALL"},f={enum_type:"OPEN",field_presence:"IMPLICIT",json_format:"ALLOW",message_encoding:"LENGTH_PREFIXED",repeated_field_encoding:"PACKED",utf8_validation:"VERIFY",enforce_naming_style:"STYLE_LEGACY",default_symbol_visibility:"EXPORT_ALL"};function c(t,i){if(!o.isString(t))throw TypeError("name must be a string");if(i&&!o.isObject(i))throw TypeError("options must be an object");this.options=i,this.parsedOptions=null,this.name=t,this.e=null,this.u="proto2",this.o={},this.g=!1,this.parent=null,this.resolved=!1,this.comment=null,this.filename=null}Object.defineProperties(c.prototype,{root:{get:function(){for(var t=this;null!==t.parent;)t=t.parent;return t}},fullName:{get:function(){for(var t=[this.name],i=this.parent;i;)t.unshift(i.name),i=i.parent;return t.join(".")}}}),c.prototype.toJSON=function(){throw Error()},c.prototype.onAdd=function(t){this.parent&&this.parent!==t&&this.parent.remove(this),this.parent=t,this.resolved=!1;t=t.root;t instanceof e&&t.j(this)},c.prototype.onRemove=function(t){t=t.root;t instanceof e&&t.O(this),this.parent=null,this.resolved=!1},c.prototype.resolve=function(){return this.resolved||this.root instanceof e&&(this.resolved=!0),this},c.prototype.p=function(t){return this.r(this.e||t)},c.prototype.r=function(t){if(!this.g){var i={};if(!t)throw Error("Unknown edition for "+this.fullName);var n=Object.assign(this.options?Object.assign({},this.options.features):{},this.f(t));if(this.e){if("proto2"===t)i=Object.assign({},h);else if("proto3"===t)i=Object.assign({},f);else if("2023"===t)i=Object.assign({},u);else{if("2024"!==t)throw Error("Unknown edition: "+t);i=Object.assign({},s)}this.o=Object.assign(i,n||{})}else{if(this.partOf instanceof r){t=Object.assign({},this.partOf.o);this.o=Object.assign(t,n||{})}else if(!this.declaringField){if(!this.parent)throw Error("Unable to find a parent for "+this.fullName);i=Object.assign({},this.parent.o);this.o=Object.assign(i,n||{})}this.extensionField&&(this.extensionField.o=this.o)}this.g=!0}},c.prototype.f=function(){return{}},c.prototype.getOption=function(t){return this.options?this.options[t]:g},c.prototype.setOption=function(t,i,n){return this.options||(this.options={}),/^features\./.test(t)?o.setProperty(this.options,t,i,n):n&&this.options[t]!==g||(this.getOption(t)!==i&&(this.resolved=!1),this.options[t]=i),this},c.prototype.setParsedOption=function(i,t,n){this.parsedOptions||(this.parsedOptions=[]);var r,e,s=this.parsedOptions;return n?(r=s.find(function(t){return Object.prototype.hasOwnProperty.call(t,i)}))?(e=r[i],o.setProperty(e,n,t)):((r={})[i]=o.setProperty({},n,t),s.push(r)):((e={})[i]=t,s.push(e)),this},c.prototype.setOptions=function(t,i){if(t)for(var n=Object.keys(t),r=0;r<n.length;++r)this.setOption(n[r],t[n[r]],i);return this},c.prototype.toString=function(){var t=this.constructor.className,i=this.fullName;return i.length?t+" "+i:t},c.prototype.h=function(){return this.e&&"proto3"!==this.e?this.e:g},c.c=function(t){e=t}},{23:23,33:33}],23:[function(t,i,n){i.exports=o;var e=t(22),r=(((o.prototype=Object.create(e.prototype)).constructor=o).className="OneOf",t(15)),s=t(33);function o(t,i,n,r){if(Array.isArray(i)||(n=i,i=g),e.call(this,t,n),i!==g&&!Array.isArray(i))throw TypeError("fieldNames must be an Array");this.oneof=i||[],this.fieldsArray=[],this.comment=r}function u(t){if(t.parent)for(var i=0;i<t.fieldsArray.length;++i)t.fieldsArray[i].parent||t.parent.add(t.fieldsArray[i])}o.fromJSON=function(t,i){return new o(t,i.oneof,i.options,i.comment)},o.prototype.toJSON=function(t){t=!!t&&!!t.keepComments;return s.toObject(["options",this.options,"oneof",this.oneof,"comment",t?this.comment:g])},o.prototype.add=function(t){if(t instanceof r)return t.parent&&t.parent!==this.parent&&t.parent.remove(t),this.oneof.push(t.name),this.fieldsArray.push(t),u(t.partOf=this),this;throw TypeError("field must be a Field")},o.prototype.remove=function(t){if(!(t instanceof r))throw TypeError("field must be a Field");var i=this.fieldsArray.indexOf(t);if(i<0)throw Error(t+" is not a member of "+this);return this.fieldsArray.splice(i,1),-1<(i=this.oneof.indexOf(t.name))&&this.oneof.splice(i,1),t.partOf=null,this},o.prototype.onAdd=function(t){e.prototype.onAdd.call(this,t);for(var i=0;i<this.oneof.length;++i){var n=t.get(this.oneof[i]);n&&!n.partOf&&(n.partOf=this).fieldsArray.push(n)}u(this)},o.prototype.onRemove=function(t){for(var i,n=0;n<this.fieldsArray.length;++n)(i=this.fieldsArray[n]).parent&&i.parent.remove(i);e.prototype.onRemove.call(this,t)},Object.defineProperty(o.prototype,"isProto3Optional",{get:function(){var t;return null!=this.fieldsArray&&1===this.fieldsArray.length&&(null!=(t=this.fieldsArray[0]).options&&!0===t.options.proto3_optional)}}),o.d=function(){for(var n=Array(arguments.length),t=0;t<arguments.length;)n[t]=arguments[t++];return function(t,i){s.decorateType(t.constructor).add(new o(i,n)),Object.defineProperty(t,i,{get:s.oneOfGetter(n),set:s.oneOfSetter(n)})}}},{15:15,22:22,33:33}],24:[function(t,i,n){i.exports=h;var r,e=t(35),s=e.LongBits,o=e.utf8;function u(t,i){return RangeError("index out of range: "+t.pos+" + "+(i||1)+" > "+t.len)}function h(t){this.buf=t,this.pos=0,this.len=t.length}function f(){return e.Buffer?function(t){return(h.create=function(t){return e.Buffer.isBuffer(t)?new r(t):a(t)})(t)}:a}var c,a="undefined"!=typeof Uint8Array?function(t){if(t instanceof Uint8Array||Array.isArray(t))return new h(t);throw Error("illegal buffer")}:function(t){if(Array.isArray(t))return new h(t);throw Error("illegal buffer")};function l(){var t=new s(0,0),i=0;if(!(4<this.len-this.pos)){for(;i<3;++i){if(this.pos>=this.len)throw u(this);if(t.lo=(t.lo|(127&this.buf[this.pos])<<7*i)>>>0,this.buf[this.pos++]<128)return t}return t.lo=(t.lo|(127&this.buf[this.pos++])<<7*i)>>>0,t}for(;i<4;++i)if(t.lo=(t.lo|(127&this.buf[this.pos])<<7*i)>>>0,this.buf[this.pos++]<128)return t;if(t.lo=(t.lo|(127&this.buf[this.pos])<<28)>>>0,t.hi=(t.hi|(127&this.buf[this.pos])>>4)>>>0,this.buf[this.pos++]<128)return t;if(i=0,4<this.len-this.pos){for(;i<5;++i)if(t.hi=(t.hi|(127&this.buf[this.pos])<<7*i+3)>>>0,this.buf[this.pos++]<128)return t}else for(;i<5;++i){if(this.pos>=this.len)throw u(this);if(t.hi=(t.hi|(127&this.buf[this.pos])<<7*i+3)>>>0,this.buf[this.pos++]<128)return t}throw Error("invalid varint encoding")}function d(t,i){return(t[i-4]|t[i-3]<<8|t[i-2]<<16|t[i-1]<<24)>>>0}function v(){if(this.pos+8>this.len)throw u(this,8);return new s(d(this.buf,this.pos+=4),d(this.buf,this.pos+=4))}h.create=f(),h.prototype.k=e.Array.prototype.subarray||e.Array.prototype.slice,h.prototype.uint32=(c=4294967295,function(){if(c=(127&this.buf[this.pos])>>>0,this.buf[this.pos++]<128||(c=(c|(127&this.buf[this.pos])<<7)>>>0,this.buf[this.pos++]<128||(c=(c|(127&this.buf[this.pos])<<14)>>>0,this.buf[this.pos++]<128||(c=(c|(127&this.buf[this.pos])<<21)>>>0,this.buf[this.pos++]<128||(c=(c|(15&this.buf[this.pos])<<28)>>>0,this.buf[this.pos++]<128||!((this.pos+=5)>this.len))))))return c;throw this.pos=this.len,u(this,10)}),h.prototype.int32=function(){return 0|this.uint32()},h.prototype.sint32=function(){var t=this.uint32();return t>>>1^-(1&t)|0},h.prototype.bool=function(){return 0!==this.uint32()},h.prototype.fixed32=function(){if(this.pos+4>this.len)throw u(this,4);return d(this.buf,this.pos+=4)},h.prototype.sfixed32=function(){if(this.pos+4>this.len)throw u(this,4);return 0|d(this.buf,this.pos+=4)},h.prototype.float=function(){if(this.pos+4>this.len)throw u(this,4);var t=e.float.readFloatLE(this.buf,this.pos);return this.pos+=4,t},h.prototype.double=function(){if(this.pos+8>this.len)throw u(this,4);var t=e.float.readDoubleLE(this.buf,this.pos);return this.pos+=8,t},h.prototype.bytes=function(){var t=this.uint32(),i=this.pos,n=this.pos+t;if(n>this.len)throw u(this,t);return this.pos+=t,Array.isArray(this.buf)?this.buf.slice(i,n):i===n?(t=e.Buffer)?t.alloc(0):new this.buf.constructor(0):this.k.call(this.buf,i,n)},h.prototype.string=function(){var t=this.bytes();return o.read(t,0,t.length)},h.prototype.skip=function(t){if("number"==typeof t){if(this.pos+t>this.len)throw u(this,t);this.pos+=t}else do{if(this.pos>=this.len)throw u(this)}while(128&this.buf[this.pos++]);return this},h.prototype.skipType=function(t){switch(t){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;4!=(t=7&this.uint32());)this.skipType(t);break;case 5:this.skip(4);break;default:throw Error("invalid wire type "+t+" at offset "+this.pos)}return this},h.c=function(t){r=t,h.create=f(),r.c();var i=e.Long?"toLong":"toNumber";e.merge(h.prototype,{int64:function(){return l.call(this)[i](!1)},uint64:function(){return l.call(this)[i](!0)},sint64:function(){return l.call(this).zzDecode()[i](!1)},fixed64:function(){return v.call(this)[i](!0)},sfixed64:function(){return v.call(this)[i](!1)}})}},{35:35}],25:[function(t,i,n){i.exports=s;var r=t(24),e=((s.prototype=Object.create(r.prototype)).constructor=s,t(35));function s(t){r.call(this,t)}s.c=function(){e.Buffer&&(s.prototype.k=e.Buffer.prototype.slice)},s.prototype.string=function(){var t=this.uint32();return this.buf.utf8Slice?this.buf.utf8Slice(this.pos,this.pos=Math.min(this.pos+t,this.len)):this.buf.toString("utf-8",this.pos,this.pos=Math.min(this.pos+t,this.len))},s.c()},{24:24,35:35}],26:[function(t,i,n){i.exports=h;var r,d,v,e=t(21),s=(((h.prototype=Object.create(e.prototype)).constructor=h).className="Root",t(15)),o=t(14),u=t(23),b=t(33);function h(t){e.call(this,"",t),this.deferred=[],this.files=[],this.e="proto2",this.y={}}function p(){}h.fromJSON=function(t,i){return i=i||new h,t.options&&i.setOptions(t.options),i.addJSON(t.nested).resolveAll()},h.prototype.resolvePath=b.path.resolve,h.prototype.fetch=b.fetch,h.prototype.load=function t(i,s,e){"function"==typeof s&&(e=s,s=g);var o=this;if(!e)return b.asPromise(t,o,i,s);var u=e===p;function h(t,i){if(e){if(u)throw t;i&&i.resolveAll();var n=e;e=null,n(t,i)}}function f(t){var i=t.lastIndexOf("google/protobuf/");if(-1<i){t=t.substring(i);if(t in v)return t}return null}function c(t,i){try{if(b.isString(i)&&"{"==(i[0]||"")&&(i=JSON.parse(i)),b.isString(i)){d.filename=t;var n,r=d(i,o,s),e=0;if(r.imports)for(;e<r.imports.length;++e)(n=f(r.imports[e])||o.resolvePath(t,r.imports[e]))&&a(n);if(r.weakImports)for(e=0;e<r.weakImports.length;++e)(n=f(r.weakImports[e])||o.resolvePath(t,r.weakImports[e]))&&a(n,!0)}else o.setOptions(i.options).addJSON(i.nested)}catch(t){h(t)}u||l||h(null,o)}function a(n,r){if(n=f(n)||n,!~o.files.indexOf(n))if(o.files.push(n),n in v)u?c(n,v[n]):(++l,setTimeout(function(){--l,c(n,v[n])}));else if(u){var t;try{t=b.fs.readFileSync(n).toString("utf8")}catch(t){return void(r||h(t))}c(n,t)}else++l,o.fetch(n,function(t,i){--l,e&&(t?r?l||h(null,o):h(t):c(n,i))})}var l=0;b.isString(i)&&(i=[i]);for(var n,r=0;r<i.length;++r)(n=o.resolvePath("",i[r]))&&a(n);return u?o.resolveAll():l||h(null,o),o},h.prototype.loadSync=function(t,i){if(b.isNode)return this.load(t,i,p);throw Error("not supported")},h.prototype.resolveAll=function(){if(!this.b)return this;if(this.deferred.length)throw Error("unresolvable extensions: "+this.deferred.map(function(t){return"'extend "+t.extend+"' in "+t.parent.fullName}).join(", "));return e.prototype.resolveAll.call(this)};var f=/^[A-Z]/;function c(t,i){var n,r=i.parent.lookup(i.extend);if(r)return n=new s(i.fullName,i.id,i.type,i.rule,g,i.options),r.get(n.name)||((n.declaringField=i).extensionField=n,r.add(n)),1}h.prototype.j=function(t){if(t instanceof s)t.extend===g||t.extensionField||c(0,t)||this.deferred.push(t);else if(t instanceof o)f.test(t.name)&&(t.parent[t.name]=t.values);else if(!(t instanceof u)){if(t instanceof r)for(var i=0;i<this.deferred.length;)c(0,this.deferred[i])?this.deferred.splice(i,1):++i;for(var n=0;n<t.nestedArray.length;++n)this.j(t.a[n]);f.test(t.name)&&(t.parent[t.name]=t)}(t instanceof r||t instanceof o||t instanceof s)&&(this.y[t.fullName]=t)},h.prototype.O=function(t){var i;if(t instanceof s)t.extend!==g&&(t.extensionField?(t.extensionField.parent.remove(t.extensionField),t.extensionField=null):-1<(i=this.deferred.indexOf(t))&&this.deferred.splice(i,1));else if(t instanceof o)f.test(t.name)&&delete t.parent[t.name];else if(t instanceof e){for(var n=0;n<t.nestedArray.length;++n)this.O(t.a[n]);f.test(t.name)&&delete t.parent[t.name]}delete this.y[t.fullName]},h.c=function(t,i,n){r=t,d=i,v=n}},{14:14,15:15,21:21,23:23,33:33}],27:[function(t,i,n){i.exports={}},{}],28:[function(t,i,n){n.Service=t(29)},{29:29}],29:[function(t,i,n){i.exports=r;var u=t(35);function r(t,i,n){if("function"!=typeof t)throw TypeError("rpcImpl must be a function");u.EventEmitter.call(this),this.rpcImpl=t,this.requestDelimited=!!i,this.responseDelimited=!!n}((r.prototype=Object.create(u.EventEmitter.prototype)).constructor=r).prototype.rpcCall=function t(n,i,r,e,s){if(!e)throw TypeError("request must be specified");var o=this;if(!s)return u.asPromise(t,o,n,i,r,e);if(!o.rpcImpl)return setTimeout(function(){s(Error("already ended"))},0),g;try{return o.rpcImpl(n,i[o.requestDelimited?"encodeDelimited":"encode"](e).finish(),function(t,i){if(t)return o.emit("error",t,n),s(t);if(null===i)return o.end(!0),g;if(!(i instanceof r))try{i=r[o.responseDelimited?"decodeDelimited":"decode"](i)}catch(t){return o.emit("error",t,n),s(t)}return o.emit("data",i,n),s(null,i)})}catch(t){return o.emit("error",t,n),setTimeout(function(){s(t)},0),g}},r.prototype.end=function(t){return this.rpcImpl&&(t||this.rpcImpl(null,null,null),this.rpcImpl=null,this.emit("end").off()),this}},{35:35}],30:[function(t,i,n){i.exports=o;var r=t(21),s=(((o.prototype=Object.create(r.prototype)).constructor=o).className="Service",t(20)),u=t(33),h=t(28);function o(t,i){r.call(this,t,i),this.methods={},this.A=null}function e(t){return t.A=null,t}o.fromJSON=function(t,i){var n=new o(t,i.options);if(i.methods)for(var r=Object.keys(i.methods),e=0;e<r.length;++e)n.add(s.fromJSON(r[e],i.methods[r[e]]));return i.nested&&n.addJSON(i.nested),i.edition&&(n.e=i.edition),n.comment=i.comment,n.u="proto3",n},o.prototype.toJSON=function(t){var i=r.prototype.toJSON.call(this,t),n=!!t&&!!t.keepComments;return u.toObject(["edition",this.h(),"options",i&&i.options||g,"methods",r.arrayToJSON(this.methodsArray,t)||{},"nested",i&&i.nested||g,"comment",n?this.comment:g])},Object.defineProperty(o.prototype,"methodsArray",{get:function(){return this.A||(this.A=u.toArray(this.methods))}}),o.prototype.get=function(t){return this.methods[t]||r.prototype.get.call(this,t)},o.prototype.resolveAll=function(){if(this.b){r.prototype.resolve.call(this);for(var t=this.methodsArray,i=0;i<t.length;++i)t[i].resolve()}return this},o.prototype.p=function(i){return this.v&&(i=this.e||i,r.prototype.p.call(this,i),this.methodsArray.forEach(t=>{t.p(i)})),this},o.prototype.add=function(t){if(this.get(t.name))throw Error("duplicate name '"+t.name+"' in "+this);return t instanceof s?e((this.methods[t.name]=t).parent=this):r.prototype.add.call(this,t)},o.prototype.remove=function(t){if(t instanceof s){if(this.methods[t.name]!==t)throw Error(t+" is not a member of "+this);return delete this.methods[t.name],t.parent=null,e(this)}return r.prototype.remove.call(this,t)},o.prototype.create=function(t,i,n){for(var r,e=new h.Service(t,i,n),s=0;s<this.methodsArray.length;++s){var o=u.lcFirst((r=this.A[s]).resolve().name).replace(/[^$\w_]/g,"");e[o]=u.codegen(["r","c"],u.isReserved(o)?o+"_":o)("return this.rpcCall(m,q,s,r,c)")({m:r,q:r.resolvedRequestType.ctor,s:r.resolvedResponseType.ctor})}return e}},{20:20,21:21,28:28,33:33}],31:[function(t,i,n){i.exports=w;var o=t(21),u=(((w.prototype=Object.create(o.prototype)).constructor=w).className="Type",t(14)),h=t(23),f=t(15),c=t(18),a=t(30),e=t(19),s=t(24),l=t(38),d=t(33),v=t(13),b=t(12),p=t(36),y=t(11),m=t(37);function w(t,i){o.call(this,t,i),this.fields={},this.oneofs=g,this.extensions=g,this.reserved=g,this.group=g,this._=null,this.i=null,this.T=null,this.L=null}function r(t){return t._=t.i=t.T=null,delete t.encode,delete t.decode,delete t.verify,t}Object.defineProperties(w.prototype,{fieldsById:{get:function(){if(!this._){this._={};for(var t=Object.keys(this.fields),i=0;i<t.length;++i){var n=this.fields[t[i]],r=n.id;if(this._[r])throw Error("duplicate id "+r+" in "+this);this._[r]=n}}return this._}},fieldsArray:{get:function(){return this.i||(this.i=d.toArray(this.fields))}},oneofsArray:{get:function(){return this.T||(this.T=d.toArray(this.oneofs))}},ctor:{get:function(){return this.L||(this.ctor=w.generateConstructor(this)())},set:function(t){for(var i=t.prototype,n=(i instanceof e||((t.prototype=new e).constructor=t,d.merge(t.prototype,i)),t.$type=t.prototype.$type=this,d.merge(t,e,!0),this.L=t,0);n<this.fieldsArray.length;++n)this.i[n].resolve();for(var r={},n=0;n<this.oneofsArray.length;++n)r[this.T[n].resolve().name]={get:d.oneOfGetter(this.T[n].oneof),set:d.oneOfSetter(this.T[n].oneof)};n&&Object.defineProperties(t.prototype,r)}}}),w.generateConstructor=function(t){for(var i,n=d.codegen(["p"],t.name),r=0;r<t.fieldsArray.length;++r)(i=t.i[r]).map?n("this%s={}",d.safeProp(i.name)):i.repeated&&n("this%s=[]",d.safeProp(i.name));return n("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]")},w.fromJSON=function(t,i){for(var n=new w(t,i.options),r=(n.extensions=i.extensions,n.reserved=i.reserved,Object.keys(i.fields)),e=0;e<r.length;++e)n.add((void 0!==i.fields[r[e]].keyType?c:f).fromJSON(r[e],i.fields[r[e]]));if(i.oneofs)for(r=Object.keys(i.oneofs),e=0;e<r.length;++e)n.add(h.fromJSON(r[e],i.oneofs[r[e]]));if(i.nested)for(r=Object.keys(i.nested),e=0;e<r.length;++e){var s=i.nested[r[e]];n.add((s.id!==g?f:s.fields!==g?w:s.values!==g?u:s.methods!==g?a:o).fromJSON(r[e],s))}return i.extensions&&i.extensions.length&&(n.extensions=i.extensions),i.reserved&&i.reserved.length&&(n.reserved=i.reserved),i.group&&(n.group=!0),i.comment&&(n.comment=i.comment),i.edition&&(n.e=i.edition),n.u="proto3",n},w.prototype.toJSON=function(t){var i=o.prototype.toJSON.call(this,t),n=!!t&&!!t.keepComments;return d.toObject(["edition",this.h(),"options",i&&i.options||g,"oneofs",o.arrayToJSON(this.oneofsArray,t),"fields",o.arrayToJSON(this.fieldsArray.filter(function(t){return!t.declaringField}),t)||{},"extensions",this.extensions&&this.extensions.length?this.extensions:g,"reserved",this.reserved&&this.reserved.length?this.reserved:g,"group",this.group||g,"nested",i&&i.nested||g,"comment",n?this.comment:g])},w.prototype.resolveAll=function(){if(this.b){o.prototype.resolveAll.call(this);for(var t=this.oneofsArray,i=0;i<t.length;)t[i++].resolve();for(var n=this.fieldsArray,i=0;i<n.length;)n[i++].resolve()}return this},w.prototype.p=function(i){return this.v&&(i=this.e||i,o.prototype.p.call(this,i),this.oneofsArray.forEach(t=>{t.r(i)}),this.fieldsArray.forEach(t=>{t.r(i)})),this},w.prototype.get=function(t){return this.fields[t]||this.oneofs&&this.oneofs[t]||this.nested&&this.nested[t]||null},w.prototype.add=function(t){if(this.get(t.name))throw Error("duplicate name '"+t.name+"' in "+this);if(t instanceof f&&t.extend===g){if((this._||this.fieldsById)[t.id])throw Error("duplicate id "+t.id+" in "+this);if(this.isReservedId(t.id))throw Error("id "+t.id+" is reserved in "+this);if(this.isReservedName(t.name))throw Error("name '"+t.name+"' is reserved in "+this);return t.parent&&t.parent.remove(t),(this.fields[t.name]=t).message=this,t.onAdd(this),r(this)}return t instanceof h?(this.oneofs||(this.oneofs={}),(this.oneofs[t.name]=t).onAdd(this),r(this)):o.prototype.add.call(this,t)},w.prototype.remove=function(t){if(t instanceof f&&t.extend===g){if(this.fields&&this.fields[t.name]===t)return delete this.fields[t.name],t.parent=null,t.onRemove(this),r(this);throw Error(t+" is not a member of "+this)}if(t instanceof h){if(this.oneofs&&this.oneofs[t.name]===t)return delete this.oneofs[t.name],t.parent=null,t.onRemove(this),r(this);throw Error(t+" is not a member of "+this)}return o.prototype.remove.call(this,t)},w.prototype.isReservedId=function(t){return o.isReservedId(this.reserved,t)},w.prototype.isReservedName=function(t){return o.isReservedName(this.reserved,t)},w.prototype.create=function(t){return new this.ctor(t)},w.prototype.setup=function(){for(var t=this.fullName,i=[],n=0;n<this.fieldsArray.length;++n)i.push(this.i[n].resolve().resolvedType);this.encode=v(this)({Writer:l,types:i,util:d}),this.decode=b(this)({Reader:s,types:i,util:d}),this.verify=p(this)({types:i,util:d}),this.fromObject=y.fromObject(this)({types:i,util:d}),this.toObject=y.toObject(this)({types:i,util:d});var r,t=m[t];return t&&((r=Object.create(this)).fromObject=this.fromObject,this.fromObject=t.fromObject.bind(r),r.toObject=this.toObject,this.toObject=t.toObject.bind(r)),this},w.prototype.encode=function(t,i){return this.setup().encode(t,i)},w.prototype.encodeDelimited=function(t,i){return this.encode(t,i&&i.len?i.fork():i).ldelim()},w.prototype.decode=function(t,i){return this.setup().decode(t,i)},w.prototype.decodeDelimited=function(t){return t instanceof s||(t=s.create(t)),this.decode(t,t.uint32())},w.prototype.verify=function(t){return this.setup().verify(t)},w.prototype.fromObject=function(t){return this.setup().fromObject(t)},w.prototype.toObject=function(t,i){return this.setup().toObject(t,i)},w.d=function(i){return function(t){d.decorateType(t,i)}}},{11:11,12:12,13:13,14:14,15:15,18:18,19:19,21:21,23:23,24:24,30:30,33:33,36:36,37:37,38:38}],32:[function(t,i,n){var t=t(33),e=["double","float","int32","uint32","sint32","fixed32","sfixed32","int64","uint64","sint64","fixed64","sfixed64","bool","string","bytes"];function r(t,i){var n=0,r={};for(i|=0;n<t.length;)r[e[n+i]]=t[n++];return r}n.basic=r([1,5,0,0,0,5,5,0,0,0,1,1,0,2,2]),n.defaults=r([0,0,0,0,0,0,0,0,0,0,0,0,!1,"",t.emptyArray,null]),n.long=r([0,0,0,1,1],7),n.mapKey=r([0,0,0,5,5,0,0,0,1,1,0,2],2),n.packed=r([1,5,0,0,0,5,5,0,0,0,1,1,0])},{33:33}],33:[function(n,t,i){var r,e,s=t.exports=n(35),o=n(27),u=(s.codegen=n(3),s.fetch=n(5),s.path=n(8),s.fs=s.inquire("fs"),s.toArray=function(t){if(t){for(var i=Object.keys(t),n=Array(i.length),r=0;r<i.length;)n[r]=t[i[r++]];return n}return[]},s.toObject=function(t){for(var i={},n=0;n<t.length;){var r=t[n++],e=t[n++];e!==g&&(i[r]=e)}return i},/\\/g),h=/"/g,f=(s.isReserved=function(t){return/^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(t)},s.safeProp=function(t){return!/^[$\w_]+$/.test(t)||s.isReserved(t)?'["'+t.replace(u,"\\\\").replace(h,'\\"')+'"]':"."+t},s.ucFirst=function(t){return(t[0]||"").toUpperCase()+t.substring(1)},/_([a-z])/g),c=(s.camelCase=function(t){return t.substring(0,1)+t.substring(1).replace(f,function(t,i){return i.toUpperCase()})},s.compareFieldsById=function(t,i){return t.id-i.id},s.decorateType=function(t,i){return t.$type?(i&&t.$type.name!==i&&(s.decorateRoot.remove(t.$type),t.$type.name=i,s.decorateRoot.add(t.$type)),t.$type):(i=new(r=r||n(31))(i||t.name),s.decorateRoot.add(i),i.ctor=t,Object.defineProperty(t,"$type",{value:i,enumerable:!1}),Object.defineProperty(t.prototype,"$type",{value:i,enumerable:!1}),i)},0);s.decorateEnum=function(t){var i;return t.$type||(i=new(e=e||n(14))("Enum"+c++,t),s.decorateRoot.add(i),Object.defineProperty(t,"$type",{value:i,enumerable:!1}),i)},s.setProperty=function(t,i,n,s){if("object"!=typeof t)throw TypeError("dst must be an object");if(i)return function t(i,n,r){var e=n.shift();if("__proto__"!==e&&"prototype"!==e)if(0<n.length)i[e]=t(i[e]||{},n,r);else{if((n=i[e])&&s)return i;n&&(r=[].concat(n).concat(r)),i[e]=r}return i}(t,i=i.split("."),n);throw TypeError("path must be specified")},Object.defineProperty(s,"decorateRoot",{get:function(){return o.decorated||(o.decorated=new(n(26)))}})},{14:14,26:26,27:27,3:3,31:31,35:35,5:5,8:8}],34:[function(t,i,n){i.exports=e;var r=t(35);function e(t,i){this.lo=t>>>0,this.hi=i>>>0}var s=e.zero=new e(0,0),o=(s.toNumber=function(){return 0},s.zzEncode=s.zzDecode=function(){return this},s.length=function(){return 1},e.zeroHash="\0\0\0\0\0\0\0\0",e.fromNumber=function(t){var i,n;return 0===t?s:(n=(t=(i=t<0)?-t:t)>>>0,t=(t-n)/4294967296>>>0,i&&(t=~t>>>0,n=~n>>>0,4294967295<++n&&(n=0,4294967295<++t&&(t=0))),new e(n,t))},e.from=function(t){if("number"==typeof t)return e.fromNumber(t);if(r.isString(t)){if(!r.Long)return e.fromNumber(parseInt(t,10));t=r.Long.fromString(t)}return t.low||t.high?new e(t.low>>>0,t.high>>>0):s},e.prototype.toNumber=function(t){var i;return!t&&this.hi>>>31?(t=1+~this.lo>>>0,i=~this.hi>>>0,-(t+4294967296*(i=t?i:i+1>>>0))):this.lo+4294967296*this.hi},e.prototype.toLong=function(t){return r.Long?new r.Long(0|this.lo,0|this.hi,!!t):{low:0|this.lo,high:0|this.hi,unsigned:!!t}},String.prototype.charCodeAt);e.fromHash=function(t){return"\0\0\0\0\0\0\0\0"===t?s:new e((o.call(t,0)|o.call(t,1)<<8|o.call(t,2)<<16|o.call(t,3)<<24)>>>0,(o.call(t,4)|o.call(t,5)<<8|o.call(t,6)<<16|o.call(t,7)<<24)>>>0)},e.prototype.toHash=function(){return String.fromCharCode(255&this.lo,this.lo>>>8&255,this.lo>>>16&255,this.lo>>>24,255&this.hi,this.hi>>>8&255,this.hi>>>16&255,this.hi>>>24)},e.prototype.zzEncode=function(){var t=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^t)>>>0,this.lo=(this.lo<<1^t)>>>0,this},e.prototype.zzDecode=function(){var t=-(1&this.lo);return this.lo=((this.lo>>>1|this.hi<<31)^t)>>>0,this.hi=(this.hi>>>1^t)>>>0,this},e.prototype.length=function(){var t=this.lo,i=(this.lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;return 0==n?0==i?t<16384?t<128?1:2:t<2097152?3:4:i<16384?i<128?5:6:i<2097152?7:8:n<128?9:10}},{35:35}],35:[function(t,i,n){var r=n;function e(t,i,n){for(var r=Object.keys(i),e=0;e<r.length;++e)t[r[e]]!==g&&n||(t[r[e]]=i[r[e]]);return t}function s(t){function n(t,i){if(!(this instanceof n))return new n(t,i);Object.defineProperty(this,"message",{get:function(){return t}}),Error.captureStackTrace?Error.captureStackTrace(this,n):Object.defineProperty(this,"stack",{value:Error().stack||""}),i&&e(this,i)}return n.prototype=Object.create(Error.prototype,{constructor:{value:n,writable:!0,enumerable:!1,configurable:!0},name:{get:function(){return t},set:g,enumerable:!1,configurable:!0},toString:{value:function(){return this.name+": "+this.message},writable:!0,enumerable:!1,configurable:!0}}),n}r.asPromise=t(1),r.base64=t(2),r.EventEmitter=t(4),r.float=t(6),r.inquire=t(7),r.utf8=t(10),r.pool=t(9),r.LongBits=t(34),r.isNode=!!("undefined"!=typeof global&&global&&global.process&&global.process.versions&&global.process.versions.node),r.global=r.isNode&&global||"undefined"!=typeof window&&window||"undefined"!=typeof self&&self||this,r.emptyArray=Object.freeze?Object.freeze([]):[],r.emptyObject=Object.freeze?Object.freeze({}):{},r.isInteger=Number.isInteger||function(t){return"number"==typeof t&&isFinite(t)&&Math.floor(t)===t},r.isString=function(t){return"string"==typeof t||t instanceof String},r.isObject=function(t){return t&&"object"==typeof t},r.isset=r.isSet=function(t,i){var n=t[i];return null!=n&&t.hasOwnProperty(i)&&("object"!=typeof n||0<(Array.isArray(n)?n:Object.keys(n)).length)},r.Buffer=function(){try{var t=r.inquire("buffer").Buffer;return t.prototype.utf8Write?t:null}catch(t){return null}}(),r.S=null,r.x=null,r.newBuffer=function(t){return"number"==typeof t?r.Buffer?r.x(t):new r.Array(t):r.Buffer?r.S(t):"undefined"==typeof Uint8Array?t:new Uint8Array(t)},r.Array="undefined"!=typeof Uint8Array?Uint8Array:Array,r.Long=r.global.dcodeIO&&r.global.dcodeIO.Long||r.global.Long||r.inquire("long"),r.key2Re=/^true|false|0|1$/,r.key32Re=/^-?(?:0|[1-9][0-9]*)$/,r.key64Re=/^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/,r.longToHash=function(t){return t?r.LongBits.from(t).toHash():r.LongBits.zeroHash},r.longFromHash=function(t,i){t=r.LongBits.fromHash(t);return r.Long?r.Long.fromBits(t.lo,t.hi,i):t.toNumber(!!i)},r.merge=e,r.lcFirst=function(t){return(t[0]||"").toLowerCase()+t.substring(1)},r.newError=s,r.ProtocolError=s("ProtocolError"),r.oneOfGetter=function(t){for(var n={},i=0;i<t.length;++i)n[t[i]]=1;return function(){for(var t=Object.keys(this),i=t.length-1;-1<i;--i)if(1===n[t[i]]&&this[t[i]]!==g&&null!==this[t[i]])return t[i]}},r.oneOfSetter=function(n){return function(t){for(var i=0;i<n.length;++i)n[i]!==t&&delete this[n[i]]}},r.toJSONOptions={longs:String,enums:String,bytes:String,json:!0},r.c=function(){var n=r.Buffer;n?(r.S=n.from!==Uint8Array.from&&n.from||function(t,i){return new n(t,i)},r.x=n.allocUnsafe||function(t){return new n(t)}):r.S=r.x=null}},{1:1,10:10,2:2,34:34,4:4,6:6,7:7,9:9}],36:[function(t,i,n){i.exports=function(t){var i=h.codegen(["m"],t.name+"$verify")('if(typeof m!=="object"||m===null)')("return%j","object expected"),n=t.oneofsArray,r={};n.length&&i("var p={}");for(var e=0;e<t.fieldsArray.length;++e){var s,o=t.i[e].resolve(),u="m"+h.safeProp(o.name);o.optional&&i("if(%s!=null&&m.hasOwnProperty(%j)){",u,o.name),o.map?(i("if(!util.isObject(%s))",u)("return%j",f(o,"object"))("var k=Object.keys(%s)",u)("for(var i=0;i<k.length;++i){"),function(t,i,n){switch(i.keyType){case"int32":case"uint32":case"sint32":case"fixed32":case"sfixed32":t("if(!util.key32Re.test(%s))",n)("return%j",f(i,"integer key"));break;case"int64":case"uint64":case"sint64":case"fixed64":case"sfixed64":t("if(!util.key64Re.test(%s))",n)("return%j",f(i,"integer|Long key"));break;case"bool":t("if(!util.key2Re.test(%s))",n)("return%j",f(i,"boolean key"))}}(i,o,"k[i]"),c(i,o,e,u+"[k[i]]")("}")):o.repeated?(i("if(!Array.isArray(%s))",u)("return%j",f(o,"array"))("for(var i=0;i<%s.length;++i){",u),c(i,o,e,u+"[i]")("}")):(o.partOf&&(s=h.safeProp(o.partOf.name),1===r[o.partOf.name]&&i("if(p%s===1)",s)("return%j",o.partOf.name+": multiple values"),r[o.partOf.name]=1,i("p%s=1",s)),c(i,o,e,u)),o.optional&&i("}")}return i("return null")};var o=t(14),h=t(33);function f(t,i){return t.name+": "+i+(t.repeated&&"array"!==i?"[]":t.map&&"object"!==i?"{k:"+t.keyType+"}":"")+" expected"}function c(t,i,n,r){if(i.resolvedType)if(i.resolvedType instanceof o){t("switch(%s){",r)("default:")("return%j",f(i,"enum value"));for(var e=Object.keys(i.resolvedType.values),s=0;s<e.length;++s)t("case %i:",i.resolvedType.values[e[s]]);t("break")("}")}else t("{")("var e=types[%i].verify(%s);",n,r)("if(e)")("return%j+e",i.name+".")("}");else switch(i.type){case"int32":case"uint32":case"sint32":case"fixed32":case"sfixed32":t("if(!util.isInteger(%s))",r)("return%j",f(i,"integer"));break;case"int64":case"uint64":case"sint64":case"fixed64":case"sfixed64":t("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))",r,r,r,r)("return%j",f(i,"integer|Long"));break;case"float":case"double":t('if(typeof %s!=="number")',r)("return%j",f(i,"number"));break;case"bool":t('if(typeof %s!=="boolean")',r)("return%j",f(i,"boolean"));break;case"string":t("if(!util.isString(%s))",r)("return%j",f(i,"string"));break;case"bytes":t('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))',r,r,r)("return%j",f(i,"buffer"))}return t}},{14:14,33:33}],37:[function(t,i,n){var o=t(19);n[".google.protobuf.Any"]={fromObject:function(t){if(t&&t["@type"]){var i,n=t["@type"].substring(1+t["@type"].lastIndexOf("/")),n=this.lookup(n);if(n)return~(i="."==(t["@type"][0]||"")?t["@type"].slice(1):t["@type"]).indexOf("/")||(i="/"+i),this.create({type_url:i,value:n.encode(n.fromObject(t)).finish()})}return this.fromObject(t)},toObject:function(t,i){var n,r,e="",s="";return i&&i.json&&t.type_url&&t.value&&(s=t.type_url.substring(1+t.type_url.lastIndexOf("/")),e=t.type_url.substring(0,1+t.type_url.lastIndexOf("/")),(n=this.lookup(s))&&(t=n.decode(t.value))),!(t instanceof this.ctor)&&t instanceof o?(n=t.$type.toObject(t,i),r="."===t.$type.fullName[0]?t.$type.fullName.slice(1):t.$type.fullName,n["@type"]=s=(e=""===e?"type.googleapis.com/":e)+r,n):this.toObject(t,i)}}},{19:19}],38:[function(t,i,n){i.exports=a;var r,e=t(35),s=e.LongBits,o=e.base64,u=e.utf8;function h(t,i,n){this.fn=t,this.len=i,this.next=g,this.val=n}function f(){}function c(t){this.head=t.head,this.tail=t.tail,this.len=t.len,this.next=t.states}function a(){this.len=0,this.head=new h(f,0,0),this.tail=this.head,this.states=null}function l(){return e.Buffer?function(){return(a.create=function(){return new r})()}:function(){return new a}}function d(t,i,n){i[n]=255&t}function v(t,i){this.len=t,this.next=g,this.val=i}function b(t,i,n){for(;t.hi;)i[n++]=127&t.lo|128,t.lo=(t.lo>>>7|t.hi<<25)>>>0,t.hi>>>=7;for(;127<t.lo;)i[n++]=127&t.lo|128,t.lo=t.lo>>>7;i[n++]=t.lo}function p(t,i,n){i[n]=255&t,i[n+1]=t>>>8&255,i[n+2]=t>>>16&255,i[n+3]=t>>>24}a.create=l(),a.alloc=function(t){return new e.Array(t)},e.Array!==Array&&(a.alloc=e.pool(a.alloc,e.Array.prototype.subarray)),a.prototype.P=function(t,i,n){return this.tail=this.tail.next=new h(t,i,n),this.len+=i,this},(v.prototype=Object.create(h.prototype)).fn=function(t,i,n){for(;127<t;)i[n++]=127&t|128,t>>>=7;i[n]=t},a.prototype.uint32=function(t){return this.len+=(this.tail=this.tail.next=new v((t>>>=0)<128?1:t<16384?2:t<2097152?3:t<268435456?4:5,t)).len,this},a.prototype.int32=function(t){return t<0?this.P(b,10,s.fromNumber(t)):this.uint32(t)},a.prototype.sint32=function(t){return this.uint32((t<<1^t>>31)>>>0)},a.prototype.int64=a.prototype.uint64=function(t){t=s.from(t);return this.P(b,t.length(),t)},a.prototype.sint64=function(t){t=s.from(t).zzEncode();return this.P(b,t.length(),t)},a.prototype.bool=function(t){return this.P(d,1,t?1:0)},a.prototype.sfixed32=a.prototype.fixed32=function(t){return this.P(p,4,t>>>0)},a.prototype.sfixed64=a.prototype.fixed64=function(t){t=s.from(t);return this.P(p,4,t.lo).P(p,4,t.hi)},a.prototype.float=function(t){return this.P(e.float.writeFloatLE,4,t)},a.prototype.double=function(t){return this.P(e.float.writeDoubleLE,8,t)};var y=e.Array.prototype.set?function(t,i,n){i.set(t,n)}:function(t,i,n){for(var r=0;r<t.length;++r)i[n+r]=t[r]};a.prototype.bytes=function(t){var i,n=t.length>>>0;return n?(e.isString(t)&&(i=a.alloc(n=o.length(t)),o.decode(t,i,0),t=i),this.uint32(n).P(y,n,t)):this.P(d,1,0)},a.prototype.string=function(t){var i=u.length(t);return i?this.uint32(i).P(u.write,i,t):this.P(d,1,0)},a.prototype.fork=function(){return this.states=new c(this),this.head=this.tail=new h(f,0,0),this.len=0,this},a.prototype.reset=function(){return this.states?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new h(f,0,0),this.len=0),this},a.prototype.ldelim=function(){var t=this.head,i=this.tail,n=this.len;return this.reset().uint32(n),n&&(this.tail.next=t.next,this.tail=i,this.len+=n),this},a.prototype.finish=function(){for(var t=this.head.next,i=this.constructor.alloc(this.len),n=0;t;)t.fn(t.val,i,n),n+=t.len,t=t.next;return i},a.c=function(t){r=t,a.create=l(),r.c()}},{35:35}],39:[function(t,i,n){i.exports=s;var r=t(38),e=((s.prototype=Object.create(r.prototype)).constructor=s,t(35));function s(){r.call(this)}function o(t,i,n){t.length<40?e.utf8.write(t,i,n):i.utf8Write?i.utf8Write(t,n):i.write(t,n)}s.c=function(){s.alloc=e.x,s.writeBytesBuffer=e.Buffer&&e.Buffer.prototype instanceof Uint8Array&&"set"===e.Buffer.prototype.set.name?function(t,i,n){i.set(t,n)}:function(t,i,n){if(t.copy)t.copy(i,n,0,t.length);else for(var r=0;r<t.length;)i[n++]=t[r++]}},s.prototype.bytes=function(t){var i=(t=e.isString(t)?e.S(t,"base64"):t).length>>>0;return this.uint32(i),i&&this.P(s.writeBytesBuffer,i,t),this},s.prototype.string=function(t){var i=e.Buffer.byteLength(t);return this.uint32(i),i&&this.P(o,i,t),this},s.c()},{35:35,38:38}]},{},[16])}();
/* eslint-enable */
// #endregion

const extendedMetadataJsonDescriptor = {
  nested: {
    Message: {
      fields: {
        header: { type: "Header", id: 1 },
        request: { type: "Request", id: 2, rule: "repeated" },
      },
    },
    Header: {
      fields: {
        country: { type: "string", id: 1 },
        catalogue: { type: "string", id: 2 },
        task_id: { type: "bytes", id: 3 },
      },
    },
    Request: {
      fields: {
        entity_uri: { type: "string", id: 1 },
        query: { type: "Query", id: 2 },
      },
    },
    Query: {
      fields: {
        extension_kind: { type: "uint32", id: 1 },
      },
    },
  },
};

const audioFeaturesJsonDescriptor = {
  nested: {
    Message: {
      fields: {
        header: { type: "Header", id: 1 },
        extension_kind: { type: "uint32", id: 2 },
        response: { type: "Response", id: 3, rule: "repeated" },
      },
    },
    Header: {
      fields: {
        status: { type: "uint32", id: 1 },
      },
    },
    Response: {
      fields: {
        info: { type: "ResponseInfo", id: 1 },
        track: { type: "string", id: 2 },
        attributes: { type: "AudioAttributesWrapper", id: 3, rule: "optional" },
      },
    },
    ResponseInfo: {
      fields: {
        status: { type: "uint32", id: 1 },
      },
    },
    AudioAttributesWrapper: {
      fields: {
        typestr: { type: "string", id: 1 },
        attributes: { type: "AudioAttributes", id: 2 },
      },
    },
    AudioAttributes: {
      fields: {
        bpm: { type: "double", id: 1 },
        key: { type: "Key", id: 2 },
      },
    },
    Key: {
      fields: {
        key: { type: "string", id: 1 },
        majorMinor: { type: "uint32", id: 2 },
        camelot: { type: "CamelotKey", id: 3 },
      },
    },
    CamelotKey: {
      fields: {
        key: { type: "string", id: 1 },
        backgroundColor: { type: "string", id: 2 },
      },
    },
  },
};

const trackMetadataJsonDescriptor = {
  nested: {
    Message: {
      fields: {
        header: { type: "Header", id: 1 },
        extension_kind: { type: "uint32", id: 2 },
        response: { type: "Response", id: 3, rule: "repeated" },
      },
    },
    Header: {
      fields: {
        status: { type: "uint32", id: 1 },
      },
    },
    Response: {
      fields: {
        info: { type: "ResponseInfo", id: 1 },
        track: { type: "string", id: 2 },
        metadata: { type: "TrackMetadataWrapper", id: 3, rule: "optional" },
      },
    },
    ResponseInfo: {
      fields: {
        status: { type: "uint32", id: 1 },
      },
    },
    TrackMetadataWrapper: {
      fields: {
        typestr: { type: "string", id: 1 },
        metadata: { type: "TrackMetadata", id: 2 },
      },
    },
    TrackMetadata: {
      fields: {
        gid: { type: "bytes", id: 1 },
        name: { type: "string", id: 2 },
        album: { type: "AlbumMetadata", id: 3 },
        artist: { type: "Artist", id: 4, rule: "repeated" },
        track_num: { type: "sint32", id: 5 },
        disc_num: { type: "sint32", id: 6 },
        duration_ms: { type: "sint32", id: 7 },
        popularity: { type: "sint32", id: 8 },
      },
    },
    AlbumMetadata: {
      fields: {
        gid: { type: "bytes", id: 1 },
        name: { type: "string", id: 2 },
        artist: { type: "Artist", id: 3, rule: "repeated" },
        release_date: { type: "Date", id: 6, rule: "optional" },
      },
    },
    Artist: {
      fields: {
        gid: { type: "bytes", id: 1 },
        name: { type: "string", id: 2 },
      },
    },
    Date: {
      fields: {
        year: { type: "sint32", id: 1 },
        month: { type: "sint32", id: 2, rule: "optional" },
        day: { type: "sint32", id: 3, rule: "optional" },
      },
    },
  },
};

const extendedMetadataRequest = protobuf.Root.fromJSON(extendedMetadataJsonDescriptor).lookup(
  "Message"
);
const audioFeaturesResponse = protobuf.Root.fromJSON(audioFeaturesJsonDescriptor).lookup("Message");
const trackMetadataResponse = protobuf.Root.fromJSON(trackMetadataJsonDescriptor).lookup("Message");

(async function djInfoList() {
  // waiting while loading
  while (!Spicetify.showNotification) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  const { CosmosAsync, ContextMenu, URI, React: react, ReactDOM: reactDOM } = Spicetify;
  const { useState, useEffect } = react;
  if (!(CosmosAsync && URI)) {
    setTimeout(djInfoList, 300);
    return;
  }

  const STYLE_ID = "dj-info-styles";
  let globalStyle = document.getElementById(STYLE_ID);
  if (!globalStyle) {
    globalStyle = document.createElement("style");
    globalStyle.id = STYLE_ID;
    document.head.appendChild(globalStyle);
  }
  globalStyle.innerHTML = `
    @keyframes djInfoFadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .djinfo-animate {
      animation: djInfoFadeIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    }
  `;

  let CONFIG;
  try {
    CONFIG = JSON.parse(Spicetify.LocalStorage.get("dj-info-config") || "error");
  } catch {
    CONFIG = {
      isPlaylistEnabled: true,
      isNowPlayingEnabled: true,
      isLeftPlayingEnabled: false,
      isRecommendationsEnabled: true,
      isBPMEnabled: true,
      isKeyEnabled: false,
      isCamelotEnabled: true,
      isPopularityEnabled: true,
      isEnergyEnabled: false,
      isDanceEnabled: false,
      isYearEnabled: true,
    };
  }

  const DisplayIcon = ({ icon, size }) => {
    return react.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 16 16",
      fill: "currentColor",
      dangerouslySetInnerHTML: {
        __html: icon,
      },
    });
  };

  // initialize css grid changes
  const fourColumnGridCss = "[first] 4fr [var1] 2fr [var2] 2fr [last] minmax(120px,1fr)";
  const fiveColumnGridCss =
    "[index] 16px [first] 3fr [var1] 2fr [var2] 2fr [last] minmax(120px,1fr)";
  const sixColumnGridCss =
    "[index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] 2fr [last] minmax(120px,1fr)";
  const sevenColumnGridCss =
    "[index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] minmax(120px,1fr) [var4] 2fr [last] minmax(120px,1fr)";
  const recommendationGridCss = "[index] 3fr [first] 2fr [var1] 1fr [var2] 1fr [last] 1fr";

  const waitForElement = (selector) => {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  if (window.djInfoObserver) {
    window.djInfoObserver.disconnect();
  }
  const trackIntersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const track = entry.target;
          const isRecommendation = track.closest('[data-testid="recommended-track"]') !== null;
          addInfoToTrack(track, isRecommendation);
          trackIntersectionObserver.unobserve(track);
        }
      });
    },
    { rootMargin: "200px" }
  );
  window.djInfoObserver = trackIntersectionObserver;

  // Get track uri from tracklist element
  function getTracklistTrackUri(tracklistElement) {
    let values = Object.values(tracklistElement);
    if (!values.length) {
      console.log("Error: Could not get tracklist element");
      return null;
    }
    return (
      values[0]?.pendingProps?.children[0]?.props?.children?.props?.uri ||
      values[0]?.pendingProps?.children[0]?.props?.children?.props?.children?.props?.uri ||
      values[0]?.pendingProps?.children[0]?.props?.children?.props?.children?.props?.children?.props
        ?.uri ||
      values[0]?.pendingProps?.children[0]?.props?.children[0]?.props?.uri ||
      values[0]?.pendingProps?.children?.props?.value?.item?.uri ||
      values[0]?.pendingProps?.children?.props?.children?.props?.value?.item?.uri ||
      values[0]?.pendingProps?.children?.props?.children?.props?.children?.props?.value?.item?.uri
    );
  }

  // Get page type
  function getPageType() {
    const pathname = Spicetify.Platform.History.location.pathname;
    let matches = null;
    if (pathname === "/collection/tracks") {
      return ["LIKED_SONGS", null];
    }
    if ((matches = pathname.match(/playlist\/(.*)/))) {
      return ["PLAYLIST", matches[1]];
    }
    if ((matches = pathname.match(/album\/(.*)/))) {
      return ["ALBUM", matches[1]];
    }
    if ((matches = pathname.match(/artist\/([^/]*)$/))) {
      return ["ARTIST", matches[1]];
    }
    if ((matches = pathname.match(/artist\/([^/]*)\/saved/))) {
      return ["ARTIST_LIKED", matches[1]];
    }
    return ["OTHER", null];
  }

  let oldNowPlayingWidget = null;
  let nowPlayingWidget = null;
  let updateNowPlayingWidget = null;
  let nowPlayingWidgetdjInfoData = null;

  function saveConfig() {
    Spicetify.LocalStorage.set("dj-info-config", JSON.stringify(CONFIG));
  }

  const ConfigItem = ({ name, field, func, disabled = false }) => {
    const [value, setValue] = useState(CONFIG[field]);
    return react.createElement(
      "div",
      { className: "setting-row" },
      react.createElement("label", { className: "col description" }, name),
      react.createElement(
        "div",
        { className: "col action" },
        react.createElement(
          "button",
          {
            className: "switch" + (value ? "" : " disabled"),
            disabled,
            onClick: () => {
              const state = !value;
              CONFIG[field] = state;
              setValue(state);
              saveConfig();
            },
          },
          react.createElement(DisplayIcon, {
            icon: Spicetify.SVGIcons.check,
            size: 16,
          })
        )
      )
    );
  };

  const reloadItem = ({ name, disabled = false }) => {
    return react.createElement(
      "div",
      { className: "setting-row" },
      react.createElement("label", { className: "col description" }, name),
      react.createElement(
        "div",
        { className: "col action" },
        react.createElement(
          "button",
          {
            className: "btn",
            disabled,
            onClick: () => {
              window.location.reload();
            },
          },
          "Reload"
        )
      )
    );
  };

  function openConfig() {
    const style = react.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: `
.setting-row::after {
    content: "";
    display: table;
    clear: both;
    border-radius: 4px;
}
.setting-row .col {
    display: flex;
    padding: 10px 0;
    align-items: center;
}
.setting-row .col.description {
    float: left;
    padding-right: 15px;
    color: var(--spice-text);
}
.setting-row .col.action {
    float: right;
    text-align: right;
}
h1.main-type-alto {
  color: var(--spice-text);
}
button.switch {
    align-items: center;
    border: 0px;
    border-radius: 50%;
    background-color: rgba(var(--spice-rgb-shadow), .7);
    color: var(--spice-text);
    cursor: pointer;
    display: flex;
    margin-inline-start: 12px;
    padding: 8px;
}
button.switch.disabled,
button.switch[disabled] {
    color: rgba(var(--spice-rgb-text), .3);
}
button.btn {
    font-weight: 700;
    font-size: medium;
    background-color: transparent;
    border-radius: 24px;
    transition-duration: 33ms;
    transition-property: background-color, border-color, color, box-shadow, filter, transform;
    padding-inline: 15px;
    border: 1px solid #727272;
    color: var(--spice-text);
    min-block-size: 32px;
    cursor: pointer;
}
button.btn:hover {
    transform: scale(1.04);
    border-color: var(--spice-text);
}
`,
      },
    });
    let configContainer = react.createElement(
      "div",
      null,
      style,
      react.createElement(ConfigItem, {
        name: "Enable in Playlists",
        field: "isPlaylistEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable in Now Playing",
        field: "isNowPlayingEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Display Info on Left Side in Now Playing",
        field: "isLeftPlayingEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable in Recommendations",
        field: "isRecommendationsEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable BPM",
        field: "isBPMEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable Key (Standard Notation)",
        field: "isKeyEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable Key (Camelot Notation)",
        field: "isCamelotEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable Popularity",
        field: "isPopularityEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable Year",
        field: "isYearEnabled",
      }),
      react.createElement(reloadItem, {
        name: "Reload Window to apply changes",
      })
    );
    Spicetify.PopupModal.display({
      title: "DJ Info Settings",
      content: configContainer,
    });
  }
  new Spicetify.Menu.Item(
    "DJ Info Settings",
    false,
    openConfig,
    `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentcolor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 8.25C9.92894 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92894 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z" fill="currentcolor"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9747 1.25C11.5303 1.24999 11.1592 1.24999 10.8546 1.27077C10.5375 1.29241 10.238 1.33905 9.94761 1.45933C9.27379 1.73844 8.73843 2.27379 8.45932 2.94762C8.31402 3.29842 8.27467 3.66812 8.25964 4.06996C8.24756 4.39299 8.08454 4.66251 7.84395 4.80141C7.60337 4.94031 7.28845 4.94673 7.00266 4.79568C6.64714 4.60777 6.30729 4.45699 5.93083 4.40743C5.20773 4.31223 4.47642 4.50819 3.89779 4.95219C3.64843 5.14353 3.45827 5.3796 3.28099 5.6434C3.11068 5.89681 2.92517 6.21815 2.70294 6.60307L2.67769 6.64681C2.45545 7.03172 2.26993 7.35304 2.13562 7.62723C1.99581 7.91267 1.88644 8.19539 1.84541 8.50701C1.75021 9.23012 1.94617 9.96142 2.39016 10.5401C2.62128 10.8412 2.92173 11.0602 3.26217 11.2741C3.53595 11.4461 3.68788 11.7221 3.68786 12C3.68785 12.2778 3.53592 12.5538 3.26217 12.7258C2.92169 12.9397 2.62121 13.1587 2.39007 13.4599C1.94607 14.0385 1.75012 14.7698 1.84531 15.4929C1.88634 15.8045 1.99571 16.0873 2.13552 16.3727C2.26983 16.6469 2.45535 16.9682 2.67758 17.3531L2.70284 17.3969C2.92507 17.7818 3.11058 18.1031 3.28089 18.3565C3.45817 18.6203 3.64833 18.8564 3.89769 19.0477C4.47632 19.4917 5.20763 19.6877 5.93073 19.5925C6.30717 19.5429 6.647 19.3922 7.0025 19.2043C7.28833 19.0532 7.60329 19.0596 7.8439 19.1986C8.08452 19.3375 8.24756 19.607 8.25964 19.9301C8.27467 20.3319 8.31403 20.7016 8.45932 21.0524C8.73843 21.7262 9.27379 22.2616 9.94761 22.5407C10.238 22.661 10.5375 22.7076 10.8546 22.7292C11.1592 22.75 11.5303 22.75 11.9747 22.75H12.0252C12.4697 22.75 12.8407 22.75 13.1454 22.7292C13.4625 22.7076 13.762 22.661 14.0524 22.5407C14.7262 22.2616 15.2616 21.7262 15.5407 21.0524C15.686 20.7016 15.7253 20.3319 15.7403 19.93C15.7524 19.607 15.9154 19.3375 16.156 19.1985C16.3966 19.0596 16.7116 19.0532 16.9974 19.2042C17.3529 19.3921 17.6927 19.5429 18.0692 19.5924C18.7923 19.6876 19.5236 19.4917 20.1022 19.0477C20.3516 18.8563 20.5417 18.6203 20.719 18.3565C20.8893 18.1031 21.0748 17.7818 21.297 17.3969L21.3223 17.3531C21.5445 16.9682 21.7301 16.6468 21.8644 16.3726C22.0042 16.0872 22.1135 15.8045 22.1546 15.4929C22.2498 14.7697 22.0538 14.0384 21.6098 13.4598C21.3787 13.1586 21.0782 12.9397 20.7378 12.7258C20.464 12.5538 20.3121 12.2778 20.3121 11.9999C20.3121 11.7221 20.464 11.4462 20.7377 11.2742C21.0783 11.0603 21.3788 10.8414 21.6099 10.5401C22.0539 9.96149 22.2499 9.23019 22.1547 8.50708C22.1136 8.19546 22.0043 7.91274 21.8645 7.6273C21.7302 7.35313 21.5447 7.03183 21.3224 6.64695L21.2972 6.60318C21.0749 6.21825 20.8894 5.89688 20.7191 5.64347C20.5418 5.37967 20.3517 5.1436 20.1023 4.95225C19.5237 4.50826 18.7924 4.3123 18.0692 4.4075C17.6928 4.45706 17.353 4.60782 16.9975 4.79572C16.7117 4.94679 16.3967 4.94036 16.1561 4.80144C15.9155 4.66253 15.7524 4.39297 15.7403 4.06991C15.7253 3.66808 15.686 3.2984 15.5407 2.94762C15.2616 2.27379 14.7262 1.73844 14.0524 1.45933C13.762 1.33905 13.4625 1.29241 13.1454 1.27077C12.8407 1.24999 12.4697 1.24999 12.0252 1.25H11.9747ZM10.5216 2.84515C10.5988 2.81319 10.716 2.78372 10.9567 2.76729C11.2042 2.75041 11.5238 2.75 12 2.75C12.4762 2.75 12.7958 2.75041 13.0432 2.76729C13.284 2.78372 13.4012 2.81319 13.4783 2.84515C13.7846 2.97202 14.028 3.21536 14.1548 3.52165C14.1949 3.61826 14.228 3.76887 14.2414 4.12597C14.271 4.91835 14.68 5.68129 15.4061 6.10048C16.1321 6.51968 16.9974 6.4924 17.6984 6.12188C18.0143 5.9549 18.1614 5.90832 18.265 5.89467C18.5937 5.8514 18.9261 5.94047 19.1891 6.14228C19.2554 6.19312 19.3395 6.27989 19.4741 6.48016C19.6125 6.68603 19.7726 6.9626 20.0107 7.375C20.2488 7.78741 20.4083 8.06438 20.5174 8.28713C20.6235 8.50382 20.6566 8.62007 20.6675 8.70287C20.7108 9.03155 20.6217 9.36397 20.4199 9.62698C20.3562 9.70995 20.2424 9.81399 19.9397 10.0041C19.2684 10.426 18.8122 11.1616 18.8121 11.9999C18.8121 12.8383 19.2683 13.574 19.9397 13.9959C20.2423 14.186 20.3561 14.29 20.4198 14.373C20.6216 14.636 20.7107 14.9684 20.6674 15.2971C20.6565 15.3799 20.6234 15.4961 20.5173 15.7128C20.4082 15.9355 20.2487 16.2125 20.0106 16.6249C19.7725 17.0373 19.6124 17.3139 19.474 17.5198C19.3394 17.72 19.2553 17.8068 19.189 17.8576C18.926 18.0595 18.5936 18.1485 18.2649 18.1053C18.1613 18.0916 18.0142 18.045 17.6983 17.8781C16.9973 17.5075 16.132 17.4803 15.4059 17.8995C14.68 18.3187 14.271 19.0816 14.2414 19.874C14.228 20.2311 14.1949 20.3817 14.1548 20.4784C14.028 20.7846 13.7846 21.028 13.4783 21.1549C13.4012 21.1868 13.284 21.2163 13.0432 21.2327C12.7958 21.2496 12.4762 21.25 12 21.25C11.5238 21.25 11.2042 21.2496 10.9567 21.2327C10.716 21.2163 10.5988 21.1868 10.5216 21.1549C10.2154 21.028 9.97201 20.7846 9.84514 20.4784C9.80512 20.3817 9.77195 20.2311 9.75859 19.874C9.72896 19.0817 9.31997 18.3187 8.5939 17.8995C7.86784 17.4803 7.00262 17.5076 6.30158 17.8781C5.98565 18.0451 5.83863 18.0917 5.73495 18.1053C5.40626 18.1486 5.07385 18.0595 4.81084 17.8577C4.74458 17.8069 4.66045 17.7201 4.52586 17.5198C4.38751 17.314 4.22736 17.0374 3.98926 16.625C3.75115 16.2126 3.59171 15.9356 3.4826 15.7129C3.37646 15.4962 3.34338 15.3799 3.33248 15.2971C3.28921 14.9684 3.37828 14.636 3.5801 14.373C3.64376 14.2901 3.75761 14.186 4.0602 13.9959C4.73158 13.5741 5.18782 12.8384 5.18786 12.0001C5.18791 11.1616 4.73165 10.4259 4.06021 10.004C3.75769 9.81389 3.64385 9.70987 3.58019 9.62691C3.37838 9.3639 3.28931 9.03149 3.33258 8.7028C3.34348 8.62001 3.37656 8.50375 3.4827 8.28707C3.59181 8.06431 3.75125 7.78734 3.98935 7.37493C4.22746 6.96253 4.3876 6.68596 4.52596 6.48009C4.66055 6.27983 4.74468 6.19305 4.81093 6.14222C5.07395 5.9404 5.40636 5.85133 5.73504 5.8946C5.83873 5.90825 5.98576 5.95483 6.30173 6.12184C7.00273 6.49235 7.86791 6.51962 8.59394 6.10045C9.31998 5.68128 9.72896 4.91837 9.75859 4.12602C9.77195 3.76889 9.80512 3.61827 9.84514 3.52165C9.97201 3.21536 10.2154 2.97202 10.5216 2.84515Z" fill="currentcolor"></path> </g></svg>`
  ).register();

  // Get the Key in the right notation from /audiofeatures response
  const getKeyInNotation = (key, mode) => {
    const keyInCamelot =
      key < 0 || mode < 0 ? "XX" : ((7 * key + [4, 7][mode]) % 12) + 1 + "AB"[mode];
    const keyInStandard =
      key < 0 ? "XX" : "C Db D Eb E F F♯ G Ab A Bb B".split(" ")[key] + ["m", "", "?"].at(mode);
    if (CONFIG.isCamelotEnabled) {
      if (CONFIG.isKeyEnabled) {
        return `${keyInStandard}&nbsp;(${keyInCamelot})`; // if both are enabled return both
      }
      return keyInCamelot; // else if only camelot is enabled return camelot
    }
    return keyInStandard; // else return key in standard notation
  };

  const djTrackInfo = class {
    // Class for DJ Info in local storage
    static fromQueries(res, resTrack) {
      return {
        key: res.key,
        mode: res.mode,
        tempo: Math.round(res.tempo),
        energy: Math.round(100 * res.energy),
        danceability: Math.round(100 * res.danceability),
        popularity: resTrack.popularity,
        release_date: resTrack.release_date.split("-")[0],
      };
    }
    static from(obj) {
      if (typeof obj === "string") {
        const [key, mode, tempo, energy, danceability, popularity, release_date] = obj
          .split(",")
          .map((x) => (x === "" ? null : +x));
        obj = { key, mode, tempo, energy, danceability, popularity, release_date };
      }
      return obj;
    }
    static tostr(obj) {
      const { key, mode, tempo, energy, danceability, popularity, release_date } = obj;
      return [key, mode, tempo, energy, danceability, popularity, release_date]
        .map((x) => (x !== x ? null : x))
        .join();
    }
  };

  const trackInfoQueue = new Map();
  let trackInfoTimeout = null;
  let trackDb = {};

  function loadTrackDb() {
    try {
      trackDb = JSON.parse(Spicetify.LocalStorage.get("dj-info-tracks") || "{}");
      Object.keys(trackDb).forEach((key) => {
        trackDb[key] = djTrackInfo.from(trackDb[key]);
      });
    } catch {
      trackDb = {};
    }
  }

  let saveTimeout = null;
  function saveTrackDb(immediate = false) {
    const doSave = () => {
      const savedDb = {};
      Object.keys(trackDb).forEach((key) => {
        savedDb[key] = djTrackInfo.tostr(trackDb[key]);
      });
      Spicetify.LocalStorage.set("dj-info-tracks", JSON.stringify(savedDb));
      saveTimeout = null;
    };

    if (immediate) {
      clearTimeout(saveTimeout);
      doSave();
      return;
    }

    if (!saveTimeout) {
      saveTimeout = setTimeout(doSave, 200);
    }
  }

  window.addEventListener("beforeunload", () => saveTrackDb(true));

  // Load the DB at startup
  loadTrackDb();

  function cleanupOldStorage() {
    const keysToRemove = [];
    for (let i = 0; i < Spicetify.LocalStorage.length; i++) {
      const key = Spicetify.LocalStorage.key(i);
      if (key.startsWith("djinfo-") && key !== "dj-info-tracks" && key !== "dj-info-config") {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => Spicetify.LocalStorage.remove(key));
    if (keysToRemove.length > 0) {
      Spicetify.showNotification("Cleaned up old DJ Info tracks from local storage.");
    }
  }

  cleanupOldStorage();

  const productStateValues = await Spicetify.Platform.ProductStateAPI.getValues();
  const country = productStateValues["country"] ?? "US";
  const catalogue = productStateValues["catalogue"] ?? "premium";

  const getExtendedMetadata = async (entity_uris, extension_kind) => {
    const task_id = new Uint8Array(16);
    crypto.getRandomValues(task_id);
    const payload = extendedMetadataRequest
      .encode({
        header: { country, catalogue, task_id },
        request: entity_uris.map((entity_uri) => ({ entity_uri, query: { extension_kind } })),
      })
      .finish();

    const resp = await fetch(
      "https://spclient.wg.spotify.com/extended-metadata/v0/extended-metadata",
      {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/protobuf",
          Authorization: `Bearer ${
            Spicetify.Platform.AuthorizationAPI.getState().token.accessToken
          }`,
          "Spotify-App-Version": Spicetify.Platform.version,
          "App-Platform": Spicetify.Platform.PlatformData.app_platform,
        },
        timeout: 1000 * 15,
      }
    );

    return new Uint8Array(await resp.arrayBuffer());
  };

  const getFeatures = async (ids) => {
    const buf = await getExtendedMetadata(
      ids.map((id) => `spotify:track:${id}`),
      222
    );
    const msg = audioFeaturesResponse.decode(buf);

    return msg.response.map((resp) => {
      if (!resp.attributes) return null;
      const attributes = resp.attributes.attributes;
      return {
        id: resp.track.split(":")[2],
        tempo: attributes.bpm,
        key: "C C# D D# E F F# G G# A A# B".split(" ").indexOf(attributes.key.key),
        mode: attributes.key.majorMinor - 1,
      };
    });
  };

  const getTrackFeatures = async (ids) => {
    const buf = await getExtendedMetadata(
      ids.map((id) => `spotify:track:${id}`),
      10
    );
    const msg = trackMetadataResponse.decode(buf);

    return msg.response.map((resp) => {
      if (!resp.metadata) return null;
      const metadata = resp.metadata.metadata;
      const date = metadata.album.release_date;
      const date_iso = `${date?.year}-${(date?.month + "").padStart(2, "0")}-${(
        date?.day + ""
      ).padStart(2, "0")}`;
      return {
        id: resp.track.split(":")[2],
        popularity: metadata.popularity,
        release_date: date_iso,
      };
    });
  };

  const getTrackInfo = async (id) => {
    // get Track Info from local storage or request
    if (trackDb[id]) {
      return trackDb[id];
    }
    const [info] = await getTrackInfoBatch([id]);
    return info;
  };

  const getTrackInfoBatch = async (ids) => {
    const idsToFetch = ids.filter((id) => !trackDb[id]);

    if (idsToFetch.length > 0) {
      try {
        const results = await Promise.allSettled([
          getFeatures(idsToFetch),
          getTrackFeatures(idsToFetch),
        ]);

        const featuresRes = results[0].status === "fulfilled" ? results[0].value : null;
        const metadataRes = results[1].status === "fulfilled" ? results[1].value : null;

        if (featuresRes) {
          featuresRes.forEach((track) => {
            if (track) {
              const trackDetails = metadataRes?.find((t) => t?.id === track?.id);
              if (trackDetails) {
                const info = djTrackInfo.fromQueries(track, trackDetails);
                trackDb[track.id] = info;
              }
            }
          });
          saveTrackDb();
        }
      } catch (error) {
        console.error("DJ Info: Error fetching batch track info:", error);
      }
    }
    return ids.map((id) => {
      if (trackDb[id]) return trackDb[id];
      return null;
    });
  };

  const processTrackInfoQueue = async () => {
    if (trackInfoQueue.size === 0) return;

    const ids = Array.from(trackInfoQueue.keys());
    const queueSnapshot = new Map(trackInfoQueue);
    trackInfoQueue.clear();

    const CHUNK_SIZE = 100;
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      const chunk = ids.slice(i, i + CHUNK_SIZE);
      await getTrackInfoBatch(chunk);
    }

    queueSnapshot.forEach((elements, id) => {
      const info = trackDb[id];
      if (info) {
        elements.forEach((track) => {
          if (track && track.isConnected) {
            const isRecommendation = track.closest('[data-testid="recommended-track"]') !== null;
            addInfoToTrack(track, isRecommendation);
          }
        });
      }
    });
  };

  const queueTrackInfo = (id, element) => {
    if (!trackInfoQueue.has(id)) {
      trackInfoQueue.set(id, new Set());
    }
    trackInfoQueue.get(id).add(element);

    clearTimeout(trackInfoTimeout);
    trackInfoTimeout = setTimeout(processTrackInfoQueue, 100);
  };

  const addInfoToTrack = (track, isRecommendation = false) => {
    const hasdjinfo = track.querySelector(".djinfo") !== null;
    const trackUri = getTracklistTrackUri(track);
    if (!trackUri) {
      console.error(
        "Could not find track URI for track:",
        track,
        " this might be caused by a recent Spotify update, please report it on the GitHub page."
      );
      return;
    }
    const isTrack = trackUri.includes("track");

    let djInfoColumn = track.querySelector(".djInfoList");
    if (!djInfoColumn) {
      // Add column for djInfos
      let lastColumn = track.querySelector(".main-trackList-rowSectionEnd");
      let colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"));
      lastColumn.setAttribute("aria-colindex", (colIndexInt + 1).toString());
      djInfoColumn = document.createElement("div");
      djInfoColumn.setAttribute("aria-colindex", colIndexInt.toString());
      djInfoColumn.style.display = "flex";
      djInfoColumn.classList.add("main-trackList-rowSectionVariable");
      djInfoColumn.classList.add("djInfoList");
      track.insertBefore(djInfoColumn, lastColumn);

      if (isRecommendation) {
        djInfoColumn.style.justifyContent = "center";
        djInfoColumn.style.width = "100%";
        track.style["grid-template-columns"] = recommendationGridCss;
      } else {
        switch (colIndexInt) {
          case 3:
            track.style["grid-template-columns"] = fourColumnGridCss;
            break;
          case 4:
            track.style["grid-template-columns"] = fiveColumnGridCss;
            break;
          case 5:
            track.style["grid-template-columns"] = sixColumnGridCss;
            break;
          case 6:
            track.style["grid-template-columns"] = sevenColumnGridCss;
            break;
          default:
            console.log("not 3-6 columns in Tracklist");
            break;
        }
      }
    }

    if (!trackUri || !isTrack) return;

    const uri = trackUri;
    const id = uri.split(":")[2];
    const info = trackDb[id];

    if (info) {
      if (hasdjinfo) return;
      const parsedInfo = info;
      const keyInNotation = getKeyInNotation(parsedInfo.key, parsedInfo.mode);
      let display_text = [];
      if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled) display_text.push(`${keyInNotation}`);
      if (CONFIG.isBPMEnabled) display_text.push(`${parsedInfo.tempo} ♫`);
      if (CONFIG.isEnergyEnabled) display_text.push(`E ${parsedInfo.energy}`);
      if (CONFIG.isDanceEnabled) display_text.push(`D ${parsedInfo.danceability}`);
      if (CONFIG.isPopularityEnabled) display_text.push(`♥ ${parsedInfo.popularity}`);
      if (CONFIG.isYearEnabled) display_text.push(`${parsedInfo.release_date}`);
      display_text = display_text.join(" | ");

      const text = document.createElement("p");
      text.innerHTML = display_text;
      text.classList.add("djinfo");
      text.classList.add("djinfo-animate");
      text.style.fontSize = "12px";
      djInfoColumn.innerHTML = ""; // Clear previous content
      djInfoColumn.appendChild(text);
    } else {
      if (hasdjinfo) {
        const djinfoElement = track.querySelector(".djinfo");
        if (djinfoElement) djinfoElement.remove();
      }
      queueTrackInfo(id, track);
    }
  };

  // update Tracklist and insert DJ Info
  const updateTracklist = (tracklist) => {
    if (!CONFIG.isPlaylistEnabled) return;
    if (!tracklist) return;

    // Adding DJ Info Column Header
    const tracklistHeader = tracklist.querySelector(".main-trackList-trackListHeaderRow");
    if (tracklistHeader && !tracklistHeader.querySelector(".djinfoheader")) {
      let lastColumn = tracklistHeader.querySelector(".main-trackList-rowSectionEnd");
      let colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"));

      lastColumn.setAttribute("aria-colindex", (colIndexInt + 1).toString());
      let headerColumn = document.createElement("div");
      headerColumn.style.display = "flex";
      headerColumn.classList.add("main-trackList-rowSectionVariable");
      headerColumn.role = "columnheader";
      tracklistHeader.insertBefore(headerColumn, lastColumn);
      switch (colIndexInt) {
        case 4:
          tracklistHeader.style["grid-template-columns"] = fiveColumnGridCss;
          break;
        case 5:
          tracklistHeader.style["grid-template-columns"] = sixColumnGridCss;
          break;
        case 6:
          tracklistHeader.style["grid-template-columns"] = sevenColumnGridCss;
          break;
        default:
          console.error("Unsupported number of columns, cannot add DJ Info header");
          break;
      }

      const btn = document.createElement("button");
      btn.classList.add("main-trackList-column");
      btn.classList.add("main-trackList-sortable");
      btn.classList.add("djinfoheader");
      const title = document.createElement("span");
      title.classList.add("TypeElement-mesto-type");
      title.classList.add("standalone-ellipsis-one-line");
      title.innerHTML = "DJ Info";
      btn.appendChild(title);
      headerColumn.appendChild(btn);
    }

    const tracks = tracklist.getElementsByClassName("main-trackList-trackListRow");
    for (const track of tracks) {
      const hasdjinfo = track.querySelector(".djinfo") !== null;
      if (!track.classList.contains("dj-observed") || !hasdjinfo) {
        track.classList.add("dj-observed");
        trackIntersectionObserver.observe(track);
      }
    }
  };

  const updateRecommendations = (recommendations) => {
    if (!CONFIG.isRecommendationsEnabled) return;
    if (!recommendations) return;

    const tracklist = recommendations.querySelector(".main-trackList-trackList");
    if (tracklist) {
      const tracks = tracklist.getElementsByClassName("main-trackList-trackListRow");
      for (const track of tracks) {
        const hasdjinfo = track.querySelector(".djinfo") !== null;
        if (!track.classList.contains("dj-observed") || !hasdjinfo) {
          track.classList.add("dj-observed");
          trackIntersectionObserver.observe(track);
        }
      }
    }
  };

  // Add DJ Info to Now Playing
  updateNowPlayingWidget = async () => {
    if (!nowPlayingWidgetdjInfoData || !CONFIG.isNowPlayingEnabled) return;
    const getTrackUri = () => {
      if (!Spicetify.Player.data || !Spicetify.Player.data.item) return null;
      return Spicetify.Player.data.item.uri;
    };
    // Get the current Track
    const trackUri = getTrackUri();
    if (!trackUri) {
      nowPlayingWidgetdjInfoData.style.display = "none";
      return;
    }
    const isTrack = trackUri.includes("track");

    nowPlayingWidgetdjInfoData.style.display = isTrack ? "flex" : "none";

    // get the Infos from requests, generating a Display Text
    const uri = trackUri;
    if (uri.split(":")[1] === "local") {
      // don't request data for local files
      nowPlayingWidgetdjInfoData.innerHTML = "";
      return;
    }
    const id = uri.split(":")[2];
    const info = await getTrackInfo(id);
    if (info) {
      const display_text = [];
      if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled)
        display_text.push(`${getKeyInNotation(info.key, info.mode)}`);
      if (CONFIG.isBPMEnabled) display_text.push(`${info.tempo} ♫`);
      if (CONFIG.isEnergyEnabled) display_text.push(`E ${info.energy}`);
      if (CONFIG.isDanceEnabled) display_text.push(`D ${info.danceability}`);
      if (CONFIG.isPopularityEnabled) display_text.push(`♥ ${info.popularity}`);
      if (CONFIG.isYearEnabled) display_text.push(`${info.release_date}`);
      nowPlayingWidgetdjInfoData.innerHTML = display_text.join("<br>");
      nowPlayingWidgetdjInfoData.classList.remove("djinfo-animate");
      void nowPlayingWidgetdjInfoData.offsetWidth; // Trigger reflow
      nowPlayingWidgetdjInfoData.classList.add("djinfo-animate");
    } else {
      nowPlayingWidgetdjInfoData.innerHTML = "";
      getTrackInfo(id).then((info) => {
        if (info) {
          updateNowPlayingWidget();
        }
      });
    }
    nowPlayingWidgetdjInfoData.style.fontSize = "11px";
  };

  Spicetify.Player.addEventListener("songchange", () => {
    updateNowPlayingWidget();
  });

  const observedTracklists = new WeakSet();

  function observeTracklist(tracklist, isRecommendation = false) {
    const updater = () => {
      if (isRecommendation) {
        updateRecommendations(tracklist);
      } else {
        updateTracklist(tracklist);
      }
    };

    if (observedTracklists.has(tracklist)) {
      updater();
      return;
    }

    const observer = new MutationObserver(updater);
    observer.observe(tracklist, { childList: true, subtree: true });
    observedTracklists.add(tracklist);
    updater();
  }

  function main() {
    // For regular playlists
    const tracklists = document.querySelectorAll(".main-trackList-indexable");
    tracklists.forEach((tracklist) => observeTracklist(tracklist, false));

    // For recommendations
    const recommendationsContainer = document.querySelector('[data-testid="recommended-track"]');
    if (recommendationsContainer) {
      observeTracklist(recommendationsContainer, true);
    }

    // For Now Playing bar
    oldNowPlayingWidget = nowPlayingWidget;
    nowPlayingWidget = document.querySelector(".main-nowPlayingWidget-nowPlaying");
    if (nowPlayingWidget && !nowPlayingWidget.isEqualNode(oldNowPlayingWidget)) {
      if (!nowPlayingWidget.querySelector(".dj-info-now-playing")) {
        nowPlayingWidgetdjInfoData = document.createElement("p");
        nowPlayingWidgetdjInfoData.classList.add("dj-info-now-playing");
        nowPlayingWidgetdjInfoData.style.marginLeft = "4px";
        nowPlayingWidgetdjInfoData.style.marginRight = "4px";
        nowPlayingWidgetdjInfoData.style.minWidth = "34px";
        nowPlayingWidgetdjInfoData.style.fontSize = "11px";
        nowPlayingWidgetdjInfoData.style.textAlign = "center";
        const trackInfo = nowPlayingWidget.querySelector(".main-trackInfo-container");
        if (trackInfo) {
          if (CONFIG.isLeftPlayingEnabled) {
            trackInfo.before(nowPlayingWidgetdjInfoData);
          } else {
            trackInfo.after(nowPlayingWidgetdjInfoData);
          }
        }
        updateNowPlayingWidget();
      }
    }
  }

  const debouncedMain = debounce(main, 10);
  if (window.djInfoMutationObserver) {
    window.djInfoMutationObserver.disconnect();
  }
  const observer = new MutationObserver(debouncedMain);
  main();
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  window.djInfoMutationObserver = observer;
})();
