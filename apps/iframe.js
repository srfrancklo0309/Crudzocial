const previewiframe = document.getElementById("preview-app");

// Funcionalidad para el iframe
$(document).ready(function() {
    function loadIframeContent(fileSrc) {
        const iframe = $('#preview-app');
        const placeholder = $('#iframe-placeholder');
        
        if (fileSrc) {
            // Ocultar placeholder y mostrar iframe
            placeholder.hide();
            iframe.show();
            
            // Cargar el archivo en el iframe
            iframe.attr('src', fileSrc);
            console.log('Iframe cargado con:', fileSrc);
        }
    }
    
    // Funcionalidad para el botón Home
    $('.compose .button').on('click', function(e) {
        e.preventDefault();
        console.log('Clic en botón Home:', $(this).data('src'));
        
        // Remover clase active de todos los items del aside
        $('.aside .main .item').removeClass('active');
        
        // Obtener la URL del archivo a cargar
        const fileSrc = $(this).data('src');
        loadIframeContent(fileSrc);
    });
    
    // Funcionalidad para el iframe (elementos del aside)
    $('.aside .main .item').on('click', function(e) {
        e.preventDefault();
        console.log('Clic en elemento del aside:', $(this).data('src'));
        
        // Remover clase active de todos los items
        $('.aside .main .item').removeClass('active');
        
        // Agregar clase active al item clickeado
        $(this).addClass('active');
        
        // Obtener la URL del archivo a cargar
        const fileSrc = $(this).data('src');
        loadIframeContent(fileSrc);
    });
    
    // Cargar el primer archivo por defecto
    console.log('Cargando archivo por defecto...');
    setTimeout(function() {
        $('.aside .main .item.active').trigger('click');
    }, 500);
});

