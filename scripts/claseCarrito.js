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

        this.mostrarCarrito(); 
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
            this.mostrarCarrito();
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
            this.mostrarCarrito();
        }
    }

    mostrarCarrito() {
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
                this.checkout()
                const mensajeCompra = document.createElement('h4');
                mensajeCompra.textContent = 'Operación realizada, Gracias por tu compra!';
                contenedorCarrito.innerHTML = '';
                contenedorCarrito.appendChild(mensajeCompra);
                carrito.vaciarCarrito();
             
             });
             
         }
       this.agregarEventosSumarRestar();
    
    
        
    }

    checkout() {
        const checkoutModal = document.createElement('dialog', { class: 'modal' });
        document.body.prepend(checkoutModal);
        checkoutModal.showModal();
        checkoutModal.addEventListener('close', () => checkoutModal.remove());
    
    
    
        const formCheckout = document.createElement('form', { action: '#', id: 'formCheckout' });
    
        //Datos del comprador
        const tituloChekout = document.createElement('h2', {}, 'Checkout');
        // nombre
        const nombreFormDiv = document.createElement('div');
        const nombreFormLabel = document.createElement('label', { for: 'nombre' }, 'Nombre: ');
        const nombreForminput = document.createElement('input', { id: 'nombre', type: 'text', name: 'nombre' });
        nombreFormDiv.append(nombreFormLabel);
        nombreFormLabel.append(nombreForminput);
    
        // teléfono
        const telefonoFormDiv = document.createElement('div');
        const telefonoFormLabel = document.createElement('label', { for: 'telefono' }, 'Teléfono: ');
        const telefonoForminput = document.createElement('input', { id: 'telefono', type: 'text', name: 'telefono' });
        telefonoFormDiv.append(telefonoFormLabel);
        telefonoFormLabel.append(telefonoForminput);
    
        // email
        const emailFormDiv = document.createElement('div');
        const emailFormLabel = document.createElement('label', { for: 'email' }, 'Email: ');
        const emailForminput = document.createElement('input', { id: 'email', type: 'email', name: 'email' });
        emailFormDiv.append(emailFormLabel);
        emailFormLabel.append(emailForminput);
    
        // lugar
        const lugarFormDiv = document.createElement('div');
    
        const provinciaFormDiv = document.createElement('div');
        const provinciaFormLabel = document.createElement('label', { for: 'provincia' }, 'Provincia: ');
        const provinciaFormSelect = document.createElement('select', { id: 'provincia', name: 'provincia' });
        for (const provincia of provincias) {
            const provinciaFormOption = document.createElement('option', { value: provincia }, provincia)
            provinciaFormSelect.append(provinciaFormOption);
        }
    
        provinciaFormDiv.append(provinciaFormLabel, provinciaFormSelect);
    
        const direccionFormDiv = document.createElement('div');
        const direccionFormLabel = document.createElement('label', { for: 'direccion' }, 'Direccion: ');
        const direccionForminput = document.createElement('input', { id: 'direccion', type: 'text', name: 'direccion' });
        direccionFormDiv.append(direccionFormLabel);
        direccionFormLabel.append(direccionForminput);
        lugarFormDiv.append(provinciaFormDiv, direccionFormDiv)
    
        // fecha
        const fechaFormDiv = document.createElement('div');
        const fechaFormLabel = document.createElement('label', { for: 'fecha' }, 'Fecha de entrega: ');
        const fechaForminput = document.createElement('input', { id: 'fecha', type: 'date', name: 'fecha' });
        fechaFormDiv.append(fechaFormLabel);
        fechaFormLabel.append(fechaForminput);
    
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        const tomorrowString = `${yyyy}-${mm}-${dd}`;
    
        fechaForminput.min = tomorrowString;
        fechaForminput.value = tomorrowString;
    
        // metodo de pago 
        const pagoFormDiv = document.createElement('div');
        const pagoFormTitulo = document.createElement('h3', {}, 'Elija su medio de pago');
    
        const pagoFormGroupDiv =document.createElement('div');
        const pagoFormLabelEfectivo = document.createElement('label', {}, 'Efectivo ');
        const pagoFormRadioEfectivo = document.createElement('input', { type: 'radio', name: 'medioDePago', id: 'mpefectivo', value: 'mpefectivo', checked: 'checked' });
        const pagoFormLabelTrans = document.createElement('label', {}, 'Transferencia ');
        const pagoFormRadioTrans = document.createElement('input', { type: 'radio', name: 'medioDePago', id: 'mptrans', value: 'mptrans' });
        pagoFormLabelEfectivo.append(pagoFormRadioEfectivo);
        pagoFormLabelTrans.append(pagoFormRadioTrans);
    
        pagoFormGroupDiv.append(pagoFormLabelEfectivo, pagoFormLabelTrans);
    
        pagoFormDiv.append(pagoFormTitulo, pagoFormGroupDiv)
    
    
    
        //Footer para cerrar o confirmar pago
        const formcheckoutModal = document.createElement('form');
        formcheckoutModal.method = 'dialog';
    
        const footerCheckout = document.createElement('div');
        const btnCerrarCheckout = document.createElement('button');
        btnCerrarCheckout.textContent = 'Cerrar';
    
        const btnConfirmarCheckout = document.createElement('button', { type: "submit" }, 'Confirmar Pago');
    
        footerCheckout.append(formcheckoutModal)
        formcheckoutModal.append(btnCerrarCheckout);
    
        formCheckout.append(tituloChekout, nombreFormDiv, telefonoFormDiv, emailFormDiv, lugarFormDiv, fechaFormDiv, pagoFormDiv, footerCheckout, btnConfirmarCheckout);
        checkoutModal.append(formCheckout);
    
        const nombreErrorForm = document.createElement('small');
        const telefonoErrorForm = document.createElement('small');
        const emailErrorForm = document.createElement('small');
        const direccionErrorForm = document.createElement('small');
    
        formCheckout.addEventListener('submit', (e) => {
            e.preventDefault();
    
    
            const data = new FormData(e.currentTarget);
    
           
    
            //nombre
            document.querySelector('#nombre').addEventListener('input', (e) => {
                const campo = e.currentTarget;
    
                if (campo.value.length >= 1) {
                    formCheckout.nombre.removeAttribute('data-invalid');
                    nombreErrorForm.textContent = '';
                }
            })
    
            if (data.get('nombre') == '') {
                formCheckout.nombre.setAttribute('data-invalid', 'true');
                nombreErrorForm.textContent = 'Se requiere indicar su nombre';
                nombreFormDiv.append(nombreErrorForm);
            } else {
                formCheckout.nombre.removeAttribute('data-invalid');
                nombreErrorForm.textContent = '';
            }
    
            //telefono
            document.querySelector('#telefono').addEventListener('input', (e) => {
                const campo = e.currentTarget;
    
                if (campo.value.length >= 6) {
                    formCheckout.telefono.removeAttribute('data-invalid');
                    telefonoErrorForm.textContent = '';
                }
            })
    
            if (data.get('telefono') == '' || data.get('telefono').length > 13) {
                formCheckout.telefono.setAttribute('data-invalid', 'true');
                telefonoErrorForm.textContent = 'El teléfono es invalido';
                telefonoFormDiv.append(telefonoErrorForm);
            } else {
                formCheckout.telefono.removeAttribute('data-invalid');
                telefonoErrorForm.textContent = '';
            }
    
            //emails
            document.querySelector('#email').addEventListener('input', (e) => {
                const campo = e.currentTarget;
    
                if (campo.value.includes('@')) {
                    formCheckout.email.removeAttribute('data-invalid');
                    emailErrorForm.textContent = '';
                }
            })
    
            if (!data.get('email').includes('@')) {
                formCheckout.email.setAttribute('data-invalid', 'true');
                emailErrorForm.textContent = 'El email es invalido';
                emailFormDiv.append(emailErrorForm);
            } else {
                formCheckout.email.removeAttribute('data-invalid');
                emailErrorForm.textContent = '';
            }
    
            //direccion
            document.querySelector('#direccion').addEventListener('input', (e) => {
                const campo = e.currentTarget;
    
                if (campo.value.length >= 1) {
                    formCheckout.direccion.removeAttribute('data-invalid');
                    direccionErrorForm.textContent = '';
                }
            })
    
            if (data.get('direccion') == '') {
                formCheckout.direccion.setAttribute('data-invalid', 'true');
                direccionErrorForm.textContent = 'Se requiere indicar su direccion';
                direccionFormDiv.append(direccionErrorForm);
            } else {
                formCheckout.direccion.removeAttribute('data-invalid');
                direccionErrorForm.textContent = '';
            }
    
    
            if (!data.get('nombre') == '' && !(data.get('telefono') == '' || data.get('telefono').length > 13) && data.get('email').includes('@') && !data.get('direccion') == '') {
                checkoutModal.remove()
                gracias()
                eliminarCarrito();
            }
    
        });
    
    }
    
}

function agregarAlCarrito(producto) {
    carrito.agregarProducto(producto);
   
}
// INICIAR CARRITO------------------------------------------------------------------------------------------------------

const carrito = new Carrito();
document.addEventListener('DOMContentLoaded', () => carrito.actualizarCarrito());

// Evento para mostrar carrito
document.querySelector('.mostrarCarritoBtn').addEventListener('click', () => carrito.mostrarCarrito());

