/*
  PROCESO DE INICIO A FIN:
  1. Recibir datos: El componente UsersTable recibe la lista de usuarios y funciones de paginación desde un 
  componente padre.
  2. Preparar la memoria (Estado): Usa variables internas para recordar qué fila se está editando, los datos
   temporales del formulario, y si se está guardando.
  3. Diseñar las columnas: Define cómo se verá cada columna de la tabla. Si una fila está en "modo edición",
   muestra campos de texto (<input>) y un selector (<select>). Si no, muestra texto normal.
  4. Construir la tabla: Pasa las columnas y los datos a "useReactTable", una herramienta que se encarga de la 
  lógica interna de la tabla.
  5. Dibujar en pantalla (Renderizar): Dibuja el HTML de la tabla fila por fila y los controles de paginación.
  6. Al guardar: Llama a la función "updateUser" para enviar los datos modificados al servidor web y
   actualiza la vista.
*/

// useMemo y useState son FUNCIONES NATIVAS DE REACT (llamadas Hooks).
// - useState: Le da memoria al componente para recordar información (como qué estamos editando ahora).
// - useMemo: Hace que React recuerde el resultado de una operación para que la tabla no se vuelva a recalcular 
// innecesariamente en cada ciclo.
import { useMemo, useState } from 'react';

// Estas son herramientas importadas de una librería externa llamada TanStack Table.
// Sirven para manejar toda la lógica compleja de una tabla (paginación, columnas, filas) sin hacerlo desde cero.
import {
    useReactTable, // Función principal (hook) que inicializa y crea la "mente" de la tabla.
    getCoreRowModel, // Función que calcula y genera las filas de datos reales a partir de los datos crudos.
    flexRender, // Función útil que convierte las definiciones de celdas y encabezados (código) en etiquetas HTML dibujables.
    type ColumnDef, // TypeScript: El "molde" que dicta cómo debemos estructurar la configuración de una columna.
    type PaginationState, // TypeScript: El "molde" que describe la información de paginación (página actual, datos por página).
    type OnChangeFn // TypeScript: El "molde" para la función que se ejecuta cuando la paginación cambia.
} from '@tanstack/react-table';

// Lucide-react es una librería de íconos. Traemos el Lápiz para editar, el Check para guardar y la X para cancelar.
import { Pencil, Check, X } from 'lucide-react';

// Importamos el "molde" o manual de cómo debe verse un Usuario (sus propiedades)
import type { User } from '../types';

// Importamos la función que permite hablar con el servidor para actualizar los datos de un usuario
import { updateUser } from '../api/updateUser';

// Importamos estilos CSS para que nuestra tabla se vea bonita y ordenada
import '../../products/components/ProductsTable.css';
import '../../products/components/Pagination.css';

// Esta interface es el "manual de instrucciones" de este componente.
// Le dice a TypeScript exactamente qué información DEBE recibir la tabla desde afuera para poder funcionar.
interface UsersTableProps {
    users: User[]; // La lista completa de usuarios a mostrar
    isLoading?: boolean; // Un verdadero/falso que indica si la información apenas está cargando
    pageCount: number; // La cantidad total de páginas que hay
    pagination: PaginationState; // En qué página estamos actualmente y cuántos datos por página
    onPaginationChange: OnChangeFn<PaginationState>; // Función que se ejecuta cuando cambiamos de página
    onUserUpdated?: () => void; // Función opcional para avisar al componente padre que un usuario fue editado
}

