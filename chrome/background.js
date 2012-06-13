chrome.browserAction.onClicked.addListener(
	function( tab ) {
	    chrome.tabs.executeScript( tab.id, { file: 'content_script.js' } );
	}
);

chrome.extension.onConnect.addListener(function(port) {
  var tab = port.sender.tab;
  port.onMessage.addListener( function( data ) {
	var url = 'http://www.google.com/calendar/';
	if( data.txt ) {
		var res = seint( data.txt, data.url, data.title );
		if( res.url ) url = res.url;
	}
	chrome.tabs.create( { "url": url } );
  });
});