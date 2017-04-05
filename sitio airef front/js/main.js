// Loader
(function() {
    jQuery(document).ready(function() {
		jQuery(".page-loader .loader").fadeIn(2000);
       	jQuery(document).imagesLoaded(function() {
            // Page loader
            $(window).off("resize",moveProgressBar);
            jQuery(".page-loader .loader").delay(2000).fadeOut();
            jQuery(".page-loader").delay(2400).fadeOut(600,
            function(){ 
                // lanzando evento para mandar a reproducir el player 
                $(document).trigger("loaderComplete"); 
            });
        });

        moveProgressBar();
    });

    
    // on browser resize...
    $(window).resize(moveProgressBar);

    // SIGNATURE PROGRESS
    function moveProgressBar() {
      console.log("moveProgressBar");
        var getPercent = ($('.progress-wrap').data('progress-percent') / 100);
        var getProgressWrapWidth = $('.progress-wrap').width();
        var progressTotal = getPercent * getProgressWrapWidth;
        var animationLength = 2000;
        
        // on page load, animate percentage bar to data percentage length
        // .stop() used to prevent animation queueing
        $('.progress-bar').stop().animate({
            left: progressTotal
        }, animationLength);
    }
	
	
})();

// Agregando los tres puntos a los textos largos en las diferentes secciones del template
$(function(){
	
	var TextsTitles;

    // Títulos del contenedor principal
    TextsTitles = document.querySelectorAll(".container-principal .slide-info-container .title-10 a");				      
		
	for(var s = 0; s < TextsTitles.length; s++) {		
		currentText="";	
		$(TextsTitles[s]).after('<span class="complete">'+TextsTitles[s].textContent+'</span>');		
		currentText=TextsTitles[s].textContent;	
		$(TextsTitles[s]).after('<span class="cut1">'+currentText+'</span>');
	} 
	// titulo del current slide, con el panel de lectura plegado
	$(".container-principal .slide-info-container .title-10 a").succinct({size:130});
    // titulo del current slide, con el panel de lectura desplegado
	$(".container-principal .slide-info-container .title-10 span.cut1").succinct({size:165});	
	// parrafo con extracto de la noticia asociada al current slide 
    $(".container-principal .container-hidden p.p").succinct({size:300});
    // titulo de los thumbs
    $(".main-posts-1 .container-articles .post-tp-6 .title-6 a").succinct({size:85});

	//titulo de las cajas ultimas noticias
    $(".mp-section.last article.post-tp-5 .title-14 a").succinct({size:150});
	// parrafo con extracto de las ultimas noticias
    $(".mp-section.last article.post-tp-5 p.p").succinct({size:250});
	
    //titulos de la lista de  informes y noticias
    $(".notices .title-5 a").succinct({size:130});
	
    //textos de acerca del presidente y nuestra misión
    $(".wrapper-about article p.p").succinct({size:215});
});

// Aside menu (Site map)
(function(){
    var mbMenu = $('.js-asd-menu');

    mbMenu.magnificPopup({
        mainClass: 'mfp-asd-menu mfp-slide-left',
        type:'inline',
        midClick: true,
		closeOnContentClick: false,
		closeOnBgClick: false,
        closeMarkup: '<span class="aside-menu-close-ic mfp-close"></span>',
        removalDelay: 800
    });
	
	$('.js-asd-menu').mouseover(function(e){
		$(this).css({'cursor':'pointer'});
		$(this).click();
	})
})();

// Super fish menu (Main menu)
(function(){
    $(document).ready(function() {
        $('ul.sf-menu').superfish({
            delay: 300
        });
    });
})();

// Search block 
(function(){
    var searchBtn = $('.js-hd-search');
    var searchBlock = $('.js-hd-search-block');

    searchBtn.on('click', function(e) {
        var el = $(this);
        var searchBlock = el.parent().find('.js-hd-search-block');
		

        e.preventDefault();
        searchBlock.fadeToggle(100);
		searchBlock.find('.search').animate({
            right:  0
        }, 300);
		setTimeout(function(){
		searchBlock.find('.search-input input').focus();
		}, 400);
    });

    $(document).on("click", function(event) {
        if( $(event.target).closest(searchBlock).length == 0 && $(event.target).closest(searchBtn).length == 0 ) {
            
			searchBlock.find('.search').animate({
                right:  -296
            }, 300)
			searchBlock.fadeOut(400);
                
            
        }
    });
})();

// Filters dropdown
(function(){
    var filterBtn = $('.js-fl-btn');

    filterBtn.each(function() {
        var el = $(this);
        var filterBlock = el.find('.js-fl-block');

        el.on('click', function(e) {
            e.preventDefault();
            filterBlock.fadeToggle(200);
        });

        $(document).on("click", function(event) {
            if( $(event.target).closest(filterBlock).length == 0 && $(event.target).closest(el).length == 0 ) {
                filterBlock.fadeOut(200);
            }
        });
    });
})();


