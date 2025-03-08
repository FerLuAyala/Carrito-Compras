


const url = "productos.json";
const contenedorTarjetas = document.getElementById('productos');
const botonesFiltro = document.querySelectorAll('.filtro-categoria');
const filtroPrecio = document.getElementById('filtro-precio');
const botonCatalogo = document.querySelector('.mostrarCatalogo');


let catalogo= new Producto();
catalogo.cargarProductos(url,contenedorTarjetas);





// Eventos---------------------------------------


filtroPrecio.addEventListener('change', () => {
    // Usar la instancia de catalogo para cargar productos con los filtros
    catalogo.cargarProductos(url,contenedorTarjetas);
});





