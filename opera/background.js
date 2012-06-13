// Add a button to Opera's toolbar when the extension loads.
window.addEventListener( 'load', function() {
	// Buttons are members of the UIItem family.
	// Firstly we set some properties to apply to the button.
	var UIItemProperties = {
		disabled: true, // The button is disabled.
		title: "Search Event and redirect to Google Calendar", // The tooltip title.
		icon: "icon_18.png", // The icon (18x18) to use for the button.
		onclick: function() {
			// Send a message to the currently-selected tab.
			var tab = opera.extension.tabs.getFocused();
			if( tab ) { // Null if the focused tab is not accessible by this extension
				tab.postMessage('go');
			}
		}
	};

	// Next, we create the button and apply the above properties.
    var button = opera.contexts.toolbar.createItem( UIItemProperties );
    // Finally, we add the button to the toolbar.
    opera.contexts.toolbar.addItem( button );
    
	function enableButton() {
		button.disabled = opera.extension.tabs.getFocused() ? false : true;
	}
	
	// Enable the button when a tab is ready.
	opera.extension.onconnect = enableButton;
	opera.extension.tabs.onfocus = enableButton;
	opera.extension.tabs.onblur = enableButton;
	
	
	opera.extension.onmessage = function( e ) {
		if( e.data.action == 'new_tab' ) {
			opera.extension.tabs.create( {
				url: e.data.url,
				focused: true,
			} );
		}
	}
	
}, false);
