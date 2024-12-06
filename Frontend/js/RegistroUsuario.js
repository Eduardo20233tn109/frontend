document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const correoElectronico = document.getElementById('correoElectronico').value;
    const telefono = document.getElementById('telefono').value;
    const contrasena = document.getElementById('contrasena').value;
    const rol = document.getElementById('rol').value;
    const status = document.getElementById('status').checked;  // Determina si está habilitado o no

    // Crear el objeto que se enviará en la solicitud POST
    const data = {
        nombre: nombre,
        apellidos: apellidos,
        correoElectronico: correoElectronico,
        telefono: telefono,
        contrasena: contrasena,
        rol: rol,
        status: status
    };

    // Limpiar el mensaje anterior
    const mensajeResultado = document.getElementById('mensajeResultado');
    mensajeResultado.style.display = "none"; // Ocultar mensaje anterior

    // Enviar la solicitud POST al servidor
    fetch('http://localhost:8080/api/usuarios/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Respuesta exitosa, procesamos la respuesta
            } else {
                throw new Error('Error al registrar el usuario');
            }
        })
        .then(data => {
            // Mostrar mensaje de éxito
            mensajeResultado.classList.remove('mensaje-error');
            mensajeResultado.classList.add('mensaje-exito');
            mensajeResultado.textContent = 'Usuario registrado exitosamente';
            mensajeResultado.style.display = "block"; // Mostrar mensaje
        })
        .catch((error) => {
            // Mostrar mensaje de error
            mensajeResultado.classList.remove('mensaje-exito');
            mensajeResultado.classList.add('mensaje-error');
            mensajeResultado.textContent = 'Error al registrar el usuario: ' + error.message;
            mensajeResultado.style.display = "block"; // Mostrar mensaje
        });
});