// Informes - News (tabs)
(function(){
    var filters = $('.js-tab-filter');
    var slider = $('.js-tab-slider');

    filters.on('click', 'a', function(e) {
        e.preventDefault();
        var el = $(this);

        if(!el.hasClass('active')) {
            el.parent().parent().find('a').removeClass('active');
            el.addClass('active');
			var panel = el.attr('data-option');
			var padre = el.parent().parent().parent().parent();
			el.parent().parent().parent().parent().find('.data.active').css({'display':'none'});
			el.parent().parent().parent().parent().find('.'+panel).css({'display':'block'});
			el.parent().parent().parent().parent().find('.'+panel).addClass('active');
        }
		
    });
})();

// Go top button
(function(){
    var butt = $('.js-go-top');
    butt.on('click', function(e) {
        e.preventDefault();
        var body = $("html, body");
        body.animate({
            scrollTop: 0
        }, 1500);
    });

    $('.main-content').waypoint(function(direction) {
        if(direction==="down") {
            butt.removeClass('fadeOutUp')
                .addClass('fadeInUp');
        } else if(direction==="up") {
            butt.removeClass('fadeInUp')
                .addClass('fadeOutUp');
        }
    });
})();

// Sticky header
(function(){
    var stHeader = $('.js-sticky-header');
    var content = $('.main-content');

    content.waypoint(function(direction) {
        if(direction==="down") {
            stHeader.addClass('visible');
        } else if(direction==="up") {
            stHeader.removeClass('visible');
        }
    });
})();


// Accordions
(function() {

    var allPanels = $('.accordion > .container-menu > dd').hide();

    $('.accordion > .container-menu > dt > a').on('click', function(e) {
        e.preventDefault();

        var el = $(this);
        if(!el.hasClass('open')) {
            allPanels.slideUp().prev().removeClass('open').children().removeClass('open');
            $(this).addClass('open').parent().addClass('open').next().slideDown();
        }else{
			 $(this).removeClass('open').parent().removeClass('open').next().slideUp();
		}

    });

})();


// Varios
(function(){
    $(document).ready(function() {
	
	/* Aside menu for mobile */
	$(document).on("click",'.js-asd-menu', function() {
		
		if(!$(this).hasClass('open-menu') && $(window).width()<=1077) {
			$(this).addClass('open-menu');
			$('.container-site').fadeOut(600);
		}
	});
	
	$(document).on("click",'.aside-menu .mfp-close', function() {
		if($('.js-asd-menu').hasClass('open-menu') && $(window).width()<=1077) {
			$('.container-site').fadeIn(100);
			$('.js-asd-menu').removeClass('open-menu');
		}
	});
	
	// Tabs de los inormes y noticias
	$('.wrapper-notices .data').css({'display':'none'});
	$('.wrapper-notices .data.active').css({'display':'block'});
	
	/* Dropdown de idioma click handler*/
	$(document).on("click",'.aside-menu ul.language a', function() {
		$('.aside-menu ul.language a').removeClass('active');
		$(this).addClass('active');
	});
	

  });
})();

// Manejando largo de textos para todos los contenidos del home
(function(){
    $(document).ready(function() {
        
        // Quitando espacios al inicio y al final de la cadena
        function trim (myString)
        {
            return myString.replace(/^\s+/g,'').replace(/\s+$/g,'')
        }
        
        /* Evitando que se muestren palabras cortadas */
        function FindSpace(pString){
            Count=pString.length;
            placeSpace='';
            if(pString!=''){
                while(Count>=0){
                    if(pString[Count]==' '){
                        placeSpace=Count;
                        break;
                    }
                    Count--;
                }
            }
            return placeSpace;		
        }

	});
})();

// Animations
(function(){
    $(document).ready(function() {

       $('#dl-item1').css('opacity', 0);
       $('#dl-item2').css('opacity', 0);
       $('#dl-item3').css('opacity', 0);
       $('#dl-item4').css('opacity', 0);
	   $('#dl-item5').css('opacity', 0);
       $('.wrapper-btns').css('opacity', 0);
       

       $('#dl-item1').waypoint(function() {
           $('#dl-item1').addClass('animated fadeIn');
        },{ offset: '100%' });

        $('#dl-item2').waypoint(function() {
           $('#dl-item2').addClass('animated fadeIn');
        },{ offset: '100%' }); 

       $('#dl-item3').waypoint(function() {
           $('#dl-item3').addClass('animated fadeIn');
        },{ offset: '100%' });

        $('#dl-item4').waypoint(function() {
           $('#dl-item4').addClass('animated fadeIn');
        },{ offset: '100%' }); 
		
		$('#dl-item5').waypoint(function() {
           $('#dl-item5').addClass('animated fadeIn');
        },{ offset: '100%' }); 

        $('.wrapper-btns').waypoint(function() {
           $('.wrapper-btns').addClass('animated fadeIn');
        },{ offset: '94%' }); 

    });
})();
