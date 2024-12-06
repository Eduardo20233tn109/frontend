document.getElementById("registroForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevenir el envío tradicional del formulario

    // Obtener los valores del formulario
    const nombre = document.getElementById("nombre").value;
    const apellidos = document.getElementById("apellidos").value;
    const correoElectronico = document.getElementById("correoElectronico").value;
    const telefono = document.getElementById("telefono").value;
    const contrasena = document.getElementById("contrasena").value;
    const rol = document.getElementById("rol").value;
    const status = document.getElementById("status").value;

    // Crear el objeto con los datos a enviar
    const nuevoUsuario = {
        nombre: nombre,
        apellidos: apellidos,
        correoElectronico: correoElectronico,
        telefono: telefono,
        contrasena: contrasena,
        rol: rol,
        status: status
    };

    // Hacer la solicitud POST usando Fetch
    fetch("http://localhost:8080/api/usuarios/registrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoUsuario) // Convertir el objeto a JSON
    })
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            if (data === "Usuario registrado correctamente") {
                document.getElementById("respuesta").innerHTML = "<p>Registro exitoso.</p>";
            } else {
                document.getElementById("respuesta").innerHTML = "<p>" + data + "</p>"; // Mostrar mensaje de error
            }
        })
        .catch(error => {
            document.getElementById("respuesta").innerHTML = "<p>Error al registrar usuario.</p>";
            console.error('Error:', error);
        });
});
