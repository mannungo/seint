
if( typeof window.getSelection == 'function' ) {
	txt = window.getSelection().toString();
	if( ! txt ) {
		var fs = document.getElementsByTagName( 'frame' );
		for( var i = 0; i < fs.length; i++ ) {
			txt = fs[i].contentDocument.getSelection().toString();
			if( txt ) break;
		}
	}
	if( ! txt ) {
		fs = document.getElementsByTagName( 'iframe' );
		for( var i = 0; i < fs.length; i++ ) {
			if( fs[i].contentDocument ) txt = fs[i].contentDocument.getSelection().toString();
			if( txt ) break;
		}
	}
}

chrome.extension.connect().postMessage( { "txt": txt, "url": window.location.href, "title": document.title } );