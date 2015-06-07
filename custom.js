$(document).ready(function(){


	function insertBlockAtCursor(element, className) { 
        var sel, range, html; 
        sel = window.getSelection();
        range = sel.getRangeAt(0);
        //stop elements from being added to the toolbar
        if(range.endContainer.className != "toolbar"){
	        range.deleteContents(); 
	        var newBlock = document.createElement(element);
	        newBlock.className = className;
	        var blockText = document.createTextNode("This is a new code block");
	        var afterBlock = document.createElement('p');
	        afterBlock.className = 'afterBlock';
	        newBlock.appendChild(blockText);
	        range.insertNode(newBlock);
	        range.setStartAfter(newBlock);
	        range.insertNode(afterBlock);
	        sel.removeAllRanges();
	        sel.addRange(range); 
        }       
    }
   

    $('.insertCodeBlock').click(function(){
    	insertBlockAtCursor('div', 'codeBlock');
    });
    $('.indentSection').click(function(){
    	insertBlockAtCursor('div', 'indentedBlock');
    });

    // store all notes html to local browser storage
    // store data on keyup, with debounce (only run after x milisec. of no keyups)
    var saveLocal = function(){
    	localStorage.setItem('content', $('.notesContain').html());
    }
    var debouncedSaveLocal = _.debounce(saveLocal, 500);

    $('.notesContain').keyup(function(){
    	debouncedSaveLocal();
    });
    // on load, retrieve stored data from local browser storage
    if (localStorage.getItem('content')) {
	  $('.notesContain').html(localStorage.getItem('content'));
	}
});