// Empezamos a definir nuestro componente. Desempaquetamos (destructuramos) las props que definimos en la interface.
export const UsersTable = ({
    users,
    isLoading,
    pageCount,
    pagination,
    onPaginationChange,
    onUserUpdated
}: UsersTableProps) => {

    // MEMORIA DEL COMPONENTE (Estados usando useState, función nativa de React)

    // 1. Guarda el ID de la fila (usuario) que se está editando en este momento. Inicia en null (nadie).
    const [editingRowId, setEditingRowId] = useState<number | string | null>(null);

    // 2. Guarda temporalmente lo que el usuario está escribiendo en las cajitas de texto mientras edita. Inicia vacío.
    const [editFormData, setEditFormData] = useState<{ name?: string; username?: string; role?: string }>({});

    // 3. Guarda un "verdadero/falso" para saber si el sistema está guardando. Útil para bloquear botones mientras carga.
    const [isSaving, setIsSaving] = useState(false);

    // FUNCIÓN: Qué hacer cuando el usuario hace clic en el botón del "Lápiz" de una fila.
    const handleEditClick = (user: User) => {
        setEditingRowId(user.id); // Avisamos que esta es la fila que se va a editar
        setEditFormData({         // Pre-llenamos el formulario con los datos actuales del usuario
            name: user.name,
            username: user.username,
            role: user.role
        });
    };

    // FUNCIÓN: Qué hacer cuando el usuario se arrepiente y presiona la "X" (Cancelar).
    const handleCancelEdit = () => {
        setEditingRowId(null); // Borramos qué fila está en edición (vuelve a la normalidad)
        setEditFormData({});   // Limpiamos los datos del formulario temporal
    };

    // FUNCIÓN: Qué hacer cuando el usuario presiona el "Check" (Guardar).
    // Es asíncrona (async) porque se va a comunicar con el servidor externo y tomará tiempo.
    const handleSaveEdit = async (id: number | string) => {
        // Validación: Avisa si intentan dejar el nombre o usuario en blanco
        if (!editFormData.name?.trim() || !editFormData.username?.trim()) {
            alert('El nombre y usuario son obligatorios');
            return;
        }

        setIsSaving(true); // Bloqueamos los botones indicando que ya empezó a guardar
        try {
            // Llamamos a la función "updateUser" (que habla con el servidor) y esperamos (await) su respuesta
            await updateUser(Number(id), {
                name: editFormData.name,
                username: editFormData.username,
                role: editFormData.role
            });
            // Si la línea anterior termina con éxito:
            setEditingRowId(null); // Quitamos el modo edición de la fila (vuelve ser una fila normal)
            if (onUserUpdated) onUserUpdated(); // Avisamos que hubo un cambio para que se refresque la lista de usuarios entera
        } catch (error) {
            // Si hubo un error de internet o del servidor, entramos aquí y mostramos un error en consola y alerta.
            console.error('Failed to update user', error);
            alert('Error al actualizar el usuario');
        } finally {
            setIsSaving(false); // Sin importar si hubo error o éxito, desbloqueamos los botones al final.
        }
    };

    // Definimos las columnas de nuestra tabla. 
    // Usamos 'useMemo' (Nativo de React) para que esta construcción de columnas se guarde en memoria y no se recalcule siempre.
    //
    // ¿Qué significa <ColumnDef<User>[]>? Son reglas estrictas de TypeScript para protegernos de errores:
    // - ColumnDef (Definición de Columna): Es el "molde" o manual de instrucciones que nos da la librería `@tanstack/react-table`. Nos obliga a escribir correctamente la columna (ej: ponerle un 'header' y un 'accessorKey'). Si escribimos algo mal, el editor nos avisa.
    // - <User>: Los picos (< >) le inyectan información a ese molde. Le estamos diciendo: "Las filas de esta tabla van a estar llenas de datos de un Usuario". Gracias a esto, si más abajo intentamos leer `user.edad`, el editor se pondrá rojo y nos dirá "¡Error! La interface User solo tiene id, name, username y role".
    // - []: Los corchetes al final significan "Una lista (array) de...". En resumen: Estamos creando una LISTA de MOLDES de columnas, hechas específicamente para mostrar un USUARIO.
    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                accessorKey: 'id', // Qué propiedad extrae del usuario
                header: 'ID', // El título superior
                // ¿Qué es 'cell'? 'cell' es el dibujante visual de esta celda en específico.
                // 1. (info): La tabla te pasa automáticamente toda la "información" ('info') del usuario actual en esta fila.
                // 2. =>: Es una función flecha (arrow function) que dice "tomo esta info y devuelvo el siguiente HTML".
                // 3. info.getValue<number>(): Como arriba en accessorKey le dijiste que tomara el 'id', getValue() saca ese número exacto (ej. 5).
                // En resumen: Esta línea toma el número de ID puro (ej. 5) y lo envuelve en una etiqueta HTML <span> con clases CSS y le pone un "#" adelante para que se vea bonito en pantalla como "#5".
                cell: (info) => <span className="col-id">#{info.getValue<number>()}</span>,
            },
            {
                accessorKey: 'name',
                header: 'Nombre',
                cell: (info) => {
                    const user = info.row.original; // Extraemos todos los datos completos del usuario de esta fila
                    const meta = info.table.options.meta as any; // Extraemos los estados/funciones compartidas de la tabla que indicamos abajo

                    // Si el ID del usuario de esta fila que se está dibujando coincide con el "editingRowId"...
                    if (meta.editingRowId === user.id) {
                        return (
                            // ...mostramos una caja de texto (input de HTML) que permite escribir
                            <input
                                type="text"
                                className="edit-input"
                                value={meta.editFormData.name || ''}
                                // Cada vez que el usuario teclea (onChange nativo), actualiza la memoria temporal (estado de react)
                                onChange={(e) => meta.setEditFormData({ ...meta.editFormData, name: e.target.value })}
                                disabled={meta.isSaving} // Si está en proceso de guardado, lo bloqueamos
                            />
                        );
                    }
                    // Si no es el que se está editando, solo mostramos el nombre normal
                    return <span className="product-name">{info.getValue<string>()}</span>;
                },
            },
            {
                accessorKey: 'username',
                header: 'Usuario',
                cell: (info) => {
                    const user = info.row.original;
                    const meta = info.table.options.meta as any;

                    if (meta.editingRowId === user.id) {
                        return (
                            <input
                                type="text"
                                className="edit-input"
                                value={meta.editFormData.username || ''}
                                onChange={(e) => meta.setEditFormData({ ...meta.editFormData, username: e.target.value })}
                                disabled={meta.isSaving}
                            />
                        );
                    }
                    return <span>{info.getValue<string>()}</span>;
                },
            },
            {
                accessorKey: 'role',
                header: 'Rol',
                cell: (info) => {
                    const user = info.row.original;
                    const meta = info.table.options.meta as any;

                    if (meta.editingRowId === user.id) {
                        return (
                            // En vez de caja de texto, construimos una lista HTML desplegable (select)
                            <select
                                className="edit-input"
                                value={meta.editFormData.role || ''}
                                onChange={(e) => meta.setEditFormData({ ...meta.editFormData, role: e.target.value })}
                                disabled={meta.isSaving}
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="ADMIN">ADMIN</option>
                                <option value="VENDEDOR">VENDEDOR</option>
                                <option value="ALMACENISTA">ALMACENISTA</option>
                            </select>
                        );
                    }
                    // Si no edita, muestra una "chapita" (badge) de colores para distinguir a simple vista si es Admin, Vendedor etc.
                    return (
                        <span className={`status-badge ${user.role === 'ADMIN' ? 'stock-ok' : user.role === 'VENDEDOR' ? 'stock-low' : 'stock-out'}`}>
                            {info.getValue<string>()}
                        </span>
                    );
                },
            },
            {
                id: 'actions',
                header: 'Acciones',
                cell: (info) => {
                    const user = info.row.original;
                    const meta = info.table.options.meta as any;
                    const isEditing = meta.editingRowId === user.id;

                    // Si esta es la fila en modo edición, le mostramos "Guardar" y "Cancelar"
                    if (isEditing) {
                        return (
                            <div className="actions-cell">
                                {/* Botón para guardar que llama a handleSaveEdit pasándole su ID */}
                                <button
                                    onClick={() => meta.handleSaveEdit(user.id)}
                                    className="action-btn save-btn"
                                    title="Guardar"
                                    disabled={meta.isSaving}
                                >
                                    <Check size={16} />
                                </button>
                                {/* Botón para cancelar que llama a handleCancelEdit */}
                                <button
                                    onClick={meta.handleCancelEdit}
                                    className="action-btn cancel-btn"
                                    title="Cancelar"
                                    disabled={meta.isSaving}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        );
                    }

                    // Botón por defecto para entrar a modo edición (Lápiz) cuando simplemente estás viendo la tabla
                    return (
                        <button
                            onClick={() => meta.handleEditClick(user)}
                            className="action-btn edit-btn"
                            title="Editar"
                        >
                            <Pencil size={16} />
                        </button>
                    );
                }
            }
        ],
        []
    );

    // Creamos la magia abstracta o el "cerebro" de la tabla utilizando la librería react-table importada arriba.
    const table = useReactTable({
        data: users, // Le pasamos los usuarios
        columns, // Le pasamos las columnas
        pageCount, // Páginas totales
        state: {
            pagination, // Estado de páginas
        },
        onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        // meta es un atajo para compartir directamente variables y funciones del componente padre (UsersTable) a los hijos (celdas)
        meta: {
            editingRowId,
            editFormData,
            setEditFormData,
            isSaving,
            handleEditClick,
            handleSaveEdit,
            handleCancelEdit
        }
    });

    // Validamos: Si en general está buscando datos de servidor y aún no tiene ningún usuario cargado,
    // dibuja unas cajas HTML de esqueleto animado para dar percepción de que "está pensando".
    if (isLoading && !users.length) {
        return (
            <div className="products-table-skeleton">
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
            </div>
        );
    }

    // Validamos: Si ya terminó y definitivamente no llegó nada, muestra un mensaje vacío.
    if (!isLoading && !users.length) {
        return (
            <div className="products-empty-state">
                <p>No hay usuarios registrados.</p>
            </div>
        );
    }

    // A partir de aquí devolvemos (return) ya las etiquetas de código puro HTML entrelazado con React (TSX) visual final.
    return (
        <div className="table-container-wrapper">
            <div className="products-table-container">
                {/* HTML nativo: Etiqueta <table> */}
                <table className={`products-table ${isLoading ? 'table-loading' : ''}`}>
                    {/* ENCABEZADOS DE LA TABLA */}
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    {/* CUERPO DE LA TABLA (Las filas que guardan la data) */}
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className={`col-${cell.column.id}`}>
                                        {/* flexRender es lo que procesa ese bloque "cell" que definimos arriba en las columnas y lo dibuja. */}
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ZONA INFERIOR DE CONTROLES DE PAGINACIÓN */}
            <div className="pagination-controls">
                <div className="pagination-info">
                    {/* Lee de la tabla en base a 0, así que se le suma +1 (EJ: index 0 muestra Página 1) */}
                    Página <strong>{table.getState().pagination.pageIndex + 1}</strong> de{' '}
                    <strong>{table.getPageCount() === 0 ? 1 : table.getPageCount()}</strong>
                </div>
                <div className="pagination-actions">
                    {/* Botones de navegación. Se deshabilitan mágicamente (disabled) calculando variables que la librería da. Ejemplo: getCanPreviousPage (puedo volver atrás?) */}
                    <button className="pagination-button" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage() || isLoading}>{'<<'}</button>
                    <button className="pagination-button" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage() || isLoading}>{'<'}</button>
                    <button className="pagination-button" onClick={() => table.nextPage()} disabled={!table.getCanNextPage() || isLoading}>{'>'}</button>
                    <button className="pagination-button" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage() || isLoading}>{'>>'}</button>
                </div>
                <div className="pagination-size">
                    {/* Elemento de lista (select) para ajustar de cuantos en cuantos usuarios ver (10, 20, 50 por página) */}
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                        className="pagination-select"
                        disabled={isLoading}
                    >
                        {[5, 10, 20, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>Mostrar {pageSize}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
