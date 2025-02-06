


const url = "productos.json";
const contenedorTarjetas = document.getElementById('productos');
const filtroCategoria = document.getElementById('filtro-categoria');
const filtroPrecio = document.getElementById('filtro-precio');
const botonCatalogo = document.querySelector('.mostrarCatalogo');


let catalogo= new Producto();
catalogo.cargarProductos(url,contenedorTarjetas);





// Eventos---------------------------------------
filtroCategoria.addEventListener('change', () => {
    // Usar la instancia de catalogo para cargar productos con los filtros
    catalogo.cargarProductos(url,contenedorTarjetas);
});

filtroPrecio.addEventListener('change', () => {
    // Usar la instancia de catalogo para cargar productos con los filtros
    catalogo.cargarProductos(url,contenedorTarjetas);
});

botonCatalogo.addEventListener('click', () => {
    // Restablecer los filtros y cargar los productos
    filtroCategoria.value = ''; 
    filtroPrecio.value = '';  
    catalogo.cargarProductos(url,contenedorTarjetas);
});

carrito.mostrarCarrito();

