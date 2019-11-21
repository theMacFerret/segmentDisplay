/* 
   Segment display plugin
   by theMacFerret

   display whatever on 16 segments display made of SVGs

	v0.2
*/

(function(window){

	function segmentDisplay() {
		var _segmentDisplayObject = {};

		var settings = {
			target: document.body,
			animationDelay: 100, // milliseconds
			clockStarted: false,
			clockType: 24, // 24 or 12
			clockSeconds: true,
			debug: false,
			error: true,
			maxDisplayLength: false, // number of display, if false it's infinite
			segmentClassName: 'segment',
			segmentDisplaySvgAttr: { viewBox: '0 0 560 750', class: 'segment-display' },
			segmentPaths: [
				'M444.3,50l-46,46H101.7l-46-46l46-46h296.7L444.3,50z',
				'M4,298.3l46,46l46-46V101.7l-46-46l-46,46V298.3z',
				'M147.4,102l86.8,196.3h-81.6l-50.6-110V102H147.4',
				'M260.3,298.3h-20.6L204,217.6V101.7h92v115.9L260.3,298.3z',
				'M352.6,102H398v86.3l-50.6,110h-81.6L352.6,102',
				'M404,298.3l46,46l46-46V101.7l-46-46l-46,46V298.3z',
				'M101.7,396h144.7v-92H101.7l-46,46L101.7,396z',
				'M253.7,396h144.7l46-46l-46-46H253.7V396z',
				'M4,598.3l46,46l46-46V401.7l-46-46l-46,46V598.3z',
				'M147.4,598H102v-86.3l50.6-110h81.7L147.4,598',
				'M296,482.4v115.9h-92V482.4l35.7-80.7h20.6L296,482.4z',
				'M352.6,598l-86.8-196.3h81.6l50.6,110V598H352.6',
				'M404,598.3l46,46l46-46V401.7l-46-46l-46,46V598.3z',
				'M444.3,650l-46,46H101.7l-46-46l46-46h296.7L444.3,650z',
				'M-56.9,122l27.6,27.6L-1.7,122V4h-55.2V122z',
				'M502,696h55.2v-59H502V696z'
			],
			marqueeDelay: 500
		}

		var timerInterval;

		_segmentDisplayObject.clock = function(type) {
			debug('_segmentDisplayObject.clock >> ' + JSON.stringify(arguments));
			if (typeof type !== 'undefined') {
				if (type == 24 || 12 || false) settings.clockType = type;
				else error('clock - ' + type + ' is not a valid parameter, requires 24, 12 or false');
			}
			if (!type) {
				debug('_segmentDisplayObject.clock >> type = ' + type);
				clearInterval(timerInterval);
				return debug('_segmentDisplayObject.clock >> settings.clockStarted = ' + settings.clockStarted);
			}
			else {
				if (settings.clockStarted) {
					debug('_segmentDisplayObject.clock >> timerInterval = ' + timerInterval)
					clearInterval(timerInterval);
					timerInterval = setInterval(getTime, 1000);
					return debug('_segmentDisplayObject.clock >> settings.clockStarted = ' + settings.clockStarted);
				}
				else {
					settings.clockStarted = true;
					timerInterval = setInterval(getTime, 1000);
					return debug('_segmentDisplayObject.clock >> settings.clockStarted = ' + settings.clockStarted);
				}
			}
		}

		_segmentDisplayObject.text = function(string) {
			debug('_segmentDisplayObject.text >> ' + JSON.stringify(arguments));
			if (typeof string !== 'undefined') {
				showCode(convertToCode(string.toString()));
			}
			else error('string - ' + string + ' is not a valid parameter, requires a string');
		}

		_segmentDisplayObject.code = function(code) {
			debug('_segmentDisplayObject.code >> ' + JSON.stringify(arguments));
			if (typeof code !== 'undefined' && typeof code === 'object') {
				showCode(code);
			}
			else error('code - ' + code + ' is not a valid parameter, requires an array');
		}

		_segmentDisplayObject.testWidth = function() {
			debug('_segmentDisplayObject.testWidth >> ' + JSON.stringify(arguments));
			setMaxDisplayLength();

			setTimeout(function() {
				var characters = '';
				for (var i = 0; i < settings.maxDisplayLength; i++) {
					characters += '0';
				}
				debug('_segmentDisplayObject.testWidth >> settings.maxDisplayLength = ' + settings.maxDisplayLength);
				showCode(convertToCode(characters.toString()));
			}, 200);
		}

		_segmentDisplayObject.marquee = function(string) {
			debug('_segmentDisplayObject.marquee >> ' + JSON.stringify(arguments));
			if (typeof string !== 'undefined') {
				if (!settings.maxDisplayLength) setMaxDisplayLength();

				setTimeout(function() {
					if (string.length < settings.maxDisplayLength) showCode(convertToCode(string.toString()));
					else {
						var steps = (string.length - settings.maxDisplayLength) + 1;
						var textArray = string.toString().split('');
						var marqueeArray = [];
						var timeoutArray = [];
						for (var i = 0; i < steps; i++) {
							timeoutArray.push(settings.marqueeDelay * i);
							if (i != 0) textArray.shift();
							marqueeArray.push(textArray.join(''));
						}
						function marqueeTimeout(i) {
							debug('_segmentDisplayObject.marquee >> step = ' + i + ', text = ' + marqueeArray[i]);
							setTimeout(function() {
								showCode(convertToCode(marqueeArray[i]), true);
							}, timeoutArray[i]);
						}
						setTimeout(function() {
							for (var t = 0; t < steps; t++) marqueeTimeout(t);
						}, 100);
					}
				}, 200);
			}


		}

		_segmentDisplayObject.setup = function(options) {
			debug('_segmentDisplayObject.settings >> ' + JSON.stringify(arguments));
			if (typeof options === 'object') {
				if (options.target) settings.target = options.target;
				else error('setup - options.target = ' + options.target);

				if (typeof options.animationDelay !== 'undefined') settings.animationDelay = options.animationDelay;
				if (typeof options.debug === 'boolean') settings.debug = options.debug;
				if (typeof options.error === 'boolean') settings.error = options.error;
				if (typeof options.maxDisplayLength !== 'undefined') settings.maxDisplayLength = options.maxDisplayLength;
				if (typeof options.clockSeconds === 'boolean') settings.clockSeconds = options.clockSeconds;
				if (typeof options.marqueeDelay === 'undefined') settings.marqueeDelay = options.marqueeDelay;
			}
			else error('code - ' + options + ' is not a valid parameter, requires an object');
		}

		_segmentDisplayObject.settings = function() {
			debug('_segmentDisplayObject.settings');
		}

		function error(string) {
			if (settings.error) console.error('segmentDisplay.' + string);
		}

		function debug(string) {
			if (settings.debug) console.log(string);
		}

		function convertToCode(string) {
			debug('convertToCode >> string = ' + string);
			var encoding = {
				'0':'3333',
				'1':'1030',
				'2':'21E1',
				'3':'30A1',
				'4':'10E2',
				'5':'30C3',
				'6':'31C3',
				'7':'1021',
				'8':'31E3',
				'9':'10E3',
				'a':'31E1',
				'à':'31E1',
				'b':'2942',
				'c':'21C0',
				'd':'2548',
				'e':'2143',
				'é':'2143',
				'è':'2143',
				'ê':'2143',
				'ë':'2143',
				'f':'0143',
				'g':'30A5',
				'h':'11C2',
				'i':'0400',
				'î':'0400',
				'ï':'0400',
				'j':'3020',
				'k':'0C18',
				'l':'0102',
				'm':'15C0',
				'n':'0940',
				'o':'31C0',
				'ô':'31C0',
				'ö':'31C0',
				'p':'0153',
				'q':'08E3',
				'r':'0140',
				's':'3085',
				't':'2142',
				'u':'3100',
				'ù':'3100',
				'û':'3100',
				'ü':'3100',
				'v':'0300',
				'w':'1B00',
				'x':'0A14',
				'y':'30A8',
				'z':'2211',
				'A':'34A9',
				'À':'34A9',
				'Â':'34A9',
				'B':'254B',
				'C':'2103',
				'D':'3429',
				'E':'21C3',
				'É':'21C3',
				'È':'21C3',
				'Ê':'21C3',
				'Ë':'21C3',
				'F':'01C3',
				'G':'3183',
				'H':'11E2',
				'I':'2409',
				'Î':'2409',
				'Ï':'2409',
				'J':'3120',
				'K':'0952',
				'L':'2102',
				'M':'1136',
				'N':'1926',
				'O':'3123',
				'Ô':'3123',
				'Ö':'3123',
				'P':'01E3',
				'Q':'3923',
				'R':'09E3',
				'S':'3085',
				'T':'0409',
				'U':'3122',
				'Ù':'3122',
				'Û':'3122',
				'V':'0312',
				'W':'1B22',
				'X':'0A14',
				'Y':'0414',
				'Z':'2211',
				'-':'00C0',
				'_':'2000',
				':':'0408',
				'~':'0000',
				"'":'4000',
				'\\':'0804',
				'=':'20C0',
				'$':'34CB',
				'+':'04C8',
				'*':'0EDC',
				'/':'0210',
				',':'0200',
				'.':'8000',
				'error':'3B37'
			}
			debug('convertToCode >> string = ' + string);
			var array = string.replace(/ /g, '~').split('');
			var newArray = [];
			array.forEach(function(e, i) {
				if (encoding.hasOwnProperty(e)) array[i] = encoding[e];
				else array[i] = encoding.error;
			});
			return array;
		}

		function showCode(code, fast) {
			debug('showCode >> code = ' + JSON.stringify(code));
			var length = code.length;
			checkAvailableDisplay(length);
			setDisplay(code, fast);
		}

		function getTime() {
			debug('getTime >> settings.clockType = ' + settings.clockType);
			var date = new Date(), hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
			var secondTick = (seconds % 2 == 1 ? ':' : ' ');
			var secondCode = (settings.clockSeconds ? secondTick + (seconds.toString().length > 1 ?  seconds : '0' + seconds) : '');
			if (settings.clockType == 24) var time = hours + (!settings.clockSeconds ? secondTick : 'h') + (minutes.toString().length > 1 ? minutes : '0' + minutes) + secondCode;
			else {
				var AM = (hours > 12 ? false : true);
				var hours = hours % 12;
				var time = hours + (!settings.clockSeconds ? secondTick : 'h') + (minutes.toString().length > 1 ? minutes : '0' + minutes) + secondCode + (AM ? ' AM' : ' PM');
			}
			debug ('getTime >> time = ' + time);
			showCode(convertToCode(time));
		}

		// Creates SVG elements with attributes as objects
		function getNode(n, v) {
			n = document.createElementNS('http://www.w3.org/2000/svg', n);
			for (var p in v)
				n.setAttributeNS(null, p, v[p]);
			if (n.nodeName == 'svg')
				n.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
			if (n.nodeName == 'use')
				n.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href', '#' + v.xlink);
			return n
		}

		function appendSegmentDisplay(number) {
			debug('appendSegmentDisplay >> number = ' + number);
			if (typeof number === 'undefined') number = 1;
			for (var i = 0; i < number; i++) {
				var svg = getNode('svg', settings.segmentDisplaySvgAttr);
				var group = getNode('g');
				settings.segmentPaths.forEach(function (e) {
					group.appendChild(getNode('path', {d: e, class: settings.segmentClassName}));
				});
				svg.appendChild(group);
				settings.target.appendChild(svg);
			}
		}

		function removeSegmentDisplay(number) {
			debug('removeSegmentDisplay >> number = ' + number + ' number of elements = ' + settings.target.getElementsByClassName(settings.segmentDisplaySvgAttr.class).length);
			for (var i = 0; i < number; i++) {
				var displays = settings.target.getElementsByClassName(settings.segmentDisplaySvgAttr.class);
				displays[displays.length - 1].remove();
			}
		}

		function checkAvailableDisplay(number) {
			var displays = settings.target.getElementsByClassName(settings.segmentDisplaySvgAttr.class);
			debug('checkAvailableDisplay >> number = ' + number + ', displays.length = ' + displays.length);
			if (!settings.maxDisplayLength) {
				if (number > displays.length) appendSegmentDisplay(number - displays.length);
				if (number < displays.length) removeSegmentDisplay(displays.length - number);
			}
			else if (settings.maxDisplayLength < displays.length) {
				removeSegmentDisplay(displays.length - settings.maxDisplayLength);
			}
			else if (settings.maxDisplayLength > displays.length) {
				appendSegmentDisplay(settings.maxDisplayLength);
			}
		}

		function setDisplay(code, fast) {
			debug('setDisplay >> code = ' + JSON.stringify(code));
			var overflow = 0;
			code.forEach(function(e, i) {
				var display = settings.target.getElementsByClassName(settings.segmentDisplaySvgAttr.class)[i];
				if (typeof display !== 'undefined') {
					if (typeof fast !== 'undefined' && fast) display.classList.add('fast');
					else display.classList.remove('fast');
				}
				var bin = preZero(parseInt(e, 16).toString(2));
				var array = bin.split('').reverse();
				debug('setDisplay >> index = ' + i + ', bin = ' + bin);
				array.forEach(function(s, i) {
					if (s == 1 && typeof display !== 'undefined') display.childNodes[0].childNodes[i].classList.add('selected');
					else if (s == 0 && typeof display !== 'undefined') display.childNodes[0].childNodes[i].classList.remove('selected');
				});
				if (typeof display === 'undefined') overflow++;
			});
			if (overflow > 0) debug('setDisplay >> display overflow = ' + overflow);
		}

		function preZero(string) {
			var missingZeros = settings.segmentPaths.length - string.toString().length;
			debug('preZero >> missing zeros = ' + missingZeros);
			var zeros = '';
			for (var i = 0; i < missingZeros; i++) zeros += '0';
			return zeros + string.toString();
		}

		function setMaxDisplayLength() {
			var displayWidth = settings.target.offsetWidth;
			settings.maxDisplayLength = 1;
			showCode(['0000']);
			setTimeout(function() {
				var segmentWidth = settings.target.getElementsByTagName('svg')[0].getBoundingClientRect();
				segmentWidth = segmentWidth.width;
				var maxDisplayLengthForTargetWidth = Math.floor(displayWidth / segmentWidth);			
				debug('setMaxDisplayLength >> displayWidth = ' + displayWidth + ', segmentWidth = ' + segmentWidth + ', maxDisplayLengthForTargetWidth = ' + maxDisplayLengthForTargetWidth);
				settings.maxDisplayLength = maxDisplayLengthForTargetWidth;
				settings.target.innerHTML = '';
			}, 100);
		}

		return _segmentDisplayObject;

	}

	if (typeof(window.segmentDisplay) === 'undefined') {
		window.segmentDisplay = segmentDisplay();
	}
	else console.error('Unable to execute, segmentDisplay is already defined');
})(window);