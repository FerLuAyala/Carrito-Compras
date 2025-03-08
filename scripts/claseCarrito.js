class Carrito {
    constructor() {
        this.carrito = [];
        this.cargarCarrito();
    }



    agregarProducto(producto) {
        const index = this.carrito.findIndex(item => item.id === producto.id);
        if (index === -1) {
            this.carrito.push({ ...producto, cantidad: 1 });
        } else {
            this.carrito[index].cantidad++;
        }

        this.actualizarCarrito();

    }


    actualizarCarrito() {
        // Actualizar la cantidad total de productos y el total del carrito 
        document.querySelector('.cantidadCarrito').textContent = this.carrito.reduce((total, item) => total + item.cantidad, 0);
        document.querySelector('.totalCarrito').textContent = this.obtenerTotal().toFixed(2);

        // Guardar el carrito en el localStorage
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }

    obtenerTotal() {
        return this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    cargarCarrito() {
        const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
        if (carritoGuardado) {
            this.carrito = carritoGuardado;
            this.actualizarCarrito();
        }
    }



    eliminarProducto(id) {

        this.carrito = this.carrito.filter(producto => producto.id !== id);
        this.actualizarCarrito();

        this.modalCarrito();
    }

    agregarEventosSumarRestar() {
        document.querySelectorAll('.sumar').forEach(boton => {
            boton.addEventListener('click', () => {
                const idProducto = parseInt(boton.getAttribute('data-id'));
                this.sumarProducto(idProducto);
            });
        });

        document.querySelectorAll('.restar').forEach(boton => {
            boton.addEventListener('click', () => {
                const idProducto = parseInt(boton.getAttribute('data-id'));
                this.restarProducto(idProducto);
            });
        });
    }

    sumarProducto(idProducto) {
        const producto = this.carrito.find(item => item.id === idProducto);
        if (producto) {
            producto.cantidad++;
            this.actualizarCarrito();
            this.modalCarrito();

        }
    }

    restarProducto(idProducto) {
        const producto = this.carrito.find(item => item.id === idProducto);
        if (producto) {
            if (producto.cantidad > 1) {
                producto.cantidad--;
            } else {
                this.eliminarProducto(idProducto);
            }
            this.actualizarCarrito();
            this.modalCarrito();

        }
    }


    modalCarrito() {

        const modalExistente = document.querySelector('.modal-div');
        if (modalExistente) {
            modalExistente.remove();
        }

        const carritoModal = document.createElement('dialog');
        document.body.prepend(carritoModal);
        carritoModal.showModal();
        carritoModal.addEventListener('close', () => carritoModal.remove());

        const contenedorModal = document.createElement('div');
        carritoModal.classList.add("modal-div");
        carritoModal.appendChild(contenedorModal);

        contenedorModal.innerHTML = "";

        if (carrito.carrito.length === 0) {
            const mensajeVacio = document.createElement('p');
            mensajeVacio.textContent = "Tu carrito esta vacio";
            contenedorModal.appendChild(mensajeVacio);
        } else {
            carrito.carrito.forEach(producto => {
                const productoElement = document.createElement('div');
                productoElement.classList.add('modal-carrito');
              
                const imagen = document.createElement('img');
                imagen.src = `./${producto.imagen}`;
                imagen.alt = producto.titulo;

                const nombreProducto = document.createElement('p');
                nombreProducto.textContent = producto.titulo;

                const cantidad = document.createElement('span');
                cantidad.textContent = `${producto.cantidad}`;

                const precio = document.createElement('p');
                precio.textContent = `$${producto.precio}`;

                const totalProducto = document.createElement('p');
                totalProducto.textContent = `SubTotal: $${(producto.precio * producto.cantidad).toFixed(2)}`;

                const botonEliminar = document.createElement('button');
                botonEliminar.classList.add('btn');
                const icono = document.createElement('i');
                icono.classList.add('fa-solid', 'fa-trash-can');
                botonEliminar.textContent = ' ';
                botonEliminar.prepend(icono);
                botonEliminar.addEventListener('click', () => this.eliminarProducto(producto.id));

                
                const botonSumar = document.createElement('button');
                botonSumar.classList.add('btn', 'sumar');
                botonSumar.textContent = '+';
                botonSumar.setAttribute('data-id', producto.id);

                const botonResta = document.createElement('button');
                botonResta.classList.add('btn', 'restar');
                botonResta.textContent = '-';
                botonResta.setAttribute('data-id', producto.id);

                
                const contenedorBotones = document.createElement('div');
                contenedorBotones.classList.add('botones-acciones');
                contenedorBotones.appendChild(botonResta);
                contenedorBotones.appendChild(cantidad);
                contenedorBotones.appendChild(botonSumar);

                productoElement.appendChild(imagen);
                productoElement.appendChild(nombreProducto);
                productoElement.appendChild(precio);
                productoElement.appendChild(contenedorBotones);
                productoElement.appendChild(totalProducto);
                productoElement.appendChild(botonEliminar);

                contenedorModal.appendChild(productoElement);
            });

        }
        this.agregarEventosSumarRestar();

        const total = carrito.obtenerTotal();
        const totalCar = document.createElement('div');
        totalCar.classList.add('resultado');

        const totalTex = document.createElement('p');
        totalTex.textContent = `Total del carrito: $${total.toFixed(2)}`;

        const totalProdu = document.createElement('p');
        totalProdu.textContent = `Total de productos: ${carrito.carrito.reduce((acc, prod) => acc + prod.cantidad, 0)}`;

       

        const finalCompra = document.createElement('button');
        finalCompra.classList.add('button', 'btn-agregar');
        finalCompra.textContent = 'Finalizar Compra';

        const seguirCompra = document.createElement('button');
        seguirCompra.classList.add('button', 'btn-agregar');
        const iconoCarrito = document.createElement('i');
        iconoCarrito.classList.add('fas', 'fa-shopping-cart');
        seguirCompra.appendChild(iconoCarrito);
        seguirCompra.appendChild(document.createTextNode(' Agregar'));


        const cerrarFooter = document.createElement('button');
        cerrarFooter.classList.add('btn-detalle');
        cerrarFooter.textContent = 'X';
        totalCar.appendChild(totalProdu);
        totalCar.appendChild(totalTex);
      

        carritoModal.appendChild(totalCar);
        const btnContainer = document.createElement('div');
        btnContainer.classList.add('btn-container');
        carritoModal.appendChild(btnContainer);
        btnContainer.appendChild(cerrarFooter);
        btnContainer.appendChild(seguirCompra);
        btnContainer.appendChild(finalCompra);

        cerrarFooter.addEventListener('click', () => carritoModal.close());
        finalCompra.addEventListener('click', () => carritoModal.close());
        seguirCompra.addEventListener('click', () =>
            carritoModal.close());

        carritoModal.addEventListener('click', (e) => {
            if (e.target === carritoModal) {
                carritoModal.close();
                document.body.removeChild(carritoModal);
            }
        });
    }



    /*mostrarCarrito() {
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
                 botonEliminar.classList.add('btn');
                 let icono = document.createElement('i');
                 icono.classList.add('fa-solid', 'fa-trash-can');
                 botonEliminar.textContent = '  Eliminar ';
                 botonEliminar.prepend(icono);
 
                 const botonSumar = document.createElement('button');
                 botonSumar.classList.add('btn', 'sumar');
                 botonSumar.textContent = '+';
                 botonSumar.setAttribute('data-id', producto.id);
 
                 const botonResta = document.createElement('button');
                 botonResta.classList.add('btn', 'restar');
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
 
                 this.agregarEventosSumarRestar();
 
 
 
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
                 mensajeCompra.textContent = 'Operación realizada, ¡Gracias por tu compra!';
 
 
                 contenedorCarrito.innerHTML = '';
                 contenedorCarrito.appendChild(mensajeCompra);
 
 
                 this.carrito = [];
 
 
                 this.actualizarCarrito();
 
                 localStorage.setItem('carrito', JSON.stringify(this.carrito));
             });
 
         }
 
         this.agregarEventosSumarRestar();
 
 
     }
 */

}




function agregarAlCarrito(producto) {
    carrito.agregarProducto(producto);

}
// INICIAR CARRITO------------------------------------------------------------------------------------------------------

const carrito = new Carrito();
document.addEventListener('DOMContentLoaded', () => carrito.actualizarCarrito());

// Evento para mostrar carrito


document.querySelector('.otroBoton').addEventListener('click', () => carrito.modalCarrito()); 