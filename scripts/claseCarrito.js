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

    vaciarCarrito() {
        this.carrito = [];
        console.log('El carrito ha sido vaciado');
        this.actualizarCarrito();
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

        const carNom = document.createElement('h3');
        carNom.classList.add("tituloCarrito")
        carNom.textContent = `Mi carrito`;
        carritoModal.appendChild(carNom);

        const contenedorModal = document.createElement('div');
        carritoModal.classList.add("modal-div");
        carritoModal.appendChild(contenedorModal);

        contenedorModal.innerHTML = "";

        if (carrito.carrito.length === 0) {


            const msjNoCompra = document.createElement('div');
            msjNoCompra.classList.add('msjCarrito');
            contenedorModal.appendChild(msjNoCompra);
            const carritoNoCompra = document.createElement('h4');
            carritoNoCompra.textContent = 'Carrito Vacio';
            msjNoCompra.appendChild(carritoNoCompra);

            const vacioImg = document.createElement('img')
            vacioImg.src = 'img/carrito-vacio.png';
            vacioImg.alt = 'carrito vacio';
            vacioImg.classList.add('vacio-img');

            msjNoCompra.appendChild(vacioImg);



            console.log("cerrado")



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
                contenedorBotones.append(botonResta, cantidad, botonSumar);


                productoElement.append(imagen, nombreProducto, precio, contenedorBotones, totalProducto, botonEliminar);


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
        cerrarFooter.textContent = 'Cerrar';
        totalCar.appendChild(totalProdu);
        totalCar.appendChild(totalTex);


        carritoModal.appendChild(totalCar);
        const btnContainer = document.createElement('div');
        btnContainer.classList.add('btn-container');
        carritoModal.appendChild(btnContainer);
        btnContainer.append(cerrarFooter, seguirCompra, finalCompra);


        cerrarFooter.addEventListener('click', () => carritoModal.close());


        finalCompra.addEventListener('click', () => {


            if (carrito.carrito.length === 0) {

                carritoModal.remove();


                const carVacio = document.createElement('dialog');
                carVacio.classList.add('modal-vacio');
                document.body.prepend(carVacio);
                carVacio.showModal();

                carVacio.addEventListener('close', () => carVacio.remove());

                const msjNoCompra = document.createElement('div');
                msjNoCompra.classList.add('msjCarrito');
                carVacio.appendChild(msjNoCompra);

                const carritoNoCompra = document.createElement('p');
                carritoNoCompra.textContent = 'Carrito Vacio. Debe cargar producto';
                msjNoCompra.appendChild(carritoNoCompra);

                const vacioImg = document.createElement('img');
                vacioImg.src = 'img/carrito-vacio.png';
                vacioImg.alt = 'carrito vacio';
                vacioImg.classList.add('vacio-img');

                msjNoCompra.appendChild(vacioImg);


                const comprarMas = document.createElement('button');
                comprarMas.classList.add('btn-checkout');
                const iconoCarrito = document.createElement('i');
                iconoCarrito.classList.add('fas', 'fa-shopping-cart');
                comprarMas.prepend(iconoCarrito);
                comprarMas.append(' Catalogo');
                msjNoCompra.appendChild(comprarMas);


                comprarMas.addEventListener('click', () => {
                    carVacio.remove();
                });

                console.log("Modal cerrado - Carrito vacío");

            } else {

                carritoModal.close();
                this.checkout();
            }



        });

        seguirCompra.addEventListener('click', () =>
            carritoModal.close());

        carritoModal.addEventListener('click', (e) => {
            if (e.target === carritoModal) {
                carritoModal.close();
                document.body.removeChild(carritoModal);
            }
        });



    }



    checkout() {
        console.log("pago");



        const provincias = [
            'Buenos Aires', 'Ciudad Autónoma de Buenos Aires', 'Córdoba', 'Entre Ríos'];

        const checkoutModal = document.createElement('dialog');
        checkoutModal.classList.add('modal-checkout');
        document.body.prepend(checkoutModal);
        checkoutModal.showModal();
        checkoutModal.addEventListener('close', () => checkoutModal.remove());

        const carritoTotal =document.createElement('div');
        carritoTotal.classList.add('carrito-car');
        checkoutModal.appendChild(carritoTotal);
        const peTotal = document.createElement('p');
        const totalC = carrito.obtenerTotal().toFixed(2);
        peTotal.textContent = `Total carrito: $ ${totalC}`;
        carritoTotal.appendChild(peTotal);




        const formCheckout = document.createElement('form');
        formCheckout.action = '#';
        formCheckout.method = 'POST';
        formCheckout.id = 'formCheckout';

        const tituloChekout = document.createElement('h2');
        tituloChekout.textContent = 'Checkout';

        // nombre
        const nombreFormDiv = document.createElement('div');
        const nombreFormLabel = document.createElement('label');
        //etiqueta label
        nombreFormLabel.setAttribute('for', 'nombre');
        nombreFormLabel.textContent = 'Nombre: ';
        //campo input
        const nombreFormInput = document.createElement('input');
        nombreFormInput.setAttribute('id', 'nombre');
        nombreFormInput.setAttribute('type', 'text');
        nombreFormInput.setAttribute('name', 'nombre');

        nombreFormDiv.appendChild(nombreFormLabel);
        nombreFormLabel.appendChild(nombreFormInput);
        console.log("nombre");

        const apellidoFormDiv = document.createElement('div');
        const apellidoFormLabel = document.createElement('label');
        apellidoFormLabel.setAttribute('for', 'apellido');
        apellidoFormLabel.textContent = 'Apellido: ';

        const apellidoFormInput = document.createElement('input');
        apellidoFormInput.setAttribute('id', 'apellido');
        apellidoFormInput.setAttribute('type', 'text');
        apellidoFormInput.setAttribute('name', 'apellido');

        apellidoFormDiv.appendChild(apellidoFormLabel);
        apellidoFormDiv.appendChild(apellidoFormInput);


        console.log("apellido");


        // teléfono
        const telefonoFormDiv = document.createElement('div');
        const telefonoFormLabel = document.createElement('label');
        telefonoFormLabel.setAttribute('for', 'telefono');
        telefonoFormLabel.textContent = 'Teléfono: ';

        const telefonoFormInput = document.createElement('input');
        telefonoFormInput.setAttribute('id', 'telefono');
        telefonoFormInput.setAttribute('type', 'text');
        telefonoFormInput.setAttribute('name', 'telefono');

        telefonoFormDiv.appendChild(telefonoFormLabel);
        telefonoFormLabel.appendChild(telefonoFormInput);

        console.log("tel");

        // email
        const emailFormDiv = document.createElement('div');
        const emailFormLabel = document.createElement('label');
        emailFormLabel.setAttribute('for', 'email');
        emailFormLabel.textContent = 'Email: ';

        const emailFormInput = document.createElement('input');
        emailFormInput.setAttribute('id', 'email');
        emailFormInput.setAttribute('type', 'email');
        emailFormInput.setAttribute('name', 'email');

        emailFormDiv.appendChild(emailFormLabel);
        emailFormLabel.appendChild(emailFormInput);
        console.log("email");

        // lugar
        const lugarFormDiv = document.createElement('div');

        // provincia
        const provinciaFormDiv = document.createElement('div');
        const provinciaFormLabel = document.createElement('label');
        provinciaFormLabel.setAttribute('for', 'provincia');
        provinciaFormLabel.textContent = 'Provincia: ';

        const provinciaFormSelect = document.createElement('select');
        provinciaFormSelect.setAttribute('id', 'provincia');
        provinciaFormSelect.setAttribute('name', 'provincia');

        for (const provincia of provincias) {
            const provinciaFormOption = document.createElement('option');
            provinciaFormOption.setAttribute('value', provincia);
            provinciaFormOption.textContent = provincia;
            provinciaFormSelect.appendChild(provinciaFormOption);
        }

        provinciaFormDiv.appendChild(provinciaFormLabel);
        provinciaFormDiv.appendChild(provinciaFormSelect);

        // direccion
        const direccionFormDiv = document.createElement('div');
        const direccionFormLabel = document.createElement('label');
        direccionFormLabel.setAttribute('for', 'direccion');
        direccionFormLabel.textContent = 'Direccion: ';

        const direccionFormInput = document.createElement('input');
        direccionFormInput.setAttribute('id', 'direccion');
        direccionFormInput.setAttribute('type', 'text');
        direccionFormInput.setAttribute('name', 'direccion');

        direccionFormDiv.appendChild(direccionFormLabel);
        direccionFormLabel.appendChild(direccionFormInput);

        console.log("dire");

        lugarFormDiv.appendChild(provinciaFormDiv);
        lugarFormDiv.appendChild(direccionFormDiv);

        // fecha
        const fechaFormDiv = document.createElement('div');
        const fechaFormLabel = document.createElement('label');
        fechaFormLabel.setAttribute('for', 'fecha');
        fechaFormLabel.textContent = 'Fecha de entrega: ';

        const fechaFormInput = document.createElement('input');
        fechaFormInput.setAttribute('id', 'fecha');
        fechaFormInput.setAttribute('type', 'date');
        fechaFormInput.setAttribute('name', 'fecha');

        fechaFormDiv.appendChild(fechaFormLabel);
        fechaFormLabel.appendChild(fechaFormInput);


        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        const tomorrowString = `${yyyy}-${mm}-${dd}`;
        fechaFormInput.setAttribute('value', tomorrowString);

        //-------------------------------
        const pagoFormDiv = document.createElement('div');
        const pagoFormTitulo = document.createElement('h3');
        pagoFormTitulo.textContent = 'Elija su medio de pago';

        const pagoFormGroupDiv = document.createElement('div');

        // Efectivo/transferencia
        const pagoFormLabelEfectivo = document.createElement('label');
        pagoFormLabelEfectivo.textContent = 'Efectivo/Transferencia ';

        const pagoFormRadioEfectivo = document.createElement('input');
        pagoFormRadioEfectivo.setAttribute('type', 'radio');
        pagoFormRadioEfectivo.setAttribute('name', 'medioDePago');
        pagoFormRadioEfectivo.setAttribute('id', 'mpefectivo');
        pagoFormRadioEfectivo.setAttribute('value', 'mpefectivo');
        pagoFormRadioEfectivo.setAttribute('checked', 'checked');

        // Tarjeta
        const pagoFormLabelTarj = document.createElement('label');
        pagoFormLabelTarj.textContent = 'Tarjeta de credito ';

        const pagoFormRadioTarj = document.createElement('input');
        pagoFormRadioTarj.setAttribute('type', 'radio');
        pagoFormRadioTarj.setAttribute('name', 'medioDePago');
        pagoFormRadioTarj.setAttribute('id', 'mptrans');
        pagoFormRadioTarj.setAttribute('value', 'mptrans');

        // Cuotas section
        const cuotasFormDiv = document.createElement('div');
        const cuotasFormLabel = document.createElement('label');
        cuotasFormLabel.setAttribute('for', 'cuotas');
        cuotasFormLabel.textContent = 'Cantidad de cuotas: ';

        const cuotasFormSelect = document.createElement('select');
        cuotasFormSelect.setAttribute('id', 'cuotas');
        cuotasFormSelect.setAttribute('name', 'cuotas');

        // Numero Tarjeta
        const tarjFormDiv = document.createElement('div');
        const tarjFormLabel = document.createElement('label');
        tarjFormLabel.setAttribute('for', 'tarjeta');
        tarjFormLabel.textContent = 'Tarjeta: ';

        const tarjFormInput = document.createElement('input');
        tarjFormInput.setAttribute('id', 'tarjeta');
        tarjFormInput.setAttribute('type', 'text');
        tarjFormInput.setAttribute('name', 'tarjeta');

        // cuotas 
        const cuotasOptions = [1, 3, 6, 12];
        cuotasOptions.forEach(cuota => {
            const option = document.createElement('option');
            option.setAttribute('value', cuota);
            option.textContent = `${cuota} cuotas`;
            cuotasFormSelect.appendChild(option);
        });


        pagoFormRadioTarj.addEventListener('change', () => {
            if (pagoFormRadioTarj.checked) {
                console.log('tarjeta');
                cuotasFormDiv.style.display = 'block';
                tarjFormDiv.style.display = 'block';

            }
        });


        pagoFormRadioEfectivo.addEventListener('change', () => {
            if (pagoFormRadioEfectivo.checked) {
                console.log('efectivo');
                cuotasFormDiv.style.display = 'none';
                tarjFormDiv.style.display = 'none';
            }
        });

        cuotasFormSelect.addEventListener('change', () => {


            if (pagoFormRadioTarj.checked) {
                const cuotas = parseInt(cuotasFormSelect.value, 10);
                const total = carrito.obtenerTotal();
                const totalPorCuota = total / cuotas;
                console.log(`Total por cuota: ${totalPorCuota}`);
                totCuota.textContent = `Total por cuota: ${totalPorCuota.toFixed(2)}`;
            }
        });

        const divCuota = document.createElement('div');
        divCuota.classList.add('tot-cuota');
        const totCuota = document.createElement('p');
        divCuota.appendChild(totCuota);

        const divTotal = document.createElement('div');
        divTotal.classList.add('tot-cuota');
        const pTotal = document.createElement('p');
        const total = carrito.obtenerTotal();
        totCuota.textContent = `Total carrito: ${total}`;
        divTotal.appendChild(pTotal);


        cuotasFormDiv.append(cuotasFormLabel, cuotasFormSelect, divCuota);

        tarjFormDiv.append(tarjFormLabel, tarjFormInput);


        pagoFormGroupDiv.append(pagoFormLabelEfectivo, pagoFormRadioEfectivo, pagoFormLabelTarj, pagoFormRadioTarj);



        cuotasFormDiv.style.display = 'none';
        tarjFormDiv.style.display = 'none';

        pagoFormDiv.append(pagoFormTitulo, pagoFormGroupDiv, cuotasFormDiv, tarjFormDiv);



        document.body.appendChild(pagoFormDiv);

        //--------------------------------------


        const btnConfirmarCheckout = document.createElement('button');
        btnConfirmarCheckout.setAttribute('type', 'submit');
        btnConfirmarCheckout.textContent = 'Confirmar Pago';
        btnConfirmarCheckout.classList.add('btn-checkout');

        const continuarFooter = document.createElement('button');
        continuarFooter.classList.add('btn-checkout');
        const iconoCarrito = document.createElement('i');
        iconoCarrito.classList.add('fas', 'fa-shopping-cart');
        continuarFooter.prepend(iconoCarrito);
        continuarFooter.append(' continuar comprando');

        const btnCerrarCheckout = document.createElement('button');
        btnCerrarCheckout.classList.add('btn-checkout');
        btnCerrarCheckout.append('cerrar');


        formCheckout.append(tituloChekout, nombreFormDiv, apellidoFormDiv, telefonoFormDiv, emailFormDiv, lugarFormDiv,
            fechaFormDiv, pagoFormDiv, btnConfirmarCheckout, cuotasFormDiv, btnConfirmarCheckout, continuarFooter, btnCerrarCheckout);

        checkoutModal.append(formCheckout);

        continuarFooter.addEventListener('click', () => {

            checkoutModal.remove();
        });

        btnCerrarCheckout.addEventListener('click', () => {

            checkoutModal.remove();
        });

        // --- Agregar eventos de validación
        const nombreErrorForm = document.createElement('small');
        const apellidoErrorForm = document.createElement('small');
        const telefonoErrorForm = document.createElement('small');
        const emailErrorForm = document.createElement('small');
        const direccionErrorForm = document.createElement('small');
        
      
        // Prevenir el envío del formulario
        formCheckout.addEventListener('submit', (e) => {
            e.preventDefault();

            let validacion = true; 

            // Validación de nombre
            //selecciono el nombre
            //valido con las condiciones, msj de error
            //verifico no repetir msj de error
            //validacion si dan falsas no pasa

            const nombre = document.querySelector('#nombre');
            if (nombre.value === '' || !isNaN(nombre.value)) {
                formCheckout.nombre.setAttribute('data-invalid', 'true');
                nombreErrorForm.textContent = nombre.value === '' ? 'Completar con su nombre' : 'El nombre no puede ser un número';
                if (!nombreFormDiv.contains(nombreErrorForm)) {
                    nombreFormDiv.append(nombreErrorForm);
                }
                validacion = false;
            } else {
                formCheckout.nombre.removeAttribute('data-invalid');
                nombreErrorForm.textContent = '';
            }

            const apellido = document.querySelector('#apellido');
            if (apellido.value === '' || !isNaN(apellido.value)) {
                apellido.setAttribute('data-invalid', 'true');
                apellidoErrorForm.textContent = apellido.value === '' ? 'Completar con su apellido' : 'El apellido no puede ser un número';
                if (!apellidoFormDiv.contains(apellidoErrorForm)) {
                    apellidoFormDiv.appendChild(apellidoErrorForm);
                }
                validacion = false;
            } else {
                apellido.removeAttribute('data-invalid');
                apellidoErrorForm.textContent = '';
            }

            // Validación de teléfono
            const telefono = document.querySelector('#telefono');
            if (telefono.value === '' || telefono.value.length < 6 || telefono.value.length > 13) {
                formCheckout.telefono.setAttribute('data-invalid', 'true');
                telefonoErrorForm.textContent = 'El teléfono es inválido';
                if (!telefonoFormDiv.contains(telefonoErrorForm)) {
                    telefonoFormDiv.append(telefonoErrorForm);
                }
                validacion = false;
            } else {
                formCheckout.telefono.removeAttribute('data-invalid');
                telefonoErrorForm.textContent = '';
            }

            // Validación de email
            const email = document.querySelector('#email');
            if (!email.value.includes('@')) {
                formCheckout.email.setAttribute('data-invalid', 'true');
                emailErrorForm.textContent = 'El email es inválido o vacio';
                if (!emailFormDiv.contains(emailErrorForm)) {
                    emailFormDiv.append(emailErrorForm);
                }
                validacion = false;
            } else {
                formCheckout.email.removeAttribute('data-invalid');
                emailErrorForm.textContent = '';
            }

            // Validación de dirección
            const direccion = document.querySelector('#direccion');
            if (direccion.value === '') {
                formCheckout.direccion.setAttribute('data-invalid', 'true');
                direccionErrorForm.textContent = 'Completar con su dirección';
                if (!direccionFormDiv.contains(direccionErrorForm)) {
                    direccionFormDiv.append(direccionErrorForm);
                }
                validacion = false;
            } else {
                formCheckout.direccion.removeAttribute('data-invalid');
                direccionErrorForm.textContent = '';
            }
           
            // Si todo es válido, proceder con el checkout
            if (validacion) {
                checkoutModal.remove();
                gracias();
                this.vaciarCarrito();
            }
        });

    }


   

}
function gracias() {

    const graciasModal = document.createElement('dialog');
    graciasModal.classList.add('modal-vacio');
    document.body.prepend(graciasModal);
    graciasModal.showModal();
    graciasModal.addEventListener('close', () => graciasModal.remove());

    const graciasMensajeTitulo = document.createElement('h3');
    graciasMensajeTitulo.textContent = '¡Gracias por tu compra!'

    const vacioImg = document.createElement('img')
    vacioImg.src = 'img/envio.png';
    vacioImg.alt = 'carrito vacio';
    vacioImg.classList.add('vacio-img');

    const graciasMensajeTexto1 = document.createElement('p');
    graciasMensajeTexto1.textContent = 'Tu pedido está siendo procesado y pronto estará en camino.';


    graciasModal.append(graciasMensajeTitulo, graciasMensajeTexto1, vacioImg);

    setTimeout(() => {
        graciasModal.remove();
    }, 3000);
}

function agregarAlCarrito(producto) {
    carrito.agregarProducto(producto);

}
// INICIAR CARRITO------------------------------------------------------------------------------------------------------

const carrito = new Carrito();
document.addEventListener('DOMContentLoaded', () => carrito.actualizarCarrito());

// Evento para mostrar carrito


document.querySelector('.otroBoton').addEventListener('click', () => carrito.modalCarrito());

