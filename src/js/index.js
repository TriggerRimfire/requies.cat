let $ = require('jquery') //eww
const nav = $('nav > ul > li > a')
nav.hover(function() {
  $(":first-child", nav).css("display", "block");
})

$(":first-child", nav).hover(function(){
  $(this).css("display", "block")
})
