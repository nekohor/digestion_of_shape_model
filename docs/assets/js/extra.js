// window.MathJax = {
//   tex2jax: {
//     inlineMath: [ ["\\(","\\)"], ["$","$"] ],
//     displayMath: [ ["\\[","\\]"], ["$$","$$"] ]
//   },
//   TeX: {
//     TagSide: "right",
//     TagIndent: ".8em",
//     MultLineWidth: "85%",
//     equationNumbers: {
//       autoNumber: "AMS",
//     },
//     unicode: {
//       fonts: "STIXGeneral,'Arial Unicode MS'"
//     }
//   },
//   displayAlign: "left",
//   showProcessingMessages: false,
//   messageStyle: "none"
// };

// 使右键和复制失效 DOM操作
document.oncontextmenu=new Function("event.returnValue=false");
document.onselectstart=new Function("event.returnValue=false"); 

// test
console.log("hehe!")

//
var footnote = document.getElementsByClassName("md-footer-copyright");
var copyright = document.getElementsByClassName("md-footer-copyright__highlight");
footnote[0].textContent = copyright[0].textContent;
console.log(footnote[0].textContent)
