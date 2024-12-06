document.addEventListener("DOMContentLoaded", () => {
    const registroForm = document.getElementById("registroForm");
    const mensajeResultado = document.getElementById("mensajeResultado");
    const resultadosBody = document.getElementById("resultados");
    let usuarioIdEditando = null; // Variable para almacenar el ID del usuario a editar

    // Función para cargar usuarios desde la API
    function cargarUsuarios() {
        fetch("http://localhost:8080/api/usuarios/lista-usuarios") // Endpoint para listar usuarios
            .then(verificarRespuesta)
            .then((usuarios) => {
                resultadosBody.innerHTML = ""; // Limpia la tabla antes de agregar filas

                // Agregar cada usuario como una fila en la tabla
                usuarios.forEach((usuario) => {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${usuario.id}</td>
                        <td>${usuario.nombre} ${usuario.apellidos}</td>
                        <td>${usuario.correoElectronico}</td>
                        <td>${usuario.telefono}</td>
                        <td>${usuario.rol}</td>
                        <td>${usuario.status ? "Activo" : "Inactivo"}</td>
                        <td>
                            <button class="btn btn-warning btn-sm editar-btn" data-id="${usuario.id}" data-bs-toggle="modal" data-bs-target="#registrarModal">Editar</button>
                            <button class="btn btn-secondary btn-sm estado-btn" data-id="${usuario.id}" data-estado="${!usuario.status}">
                                ${usuario.status ? "Desactivar" : "Activar"}
                            </button>
                        </td>
                    `;
                    resultadosBody.appendChild(fila);

                    // Asociar eventos a los botones
                    fila.querySelector(".editar-btn").addEventListener("click", () => {
                        cargarDatosUsuario(usuario.id);
                    });
                    fila.querySelector(".estado-btn").addEventListener("click", (event) => {
                        const estado = event.target.getAttribute("data-estado") === "true";
                        cambiarEstadoUsuario(usuario.id, estado);
                    });
                });
            })
            .catch((error) => mostrarMensaje("Error al cargar usuarios.", "danger"));
    }

    // Función para cargar datos de un usuario por ID
    function cargarDatosUsuario(id) {
        fetch(`http://localhost:8080/api/usuarios/${id}`) // Endpoint para obtener un usuario por ID
            .then(verificarRespuesta)
            .then((usuario) => {
                // Precargar los datos en el formulario
                document.getElementById("nombre").value = usuario.nombre;
                document.getElementById("apellidos").value = usuario.apellidos;
                document.getElementById("correoElectronico").value = usuario.correoElectronico;
                document.getElementById("telefono").value = usuario.telefono;
                document.getElementById("rol").value = usuario.rol;
                document.getElementById("status").checked = usuario.status;

                usuarioIdEditando = usuario.id; // Establecer el ID del usuario en edición
            })
            .catch((error) => mostrarMensaje("Error al cargar los datos del usuario.", "danger"));
    }

    // Manejo del registro o edición al enviar el formulario
    registroForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = {
            nombre: document.getElementById("nombre").value,
            apellidos: document.getElementById("apellidos").value,
            correoElectronico: document.getElementById("correoElectronico").value,
            telefono: document.getElementById("telefono").value,
            contrasena: document.getElementById("contrasena").value,
            rol: document.getElementById("rol").value,
            status: document.getElementById("status").checked,
        };

        const url = usuarioIdEditando
            ? `http://localhost:8080/api/usuarios/editar/${usuarioIdEditando}` // Endpoint para actualizar usuario
            : "http://localhost:8080/api/usuarios/registrar"; // Endpoint para registrar usuario
        const method = usuarioIdEditando ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(verificarRespuesta)
            .then(() => {
                mostrarMensaje(usuarioIdEditando ? "Usuario actualizado con éxito." : "Usuario registrado con éxito.", "success");

                // Limpiar el formulario y recargar usuarios
                registroForm.reset();
                usuarioIdEditando = null;
                cargarUsuarios();

                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById("registrarModal"));
                modal.hide();
            })
            .catch((error) => mostrarMensaje("Error al registrar/editar usuario.", "danger"));
    });

    // Función para cambiar el estado de un usuario
    function cambiarEstadoUsuario(id, estado) {
        fetch(`http://localhost:8080/api/usuarios/${id}/estado?estado=${estado}`, {
            method: "PATCH", // Endpoint para cambiar el estado del usuario
        })
            .then(verificarRespuesta)
            .then(() => {
                mostrarMensaje("Estado del usuario actualizado con éxito.", "success");
                cargarUsuarios(); // Recargar la lista de usuarios
            })
            .catch((error) => mostrarMensaje("Error al cambiar el estado del usuario.", "danger"));
    }

    // Función auxiliar para verificar respuestas
    function verificarRespuesta(response) {
        if (!response.ok) {
            return response.json().then((error) => {
                throw new Error(error.mensaje || "Error desconocido");
            });
        }
        return response.json();
    }

    // Función para mostrar mensajes de éxito o error
    function mostrarMensaje(mensaje, tipo) {
        mensajeResultado.classList.remove("d-none", "alert-success", "alert-danger");
        mensajeResultado.classList.add(`alert-${tipo}`);
        mensajeResultado.textContent = mensaje;
    }

    // Cargar usuarios al iniciar
    cargarUsuarios();
});
