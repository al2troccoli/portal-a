// Main slider home page
(function() {

    $(document).ready(function() {
		
        // Funcionalidad para expandir y contraer el panel de lectura
		$('.main-posts-1 .container-principal a.down').on('click', function(){
			if ($('.main-posts-1 .container-principal').hasClass('expand')){
				$('.main-posts-1 .container-principal').removeClass('expand');
				$('.main-posts-1 .container-principal a.down i').removeClass('fa-angle-up');
				$('.main-posts-1 .container-principal a.down i').addClass('fa-angle-down');
				$('.container-hidden').fadeOut();
				$('.container-principal .title-10 a').css({'display':'block'});
				$('.container-principal .title-10 span.cut1').css({'display':'none'});
			}else{
				$('.main-posts-1 .container-principal').addClass('expand');
				$('.main-posts-1 .container-principal a.down i').removeClass('fa-angle-down');
				$('.main-posts-1 .container-principal a.down i').addClass('fa-angle-up');
				$('.container-hidden').fadeIn();
				$('.container-principal .title-10 a').css({'display':'none'});
				$('.container-principal .title-10 span.cut1').css({'display':'block'});
			}
		})        
		
        // Resize para el video
		$(window).resize(function() {
			$('.video-js, video').css({'height': ' '});
			$('.video-js, video').css({'height': $('.container-main-post-1 .swiper-slide').innerHeight()});
		});
		
		$('.video-js, video').css({'height': $('.container-main-post-1 .swiper-container').innerHeight()});


        // FUNCIONALIDAD DEL SLIDER --------------------------------------------------------------------------

        var previousRealIndex;                               // Indice del slide anterior al actual
        var totalSlides;  
        var canClick = false;                                // Para controlar el evento click sobre los thumbs

        // THUMBS
        var currentHiddenThumb;                              // Es el current thumb que permanece escondido
        var thumbsCollection;                                // Colección de los thumbs visibles
        var thumbsContainer = $(".container-articles");      // Referencia al elemento html del DOM que contiene los thumbs
       
        // SLIDES INFO 
        var currentSlideInfo;                                // Información del slide actual (titulo, fecha, extracto de la noticia... etc)
        var slideInfoContainer = $(".slide-info-container"); // Referencia al elemento html del DOM que contiene los thumbs

        // VIDEOS
        var playersCollection= new Array();
        var currentVideo = null;                              // video asociado al slide actual, null si el slide no tiene video

        //Click handler para los thumbs
        $('.slide-thumb').on('click', function(e){
            if(canClick){
                
                e.preventDefault();

                var _thumbIndex = $(this).attr("data-slide-index");
                //console.log(_thumbIndex + " indice del thumb cliqueado");
                var _direction = $(this).attr("data-position");
                //console.log(_direction);
                    
                if(_direction === "up"){
                    swiper.slideNext();
                }
                else swiper.slidePrev();
            }

        });   

        // Instancia del objeto swiper 
        var swiper = new Swiper('.swiper-container', {
            speed: 600,
            loop: true,
			setWrapperSize:true,
			nextButton: '.paginator-slider .next',                     
            prevButton: '.paginator-slider .prev',                   
            pagination: '.pagination',
            onInit: initSwiper,
			simulateTouch:false,
            paginationFractionRender: function(swiper, currentClassName, totalClassName) {
                return '<span class="' + currentClassName + '"></span>' +
                    ' de ' +
                    '<span class="' + totalClassName + '"></span>';
            }
        });

        //slider inicialización
        function initSwiper(swiper){
            
            // Tratamiento de thumbs
                var _currentSlideIndex = previousRealIndex = swiper.realIndex;
                var _temporalCurrentThumb = $(".container-articles").find("[data-slide-index='" + _currentSlideIndex + "']");
                currentHiddenThumb = _temporalCurrentThumb.detach();
               
                //se actualiza thumbsCollection sin el thumb que fue extraido del DOM
                thumbsCollection = $(".slide-thumb");

                // obteniendo numero de slides. TODO: de momento no los puedo obtener del swiper
                totalSlides = $(".slide-thumb").length;
            
                // marcando thumb superior e inferior en la columna
                tagThumbs();
                // activando evento click sobre los thumbs
                canClick = true;

            //Tratamiento de la información asociada al slide principal activo
                var _temporalSlidesInfoCollection = $(".slide-info");
                
                //Ocultando las informaciones de los slides que no están activos
                $(_temporalSlidesInfoCollection).each(function(index){
                    if($(this).data("slide-info-index") !== _currentSlideIndex){
                        $(this).hide(0);
                    }
                    else{
                        currentSlideInfo = $(this);
                    }
                })

            // handler para slideChangeStart
            swiper.on('slideChangeStart', function () {
               onSlideChange(swiper);
            });	

            SetVideos();
        }		
		

		
		// Control de los videos
		function SetVideos(){

            // Contando videos existentes ( incluyendo el duplicado por el loop del slider )
            var totalVideos = document.querySelectorAll(".main-posts-1 .swiper-slide .video-js");	      
            
            if(totalVideos.length !== 0 ){

                    //TODO : usar each
                    for(var i = 0; i < totalVideos.length; i++) {
                        var current = totalVideos[i];
                        
                        // Modificando el id de los videos, para evitar que existan dos videos con el mismo id por los duplicados del loop del slider
                        $(current).attr('id','video'+i);
                        
                        // Layer para que el video solo se reproduzca dándole al play
                        $(current).parent().prepend("<div class='layer video"+i+"'></div>");

                        // Instanciando
                        playersCollection[i] = videojs('video'+i, {
                            "poster" : $(current).find('img.poster').attr('src')
                        }); 
                        
                        playersCollection[i].on('play', function(event) {
                            $('.swiper-slide-active .layer').fadeOut();
                        });
                    }		
                    
                    
                    
                    //saber si el pirmer slide tiene un video
                    var firstSlideIsVideo = $(".swiper-slide-active .video-js");
                    
                    if(firstSlideIsVideo.length === 1){
                        // capturar evento loaderComplete para lanzar la reproducción del primer video 
                        $(document).on("loaderComplete", function(){
                            if($(window).innerWidth()>=1077){
                                firstSlideIsVideo[0].player.play();
                            }
                            $(document).off("loaderComplete");
                        })  
                        // actualizar currentVideo primera vez
                        currentVideo = firstSlideIsVideo[0].player;
                    }
          
            }
        }

        // callback cuando se detecta que se esta cambiando de slide
        function onSlideChange(swiper){
           
            // bloqueando click sobre los thumbs
            canClick = false;

            var _currentSlideIndex = swiper.realIndex; 
            var _previousSlideIndex = previousRealIndex;
            var _differenceNumber = _currentSlideIndex - _previousSlideIndex;
            var _jumpCondition = Math.abs(totalSlides) * -1;
            var _direction;
            
           if( (_differenceNumber === 1) || (_differenceNumber === _jumpCondition) ){
               _direction = "up"
           }
           else {
                _direction = "down";
           }

            previousRealIndex = _currentSlideIndex
            updateSliderState(_currentSlideIndex, _direction);

            // Pausando current video y actualizando
            if(currentVideo != null){
                currentVideo.pause();
                currentVideo.currentTime(0.4);
                var newCurrent = $(".swiper-slide-active .video-js");
                if(newCurrent.length === 1){
                    currentVideo = newCurrent[0].player;
                }
                else currentVideo = null;
            }else{
                var newCurrent = $(".swiper-slide-active .video-js");
                if(newCurrent.length === 1){
                    currentVideo = newCurrent[0].player;
                }
            }
        }

        //Actualiza los thumbs y la información asociada al slide al cambiar los slides 
        function updateSliderState(thumbToHideIndex, direction){
           
           // THUMBS ----------------- 
            //obteniendo thumb a esconder
            var _thumbToHide = $(".container-articles").find("[data-slide-index='" + thumbToHideIndex + "']");
            //obteniendo altura de los thumbs
            var _thumbHeight = $(".slide-thumb").outerHeight();
            //añadiendo signo negativo y formato para animación
            var _thumbOffset = (_thumbHeight*-1)  + 'px';
            var _bottomValue;
            var _animationTime = 500;
            //configurando valores para la animación
            switch (direction){
                    case "up":
                        _bottomValue = 0;
                        // agregando proximo thumb por abajo
                        currentHiddenThumb.appendTo(thumbsContainer);
                        // moviendo container hacia abajo, preparando para la animación
                        thumbsContainer.css({'bottom': _thumbHeight*-1 });
                        break;
                    case "down":
                        _bottomValue = _thumbOffset;
                        // agregando proximo thumb por arriba
                        currentHiddenThumb.prependTo(thumbsContainer);
                        break;
                }      

           //SLIDE INFO -----------------
            //obtener el SlideInfo a mostrar
            var _slideInfoToShow = $(".slide-info-container").find("[data-slide-info-index='" + swiper.realIndex + "']");  
            var _slideInfoAnimationTime = 245;

          //ANIMACIONES -----------------
            // Animación Thumbs
           thumbsContainer.animate({
                bottom:  _bottomValue
            }, _animationTime, function() {
                // eliminando thumb oculto
                currentHiddenThumb = _thumbToHide.detach();
                if(direction === "down"){
                    // posicionando container
                    thumbsContainer.css({'bottom':'0px'});
                }
                // restableciendo el arreglo de thumbs
                thumbsCollection = $(".slide-thumb");
                // marcando thumb superior e inferior
                tagThumbs();
                //habilitando evento click sobre los thumbs
                canClick = true;
            });

            // Animación Slide Info
            currentSlideInfo.fadeOut(_slideInfoAnimationTime, function(){
                 $(_slideInfoToShow).fadeIn(_slideInfoAnimationTime, function(){
                     currentSlideInfo = _slideInfoToShow;
                 })

            })
        }

        // Se marcan los thumbs para saber quien el superior e inferior
        function tagThumbs(){
            $(thumbsCollection[0]).attr( "data-position", "up" );
            $(thumbsCollection[1]).attr( "data-position", "down" );
        }
    });
})();