// This script is only executed once the page has loaded.
if( window.opera && opera.extension ) {
	window.addEventListener( 'DOMContentLoaded', function() {
		opera.extension.onmessage = function(e) {
			var url = 'http://www.google.com/calendar';
			var res = seint();
			if( res && res.url ) url = res.url;
			opera.extension.postMessage( { "url": url, action: 'new_tab' } );
		};
	}, false );
}





