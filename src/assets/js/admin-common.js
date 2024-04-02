$(function() {	

    // function clickOutSide(event) {        
    //     var hasNavClass = '.hasSublink, .active';               
    //     if (!event.target.matches(hasNavClass)) {     
    //         $(hasNavClass).siblings('ul').removeClass('sidebar-active');
    //     }                
    // };

    // document.body.addEventListener('click', clickOutSide);

    $('body').on('click','.hasSublink',function(e){  
        //alert(1);
        if($(this).siblings('ul').hasClass('sidebar-active') === true){
            $(this).siblings('ul').removeClass('sidebar-active');
           
        }
        else
        {       
            $('.hasSublink').siblings('ul').removeClass('sidebar-active');          
            $(this).siblings('ul').addClass('sidebar-active');  
                                
        }        
    }); 
    
    $('body').on('click','.hasSublink',function(e){  
        //alert(2);
        if($(this).hasClass('active') === true){
            $(this).removeClass('active');
        }
        else
        {       
            $('.hasSublink').removeClass('active');          
            $(this).addClass('active'); 
                                    
        }        
    }) 


    $('body').on('click','.menuLink',function(){
        $('.hasSublink').siblings('ul').removeClass('sidebar-active');
    });
    
    // $('body').on('click','.ml',function(){
    //    // alert('uu');
    //     $(this).siblings('li').children('a').removeClass('active');
    //     $(this).siblings('li').children('ul').removeClass('sidebar-active');
    // });

  
    // $('body').on('click','.navSpan',function(){
    //   // alert("hello");
    //     if($(this).hasClass('humber-menu-active') === true){
    //         $(this).removeClass('humber-menu-active');
    //         $('.sideNav').css('display','none');
    //     }
    //     else
    //     {                 
    //         $(this).addClass('humber-menu-active');
    //         $('.sideNav').css('display','block');
    //     }
        
    // }); 
    
   
   
});

