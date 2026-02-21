# Panadería - Sistema de Gestión de Ventas

![cashdeskapp](https://github.com/user-attachments/assets/488a7f0c-ece2-41cf-9d08-d098dabb6bc6)


Este proyecto es una aplicación web desarrollada con **React** y **Material UI** en el frontend y **Node.js** en el backend. Su objetivo es gestionar y controlar las ventas diarias de una panadería que opera en dos sucursales. La aplicación permite registrar los pagos de ventas y diferenciar entre distintos tipos de pagos. Además, proporciona funcionalidades avanzadas para administradores, como la gestión de usuarios y la generación de reportes en formato `.xls`.

## Funcionalidades

### 1. Gestión de Usuarios
- **Roles de usuario**: Existen dos tipos de roles: `Administrador` y `Vendedor`.
  - El **Administrador** puede:
    - Agregar, modificar y eliminar usuarios.
    - Asignar roles y permisos a los usuarios (Administrador o Vendedor).
    - Descargar reportes diarios en formato `.xls`.
  - El **Vendedor** puede:
    - Registrar pagos en la aplicación.

### 2. Registro de Pagos
- Los usuarios pueden registrar pagos en función de cuatro métodos:
  - **Efectivo**
  - **QR**
  - **Transferencia bancaria**
  - **Tarjeta**
- Cada pago está asociado a una **sucursal** y un **tipo de pago**.

### 3. Reportes Diarios
- Los administradores pueden generar y descargar **reportes diarios** en formato `.xls` con la siguiente información:
  - Tipos de pago (efectivo, QR, transferencia, tarjeta).
  - Sucursal donde se realizó la transacción.
  - Fecha de la transacción.
  - Total de ventas por día y por sucursal.

### 4. Sucursales
- La aplicación está diseñada para dos sucursales, y cada una puede ver sus **propias ventas diarias**.
  - Los **vendedores** solo pueden ver y gestionar las ventas de la sucursal a la que pertenecen.
  - Los **administradores** pueden visualizar y gestionar las ventas de ambas sucursales.

## Tecnologías Utilizadas

### Frontend
- **React**: Librería principal para la creación de la interfaz de usuario.
- **Material UI**: Utilizado para el diseño y la interfaz gráfica.
- **Axios**: Para la comunicación con el backend a través de peticiones HTTP.

### Backend
- **Node.js**: Entorno de ejecución para el backend.
- **Express**: Framework para la creación de la API REST.
- **SQLite**: Base de datos local embebida utilizada para almacenar usuarios, transacciones y ventas.
- **exceljs**: Librería utilizada para la generación de archivos `.xls` en los reportes.

## Ejecutar en modo desktop (Electron)

### 1) Instalar dependencias
```bash
npm install
```

Si también querés correr el backend de forma aislada:
```bash
npm install --prefix backend
```

### 2) Desarrollo desktop (frontend + backend + Electron)
```bash
npm run dev:electron
```

Este comando levanta:
- React en `http://localhost:3000`
- Backend embebido en Electron en `http://127.0.0.1:8080`
- Ventana Electron cargando el frontend

### 3) Build de instalador desktop
```bash
npm run dist
```

## Base de datos SQLite

- El backend crea automáticamente tablas `users` y `payments` al iniciar.
- En Electron, la DB se guarda en la carpeta de usuario de la app (`app.getPath('userData')/data/cashdesk.sqlite`).
- En modo backend standalone (sin Electron), la DB queda en `backend/data/cashdesk.sqlite`.


