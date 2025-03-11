


const url = "productos.json";
const contenedorTarjetas = document.getElementById('productos');
const filtroCategoria = document.getElementById('filtro-categoria');
const filtroPrecio = document.getElementById('filtro-precio');



let catalogo= new Producto();
catalogo.cargarProductos(url,contenedorTarjetas);





// Eventos---------------------------------------
filtroCategoria.addEventListener('change', () => {

    catalogo.cargarProductos(url,contenedorTarjetas);
});

filtroPrecio.addEventListener('change', () => {
   
    catalogo.cargarProductos(url,contenedorTarjetas);
});





