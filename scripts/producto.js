
class Producto {
    constructor(id, nombre, precio, imagen, categoria) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.imgDetalles =[];
        this.categoria = categoria;
    }
    cargarProductos(url, contenedor) {
        fetch(url)
            .then(response => response.json())
            .then(productos => {

                const categoriaSeleccionada = filtroCategoria.value;
                const precioSeleccionado = filtroPrecio.value;

                const productosFiltrados = productos.filter(producto => {
                    let categoriaCoincide = true;

                    // Filtro por categoría
                    if (categoriaSeleccionada && producto['categoria'] !== categoriaSeleccionada) {
                        categoriaCoincide = false;
                    }

                    return categoriaCoincide;
                });

                // Filtro de precio
                if (precioSeleccionado) {
                    if (precioSeleccionado === 'asc') {
                        productosFiltrados.sort((a, b) => a.precio - b.precio);
                    } else if (precioSeleccionado === 'desc') {
                        productosFiltrados.sort((a, b) => b.precio - a.precio);
                    }
                }


                contenedor.innerHTML = '';


                productosFiltrados.forEach(producto => {
                    const tarjetaProducto = document.createElement('div');
                    tarjetaProducto.classList.add('tarjeta-producto');

                    const card = document.createElement('div');
                    card.classList.add('card');

                    const img = document.createElement('img');
                    img.src = `./${producto.imagen}`;
                    img.alt = producto.nombre;

                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    const titulo = document.createElement('h3');
                    titulo.classList.add('card-title');
                    titulo.textContent = producto.nombre;

                    const precio = document.createElement('span');
                    precio.classList.add('card-text');
                    precio.textContent = `Precio: $${producto.precio.toFixed(2)}`;

                    const categoria = document.createElement('p');
                    categoria.classList.add('card-text');
                    categoria.textContent = `Categoría: ${producto['categoria']}`;

                    const botonAgregar = document.createElement('button');
                    botonAgregar.classList.add('btn-agregar');
                    botonAgregar.textContent = 'Agregar al carrito';

                    const botonDetalle = document.createElement('button');
                    botonDetalle.classList.add('btn-detalle');
                    botonDetalle.setAttribute('data-id', producto.id);
                    botonDetalle.textContent = 'Ver Detalles';

                    // Agregar los elementos al cardBody
                    cardBody.appendChild(titulo);
                    cardBody.appendChild(precio);
                    cardBody.appendChild(categoria);
                    cardBody.appendChild(botonAgregar);
                    cardBody.appendChild(botonDetalle);

                    // Agregar la imagen y el cuerpo del card al card
                    card.appendChild(img);
                    card.appendChild(cardBody);

                    // Agregar el card al contenedor de productos
                    tarjetaProducto.appendChild(card);
                    contenedor.appendChild(tarjetaProducto);

                    // Agregar eventos a los botones

                    botonAgregar.addEventListener('click', () => {
                        agregarAlCarrito(producto);
                    });

                    botonDetalle.addEventListener('click', () => {
                        this.mostrarDetalleProducto(producto);
                    });

                    // Agregar el evento click a la imagen para mostrar el detalle del producto
                    img.addEventListener('click', (e) => {
                        e.preventDefault(); // Previene el comportamiento por defecto si fuera necesario
                        this.mostrarDetalleProducto(producto); // Muestra el detalle del producto cuando se hace clic en la imagen
                    });

                });

                // Mostrar oferta especial si hay una categoría seleccionada
                if (categoriaSeleccionada) {
                    this.mostrarOfertaEspecial(categoriaSeleccionada);
                }


            })
            .catch(error => {
                console.error('Error al cargar los productos:', error);
            });
    }

    mostrarOfertaEspecial(categoriaSeleccionada) {
        // Crear el banner flotante de oferta especial
        const ofertaBanner = document.createElement('img');
        const ofertaImg = document.createElement('img'); 


        ofertaBanner.classList.add('oferta-banner');
        ofertaImg.classList.add('banner-img');


        let mensajeOferta = '';
        let imgSrc = ''; 

        switch (categoriaSeleccionada) {
            case 'tv':
                mensajeOferta = '/desc.jpg';
                imgSrc = '/banner1.jpg'; // Ruta de la imagen de la oferta de televisores
                break;
            case 'tecnologia':
                mensajeOferta = '/desc.jpg';
                imgSrc = '/banner1.jpg';
                break;
            default:
                mensajeOferta = '/desc.jpg';
                imgSrc = '/banner1.jpg';
                break;
        }

        // Asignar el mensaje y la imagen al banner
        ofertaBanner.src = mensajeOferta;
        ofertaImg.src = imgSrc;




        // Agregar el banner y la imagen al contenedor del banner
        const bannerContainer = document.getElementById('banner');
        bannerContainer.innerHTML = ''; // Limpiar contenido previo en el contenedor
        bannerContainer.appendChild(ofertaBanner);
        bannerContainer.appendChild(ofertaImg);




        // Eliminar ambos después de 10 segundos
        setTimeout(() => {
            ofertaBanner.remove();

        }, 10000);
    }


    mostrarDetalleProducto(producto) {
       
        const modal = document.createElement('dialog');

        const carruselContenedor = document.createElement('div');
        carruselContenedor.classList.add('carrusel');
        
        
        producto.imgDetalles.forEach((imagenUrl, index) => {
            const img = document.createElement('img');
            img.src = imagenUrl;
            img.alt = `${producto.nombre} imagen ${index + 1}`;
            img.classList.add('carrusel-imagen');
            
            // Inicialmente ocultar todas las imágenes excepto la primera
            if (index !== 0) {
                img.style.display = 'none';
            }
            carruselContenedor.appendChild(img);
        });
        
        // Crear botones de navegación del carrusel
        const prevButton = document.createElement('button');
        prevButton.textContent = '←';
        prevButton.classList.add('carrusel-btn');
        prevButton.addEventListener('click', () => cambiarImagen(-1));
        
        const nextButton = document.createElement('button');
        nextButton.textContent = '→';
        nextButton.classList.add('carrusel-btn');
        nextButton.addEventListener('click', () => cambiarImagen(1));
        
        // Función para cambiar las imágenes en el carrusel
        let imagenActual = 0;
        function cambiarImagen(direccion) {
            const imagenes = carruselContenedor.querySelectorAll('.carrusel-imagen');
            imagenes[imagenActual].style.display = 'none';
            imagenActual = (imagenActual + direccion + imagenes.length) % imagenes.length;
            imagenes[imagenActual].style.display = 'block';
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                cambiarImagen(-1); 
            } else if (event.key === 'ArrowRight') {
                cambiarImagen(1); 
            }
        });


        const nomDet = document.createElement('h1');
        nomDet.textContent = producto.nombre;


        const descripcion = document.createElement('p');
        descripcion.textContent = `Descripcion: ${producto.descripcion}`;

        const precio = document.createElement('span');
        precio.textContent = `Precio: $${producto.precio.toFixed(2)}`;
        // Crear botón de cerrar
        const cerrarFooter = document.createElement('button');
        cerrarFooter.type = 'button';
        cerrarFooter.textContent = 'Cerrar';
        cerrarFooter.addEventListener('click', () => modal.close()); // Cerrar el modal al hacer clic

        // Crear botón de agregar al carrito
        const agregarFooter = document.createElement('button');
        agregarFooter.type = 'button';
        agregarFooter.textContent = 'Agregar al carrito';
        agregarFooter.addEventListener('click', () => {
         
            
                agregarAlCarrito(producto);
                
                modal.remove();  // Remover el modal después de cerrar
           
        


        });

        // Añadir los elementos al modal
        modal.appendChild(nomDet);
        modal.appendChild(precio);
        modal.appendChild(carruselContenedor);
        modal.appendChild(prevButton);
        modal.appendChild(nextButton);
       
       
        modal.appendChild(descripcion);
     
        modal.appendChild(cerrarFooter);
        modal.appendChild(agregarFooter);

        // Mostrar el modal
        document.body.prepend(modal);
        modal.showModal();

        // Cerrar el modal al hacer clic
        modal.addEventListener('close', () => modal.remove());
    }



}







