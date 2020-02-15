(this.webpackJsonpsudoku=this.webpackJsonpsudoku||[]).push([[0],{14:function(e,t,r){},15:function(e,t,r){},21:function(e,t,r){"use strict";r.r(t);var n=r(0),a=r.n(n),i=r(8),o=r.n(i),u=(r(14),r(1)),l=r(2),s=r(3),c=r(5),f=r(4),h=r(6);r(15);function d(e){var t=a.a.createRef(),r="square";e.isAnswer&&(r+=" red"),e.isSelected&&(r+=" focus"),e.isValid||(r+=" invalid");return a.a.createElement("button",{type:"button",className:r,ref:t,onClick:function(){t.current.focus(),e.onClick()}},e.value)}var p=function(e){function t(e){var r;return Object(l.a)(this,t),(r=Object(c.a)(this,Object(f.a)(t).call(this,e))).state={selectedSquare:[-1,-1],previousNumber:[-1,-1,-1]},r}return Object(h.a)(t,e),Object(s.a)(t,[{key:"onClick",value:function(e,t){var r=Object(u.a)(this.state.selectedSquare,2),n=r[0],a=r[1];if(n===e&&a===t){var i=this.props.info.questionGrid[e][t],o=9!==i?i+1:0;this.setState({previousNumber:[e,t,o]}),this.props.onKeyPress(e,t,o)}this.setState({selectedSquare:[e,t]})}},{key:"userInputIsValid",value:function(e,t,r){var n=this,a=this.props.info.questionGrid;if(a[e].filter((function(e){return e===r})).length>1)return 1;if(a.map((function(e){return e[t]})).filter((function(e){return e===r})).length>1)return 2;var i=function(e){var t=Math.sqrt(n.props.info.questionGrid.length),r=Math.floor(e/t)*t;return new Array(t).fill(0).map((function(e,t){return r+t}))},o=i(e),u=i(t);return a.filter((function(e,t){return o.includes(t)})).flatMap((function(e){return e.filter((function(e,t){return u.includes(t)}))})).filter((function(e){return e===r})).length>1?3:0}},{key:"handleKeyUp",value:function(e){var t=Object(u.a)(this.state.selectedSquare,2),r=t[0],n=t[1],a=this.props.info.questionGrid.length;if(-1!==r&&-1!==n&&(8===e.keyCode&&this.props.onKeyPress(r,n,-1),new Array(a).fill(0).map((function(e,t){return(t+1).toString()})).includes(e.key))){var i=parseInt(e.key);this.setState({previousNumber:[r,n,i]}),this.props.onKeyPress(r,n,i)}}},{key:"renderGrid",value:function(){var e=this,t=this.props.info.questionGrid,r=this.props.info.answerGrid,n=Object(u.a)(this.state.previousNumber,3),i=n[0],o=n[1],l=n[2],s=0;i===o&&-1===i||t[i][o]!==l||(s=this.userInputIsValid(i,o,l));var c=function(t,r){switch(s){case 0:return!0;case 1:return!(t===i);case 2:return!(r===o);case 3:var n=Math.sqrt(e.props.info.questionGrid.length),a=Math.floor(i/n)*n,u=Math.floor(o/n)*n;return!(t>=a&&t<a+n&&r>=u&&r<u+n);default:return!0}},f=function(t,r){var n=Object(u.a)(e.state.selectedSquare,2),a=n[0],i=n[1];return t===a&&r===i};return r.map((function(r,n){var i=r.map((function(r,i){return a.a.createElement(d,{key:"Row"+n+" Col"+i,onClick:function(){return e.onClick(n,i)},isValid:c(n,i),isAnswer:0===t[n][i],isSelected:f(n,i),value:0===r?null:r})}));return a.a.createElement("div",{className:"board-row",key:"row"+n},i)}))}},{key:"render",value:function(){var e=this;return a.a.createElement("div",{className:"board",onKeyUp:function(t){return e.handleKeyUp(t)}},this.renderGrid())}}]),t}(a.a.Component),v=function(e){function t(e){var r;return Object(l.a)(this,t),(r=Object(c.a)(this,Object(f.a)(t).call(this,e))).state={puzzle:{questionGrid:new Array(9).fill(0).map((function(e){return new Array(9).fill(0)})),answerGrid:new Array(9).fill(0).map((function(e){return new Array(9).fill(0)}))},Valid:!0},r}return Object(h.a)(t,e),Object(s.a)(t,[{key:"reduceToExactCover",value:function(){for(var e=this.state.puzzle,t=this.props.length,r=Math.sqrt(t),n=Array.from(Array(t).keys()),a=new Array(t*t*t),i=function(){var e=u[o],i=!0,l=!1,s=void 0;try{for(var c,f=function(){var i=c.value,o=!0,u=!1,l=void 0;try{for(var s,f=function(){var n=s.value,o=Array(t*t).fill(0).map((function(r,n){return n===e*t+i?1:0})),u=Array(t*t).fill(0).map((function(r,a){return a===e*t+n?1:0})),l=Array(t*t).fill(0).map((function(e,r){return r===i*t+n?1:0})),c=Array(t*t).fill(0).map((function(a,o){var u=[Math.floor(e/r),Math.floor(i/r)];return o===u[0]*t*r+u[1]*t+n?1:0}));a[e*t*t+i*t+n]={data:"".concat(e,",").concat(i,",").concat(n),row:o.concat(u,l,c)}},h=n[Symbol.iterator]();!(o=(s=h.next()).done);o=!0)f()}catch(d){u=!0,l=d}finally{try{o||null==h.return||h.return()}finally{if(u)throw l}}},h=n[Symbol.iterator]();!(i=(c=h.next()).done);i=!0)f()}catch(d){l=!0,s=d}finally{try{i||null==h.return||h.return()}finally{if(l)throw s}}},o=0,u=n;o<u.length;o++)i();var l=a.filter((function(r,n){return e.questionGrid[Math.floor(n/t/t)][Math.floor(n%(t*t)/t)]===n%t+1}));return a.filter((function(r,n){return 0===e.questionGrid[Math.floor(n/t/t)][Math.floor(n%(t*t)/t)]})).concat(l)}},{key:"resolveClick",value:function(){var e=this.reduceToExactCover(),t=r(16).findOne(e);if(0!==t.length){var n=this.state.puzzle;t[0].forEach((function(e){var t=e.data.split(",").map((function(e){return parseInt(e)})),r=Object(u.a)(t,3),a=r[0],i=r[1],o=r[2];n.answerGrid[a][i]=o+1})),this.setState({puzzle:n,Valid:!0})}else this.setState({Valid:!1})}},{key:"handleValueChange",value:function(e,t,r){var n=this.state.puzzle;n.questionGrid[e][t]=-1===r?0:r,n.answerGrid[e][t]=-1===r?0:r,this.setState({puzzle:n})}},{key:"render",value:function(){var e=this,t=this.state.Valid?"":"No Solutions!";return a.a.createElement("div",{className:"game"},a.a.createElement(p,{info:this.state.puzzle,onKeyPress:function(t,r,n){return e.handleValueChange(t,r,n)}}),a.a.createElement("div",{className:"sideBar"},a.a.createElement("button",{className:"defaultSudoku",onClick:function(){e.setState({puzzle:{questionGrid:[[0,0,0,6,9,8,4,5,3],[9,5,0,0,1,7,8,6,2],[0,0,3,0,5,0,1,9,0],[1,6,7,0,0,0,0,3,8],[8,2,5,7,0,0,9,1,0],[3,0,9,8,2,1,5,0,0],[0,7,0,5,0,0,3,0,1],[5,0,1,0,0,4,6,8,0],[4,9,0,0,3,0,7,0,5]],answerGrid:[[0,0,0,6,9,8,4,5,3],[9,5,0,0,1,7,8,6,2],[0,0,3,0,5,0,1,9,0],[1,6,7,0,0,0,0,3,8],[8,2,5,7,0,0,9,1,0],[3,0,9,8,2,1,5,0,0],[0,7,0,5,0,0,3,0,1],[5,0,1,0,0,4,6,8,0],[4,9,0,0,3,0,7,0,5]]}})}},"Try with default one!"),a.a.createElement("button",{className:"clearSudoku",onClick:function(){e.setState({puzzle:{questionGrid:new Array(9).fill(0).map((function(e){return new Array(9).fill(0)})),answerGrid:new Array(9).fill(0).map((function(e){return new Array(9).fill(0)}))}})}},"Clear the board!"),a.a.createElement("button",{className:"click",onClick:function(){return e.resolveClick()}},"Resolve It!"),a.a.createElement("span",null,t)))}}]),t}(a.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(a.a.createElement(v,{length:9}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},9:function(e,t,r){e.exports=r(21)}},[[9,1,2]]]);
//# sourceMappingURL=main.caf43472.chunk.js.map