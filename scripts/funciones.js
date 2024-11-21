function cargarProductos(url, contenedor) {
    fetch(url)
        .then(response => response.json())
        .then(productos => {

            const categoriaSeleccionada = filtroCategoria.value;
            const precioSeleccionado = filtroPrecio.value;

            // Filtrar productos según la categoría
            const productosFiltrados = productos.filter(producto => {
                let categoriaCoincide = true;

                // Filtro por categoría
                if (categoriaSeleccionada && producto['categoría'] !== categoriaSeleccionada) {
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
                categoria.textContent = `Categoría: ${producto['categoría']}`;


                const botonAgregar = document.createElement('button');
                botonAgregar.classList.add('btn-agregar');
                botonAgregar.textContent = 'Agregar al carrito';


                const botonDetalle = document.createElement('button');
                botonDetalle.classList.add('btn-detalle');
                botonDetalle.setAttribute('data-id', producto.id);
                botonDetalle.textContent = 'Ver Detalles';


                cardBody.appendChild(titulo);
                cardBody.appendChild(precio);
                cardBody.appendChild(categoria);
                cardBody.appendChild(botonAgregar);
                cardBody.appendChild(botonDetalle);


                card.appendChild(img);
                card.appendChild(cardBody);


                tarjetaProducto.appendChild(card);
                contenedor.appendChild(tarjetaProducto);

                // Agregar eventos a los botones
                botonAgregar.addEventListener('click', () => {
                    agregarAlCarrito(producto);
                });

                botonDetalle.addEventListener('click', () => {
                    mostrarDetalleProducto(producto);
                });
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
}



function mostrarDetalleProducto(producto) {

   const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = 'modalDetalleProducto';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'modalDetalleProductoLabel');
    modal.setAttribute('aria-hidden', 'true');

    // Modal dialog
    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog', 'modal-lg', 'modal-body');
    modal.appendChild(modalDialog);

    // Modal content
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalDialog.appendChild(modalContent);

    // Modal header
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalContent.appendChild(modalHeader);

    const modalTitle = document.createElement('span');
    modalTitle.classList.add('modal-title');
    modalTitle.id = 'modalDetalleProductoLabel';
    modalTitle.textContent = 'Detalle del Producto';
    modalHeader.appendChild(modalTitle);

    const cerrar = document.createElement('button');
    cerrar.type = 'button';
    cerrar.classList.add('btn-close');
    cerrar.setAttribute('data-bs-dismiss', 'modal');
    cerrar.setAttribute('aria-label', 'Close');
    modalHeader.appendChild(cerrar);

    // Modal body
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalContent.appendChild(modalBody);

    const modalName = document.createElement('span');
    modalName.id = 'modalProductoNombre';
    modalName.textContent = producto.nombre;
    modalBody.appendChild(modalName);
    
    

    const modalImage = document.createElement('img');
    modalImage.id = 'modalProductoImagen';
    modalImage.src = `./${producto.imagen}`;
    modalImage.alt = '';
    modalImage.classList.add('img-fluid', 'mb-3');
    modalBody.appendChild(modalImage);

    const precioModal = document.createElement('p');
    precioModal.innerHTML = `<strong>Precio:</strong> $<span id="modalProductoPrecio">${producto.precio}</span>`;
    modalBody.appendChild(precioModal); 
    
    const modalDescription = document.createElement('p');
    modalDescription.id = 'modalProductoDescripcion';
    modalDescription.textContent = producto.descripcion;
    modalBody.appendChild(modalDescription);



    // Modal footer
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');
    modalContent.appendChild(modalFooter);

    const cerrarFooter = document.createElement('button');
    cerrarFooter.type = 'button';
    cerrarFooter.classList.add('btn', 'btn-secondary');
    cerrarFooter.setAttribute('data-bs-dismiss', 'modal');
    cerrarFooter.textContent = 'Cerrar';
    modalFooter.appendChild(cerrarFooter);

    const agregarBo = document.createElement('button');
    agregarBo.classList.add('btn','btn-agregarModal' , 'btn-success');
    agregarBo.textContent = 'Agregar al carrito';
    modalFooter.appendChild(agregarBo);

    // Agregar el modal al cuerpo de la página
    document.body.appendChild(modal);

    // Mostrar el modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    // Agregar el evento para el botón de "Agregar al carrito"
    agregarBo.addEventListener('click', () => {
        agregarAlCarrito(producto);
        bootstrapModal.hide();
        modal.remove();  // Remover el modal después de cerrar
    });

    // Eliminar el modal cuando se cierra
    cerrar.addEventListener('click', () => {
        modal.remove();
    });
}


function agregarAlCarrito(producto) {
    carrito.agregarProducto(producto);
   
}



function agregarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll('.eliminarProducto');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', function () {
            const idProducto = parseInt(boton.getAttribute('data-id'));
            eliminarProductoDelCarrito(idProducto);
        });
    });
}
function mostrarCarrito() {
    const contenedorCarrito = document.querySelector('#productosCarrito');
  
    contenedorCarrito.innerHTML = '';

    
    if (carrito.carrito.length === 0) {
        const mensajeVacio = document.createElement('h4');
        mensajeVacio.textContent = 'Tu carrito está vacío.';
        contenedorCarrito.appendChild(mensajeVacio);
    } else {
       
        carrito.carrito.forEach(producto => {
            const productoElement = document.createElement('div');
            productoElement.classList.add('productoCarrito');

       
            const imagen = document.createElement('img');
            imagen.src = `./${producto.imagen}`;
            imagen.alt = producto.nombre;
            imagen.classList.add('img-fluid', 'rounded-start');

            const nombre = document.createElement('span');
            nombre.textContent = producto.nombre;

            const cantidad = document.createElement('p');
            cantidad.classList.add('cantidad');
            cantidad.textContent = `${producto.cantidad}`;

            const precio = document.createElement('p');
            precio.textContent = `Precio: $${producto.precio}`;

            const totalProducto = document.createElement('p');
            totalProducto.textContent = `Total: $${(producto.precio * producto.cantidad).toFixed(2)}`;

           
            let botonEliminar = document.createElement('button');
            botonEliminar.classList.add('btn', 'btn-danger');
            let icono = document.createElement('i');
            icono.classList.add('fa-solid', 'fa-trash-can');
            botonEliminar.textContent = '  Eliminar ';
            botonEliminar.prepend(icono);

            const botonSumar = document.createElement('button');
            botonSumar.classList.add('btn', 'btn-danger', 'sumar');
            botonSumar.textContent = '+';
            botonSumar.setAttribute('data-id', producto.id);

            const botonResta = document.createElement('button');
            botonResta.classList.add('btn', 'btn-danger', 'restar');
            botonResta.textContent = '-';
            botonResta.setAttribute('data-id', producto.id);


            //botones de acción (Sumar, cantidad, Restar)
            const contenedorBotones = document.createElement('div');
            contenedorBotones.classList.add('botones-acciones');
            contenedorBotones.appendChild(botonResta);
            contenedorBotones.appendChild(cantidad);
            contenedorBotones.appendChild(botonSumar);
       

            // Añadir los elementos al producto
            productoElement.appendChild(imagen);
            productoElement.appendChild(nombre);
            productoElement.appendChild(precio);
            productoElement.appendChild(totalProducto);
            productoElement.appendChild(contenedorBotones);
            productoElement.appendChild(botonEliminar);

            // Añadir el producto al contenedor
            contenedorCarrito.appendChild(productoElement);

         
            botonEliminar.addEventListener('click', () => {
                carrito.eliminarProducto(producto.id); 

            });

           
            
            

        });

        // Mostrar el total del carrito
        const total = carrito.obtenerTotal();
        const totalCarrito = document.createElement('div');
        totalCarrito.classList.add('resultado');

        const totalTexto = document.createElement('p');
        totalTexto.textContent = `Total del carrito: $${total.toFixed(2)}`;

        const totalProductos = document.createElement('p');
        totalProductos.textContent = `Total de productos: ${carrito.carrito.reduce((acc, prod) => acc + prod.cantidad, 0)}`;

        const finalizarCompra = document.createElement('button');
        finalizarCompra.classList.add('button', 'aceptar');
        finalizarCompra.textContent = 'Finalizar Compra';


        totalCarrito.appendChild(totalTexto);
        totalCarrito.appendChild(totalProductos);
        contenedorCarrito.appendChild(totalCarrito);
        totalCarrito.appendChild(finalizarCompra);


        finalizarCompra.addEventListener('click', () => {
          
            const mensajeCompra = document.createElement('h4');
            mensajeCompra.textContent = 'Operación realizada, Gracias por tu compra!';
            contenedorCarrito.innerHTML = '';
            contenedorCarrito.appendChild(mensajeCompra);
            carrito.vaciarCarrito();
         
         });
         
     }
    agregarEventosSumarRestar();


    
}

function agregarEventosSumarRestar() {
    const botonesSumar = document.querySelectorAll('.sumar');
    botonesSumar.forEach(boton => {
        boton.addEventListener('click', function () {
            const idProducto = parseInt(boton.getAttribute('data-id'));
            sumarProducto(idProducto);
        });
    });

    const botonesRestar = document.querySelectorAll('.restar');
    botonesRestar.forEach(boton => {
        boton.addEventListener('click', function () {
            const idProducto = parseInt(boton.getAttribute('data-id'));
            restarProducto(idProducto);
        });
    });
}

function sumarProducto(idProducto) {
  
    const producto = carrito.carrito.find(item => item.id === idProducto);
    if (producto) {
        // SUMA
        producto.cantidad++;
        carrito.actualizarCarrito();
        mostrarCarrito(); 
    }
}

function restarProducto(idProducto) {
   
    const producto = carrito.carrito.find(item => item.id === idProducto);
    if (producto) {
        // RESTA
        if (producto.cantidad > 1) {
            producto.cantidad--;
        } else {
            // ELIMINA SI ES MENOR A 1
            carrito.eliminarProducto(idProducto);
        }
        carrito.actualizarCarrito();
        mostrarCarrito(); 
    }
}





