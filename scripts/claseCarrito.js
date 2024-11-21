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
        this.mostrarAlerta("Producto agregado al carrito");
    }
    
    mostrarAlerta(mensaje) {
      
        const alerta = document.createElement('div');
        alerta.classList.add('alert', 'alert-success', 'alert-dismissible', 'fade', 'show');
        alerta.role = 'alert';
        alerta.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
    
      
        const contenedorAlertas = document.getElementById('alertas');
        contenedorAlertas.appendChild(alerta);
    
        // Eliminar la alerta después de 5 segundos
        setTimeout(() => {
            alerta.remove();
        }, 5000);
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

        mostrarCarrito(); 
    }

    vaciarCarrito() {
        this.carrito = []; 
        this.actualizarCarrito(); 
    }
}


// INICIAR CARRITO------------------------------------------------------------------------------------------------------

const carrito = new Carrito();

document.addEventListener('DOMContentLoaded', () => {
    carrito.actualizarCarrito(); 
});



// EVENTO MOSTRAR CARRITO
const botonMostrarCarrito = document.querySelector('.mostrarCarritoBtn');
botonMostrarCarrito.addEventListener('click', mostrarCarrito);
