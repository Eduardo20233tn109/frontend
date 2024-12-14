describe('Pruebas de Usuarios', () => {
    let usuarioId; // Variable para almacenar el ID del usuario
  
    before(() => {
        // Registrar un usuario antes de todas las pruebas
        const nuevoUsuario = {
            nombre: "Juan",
            apellidos: "Pérez",
            correoElectronico: `juan.perez${Date.now()}@example.com`,
            telefono: `1234567890`,
            contrasena: "password123",
            rol: "ADMIN",
            status: true
        };
  
        cy.request('POST', '/api/usuarios/registrar', nuevoUsuario)
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('usuario');
                usuarioId = response.body.usuario.id;
                cy.wrap(usuarioId).should('exist');
            });
    });
  
    it('Debe obtener la lista de usuarios', () => {
        cy.request('GET', '/api/usuarios/lista-usuarios')
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('array');
                expect(response.body.some(user => user.id === usuarioId)).to.be.true;
            });
    });
  
    it('Debe consultar un usuario por ID', () => {
        cy.request('GET', `/api/usuarios/${usuarioId}`)
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('id', usuarioId);
                expect(response.body).to.have.property('nombre', "Juan");
                expect(response.body).to.have.property('apellidos', "Pérez");
            });
    });
  
    it('Debe actualizar un usuario', () => {
        const usuarioActualizado = {
            nombre: "Juan Carlos",
            apellidos: "Pérez López",
            correoElectronico: `actualizado${Date.now()}@example.com`,
            telefono: "0987654321",
            contrasena: "newpassword456",
            rol: "USER",
            status: false
        };
  
        cy.request('PUT', `/api/usuarios/editar/${usuarioId}`, usuarioActualizado)
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('usuario');
                expect(response.body.usuario).to.have.property('nombre', usuarioActualizado.nombre);
                expect(response.body.usuario).to.have.property('apellidos', usuarioActualizado.apellidos);
                expect(response.body.usuario).to.have.property('status', usuarioActualizado.status);
            });
    });
  
    it('Debe cambiar el estado de un usuario', () => {
        cy.request('PATCH', `/api/usuarios/${usuarioId}/estado?estado=true`)
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('mensaje', 'Estado del usuario actualizado correctamente.');
  
                // Verificar que el estado se actualizó
                cy.request('GET', `/api/usuarios/${usuarioId}`)
                    .then((getResponse) => {
                        expect(getResponse.status).to.eq(200);
                        expect(getResponse.body).to.have.property('status', true);
                    });
            });
    });

  });