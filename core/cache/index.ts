private let usuariosConectados={}
// Agregar usuario al caché
export function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: Secret,
): string;
  export function sing(data:object) {
    // Encriptar datos del usuario
    let datosEncriptados = datosUsuario

    usuariosConectados[] = datosEncriptados

    // Establecer temporizador para eliminar usuario del caché
    setTimeout(() => {
      delete this.usuariosConectados[datosEncriptados.id]
    }, 10000) // Tiempo en milisegundos antes de que se elimine el usuario (10 segundos en este caso)
  }

  // Obtener usuario del caché
  obtenerUsuario(idUsuario) {
    if (this.usuariosConectados[idUsuario])
      return this.usuariosConectados[idUsuario]
    else return false
  }

  obtenerTodosLosUsuarios() {
    return this.usuariosConectados
}
  
cache = new Cache()
cache.agregarUsuario({ id: 1, name: 'asd' })
setTimeout(() => {
  console.log(cache.obtenerUsuario(1))
}, 5000)
setTimeout(() => {
  console.log(cache.obtenerUsuario(1))
}, 10001)
