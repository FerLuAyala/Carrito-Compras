
const url = "productos.json";
const contenedorTarjetas = document.getElementById('productos');
const filtroCategoria = document.getElementById('filtro-categoria');
const filtroPrecio = document.getElementById('filtro-precio');
const botonCatalogo = document.querySelector('.mostrarCatalogo'); 



cargarProductos(url, contenedorTarjetas);

//eventos---------------------------------------
filtroCategoria.addEventListener('change', () => {
    cargarProductos(url, contenedorTarjetas); 
});

filtroPrecio.addEventListener('change', () => {
    cargarProductos(url, contenedorTarjetas); 
});

botonCatalogo.addEventListener('click', () => {
  
    filtroCategoria.value = ''; 
    filtroPrecio.value = '';  
    cargarProductos(url, contenedorTarjetas); 
});



mostrarCarrito();

