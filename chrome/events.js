
function seint( txt, url, title ) {
	if( ! txt )	txt = window.getSelection().toString();
	if( ! txt ) {
		var fs = document.getElementsByTagName( 'frame' );
		for( var i = 0; i < fs.length; i++ ) {
			txt = fs[i].contentDocument.getSelection().toString();
			if( txt ) break;
		}
		fs = document.getElementsByTagName( 'iframe' );
		for( var i = 0; i < fs.length; i++ ) {
			txt = fs[i].contentDocument.getSelection().toString();
			if( txt ) break;
		}
	}
	if( ! txt ) return;
	if( ! url ) url = window.location.href;
	if( ! title ) url = document.title;

	var days = {
		'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6,
		'domingo': 0, 'lunes': 1, 'martes': 2, 'miercoles': 3, 'miércoles': 3, 'jueves': 4, 'viernes': 5, 'sábado': 6, 'sabado': 6,
		'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6,
		'dom': 0, 'lun': 1, 'mar': 2, 'mie': 3, 'mié': 3, 'jue': 4, 'vie': 5, 'sab': 6, 'sáb': 6
	};

	var months = {
		'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5, 'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11,
		'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11,
		'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11,
		'ene': 0, 'abr': 3, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
	};

	var r_days = []; for( var k in days ) r_days.push( k );	r_days = r_days.join( '|' );
	var r_months = []; for( var k in months ) r_months.push( k ); r_months = r_months.join( '|' );

	var patterns = [
		{
			re: '('+r_days+').+?\\b('+r_months+')\\b.*?(\\d\\d)(.*)',
			e: function( d, m ) { return new Date( d.getFullYear(), months[ m[2] ] + 1, m[3] ); }
		},
		{
			re: '('+r_days+') (\\d\\d?).+?\\b('+r_months+')\\b.*?(\\d{2,4})(.*)',
			e: function( d, m ) { return new Date( m[4], months[ m[3] ] + 1, m[2] ); }
		},
		{
			re: '('+r_days+') (\\d\\d?).+?\\b('+r_months+')\\b(.*)', 
			e: function( d, m ) { return new Date( d.getFullYear(), months[ m[3] ] + 1, m[2] ); }
		},
		{
			re: '(\\d\\d?)[^\\d.]+?\\b('+r_months+')\\b(.*)',
			e: function( d, m ) { return  Date( d.getFullYear(), months[ m[2] ] + 1, m[1] ); }
		},
		{
			re: '('+r_days+') (\\d\\d?)(.*)',
			e: function( d, m ) { return new Date( d.getFullYear(), d.getMonth(), m[2] ); }
		},
		{
			re: '(pr[oó]ximo|este) ('+r_days+')([^.\n\r]*)', 
			e: function( d, m ) { return new Date( d.getFullYear(), d.getMonth(), d.getDate() + ( 7 + days[ m[2] ] - d.getDay() )%7 ); }
		},
		{
			re: '(this|next) ('+r_days+')([^.\n\r]*)',
			e: function( d, m ) { return new Date( d.getFullYear(), d.getMonth(), d.getDate() + ( 7 + days[ m[2] ] - d.getDay() )%7 ); }
		},
		{
			re: '(hoy|today)([^.\n\r]*)',
			e: function( d, m ) { return d; }
		},
		{
			re: '(ma[ñn]ana|tomorrow)([^.\n\r]*)',
			e: function( d, m ) { return new Date( d.getFullYear(), d.getMonth(), d.getDate() + 1 ); }
		}
	];


	function search_date( txt, d ) {
		txt = txt.toLowerCase();
		if( ! txt ) return null;
		var m;
		for( var k in patterns ) {
			m = txt.match( new RegExp( patterns[k].re ) );
			//if( m ) alert( patterns[k].re+' --------> '+m[1]+' '+m[2]+' '+m[3] ); // DEBUG
			if( m ) return search_hour( m.pop(), patterns[k].e( d, m ) );
		}

		return null;
	}


	function search_hour( txt, d ) {
		var m = txt.match( /(\d?\d):(\d\d):(\d\d)/ );
		if( m ) {
			d.setHours( m[1], m[2], m[3] );
			return d;
		}

		m = txt.match( /(\d?\d):(\d\d)/ );
		if( m ) {
			d.setHours( m[1], m[2] );
			return d;
		}

		m = txt.match( /(\d)(am|pm)/ );
		if( m ) {
			d.setHours( parseInt( m[1] ) + ( m[2] == 'pm' ? 12 : 0 ), 0 );
			return d;
		}
		
		m = txt.match( /(\d?\d)/ );
		if( m && m[1] <= 24 ) {
			d.setHours( m[1], 0 );
			return d;
		}

		m = txt.match( /(\d\d?)\s+h(our|ora|r)s/ );
		if( m && m[1] ) {
			d.setHours( m[1], 0 );
			return d;
		}

		d.setHours( 0 );

		return d;
	}

	var lm = new Date( document.lastModified );
	if( lm.getFullYear() == 1969 ) lm = new Date();

	var lines = txt.replace( /[\n\r]+/gm, ' ' ).split( /[\.\?]\s/ );

	for( var i in lines ) {
		var l = lines[i].replace( /^\s+/, '' ).replace( /\s+$/, '' ).toLowerCase();
		if( ! l ) continue;
		d = search_date( l, lm );
		if( d ) break;
	}

	if( ! d ) d = lm;

	var pad = function( n ) { return n < 10 ? '0'+n : n; };
	var h = pad( d.getUTCHours() );
	var m = pad( d.getUTCMinutes() );
	var day = pad( d.getUTCDate() );
	var mo = pad( d.getUTCMonth() );
	var dd = ''+d.getUTCFullYear()+mo+day+'T'+h+m+'00Z';
	var t = encodeURIComponent( title || url );
	var dt = encodeURIComponent( txt.replace( /\s\s+/g, ' ' ).replace( /[\n\r]{2,}/g, '\n' ).substring( 0, 500 )+'\n\n'+url );
	var url = 'http://www.google.com/calendar/event?action=TEMPLATE&text='+t+'&dates='+dd+'/'+dd+'&sprop=website:'+encodeURIComponent( url )+'&details='+dt;
	return { 'url': url, 'text': t, 'dates': dd, 'details': dt };
}




