// script.js

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevenir el envío tradicional del formulario

    // Obtener los valores del formulario
    const correoElectronico = document.getElementById("correoElectronico").value;
    const contrasena = document.getElementById("contrasena").value;

    // Crear el objeto con los datos a enviar
    const loginData = {
        correoElectronico: correoElectronico,
        contrasena: contrasena
    };

    // Hacer la solicitud POST usando Fetch
    fetch("http://localhost:8080/api/usuarios/iniciar-sesion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData) // Convertir el objeto a JSON
    })
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            if (data === "Sesión iniciada correctamente") {
                document.getElementById("respuesta").innerHTML = "<p>Inicio de sesión exitoso.</p>";
            } else {
                document.getElementById("respuesta").innerHTML = "<p>" + data + "</p>"; // Mostrar mensaje de error
            }
        })
        .catch(error => {
            document.getElementById("respuesta").innerHTML = "<p>Error al intentar iniciar sesión.</p>";
            console.error('Error:', error);
        });
});
