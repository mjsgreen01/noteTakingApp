$(document).ready(function() {
  html_init();
  handler_init();
});

function html_init() {
  var list_name = get_list_name();
  if (localStorage.getItem(list_name)) {
    var saved_html = localStorage.getItem(list_name);
    $('body').html(saved_html);
  }
  else {
    $('h1').html(list_name);
    if (list_name != "A List")
      $('li + li').remove();
  }
  $('head title').html(list_name + ' ' + $('head title').html() );

  // load list of notepads
  for(i in window.localStorage){
    $('#notepads').append('<a class="notepadTitle" href="?'+i+'">'+i+'</a>');
  }

  $('#notepadTitleInputContain').hide();

  $('body').on('click', '#makeNotepad', function(){
    $('#notepadTitleInputContain').show();
  });

  $('body').on('keyup','#notepadTitleInput', function() {
    var title = $('#notepadTitleInput').val();
    $('#createNotepad').attr('href', '?'+title);
  });
}

function handler_init() {
  
  $('body').on('keyup','*[contenteditable="true"]', function() {
    save_state();
  });
  
  $('body').on('focus','li div', function() {
    $('li').removeClass('active');
    $(this).parent('li').addClass('active');
  });
  
  $('body').on('keypress', 'li div',function(e) {
    var item = $(this).parent('li');
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
      item.children('.new-item').click();
      return false;
    }
  });

  var addNewItem = function(className) {
    var item = $(this).parent('li');
    if (item.length == 0)
      item = $('h1 + ul > li:last-of-type');
    var new_item = duplicate_item(item);
    item.after(new_item);
    new_item.find('div').focus();
    if(className){
        new_item.find('div').addClass(className)
    }else if(new_item.find('div').hasClass('codeBlock')){
        new_item.find('div').removeClass('codeBlock')
    }
    save_state();
    return false;
  }
  
  $('body').on('click', '.new-item', function(){
    addNewItem.call(this);
  });
  
  $('body').on('click', '.newCodeBlock', function(){
    addNewItem.call(this, 'codeBlock');
  });

  $('body').on('click', '.complete-item', function() {
    var item = $(this).parent('li');
    item.toggleClass('complete');
    save_state();
    return false;
  });
  
  $('body').on('click', '.remove-item', function() {
    var item = $(this).parent('li');
    if (item.siblings().length == 0) {
      var parent = item.parent('ul');
      if (item.siblings().length > 1 || parent.prev('h1').length != 1)
        item.parent('ul').remove();
    }
    else
      item.remove();
    save_state();
    return false;
  });
  
  $('body').on('click', '.new-list', function() {
    var item = $(this).parent('li');
    if (item.find('ul').length == 0) {
      var new_item = duplicate_item(item);
      item.append("<ul></ul>");
      item.find("ul").append(new_item);
      new_item.find('div').focus().removeClass('codeBlock');
    }
    save_state();
    return false;
  });
}

function save_state() {
  localStorage.setItem(get_list_name(), $('body').html());
}

function get_list_name() {
  var list_name = 'A List';
  var url_tokens = window.location.href.split('?');
  if (url_tokens.length > 1) {
    list_name = url_tokens[url_tokens.length-1];
  }
  return decodeURI(list_name);
}

function duplicate_item(item) {
  var new_item = item.clone();
  var new_div = new_item.find('div');
  new_div.html('');
  new_item.removeClass('complete');
  new_item.find('ul').remove();
  return new_item;
}
// $(document).ready(function(){


// 	function insertBlockAtCursor(element, className) { 
//         var sel, range, html; 
//         sel = window.getSelection();
//         range = sel.getRangeAt(0);
//         //stop elements from being added to the toolbar
//         if(range.endContainer.className != "toolbar"){
// 	        range.deleteContents(); 
// 	        var newBlock = document.createElement(element);
// 	        newBlock.className = className;
// 	        newBlock.setAttribute("contentEditable","true");
// 	        var blockText = document.createTextNode("This is a new code block");
// 	        var afterBlock = document.createElement('p');
// 	        afterBlock.setAttribute("contentEditable","true");
// 	        afterBlock.className = 'afterBlock';
// 	        newBlock.appendChild(blockText);
// 	        range.insertNode(newBlock);
// 	        range.setStartAfter(newBlock);
// 	        range.insertNode(afterBlock);
// 	        sel.removeAllRanges();
// 	        sel.addRange(range); 
//         }       
//     }

//     function appendNodeToParentIndent(){
//     	var sel, range, html;
//     	sel = window.getSelection();
//         range = sel.getRangeAt(0);
//         var afterBlock = document.createElement('p');
//         	afterBlock.setAttribute("contentEditable","true");
// 	        afterBlock.className = 'afterBlock';
//         if (range.endContainer.parentNode.className.indexOf("indentedBlock") >= 0) {
//         	range.endContainer.parentNode.appendChild(afterBlock);
//         }else{
// 	        function inspectNextParent(parentNode){
// 	        	if (parentNode.className.indexOf("indentedBlock") >= 0) {
// 	        		parentNode.appendChild(afterBlock);
// 	        		return;
// 	        	};
// 	        	inspectNextParent(parentNode.parentNode);
// 	        }
// 	        inspectNextParent(range.endContainer.parentNode);
//     	}
//     }
   

//     $('.insertCodeBlock').click(function(){
//     	insertBlockAtCursor('div', 'codeBlock');
//     });
//     $('.indentSection').click(function(){
//     	insertBlockAtCursor('div', 'indentedBlock');
//     });
//     $('.insertInlineCode').click(function(){
//     	insertBlockAtCursor('span', 'inlineCodeBlock');
//     });


//     // store all notes html to local browser storage
//     // store data on keyup, with debounce (only run after x milisec. of no keyups)
//     var saveLocal = function(){
//     	localStorage.setItem('content', $('.notesContain').html());
//     }
//     var debouncedSaveLocal = _.debounce(saveLocal, 500);

//     $('.notesContain').keyup(function(){
//     	debouncedSaveLocal();
//     });
//     // on load, retrieve stored data from local browser storage
//     if (localStorage.getItem('content')) {
// 	  $('.notesContain').html(localStorage.getItem('content'));
// 	}
// });