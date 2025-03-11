
class Producto {
    constructor(id, nombre, titulo, precio, imagen, categoria) {
        this.id = id;
        this.nombre = nombre;
        this.titulo = titulo;
        this.precio = precio;
        this.imagen = imagen;
        this.imgDetalles = [];
        this.categoria = categoria;
    }
    cargarProductos(url, contenedor) {

        fetch(url)
            .then(response => response.json())
            .then(productos => {

                const categoriaSeleccionada = filtroCategoria.value;
                const precioSeleccionado = filtroPrecio.value;

                const productosFiltrados = productos
                    .filter(producto => {
                        // Filtro por categoría
                        if (categoriaSeleccionada && producto['categoria'] !== categoriaSeleccionada) {
                            return false;
                        }
                        return true;
                    })
                    .sort((a, b) => {
                        // Filtro  precio
                        if (precioSeleccionado === 'asc') {
                            return a.precio - b.precio;
                        } else if (precioSeleccionado === 'desc') {
                            return b.precio - a.precio;
                        }
                        return 0;
                    });


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

                    const tit = document.createElement('h3');
                    tit.classList.add('card-title');
                    tit.textContent = producto.nombre;

                    const precio = document.createElement('h4');
                    precio.classList.add('card-text');
                    precio.textContent = `Precio: $${producto.precio.toFixed(2)}`;

                    const categoria = document.createElement('p');
                    categoria.classList.add('card-cat');
                    categoria.textContent = `Categoría: ${producto['categoria']}`;

                    const btnContainer = document.createElement('div');
                    btnContainer.classList.add('btn-container');

                    const botonAgregar = document.createElement('button');
                    botonAgregar.classList.add('btn-agregar');
                    const iconoCarrito = document.createElement('i');
                    iconoCarrito.classList.add('fas', 'fa-shopping-cart');
                    botonAgregar.prepend(iconoCarrito);
                    botonAgregar.append(' Agregar');

                    btnContainer.appendChild(botonAgregar);
                    const botonDetalle = document.createElement('button');
                    botonDetalle.classList.add('btn-detalle');
                    const iconoVer = document.createElement('i');
                    iconoVer.classList.add('fas', 'fa-eye');
                    botonDetalle.prepend(iconoVer);
                    botonDetalle.setAttribute('data-id', producto.id);
                    botonDetalle.append(' Ver');
                    btnContainer.appendChild(botonDetalle);



                    // Agregar los elementos al cardBody
                    cardBody.appendChild(tit);
                    cardBody.appendChild(precio);
                    cardBody.appendChild(categoria);
                    cardBody.appendChild(btnContainer);




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

                   
                    img.addEventListener('click', (e) => {
                        e.preventDefault(); 
                        this.mostrarDetalleProducto(producto); 
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

        const ofertaBanner = document.createElement('div');
        ofertaBanner.classList.add('oferta-banner');


        const imgOferta = document.createElement('img');
        let mensajeOferta = '';


        switch (categoriaSeleccionada) {
            case 'mesas':
                mensajeOferta = 'img/descSilla.jpg';
                break;
            case 'sillon':
                mensajeOferta = 'img/descSillon.jpg';
                break;
            case 'rackTV':
                mensajeOferta = 'img/descRack.jpg';
                break;
            default:
                mensajeOferta = 'img/descDias.jpg'
                return; 
        }

        imgOferta.src = mensajeOferta;
        imgOferta.alt = `Oferta especial para ${categoriaSeleccionada}`;


        const closeBtn = document.createElement('button');
        closeBtn.classList.add('btn-cerrar');
        closeBtn.innerText = 'X';
        closeBtn.addEventListener('click', () => ofertaBanner.remove());


        ofertaBanner.appendChild(imgOferta);
        ofertaBanner.appendChild(closeBtn);

        const bannerContainer = document.getElementById('banner');
        bannerContainer.innerHTML = '';
        bannerContainer.appendChild(ofertaBanner);

        setTimeout(() => {
            ofertaBanner.remove();
        }, 10000);

    }



    mostrarDetalleProducto(producto) {

        const modal = document.createElement('dialog');
        modal.classList.add('modal-detalle-producto');


        const carruselContenedor = document.createElement('div');
        carruselContenedor.classList.add('carrusel');

        const nomDet = document.createElement('h3');
        nomDet.textContent = producto.nombre;
        modal.appendChild(nomDet);


        const precio = document.createElement('span');
        precio.textContent = `Precio: $${producto.precio.toFixed(2)}`;
        modal.appendChild(precio);

        // Crear imagen 
        const imgDet = document.createElement('img');
        imgDet.src = producto.imgDetalles[0];
        imgDet.alt = `${producto.nombre} imagen principal`;
        imgDet.classList.add('imagen-principal');

        carruselContenedor.appendChild(imgDet);

        // Crear los botones (anterior y siguiente)
        const btnAnt = document.createElement('button');
        let iconoAnt = document.createElement('i');
        iconoAnt.classList.add('fa-solid', 'fa-angle-left'); 
        btnAnt.prepend(iconoAnt);
        btnAnt.classList.add('btn-navegacion');

        const btnSig = document.createElement('button');

        let iconoSig = document.createElement('i');
        iconoSig.classList.add('fa-solid', 'fa-angle-right'); 
        btnSig.prepend(iconoSig);
        btnSig.classList.add('btn-navegacion');

        carruselContenedor.appendChild(btnAnt);
        carruselContenedor.appendChild(btnSig);
        modal.appendChild(carruselContenedor);


        const descripcion = document.createElement('p');
        descripcion.textContent = `${producto.descripcion}`;

        modal.appendChild(descripcion);

        const btnContainer = document.createElement('div');
        btnContainer.classList.add('btn-container');
        modal.appendChild(btnContainer);

        const cerrarFooter = document.createElement('button');
        cerrarFooter.classList.add('btn-detalle');
        cerrarFooter.textContent = 'Cerrar';
        cerrarFooter.addEventListener('click', () => modal.close());

        const agregarFooter = document.createElement('button');
        agregarFooter.classList.add('btn-agregar');
        const iconoCarrito = document.createElement('i');
        iconoCarrito.classList.add('fas', 'fa-shopping-cart');
        agregarFooter.prepend(iconoCarrito);
        agregarFooter.append(' Agregar');


        agregarFooter.addEventListener('click', () => {
            agregarAlCarrito(producto);
            modal.remove();
        });


        let imgActual = 0;
        const totalImgs = producto.imgDetalles.length;
        const imgFinal = totalImgs - 1;

        btnAnt.addEventListener('click', () => {
            cambiarImagen(-1);
        });


        btnSig.addEventListener('click', () => {
            cambiarImagen(1);
        });

        // Función para cambiar la imagen
        function cambiarImagen(direccion) {
            imgActual += direccion;


            if (imgActual < 0) {
                imgActual = 0;
            } else if (imgActual > imgFinal) {
                imgActual = imgFinal;
            }

            //muestra la imagen     
            imgDet.src = producto.imgDetalles[imgActual];
        }


        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                cambiarImagen(-1);
            } else if (event.key === 'ArrowRight') {
                cambiarImagen(1);
            }
        });

        btnContainer.appendChild(agregarFooter);
        btnContainer.appendChild(cerrarFooter);

        document.body.appendChild(modal);
        modal.showModal();


        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.close();
                document.body.removeChild(modal);
            }
        });
    }

  
    


}













