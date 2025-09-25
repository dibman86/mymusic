/**carousel3dYtv4mp**/

function Carousel3Dspirale() {
	let xhr,plitems,cellWidth,cellHeight,cells,menuplaylist,oldplayid,playid,datatoken,cellCount,verif,timeout,link,iframeparent,celliframe,iframecache,btnmute,timelineContainer,currentTimeElem,wasPaused,cellIndex,minilecteurindex,totalcellCount,cumulcells,changetotal,videovue,ctp,counter,countrotate,scells;
	let isScrubbing = false;
	let valtimer = 0;
	let arraycells = [];
	const droot = document.body;
	const loader = document.querySelector('.loader');
	const bgimgoverlay = document.querySelector('.bg-image-overlay');
	const scene = document.querySelector('.scene');
	const sceneenglobe = scene.querySelector('.scene__englobe');
	const scenerotate3d = sceneenglobe.querySelector('.scene__rotate3d');
	const carousel = scene.querySelector('.carousel');
	const bouton = document.querySelector('.button-nav');
	const prevButton = bouton.querySelector('.previous-button');
	const nextButton = bouton.querySelector('.next-button');
	const scrollorswipe = document.querySelector('.scrollorswipe');
	const uptotop = document.querySelector('.btn-up');
	let indexid = 0;
	let shuffle = false;
	let blockindex = false;
	let changerotate = true;
	let tabrotate = [0,5,0,-5];
	let toggle = false;
	let isclicked = false;
	let timerclick = null;
	let intervalId = null;
	let timercursor = null;
	let playercell = null;
	let pos = [0,0],direction = 'normal';
	let rcells = [];
	window.oldcellcellIndex = 0;
	window.globalvolume = 100;
	window.globalmute = false;
	window.noMobile = document.documentElement.classList.contains('no-mobile');
	
	init();
	calcWidthAndHeight();
	
	function init(){
		cellIndex = 0;
		minilecteurindex = 0;
		totalcellCount = 0;
		cumulcells= '';
		changetotal = false;
		videovue = [];
		ctp = 0;
		counter = 0;
		countrotate = 0;
		scells = [];
	}
	
	
	function removecells() {
		bouton.style.right = '-100%';
		loader.style.display = 'block';
		droot.classList.remove('scene-loaded');
		sceneenglobe.style.setProperty('--rotate-sceneenglobe','0deg');
		if (cells) {
			removechildelement(carousel);
		}
	};

	function removepopup() {
		const popup = document.querySelector('.popup');
		if (popup) {
			popup.remove();
		}
	};

	function popupgenerate(text, v) {
		if (v) text = text + '<button type="button" class="btn reessayer" tabindex="0">réessayer</button>';
		const createpopup = '<div class="popup"><button type="button" id="popup-esc" class="popup-close" aria-label="Fermer" title="Fermer (Esc)" tabindex="0"><i class="fas fa-times"></i></button><div class="popup_content"><p>' + text + '</p></div></div>';
		scene.parentElement.insertAdjacentHTML('afterend', createpopup);
		loader.style.display = 'none';
		const popupClose = document.getElementById('popup-esc');
		popupClose.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			removepopup();
			const next = carousel.querySelector('.next_cells .btn');
			if (next) next.classList.remove("click-plus");
		})
	};
	
	function nextButtomtrigger() {
		const btnnext = document.querySelector('.next_cells .btn-plus:not(.click-plus)');
		if (btnnext) {
			triggerEvent(btnnext, 'click');
		}else{
			cellIndex < 50 ? rotateCarousel(cellIndex) : setTimeout(function(){rotateCarousel(cellIndex)},250);
			droot.classList.add('scene-loaded');
			loader.style.display = 'none';
			if (totalcellCount > 0 ) {
				bouton.style.right = '0px';
			}else{
				if(document.querySelector(".end_cells")) droot.insertAdjacentHTML('beforeend', '<div class="not_result">Aucun Résultat</div>');
			}
		}
	};
	
	window.addEventListener('resize', debounce(function() {
		if (cells) {
			calcWidthAndHeight(true);
		}
	}, 300));
	
	function calcWidthAndHeight(resize) {
		let calcWidth,calcHeight,wh,ww;
		if(window.matchMedia("screen and (max-width: 550px) and (max-height: 450px) and (orientation: landscape)").matches){
			ww = window.innerHeight * 0.55;
			wh = window.innerHeight * 0.31;
		}else if (window.matchMedia("screen and (max-height: 450px)  and (orientation: landscape)").matches) {
			ww = window.innerHeight * 0.60;
			wh = window.innerHeight * 0.33;
		}else if(window.matchMedia("screen and (max-height: 450px)").matches){
			ww = window.innerWidth * 0.50;
			wh = window.innerWidth * 0.28;
		}else{
			ww = window.innerWidth * 0.55;
			wh = window.innerWidth * 0.31;
		}
		calcWidth = Math.floor(ww);
		calcHeight = Math.floor(wh);
		carousel.style.width = `${calcWidth}px`;
		carousel.style.height = `${calcHeight}px`;
		if(!resize){
			cellWidth = carousel.offsetWidth;
			cellHeight = carousel.offsetHeight;
		}else{
			const newcellWidth = carousel.offsetWidth;
			const newcellHeight = carousel.offsetHeight;
			if (newcellWidth !== cellWidth || newcellHeight !== cellHeight) {
				cellWidth = newcellWidth;
				cellHeight = newcellHeight;
				positionCarousel(cellIndex);
			}
		}
	}

	function loadVids(playlistId, token, videoid) {
		if (!token) token = '';
		const url = 'https://www.googleapis.com/youtube/v3/playlistItems';
		const options = {
			part: 'snippet',
			key: addApiKey(),
			maxResults: 50,
			playlistId: playlistId,
			pageToken: token
		}
		if (xhr) xhr.abort();
		if ("Promise" in window) {
			getJSON(url, options)
				.then(function(data) {
					const dataitems = data.items;
					const totalvideoplaylist = data.pageInfo.totalResults;
					let cellnext;
					if (data.nextPageToken) {
						cellnext = data.nextPageToken;
					}
					
					let find;
					for(let i = 0; i < arraycells.length; i++) {
						if(arraycells[i].index === playlistId && arraycells[i].id < parseInt(indexid)){
							find = i;
						}
					}
					
					if (find){
						if (totalvideoplaylist !== arraycells[find].tvp){
							let newtotal = (totalvideoplaylist - arraycells[find].tvp);
							dataitems.splice(0,newtotal);
							changetotal = true;
						}
					}
					
					if(changetotal){
						for(let i = 0; i < arraycells.length; i++) {
							if(arraycells[i].index === playlistId){
								arraycells.splice(i,1);
							}
						}
					}else{
						arraycells.push({
							'id': indexid,
							'index': playlistId,
							'nexttoken': cellnext,
							'cells': dataitems,
							'tvp': totalvideoplaylist
						})
					}
					
					addCells(dataitems, playlistId, cellnext, indexid, videoid);
					indexid++;
				})
				.catch(function(err) {
					console.error('Augh, there was an error!', err);
					removepopup();
					if (err === 0) {
						popupgenerate('Veuillez vérifier votre connexion réseau et réessayer.', true);
						const reessayer = document.querySelector('.reessayer');
						const reload = function(e) {
							e.preventDefault();
							e.stopPropagation();
							if (!datatoken) {
								removecells();
							}
							loadVids(playid,datatoken);
						};
						window.addEventListener('online', reload);
						if (reessayer) {
							reessayer.focus();
							reessayer.addEventListener('click', reload);
						}
					} else if (err === 404) {
						popupgenerate('Cette ressource n\'est plus disponible , veuillez sélectionner une autre playlist.');
					} else {
						popupgenerate('Un probleme est survenue , veuillez verifier votre connection ou essayer une autre playlist.');
					}
				});
		}else{
			popupgenerate('Votre navigateur est trop ancien pour faire fonctionner ce site.</br>Veuiller le changer pour un navigateur plus moderne.');
		}
	};
	
	function getJSON(url, qs_params) {
		function buildQueryString(params) {
			return Object.entries(params).map(function(d) {
				return d[0] + '=' + d[1];
			}).join('&');
		};

		return new Promise(function(resolve, reject) {
			const qs = qs_params ? '?' + buildQueryString(qs_params) + '&nocache' : '?nocache';
			xhr = new XMLHttpRequest();

			xhr.onload = function() {
				if (this.status >= 200 && this.status < 300) {
					resolve(JSON.parse(this.responseText));
				}else{
					reject(this.status);
				}
			};

			xhr.onerror = function() {
				reject(this.status);
			};

			xhr.open('GET', url + qs);
			xhr.send(null);
		});
	};

	function addCells(data, playlistId, cellnext, idindex, videoid) {
		if (xhr) xhr.abort();
		removepopup();
		if (!videoid) videoid = '';
		const nextc = carousel.querySelector('.next_cells');
		if (nextc) nextc.remove();
		let newcellindex;
		let html = '';
		for (let i = 0; i < data.length; i++) {
			const title = data[i].snippet.title;
			const vid = data[i].snippet.resourceId.videoId;
			let thumb;
			if (videoid !== '') {
				if (videoid === vid) {
					newcellindex = i;
				}
			}
			if (!isEmpty(data[i].snippet.thumbnails)) {
				if (data[i].snippet.thumbnails.hasOwnProperty('standard')) {
					thumb = data[i].snippet.thumbnails.standard.url;
				} else if (data[i].snippet.thumbnails.hasOwnProperty('medium')) {
					thumb = data[i].snippet.thumbnails.medium.url;
				} else {
					thumb = data[i].snippet.thumbnails.default.url;
				}
			} else {
				data.splice(i, 1);
				i--;
				continue;
			}
			const div =
				'<div class="carousel__cell" data-style="false"><div class="wrap-cell"><div class="wrap-cell-overlay" style="background-image:url(' + thumb + ');"></div><a class="ytlink mediabox" data-click="false" data-img="' + thumb + '" data-globalid="' + (playlistId + ',' + vid) + '" data-currenttime="0" href="https://www.youtube-nocookie.com/embed/' + vid + '" rel="noopener noreferrer nofollow" target="_blank" ondragstart="return false;"><div class="cell loading_img"><img src="' + thumb + '" alt="" loading="lazy"></div><div class="carousel-glare"></div><div class="yttitle" translate="no"><span>' + title + '</span></div><div class="flashlight"></div><div class="blockqr"><button type="button" class="btn_qr fa fa-times default-click not-hide"  title="Afficher QR Code">QR</button><div class="container_qr default-click"><div class="container_imgqr loading_img"><img class="video_qr" src="https://quickchart.io/qr?text=https%3A%2F%2Fyoutu.be%2F' + vid + 'DPxL7dO5XPc&light=ff0000&dark=ffffff&margin=6&size=140&format=svg" alt="QR CODE"></div><div class="text_qr">SCANNE MOI</div></div></div></a></div></div>';
			html = html + div;
		}
		
		cellCount = data.length;
		totalcellCount += cellCount;
		
		if (!shuffle && !blockindex) {
			cellIndex = totalcellCount - cellCount;
		}
		
		if(blockindex) blockindex = false;

		if (videoid !== '') {
			if (newcellindex) {
				cellIndex = totalcellCount -  (cellCount - newcellindex);
			}else{
				if(cellnext){
					cumulcells = cumulcells + html;
					const check = checkIndex(playlistId,cellnext,idindex);
					if (check) {
						addCells(check.cells, check.index, check.nexttoken, check.id, videoid);
					} else {
						loadVids(playlistId, cellnext , videoid);
					}
					return;
				}else{
					cellIndex = 0;
					setCookie("lastposition", '');
					setCookie(playlistId, '');
				}
			}
		}
		
		minilecteurindex = cellIndex;
		
		if(cumulcells !== ''){
			html = cumulcells + html;
			cumulcells = '';
		} 
			
		if (cellnext) {
			html = html + '<div class="carousel__cell next_cells" data-style="false"><button type="button" data-id="' + idindex + '" data-playlistid="' + playlistId + '" data-token="' + cellnext + '"class="ytlink btn btn-plus" title="Voir plus"><i class="fa fa-plus"></i><span>Voir plus</span></button></div>'
		}else {
			if (totalcellCount >= 3) {
				html = html + '<div class="end_cells" style="display: none;"></div>'
			}
		}
				
		carousel.insertAdjacentHTML('beforeend', html);
		parentcells = carousel.querySelectorAll('.carousel__block');
		cells = carousel.querySelectorAll('.carousel__cell');
		const nextcells = carousel.querySelector('.next_cells .btn');
		const images = document.querySelectorAll('.carousel__cell .loading_img img');
		
		function imgOK(img) {
			if (!img.complete) {
				return false;
			}
			if (img.naturalWidth && img.naturalWidth === 0) {
				return false;
			}
			return true;
		};
		
		for(const el of images) {
			el.addEventListener("load", function(e) {
				const isLoaded = imgOK(el);
				if (isLoaded) {
					this.classList.add('loaded');
					this.parentElement.classList.remove('loading_img');
				}
			});
		};

		if (nextcells) {
			nextcells.addEventListener('click', function(e) {
				const target = e.currentTarget;
				target.classList.add("click-plus");
				const dataplaylistid = target.dataset.playlistid;
				datatoken = target.dataset.token;
				const dataindexid = target.dataset.id;
				const check = checkIndex(dataplaylistid,cellnext,dataindexid);
				setTimeout(function() {
					if (typeof check !== "undefined") {
						addCells(check.cells, check.index, check.nexttoken, check.id);
					} else {
						loadVids(dataplaylistid, datatoken);
					}
				}, valtimer);
				blockindex = true;
			});
		}
		if(searchlist.value === "") window.oldcellcellIndex = cellIndex;
		changeCarousel();
	};
	
	function changeCarousel() {	
		if(!scells.length) {
			rcells = cells;
		} else {
			rcells = scells;
		}
				
		rcells.forEach(function(el,index){
			const hendelfocuscells = debounce(function(e) {
				e.preventDefault();
				if (index === cellIndex) return;
				cellIndex = index;
				scene.scrollTo(0, 0);
				rotateCarousel(cellIndex);
				hide(scrollorswipe);
				hide(bouton);
			},150);
			
			const elchild = el.querySelector('.ytlink');
			
			if (elchild !== null) {
				delete el.onfocus;
				elchild.onfocus = function(e){hendelfocuscells(e)};
			}

			if (el.dataset.style === 'false') {
				el.dataset.style = 'true';
				el.style.opacity = '1';
				const blockqr  = el.querySelector('.blockqr');
				if (blockqr){
					blockqr.addEventListener('click',function(e){
						e.preventDefault();
						e.stopPropagation();
						const target = e.currentTarget;
						if(!target.classList.contains("btnqrclose")){
							target.classList.add("btnqrclose","visibleqr");
						}else{
							target.classList.remove("btnqrclose","visibleqr");
							target.firstElementChild.focus();
						}
					});
				}
			}
		});
		const notresult = document.querySelector(".not_result");
		if(notresult) notresult.remove();
		
		MediaBox('.mediabox');
		nextButtomtrigger();
	};
	
	function rotateCarousel(index) {
		if(intervalId) clearInterval(intervalId);
		if (totalcellCount === 0) return;
		const cell_center = carousel.querySelector('.box-center');
		sceneenglobe.style.setProperty('--rotate-sceneenglobe',`${tabrotate[countrotate]}deg`);
		sceneenglobe.style.setProperty('--scale','1');
		positionCarousel(index);
				
		if (countrotate >= tabrotate.length - 1) {
			countrotate = 0;
		}else{
			countrotate++;
		}
		if (pos[0] === 0){
			changerotate ? direction = 'normal' : direction = 'reverse'
			changerotate = !changerotate;
		}
		
		if (cell_center) {
			const blockqr = cell_center.querySelector('.blockqr');
			const ytlink = cell_center.querySelector('.ytlink');
			cell_center.classList.remove('box-center');
			ytlink.classList.remove('cell-center');
			ytlink.dataset.currenttime = '0';
			if (blockqr){ 
				if (blockqr.classList.contains("visibleqr")) blockqr.classList.remove("btnqrclose","visibleqr");
			}
			if (window.noMobile){
				cell_center.removeEventListener('mouseenter', createiframecell);
				cell_center.removeEventListener('mousemove', changebackposition);
				cell_center.removeEventListener('mouseleave', stopbackposition);
				clearIframeyt(cell_center);
			}
		}
		
		if (typeof rcells[index] !== "undefined") {
			rcells[index].classList.add('box-center');
			const ytlink = rcells[index].querySelector('.ytlink');
			ytlink.classList.add('cell-center');
			ytlink.dataset.currenttime = '0';
			bgimgoverlay.classList.remove('bgopacity');
			bgimgoverlay.style.backgroundImage = "url(" + ytlink.dataset.img + ")";
			if (window.noMobile){
				rcells[index].style.setProperty('--direction',direction);
				rcells[index].addEventListener('mouseenter', createiframecell);
				rcells[index].addEventListener('mousemove', changebackposition);
				rcells[index].addEventListener('mouseleave', stopbackposition);
			}
		}
			
		if (cellIndex < 2){
			uptotop.classList.remove('totop');
			uptotop.setAttribute('tabIndex','-1');
		} else {
			uptotop.classList.add('totop');
			uptotop.removeAttribute('tabIndex');
		}
			
		verif = true;
	};

	function positionCarousel(pos){
		carousel.style[transformProperty] = 'scale(var(--scale)) translateY(' + -(cellHeight * pos) + 'px)';
	};
			
	function createiframecell(e){
		if(playercell !== null) playercell.destroy();
		if (timeout) { clearTimeout(timeout); }
		const target = e == event ? e.currentTarget : e;
		target.classList.add('onhover')
		timeout = setTimeout(function () {
			
			droot.classList.add('hovercell');
			target.classList.remove('onhover')
			link = target.querySelector('a.ytlink');
			if (link && link.classList.contains("en_lecture")) return;
			iframeparent = link.querySelector('.cell');
			celliframe = iframeparent.querySelector('#cellplayer');
			if(celliframe) return;
			let source = link.getAttribute('href');
			if(!source){
				link.classList.add('player-error');
				return;
			}
			source += '?enablejsapi=1&amp;controls=0&amp;showinfo=0&amp;cc_load_policy=0&amp;iv_load_policy=3&amp;modestbranding=1&amp;rel=0&amp;autoplay=0&amp;loop=0&amp;disablekb=1&amp;autohide:0&amp;mute=1&amp;fa=0';
			const iframe = '<iframe id="cellplayer" src="' + source + '" allowfullscreen="1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title="YouTube video player"  frameborder="0" tabindex="-1"></iframe><div class="cellplayer_cache"></div></div><button type="button" class="btn-mute default-click not-hide" title="Activer le son" tabindex="-1"><i class="fa fa-volume-mute not-hide"></i></button><div class="timeline-container not-hide" role="slider" aria-label="Barre de lecture"><div class="timeline not-hide"><div class="current-time"></div><div class="thumb-indicator not-hide"></div></div>';
			iframeparent.insertAdjacentHTML('beforeend', iframe);
			
			
			celliframe = iframeparent.querySelector('#cellplayer');
			iframecache = iframeparent.querySelector('.cellplayer_cache');
			timelineContainer = iframeparent.querySelector('.timeline-container');
			currentTimeElem = iframeparent.querySelector('.current-time');
			btnmute = iframeparent.querySelector('.btn-mute');
			
			if (typeof(YT) === 'undefined' || typeof(YT.Player) === 'undefined') {	
				setTimeout( function() {
					if ( typeof window.onYouTubePlayerAPIReady !== 'undefined' ) {
						if ( typeof window.gambitOtherYTAPIReady === 'undefined' ) {
							window.gambitOtherYTAPIReady = [];
						}
						window.gambitOtherYTAPIReady.push( window.onYouTubePlayerAPIReady );
					}
					window.onYouTubePlayerAPIReady = function() {
						createplayer();
						if ( typeof window.gambitOtherYTAPIReady !== 'undefined' ) {
							if ( window.gambitOtherYTAPIReady.length ) {
								window.gambitOtherYTAPIReady.pop()();
							}
						}
					};
				}, 2);
			} else {
				createplayer();
			}

			if(btnmute) btnmute.addEventListener('click',function(e){
				e.preventDefault();
				e.stopPropagation();
				muteOrunmute(true);
			});
		}, 300);
		
		function onPlayerError (event) {
			iframecache.style.opacity = "0";
			link.classList.add('player-error');
		}
		 
		function onPlayerStateChange(event) {
			if (event.data === 1) {
				if(celliframe) {
					iframeparent.classList.add('player-play');
					link.classList.remove('player-error');
					link.classList.add('player-on');
					scene.classList.add('player-cell-on');
					mouseHideelement(e);
					if(window.mediaboxPlayer || window.globalmute){
						toggle = true;
					} else {
						toggle = !toggle;
					}
					muteOrunmute(false);
					const duration = event.target.getDuration();
					intervalId = setInterval(function() { 
						if(event.target.getPlayerState() === 1) {
							const currenttime = event.target.getCurrentTime();
							const diff = parseFloat((currenttime/duration));
							link.dataset.currenttime = currenttime;
							timelineContainer.style.setProperty("--progress-position", diff)
						}else{
							clearInterval(intervalId);
						}
					}, 250);
				}
			}else if(event.data === 0){
				clearInterval(intervalId);
				link.dataset.currenttime = '0';
				event.target.playVideo();
			}
		};
		
		function onPlayerReady(event) {
			
			if (parseFloat(link.dataset.currenttime) <= 0 || parseFloat(link.dataset.currenttime) >= (event.target.getDuration() - 5)){
				link.dataset.currenttime = 0;
			} else {
				link.dataset.currenttime -= 0.5;
			}
			
			event.target.setVolume(window.globalvolume);
			event.target.seekTo(link.dataset.currenttime);
			event.target.playVideo();
			iframeparent.classList.add('player-ready');
			
			timelineContainer.addEventListener("mousemove", handleTimelineUpdate);
			timelineContainer.addEventListener("mousedown", toggleScrubbing);
			document.addEventListener("mouseup", isScrubbingtoggleScrubbing);
			document.addEventListener("mousemove",isScrubbinghandleTimelineUpdate);
			triggerEvent(document,"mouseup");
		};
		
		function createplayer() {
			playercell = new YT.Player('cellplayer', {
				events: {
					'onReady': onPlayerReady,
					'onStateChange': onPlayerStateChange,
					'onError' : onPlayerError
				}
			})
		};
		
		function muteOrunmute(b) {
			let title;
			const icone = btnmute.querySelector('.fa');
			const notesboxcenter = document.getElementById("notes-box-center");
			if(toggle){
				playercell.mute();
				if(window.mediaboxPlayer && window.mediaboxPlayer.getPlayerState() === 2  && !window.isplayerpaused && b){
					window.mediaboxPlayer.playVideo();
				}
				title = 'Activer le son';
				icone.classList.replace('fa-volume-up','fa-volume-mute');
				if(!window.mediaboxPlayer && b) window.globalmute = true;
				removeNotes("box-center");
			}else{
				playercell.unMute();
				if (window.globalvolume === 0) window.globalvolume = 100;
				playercell.setVolume(window.globalvolume);
				if(window.mediaboxPlayer && window.mediaboxPlayer.getPlayerState() === 1  && !window.isplayerpaused && b){
					window.mediaboxPlayer.pauseVideo();
				}
				title = 'Désactiver le son';
				icone.classList.replace('fa-volume-mute','fa-volume-up');
				if(!window.mediaboxPlayer && b) window.globalmute = false;
				addNotes("box-center")
			}
			toggle = !toggle;
			updateTitle(btnmute,title)
		}
	};
	
	function changebackposition(e){
		const target = e.currentTarget;
		const cardglare = target.querySelector('.carousel-glare');
		mouseHideelement(e);
		if(cardglare){
			const pos = [e.clientX,e.clientY];
			const l = pos[0];
			const t = pos[1];
			const rect = cardglare.getBoundingClientRect();
			const w = rect.width / 2;
			const h = rect.height / 2;
			const x = l - rect.x;
			const y = t - rect.y;
			let gX = (1 - (x / (w * 2))) * 100;
			let gY = (1 - (y / (h * 2))) * 100;
			cardglare.style.backgroundPosition = gX + '% ' + gY + '%';
			cardglare.style.opacity =  '.4';
		}
		
	};
		
	function stopbackposition(e){
		droot.classList.remove('hovercell');
		if (timeout) {clearTimeout(timeout); }
		const target = e == event ? e.currentTarget : e;
		const cardglare = target.querySelector('.carousel-glare');
		
		if (cardglare) {
			cardglare.style.backgroundPosition = '50% 50%';
			cardglare.style.opacity =  '0';
		}
		clearIframeyt(target);
	};
	
	function clearIframeyt(el) {
		const target = el;
		let link,iframeparent;
		if(target.classList.contains('cell')){
			iframeparent = target;
			link = target.parentElement;
		}else{
			link = target.querySelector('.ytlink');;
			iframeparent = target.querySelector('.cell');
		}
		if (!iframeparent) return;
		const celliframe = iframeparent.querySelector('#cellplayer');
		const iframecache = iframeparent.querySelector('.cellplayer_cache');
		const timelineContainer = iframeparent.querySelector('.timeline-container');
		const btnmute = iframeparent.querySelector('.btn-mute');
		const yttitle = link.querySelector('.yttitle');
		if (celliframe) {
			if(intervalId) clearInterval(intervalId);
			iframeparent.removeChild(celliframe);
			iframeparent.removeChild(iframecache);
			iframeparent.removeChild(timelineContainer);
			iframeparent.removeChild(btnmute);
			scene.classList.remove('player-cell-on');
			link.classList.remove('player-on','player-error');
			iframeparent.classList.remove('player-ready','player-play');
			yttitle.style = "";
			document.removeEventListener("mouseup", isScrubbingtoggleScrubbing);
			document.removeEventListener("mousemove",isScrubbinghandleTimelineUpdate);
			const notesboxcenter = document.getElementById("notes-box-center");
			if(notesboxcenter) notesboxcenter.remove();
			if(window.mediaboxPlayer && window.mediaboxPlayer.getPlayerState() === 2  && !window.isplayerpaused){
				window.mediaboxPlayer.playVideo();
			}
			playercell = null;
		}
	}

	function mouseHideelement(e) {
		if(timercursor) clearTimeout(timercursor);
		if(!e) return;
		const targethover = e.target;
		if(link && link.classList.contains('player-on')){
			const btnqr = link.querySelector('.btn_qr');
			const yttitle = link.querySelector('.yttitle');
			link.classList.remove('autohide')
			btnqr.style.top = "2px";
			yttitle.style.top = "2px";
			btnmute.style.right = "2px";
			timelineContainer.style.bottom = "6px";
			timercursor = setTimeout(function(){
				if(link && link.classList.contains('player-on') && !targethover.classList.contains('not-hide')){
					link.classList.add('autohide')
					if(!btnqr.parentElement.classList.contains('visibleqr')) btnqr.style.top = "-50px";
					yttitle.style.top = "-25%";
					btnmute.style.right = "-50px";
					timelineContainer.style.bottom = "-12%";
				}
			},3000)
		}
	}
	
	function toggleScrubbing(e) {
		if(intervalId) clearInterval(intervalId);
		const rect = timelineContainer.getBoundingClientRect();
		const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
		isScrubbing = (e.buttons & 1) === 1;	
		const currenttime = percent * playercell.getDuration();
		if (isScrubbing) {
			link.classList.add("scrubbing");
			wasPaused = playercell.getPlayerState() === 2;
			playercell.pauseVideo();
		} else {
			setTimeout(function(){
				link.classList.remove("scrubbing");
			},5)
			if (!wasPaused) {
				playercell.seekTo(currenttime);
				playercell.playVideo();
			}
		}
		handleTimelineUpdate(e);
	};

	function handleTimelineUpdate(e) {
		const rect = timelineContainer.getBoundingClientRect();
		const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
		let nbr = 0;
		if (percent < 0.1) {
			nbr = 0.05;
		}else if (percent > 0.90) {
			nbr = - 0.05;
		}
		timelineContainer.style.setProperty("--preview-position", percent);
		const currenttime = percent * playercell.getDuration();
		currentTimeElem.textContent = formatDuration(currenttime);
		if (isScrubbing) {
			e.preventDefault();
			timelineContainer.style.setProperty("--progress-position", percent);
			link.dataset.currenttime = currenttime;
			playercell.seekTo(currenttime);
			playercell.playVideo();
		}
		timelineContainer.style.setProperty("--position-timeline", percent + nbr);
	};
	
	function isScrubbingtoggleScrubbing(e){
		if (isScrubbing) toggleScrubbing(e)
	};
		
	function isScrubbinghandleTimelineUpdate(e){
		e.preventDefault();
		e.stopPropagation();
		if (isScrubbing) handleTimelineUpdate(e)
	};

	function hide(el) {
		if (!el.classList.contains('hide-nav')) {
			setTimeout(function() {
				el.classList.add('hide-nav');
			}, 500);
		}
	};
	
	function checkIndex(pl,cn,id) {
		return arraycells.find(function(el) {
			return el.index === pl && el.nexttoken !== cn && el.id > parseInt(id);
		});
	};

	function controle() {

		const a11y = document.querySelectorAll(".a11y-nav a");
		const opennavclavier = document.querySelector('.open-nav-clavier');
		const wrapperraccourcie = document.querySelector('.wrapper-raccourcie');
		const raccourcieesc = document.getElementById('raccourcie-esc');
		const overlayplaylist = document.querySelector('.playlist-overlay');
		const titleplaylistleft = document.querySelector('.title-left');
		const titleplaylistright = document.querySelector('.title-right');
		const parent = getClosest(titleplaylistleft, '#contain-pl');
		const endfocus = document.getElementById('endfocus');
		const opensearchbox = document.getElementById('opensearchbox');
		const searchlist = searchbox.querySelector('#searchlist');
		const clearsearch = searchbox.querySelector('#clearsearch');
		searchlist.value = "";
		let verifpopup = false;
		let numitem = -1;
		let focuced;
		let startX = 0;
		let startY = 0;
		const distance = 50;
		let thread,timermouse;
		let touchetabclick= false;
		let activesearch = false;
		let w = 0,h = 0,oldnbr = 0;
		let newminilecteurindex = -1;
		let keys={};
		
		if (window.noMobile){
		
			function changeStyle(el,num,num1){
					el[0].style[transformProperty] = 'translateY(' + num + 'px) rotateY(' + num1 +'deg)';
					if(el[1]) el[1].style.backgroundPosition = (50 + num) + '% 50%';
			};
			
			function animateRotateCell(){
				const flashlight  = document.querySelector('.cell-center .flashlight');
				
				if ((droot.classList.contains('stop-scroll') && !window.isMinimised) || droot.classList.contains('hovercell')){
					
					changeStyle([scenerotate3d,flashlight],0,0);
					return;
				}
				let nbr = 0;
				do {
					nbr = random([0,30]);
				} while ( nbr === oldnbr);
				if (oldnbr >= 0){
					nbr = -nbr;
				}
				let nbr1= nbr/3 ;
				changeStyle([scenerotate3d,flashlight],nbr,nbr1);
				oldnbr = nbr;
			};
			animateRotateCell();
			setInterval(animateRotateCell, 2000);
			
			function animatemouse(){
				if (pos[0] === 0) return;
				const boxcenter = document.querySelector('.box-center');
				if(boxcenter){
					const posX = ((pos[0] - w) / w);
					direction = posX > 0 ? 'normal' : 'reverse';
					boxcenter.style.setProperty('--direction',direction);
				}
			};
			
			function onmousestop(){
				scene.classList.remove('mousemove');
				animatemouse();
				thread = setInterval(animatemouse, 2000);
			};
			setTimeout(onmousestop,1200);
			
			scene.addEventListener('mousemove',function() {
				if(thread) clearInterval(thread);
				if(timermouse) clearTimeout(timermouse);
				scene.classList.add('mousemove');
				w = window.innerWidth / 2;
				pos = [event.pageX,event.pageY]
				const boxcenter = document.querySelector('.box-center');
				if(boxcenter){
					const rect = boxcenter.getBoundingClientRect();
					const x = pos[0] - (rect.left + boxcenter.clientWidth / 2);
					const y = pos[1] - (rect.top + boxcenter.clientHeight / 2);
					const radian = Math.atan2(y,x);
					const degree = radian * (180 / Math.PI);
					boxcenter.style.setProperty('--rotate',`${degree}deg`);
				}
				timermouse = setTimeout(onmousestop, 500);
			});
			
			scene.addEventListener('mouseleave',function() {
				pos = [0,0];
			});
			
		}
		
		function waitcellcharging(el){
			if(!document.activeElement.classList.contains('nav-link')) return;
			if (window.mediaboxopen && !window.isMinimised) {
				document.getElementById('mediabox-esc').focus();
			}else{
				const cc = document.querySelector('.cell-center');
				if(cc){
					cc.focus({preventScroll:true});
				}else{
					setTimeout(function() {
						waitcellcharging(el);
					}, 200);
				}
			}
		};
		
		function waitplaylistscharging(el){
			if(!document.activeElement.classList.contains('nav-link')) return;
			if(titleplaylistleft){
				if(!parent.classList.contains("pl-active")) {
					toogleMenuplaylist(event,true);
				}
				titleplaylistleft.focus();
			}else{
				setTimeout(function() {
					waitplaylistscharging(el);
				}, 200);
			}
		};
		
		for(const el of a11y) {
			el.addEventListener('click', function(e) {
				const target = e.currentTarget;
				target.classList.add('activelink');
				if(target.classList.contains('v-last')){
					waitcellcharging(target);
				}else if(target.classList.contains('m-playlist')){
					waitplaylistscharging(target);
				}else if(target.classList.contains('r-clavier')){
						toggleRaccourciClavier();
				}
				target.classList.remove('activelink');
			});
		};
		
		function searchCells() {
			init();
			const searchlistvalue = searchlist.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/\s+/)  // coupe par espace.filter(w => w.length > 0); 
			for (let i = 0; i < cells.length; i++) {
			  const title = cells[i].querySelector(".yttitle span");
			  if (!title) continue;
			  const txtValue = title.textContent || title.innerText;
			  const normText = txtValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
			  const foundWords = searchlistvalue.filter(word => normText.includes(word));
			  if (foundWords.length > 0) {
				cells[i].style.display = "";
				scells.push(cells[i]);
			  } else {
				cells[i].style.display = "none";
			  }
			}
			if(searchlistvalue == ""){
				cellIndex = window.oldcellcellIndex;
				clearsearch.classList.remove("visibleclearsearch");
				activesearch = false;
				newminilecteurindex = -1;
			}else{
				clearsearch.classList.add("visibleclearsearch");
				activesearch = true;
			}
			totalcellCount = scells.length;
			changeCarousel();
			//if(!document.querySelector(".end_cells")) setTimeout(searchCells,1000);
		}
	
		searchlist.addEventListener("input",debounce(function(e){
			e.preventDefault();
			const codekey = e.keyCode || e.which;
			if (codekey === 13) return;
			e.stopPropagation();
			searchCells()
		},500,false))
	
		clearsearch.addEventListener("click",function(e){
			e.preventDefault();
			searchlist.value = "";
			searchlist.focus();
			searchCells();
		})
		
		opensearchbox.addEventListener("click",function(e){
			e.preventDefault();
			const searchbox = document.getElementById('searchbox');
			const searchmsg= document.getElementById('search_message');
			let title;
			if(searchbox.classList.contains('open')){
				this.firstElementChild.classList.replace('fa-times','fa-search');
				searchbox.classList.remove('open');
				searchlist.blur();
				if(searchlist.value !== ""){
					searchmsg.innerText = "Resultat : ";
					searchmsg.style.display = "block";
				}else{
					searchmsg.innerText = "";
					searchmsg.style.display = "none";
				}
				title = 'Ouvrir la recherche';
			}else{
				this.firstElementChild.classList.replace('fa-search','fa-times');
				searchbox.classList.add('open');
				searchlist.focus();
				searchmsg.innerText = "";
				searchmsg.style.display = "none";
				title = 'Fermer la recherche';
			}
			updateTitle(this,title)
		})
		
		for(const el of plitems) {
			el.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				const target = e.currentTarget;
				removecells();
				init();
				searchlist.value = "";
				clearsearch.classList.remove("visibleclearsearch");
				let n =0;
				if (window.mediaboxopen && !window.isMinimised) {
					triggerEvent(document.querySelector('.mediabox-wrap .mini-lecteur'), 'click');
					n = 500;
				} else {
					n = 0;
				}
				setTimeout(function() {
					const matches = target.getAttribute('href').match(/^.*(youtu.be\/|v\/|u\/\w\/|playlist\?list=)([^#\&\?]*).*/);
					playid = matches[2];
					document.querySelector('.list-scroll li.active').classList.remove("active");
					target.parentElement.classList.add("active");
					const checkcookie = checkCookie(playid);
					let video;
					if (checkcookie.length !== 0) {
						video = checkcookie;
					} 
					if (typeof video === "undefined") video = '';
					setCookie("lastposition",playid + ',' + video);
					const found = arraycells.find(function(target) {
						return target.index === playid;
					});
					if (typeof found === "undefined") {
						loadVids(playid,null,video);
					} else {
						setTimeout(function() {
							addCells(found.cells, found.index, found.nexttoken, found.id,video);
						}, 200);
					}
				}, n);
			});
		};
		
		window.addEventListener('blur', function(e) {
			focuced = document.activeElement;
			if(focuced.classList.contains("ytlink")) focuced.blur();
		});
		
		window.addEventListener('focus', function(e) {
			const mediaboxwrap = document.querySelector('.mediabox-wrap');
			if (mediaboxwrap) {
				mediaboxwrap.focus();
			}
		});

		(function start() {
			let timer = null;
			if (timer) clearInterval(timer);
			timer = setInterval(function() {
				if (verif) {
					verif = false;
				} else {
					bgimgoverlay.classList.add('bgopacity');
					if (bouton.classList.contains('hide-nav')) bouton.classList.remove('hide-nav');
				}
			}, 300);
		})();
		
		uptotop.addEventListener('click', function(e){
			hide(scrollorswipe);
			cellIndex = 0;
			rotateCarousel(cellIndex);
			uptotop.blur();
		});
		
		opennavclavier.addEventListener('click', toggleRaccourciClavier);
		raccourcieesc.addEventListener('click', function(e){
			e.preventDefault();
			const target = e.currentTarget;
			toggleRaccourciClavier();
			setTimeout(function() {
				target.blur();
				if (window.mediaboxopen) {
					const mediaboxclose = document.getElementById('mediabox-esc');
					if (mediaboxclose) mediaboxclose.focus();
				}
			}, 100);
		});
		
		function toggleRaccourciClavier() {
			let title;
			if(!wrapperraccourcie.classList.contains("visibleraccourcie")){
				wrapperraccourcie.classList.add("visibleraccourcie");
				title = 'Fermer raccourcis clavier (c)';
			}else{
				wrapperraccourcie.classList.remove("visibleraccourcie");
				title = 'Ouvrir raccourcis clavier (c)';
			}
			raccourcieesc.focus({preventScroll:true});
			updateTitle(opennavclavier,title)
		};
		
		function addlistnerButtom(el,func,str) {
			el.addEventListener('mousedown', function() {
					isclicked = true;
					if(!verifpopup) func();
					timerclick = setInterval(function(){
						if(isclicked){
							if(!verifpopup) func();
						}
					},250);
				
			});
			el.addEventListener('mouseup', function() {
				isclicked = false;
				if (timerclick) clearInterval(timerclick);
				if (window.mediaboxopen || window.isMinimised) {
					if(!verifpopup){
						verifpopup = true;
						toogleNextPreviousVideo(str);
					}
				}
			});
			el.addEventListener('mouseleave', function(e) {
				isclicked = false;
				if (timerclick) clearInterval(timerclick);
			});
		};
		
		addlistnerButtom(nextButton,next,'next');
		addlistnerButtom(prevButton,previous,'previous');
		
		function raccourciecheckbox(str) {
			let valuecookie = checkCookie('valuecheckbox');
			if (valuecookie.length === 0) valuecookie = '000';
			let valuecb0 = valuecookie[0];
			let valuecb1 = valuecookie[1];
			let valuecb2 = valuecookie[2];
			let valuenotif,text;
			
			if (str === 'video') {
				text = 'Répéter la video: ';
				if (valuecb0 === '0') {
					valuecb0 = '1';
					valuecb1 = '0';
					valuecb2 = '0';
					valuenotif = '1';
				} else {
					valuecb0 = '0';
					valuecb1 = '0';
					valuecb2 = '0';
					valuenotif = '0';
				}
			} else if (str === 'playlist') {
				text = 'Playlist automatique: ';
				if (valuecb1 === '0') {
					valuecb0 = '0';
					valuecb1 = '1';
					valuenotif = '1';
				} else {
					valuecb0 = '0';
					valuecb1 = '0';
					valuecb2 = '0';
					valuenotif = '0';
				}
			} else if (str === 'shuffle') {
				text = 'Lecture aléatoire: ';
				if (valuecb2 === '0') {
					valuecb0 = '0';
					valuecb1 = '1';
					valuecb2 = '1';
					valuenotif = '1';
				} else {
					valuecb0 = '0';
					valuecb2 = '0';
					valuenotif = '0';
				}
			}

			valuecookie = valuecb0 + valuecb1 + valuecb2;
			setCookie("valuecheckbox", valuecookie);
			Notification(text, valuenotif);
		};

		document.addEventListener('keydown', function(e) {
			const codekey = e.keyCode || e.which;
			keys[codekey] = e.type === 'keydown';
			focuced = document.activeElement;			
			if (!window.mediaboxopen || window.isMinimised) {
				if (codekey === 9) {
					if (verifpopup || touchetabclick) {
						e.preventDefault();
					}
					touchetabclick = true;
				}
				if (!parent.classList.contains('pl-active')) {
					if (!keys[17] && codekey === 38 || codekey === 33) {
						e.preventDefault();
						if(focuced.classList.contains('searchlistbox')) focuced.blur();
						if (!verifpopup){
							previous();
						}
					} else if (!keys[17] && codekey === 40 || codekey === 34) {
						e.preventDefault();
						if(focuced.classList.contains('searchlistbox')) focuced.blur();
						if (!verifpopup){
							next();
						}
					}
				}
				if (codekey === 36) {
					if (!verifpopup){
						if(focuced.classList.contains('searchlistbox')) focuced.blur();
						triggerEvent(uptotop, 'click');
					}
				}else if (codekey === 35){
					if (!verifpopup){
						if(focuced.classList.contains('searchlistbox')) focuced.blur();
						hide(scrollorswipe);
						cellIndex = totalcellCount - 1;
						rotateCarousel(cellIndex);
					}
					
				}
			}
			if (parent.classList.contains('pl-active') &&  !focuced.classList.contains('searchlistbox')) {
				if (codekey === 38) {
					e.preventDefault();
					if (numitem === -1) numitem = 0;
					numitem--;
					if (numitem < 0 || !focuced.classList.contains('plitem')) numitem = plitems.length - 1;
				} else if (codekey === 40) {
					e.preventDefault();
					numitem++;
					if (numitem > plitems.length - 1) numitem = 0;
				}
				if(plitems[numitem]) plitems[numitem].focus();
			}
			if (codekey === 27) {
				if (wrapperraccourcie.classList.contains('visibleraccourcie')) {
					wrapperraccourcie.classList.remove('visibleraccourcie');
				}else if(document.querySelector('.popup')) {
					removepopup();
				}else if(parent.classList.contains('pl-active')) {
					toogleMenuplaylist(event,true);
				}else if(window.mediaboxopen) {
					triggerEvent(document.querySelector('.mediabox-close'), 'click');
				}
			}
		});

		document.addEventListener('keyup', function(e) {
			e.preventDefault();
			const codekey = e.keyCode || e.which;
			if(codekey === 17) keys = {};
			if (!window.mediaboxopen || window.isMinimised) {
				if (codekey === 9) {
					touchetabclick = false;
				}
				if (codekey === 13) {
					if (!focuced.classList.contains('default-click') && !focuced.classList.contains('cell-center')) {
						triggerEvent(document.querySelector('.cell-center'), 'click');
					}
				} 
				if(focuced.classList.contains('searchlistbox')) return;
				if (!window.isMinimised){
					if (codekey === 76) {
						raccourciecheckbox('shuffle');
					} else if (codekey === 80) {
						raccourciecheckbox('playlist');
					} else if (codekey === 82) {
						raccourciecheckbox('video');
					}
				}
				if (!parent.classList.contains('pl-active') && !focuced.classList.contains('wrapper-info')) {
					if (keys[17] && codekey === 38) {
						const previousbtnvideo = document.querySelector('.video-container .previous-btn')
						if(previousbtnvideo) triggerEvent(previousbtnvideo, 'click');
					} else if (keys[17] && codekey === 40) {
						const nextbtnvideo = document.querySelector('.video-container .next-btn')
						if(nextbtnvideo) triggerEvent(nextbtnvideo, 'click');
					}
				}
			} else {
				if (!parent.classList.contains('pl-active') && !focuced.classList.contains('wrapper-info')) {
					if (codekey === 38) {
						if (!verifpopup) {
							verifpopup = true;
							toogleNextPreviousVideo('previous');
						}
					} else if (codekey === 40) {
						if (!verifpopup) {
							verifpopup = true;
							toogleNextPreviousVideo('next');
						}
					}
				}
			}
			if(focuced.classList.contains('searchlistbox')) return;
			if (codekey === 77) {
				toogleMenuplaylist(event,true);
			} else if (codekey === 67){
				toggleRaccourciClavier();
			} 
		});

		function wheel(e) {
			const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
			if (delta) {
				if (delta < 0) {
					if(!verifpopup) next();
				} else {
					if(!verifpopup) previous();
				}
			}
		};

		if (window.addEventListener) {
			scene.addEventListener(wheelEvt(), wheel, false);
		} else {
			scene.attachEvent('onmousewheel', wheel);
		}
		
		document.addEventListener("touchstart", function(e) {
			if (e.touches.length !== 1) return;
			const touches = e.changedTouches[0];
			startX = touches.pageX;
			startY = touches.pageY;
		}, false);
		document.addEventListener("touchmove", function(e) {
			e.preventDefault();
			e.stopPropagation();
		}, false);
		document.addEventListener("touchend", function(e) {
			if (e.target && getClosest(e.target, '.playlist') || getClosest(e.target, '.mediabox-content')) return;
			const touches = e.changedTouches[0];
			const betweenX = touches.pageX - startX;
			const betweenY = touches.pageY - startY;
			if (betweenX === 0 || betweenY === 0) return;
			let orientation,orientationX,orientationY;
			if (betweenX > 0) {
				orientationX = "rtl";
			} else {
				orientationX = "ltr";
			}
			if (betweenY > 0) {
				orientationY = "dwn";
			} else {
				orientationY = "top";
			}
			if (Math.abs(betweenY) >= distance && Math.abs(betweenX) <= distance) {
				orientation = orientationY;
			} else if (Math.abs(betweenX) >= distance && Math.abs(betweenY) <= distance) {
				orientation = orientationX;
			}
			if (orientation === "ltr" || orientation === "top") {
				if (!window.mediaboxopen || window.isMinimised) {
					if(!verifpopup) next();
				} else {
					if(!verifpopup){
						verifpopup = true;
						toogleNextPreviousVideo('next');
					}
				}
			} else if (orientation === "rtl" || orientation ==="dwn") {
				if (!window.mediaboxopen || window.isMinimised){
					if(!verifpopup) previous();
				} else {
					if(!verifpopup){
						verifpopup = true;
						toogleNextPreviousVideo('previous');
					}
				}
			}
		}, false);
		

		function verifShuffle() {
			const valuecookie = checkCookie('valuecheckbox');
			return valuecookie[2] === '1';
		};
		
		function toogleNextPreviousVideo(str) {
			const mediaclose = document.querySelector('.mediabox-close');
			if (oldplayid !== playid){
				oldplayid = playid;
				verifpopup = false;
				triggerEvent(mediaclose, 'click');
				return;
			} 
			let n;
			shuffle = verifShuffle();
			if (shuffle) {
				if (!videovue.includes(cellIndex) && totalcellCount > 1) {
					videovue.push(cellIndex)
				} 
							
				if(videovue.length === totalcellCount){
					videovue.splice(0, videovue.length - 1);
					ctp = 0;
				}
				//nextButtomtrigger();
			}
			if (fsChange() || window.isMinimised) {
				n = 0;
			} else {
				triggerEvent(mediaclose, 'click');
				n = 1000;
			}
			setTimeout(function() {
				if (oldplayid !== playid){
					oldplayid = playid;
					verifpopup = false;
					triggerEvent(mediaclose, 'click');
					return;
				}

				window.isMinimised ? minilecteurindex = vIndex() : cellIndex = vIndex();
				
				if (str === 'next') {
					window.isMinimised ? nextVideo(shuffle) : next(shuffle,function(){
							if(typeof event === "undefined" && cellIndex === totalcellCount - 1){
								triggerEvent(uptotop, 'click');
							}
						});
				} else {
					window.isMinimised ? previousVideo(shuffle) : previous(shuffle);
				}
				
				function vIndex(){
					return activesearch ? newminilecteurindex : window.oldcellcellIndex;
				}
				
				setTimeout(function() {
					if (oldplayid !== playid){
						oldplayid = playid;
						verifpopup = false;
						triggerEvent(mediaclose, 'click');
						return;
					}
					if (fsChange() || window.isMinimised){
						verifpopup = false;
						return;
					}
					triggerEvent(document.querySelector('.cell-center'), 'click');
					verifpopup = false;
				}, n + 300);
			}, n);
		};

		function changeposition() {
			let cellNew = 0;
			if (ctp >= videovue.length || ctp < 0) {
				do {
					cellNew = random([0, totalcellCount]);
				} while (videovue.includes(cellNew));
				if (ctp < 0) {
					ctp = videovue.length;
				} else if (ctp > videovue.length) {
					ctp = 0;
				}
			} else {
				cellNew = videovue[ctp];
			}
			return cellNew;
		};

		function next(shuf,callback) {
			let nbr = 0;
			if(carousel.querySelector('.end_cells') || totalcellCount < 3) nbr = -1; 
			if (cellIndex < (totalcellCount + nbr) || shuf) {
				cellIndex++;
				if(activesearch) newminilecteurindex++;
				toogleNextPrevious(shuf,cellIndex,1);
			}else{
				if(activesearch) newminilecteurindex = -1;
				if (callback) callback();
			}
		};

		function previous(shuf) {
			if (cellIndex > 0 || shuf) {
				cellIndex--;
				if(activesearch) newminilecteurindex--;
				toogleNextPrevious(shuf,cellIndex,-1); 
			}
		};
		
		function toogleNextPrevious(s,ci,c) {
			cellIndex = initNextPrevious(s,ci,c);
			rotateCarousel(cellIndex);
			if(!isclicked  && typeof s == 'undefined'){
				hide(bouton);
			} 
		};

		function nextVideo(shuf) {
			let nbr = 0;;
			if(carousel.querySelector('.end_cells') || totalcellCount < 3) nbr = -1; 
			if (minilecteurindex < (totalcellCount + nbr) || shuf) {
				minilecteurindex++;
				if(activesearch) newminilecteurindex++;
			}else{
				minilecteurindex = 0;
				if(activesearch) newminilecteurindex = -1;
			}
						
			NextPreviousVideo(shuf,minilecteurindex,1);
		};

		function previousVideo(shuf) {
			if (minilecteurindex > 0 || shuf) {
				minilecteurindex--;	
				if(activesearch) newminilecteurindex--;
				NextPreviousVideo(shuf,minilecteurindex,-1); 
			}
		};

		function NextPreviousVideo(s,ci,c) {
			minilecteurindex = initNextPrevious(s,ci,c);
			const activemini = carousel.querySelector('.mini');
			if (activemini) {
				const ytlink = activemini.querySelector('.ytlink');
				activemini.classList.remove('mini');
				ytlink.classList.remove('active_mini');
				ytlink.dataset.currenttime = '0';
			}
			if (typeof rcells[minilecteurindex] !== "undefined") {
				rcells[minilecteurindex].classList.add('mini');
				const ytlink = rcells[minilecteurindex].querySelector('.ytlink');
				ytlink.classList.add('active_mini');
				ytlink.dataset.currenttime = '0';
			}
		};
		
		function initNextPrevious(shuf,numindex,num){
			focuced = document.activeElement;
			hide(scrollorswipe);
			droot.classList.remove('hovercell');
			if (focuced.classList.contains("default-click")) {
				focuced.blur();
			}
			let nindex;
			if (!shuf) {
				nindex = numindex;
			} else {
				ctp = ctp + num;
				nindex = changeposition();
			}
			return nindex;
		}

		titleplaylistleft.addEventListener('click', toogleMenuplaylist);
		titleplaylistright.addEventListener('click', toogleMenuplaylist);

		function toogleMenuplaylist(e,b) {
			e.preventDefault();
			e.stopPropagation();
			let title;
			if(typeof b === "undefined") b=false;
			numitem = -1;
			if(!parent.classList.contains("pl-active")){
				parent.classList.add("pl-active");
				titleplaylistleft.focus();
				title = 'Fermer liste playlists (m)';
			}else{
				parent.classList.remove("pl-active");
				title = 'Ouvrir liste playlists (m)'
				if(b){
					let mediaboxclose = document.querySelector('.mediabox-close');
					if(mediaboxclose){
						mediaboxclose.focus();
					}else{
						document.activeElement.blur();
					}
				}
			}
			updateTitle(titleplaylistleft,title)
		};

		parent.addEventListener('click', function(e) {
			e.preventDefault();
			if (e.target.nodeName === "LI") return;
			e.currentTarget.classList.remove("pl-active");
			updateTitle(titleplaylistleft,'Ouvrir liste playlists (m)')
		});
	};
	
	function lastConnected(){
		let checkdayconnected = checkCookie('dayconnected');
		const day = Date.now();
		if (checkdayconnected.length !== 0) {
			checkdayconnected = parseInt(checkdayconnected)
			//const minute =  checkdayconnected + 600000; 
			const hour = checkdayconnected + 3600000;
			const week = checkdayconnected + 604800000;
			if(day > week){
				scrollorswipe.style.display = 'block';
				setCookie("dayconnected",day);
			}else if(day > hour){
				scrollorswipe.style.display = 'none';
			}
		} else {
			setCookie("dayconnected",day);
		}
	};
	
	(function playList() {
		const carouselwrapper = document.getElementById('carousel-wrapper');
		const dataplaylist = addPlaylist();
		let htmlpl = '';
		let video;
		if (dataplaylist.length > 1) {
			for (let i = 0; i < dataplaylist.length; i++) {
				const title = dataplaylist[i].name;
				const plelement =
					'<li><a href="https://www.youtube.com/playlist?list=' + dataplaylist[i].idplaylist + '" class="plitem default-click" target="_blank" rel="noopener" rel="noreferrer" title="' + title +'">' + title + '</a></li>';
				htmlpl = htmlpl + plelement;
			}
			htmlpl = '<div id="contain-pl"><div class="playlist-overlay"></div><div role="button" class="title-playlist title-right default-click" aria-label="Liste playlists" title="Ouvrir liste playlists (m)"><div class="icon-playlist"><svg width="24px" height="24px" viewBox="0 0 24 24" focusable="false" data-prefix="fab" aria-hidden="true" role="img" class="svg-inline--fa"><path fill="currentcolor" d="M20,7H4V6h16V7z M22,9v12H2V9H22z M15,15l-5-3v6L15,15z M17,3H7v1h10V3z"></path></svg></div></div><div class="playlist" ><button class="btn title-playlist title-left default-click" title="Ouvrir liste playlists (m)">Liste playlists<div class="icon-playlist"><svg viewBox="0 0 24 24" focusable="false" data-prefix="fab" aria-hidden="true" role="img" class="svg-inline--fa"><path fill="currentcolor" d="M20,7H4V6h16V7z M22,9v12H2V9H22z M15,15l-5-3v6L15,15z M17,3H7v1h10V3z"></path></svg></div></button><div class="list-scroll"><ul>' + htmlpl + '</ul></div></div></div>';
			carouselwrapper.insertAdjacentHTML('afterbegin', htmlpl);
		}
		plitems = document.querySelectorAll('.plitem');
		function selectplayList(item,id) {
			item.parentElement.classList.add("active");
			playid = id;
		}
		let checkcookie = checkCookie('lastposition');
		if (checkcookie.length === 0) {
			selectplayList(plitems[0],dataplaylist[0].idplaylist)
		} else {
			let valmatch;
			checkcookie = checkcookie.split(',');
			playid = checkcookie[0];
			video = checkcookie[1];
			for(const el of plitems) {
				const matches = el.getAttribute('href').match(/^.*(youtu.be\/|v\/|u\/\w\/|playlist\?list=)([^#\&\?]*).*/);
				if (playid === matches[2]) {
					valmatch = el;
					break;
				}
			};
			if (valmatch) {
				valmatch.parentElement.classList.add("active");
			}else{
				selectplayList(plitems[0],dataplaylist[0].idplaylist)
			}
		}
		
		oldplayid = playid;
		
		lastConnected();
		
		loadVids(playid,null,video);
		controle();
	})();
};

const prefix = "issamennajihv4";
function setCookie(name, value) {
	if (window.Storage){
		localStorage.setItem(prefix + name,value);
	}
};

function getCookie(name) {
	if (window.Storage){
		return localStorage.getItem(prefix + name);
	}
};

function checkCookie(value) {
	const valuecookie = getCookie(value);
	return valuecookie ? valuecookie : "";
};

function updateTitle(el,title){
	el.title = title;
}

function removeNotification() {
	const notif = document.querySelector('.notification');
	if (notif) {
		setTimeout(function(){notif.remove();},1000);
	}
};

function Notification(text, val,bool) {
	let val1 = '';
	let style = 'invisiblenotif';
	let notif = document.querySelector('.notification');
	
	if (val === '0') {
		val = 'désactivée';
		val1 = 'red';
	} else if (val === '1') {
		val = 'activée';
		val1 = 'green';
	}
	
	if (notif) notif.remove();
	if(bool) style = 'visiblenotif';

	const creatNotification = '<div class="notification '+ style +'"><div class="notif-text notif-text1">' + text + '</div><div class="notif-text notif-text2 ' + val1 + '">' + ' ' + val + '</div></div>';
	if(window.isMinimised){
		document.querySelector('.mediabox-wrap').insertAdjacentHTML('beforeend', creatNotification);
	}else{
		document.body.insertAdjacentHTML('beforeend', creatNotification);
	}
	if(!bool) removeNotification();
};

function getClosest(elem, selector) {
	if (!Element.prototype.matches) {
		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function(s) {
				const matches = (this.document || this.ownerDocument).querySelectorAll(s),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
	}
	
	for (; elem && elem !== document; elem = elem.parentNode) {
		if (elem.matches(selector)) return elem;
	}
	return null;
};

function isEmpty(obj) {
	for (const x in obj) {
		if (obj.hasOwnProperty(x)) return false;
	}
	return true;
};

const propertiestransform = ["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"];
const propertiesborderRadius = ["borderRadius", "MozBorderRadius", "webkitBorderRadius"];
function getSupportedPropertyName(properties) {
	for (let i = 0; i < properties.length; i++) {
		if (typeof document.body.style[properties[i]] != "undefined") return properties[i];
	}
	return null;
};
const transformProperty = getSupportedPropertyName(propertiestransform);
const borderRadiusProperty = getSupportedPropertyName(propertiesborderRadius);

function whichAnimationEvent(){
	const el = document.createElement("fakeelement");

	const animations = {
		"animation"      : "animationend",
		"OAnimation"     : "oAnimationEnd",
		"MozAnimation"   : "mozAnimationEnd",
		"WebkitAnimation": "webkitAnimationEnd",
		"MSAnimation"	 : "MSAnimationEnd"
	}

	for (const t in animations){
		if (el.style[t] !== undefined){
		return animations[t];
		}
	} 
};
const animationEvent = whichAnimationEvent();

function triggerEvent(el, type) {
	if (!el) return;
	if ('createEvent' in document) {
		const e = document.createEvent('HTMLEvents');
		e.initEvent(type, false, true);
		el.dispatchEvent(e);
	} else {
		const e = document.createEventObject();
		e.eventType = type;
		el.fireEvent('on' + e.eventType, e);
	}
};

function debounce(func, wait, immediate) {
	let timeout;
	return function() {
		const context = this;
		const args = arguments;
		const later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function random(range) {
	const max = Math.max(range[0], range[1]);
	const min = Math.min(range[0], range[1]);
	const diff = max - min;
	const number = Math.floor(Math.random() * diff + min);
	return number;
};

function fsChange() {
	return document.fullscreenElement || document.webkitFullscreenElementt || document.webkitCurrentFullScreenElement || document.mozFullscreenElement || document.msFullscreenElement;
};

function wheelEvt() {
	return "onwheel" in document.createElement("div") ? "wheel" : document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll"; 
};

function removechildelement(parent){
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
	minimumIntegerDigits: 2,
})
function formatDuration(time) {
	const seconds = Math.floor(time % 60);
	const minutes = Math.floor(time / 60) % 60;
	const hours = Math.floor(time / 3600);
	if (hours === 0) {
		return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
	} else {
		return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`;
	}
}

(function() {
	const tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	const firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);		
})();

function createNotes(name){
	const notes = '<div class="notes-container" id="notes-'+ name +'"><div class="notes notes-left"><div class="note noteleft1"></div><div class="note noteleft2"></div><div class="note noteleft3"></div><div class="note noteleft4"></div></div><div class="notes notes-right"><div class="note noteright1"></div><div class="note noteright2"></div><div class="note noteright3"></div><div class="note noteright4"></div></div></div>';
	const el = document.getElementsByClassName(name);
	if(typeof el[0] !== "undefined") el[0].insertAdjacentHTML("afterbegin", notes);
};

function addNotes(str){
	if(window.noMobile){
		if(str === "mediabox-content" && (window.globalvolume == 0 || window.globalmute)) return;
		const notesmediabox = document.getElementById("notes-"+ str);
		if(notesmediabox){
			notesmediabox.classList.remove("mute");
		}else{
			setTimeout(function(){
				createNotes(str);
			},200)
		}
	}
};

function removeNotes(str){
	if(window.noMobile){
		setTimeout(function(){
			const notesmediabox = document.getElementById("notes-" + str);
			if(notesmediabox) notesmediabox.classList.add("mute");
		},500);
	}
};

const isiOS = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)/i) != null;