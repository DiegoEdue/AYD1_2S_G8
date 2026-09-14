"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registrarEstudiante, registrarTutor } from "@/lib/api/auth";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import FormField, { inputClass } from "@/components/ui/FormField";
import Avatar from "@/components/ui/Avatar";

const VACIO_ESTUDIANTE = {
    nombre: "",
    apellido: "",
    carnet: "",
    genero: "",
    direccion: "",
    telefono: "",
    fechaNacimiento: "",
    correo: "",
    password: "",
    confirmarPassword: "",
    foto: null,
    };

    const VACIO_TUTOR = {
    ...VACIO_ESTUDIANTE,
    especialidad: "",
    numeroIdentificacion: "",
    direccionTutoria: "",
    anioInicio: "",
    universidad: "",
    };

    const OPCIONES_GENERO = [
    { valor: "M", etiqueta: "Masculino" },
    { valor: "F", etiqueta: "Femenino" },
    ];
    const OPCIONES_DIRECCION_TUTORIA = ["Física", "Online"];

    function validarPasswordFuerte(pw) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pw);
    }

    function distanciaTexto(a, b) {
    const fila = Array.from({ length: b.length + 1 }, (_, indice) => indice);
    for (let indiceA = 1; indiceA <= a.length; indiceA += 1) {
        let diagonal = fila[0];
        fila[0] = indiceA;
        for (let indiceB = 1; indiceB <= b.length; indiceB += 1) {
        const superior = fila[indiceB];
        fila[indiceB] = a[indiceA - 1] === b[indiceB - 1]
            ? diagonal
            : Math.min(diagonal, superior, fila[indiceB - 1]) + 1;
        diagonal = superior;
        }
    }
    return fila[b.length];
    }

    function validarEspecialidades(valor) {
    const materias = valor
        .split(",")
        .map((materia) => materia.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        .filter(Boolean);
    return materias.findIndex((materia, indice) =>
        materias.slice(0, indice).some((anterior) => materia === anterior || distanciaTexto(materia, anterior) <= 1)
    ) !== -1;
    }

    export default function RegistroPage() {
    const router = useRouter();
    const { mostrarToast } = useToast();
    const [rol, setRol] = useState("estudiante");
    const [form, setForm] = useState(VACIO_ESTUDIANTE);
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);
    const [errorGeneral, setErrorGeneral] = useState("");

    function cambiarRol(nuevoRol) {
        setRol(nuevoRol);
        setForm(nuevoRol === "estudiante" ? VACIO_ESTUDIANTE : VACIO_TUTOR);
        setErrores({});
    }

    function set(campo, valor) {
        setForm((f) => ({ ...f, [campo]: valor }));
    }

    function onFotoChange(ev) {
        const archivo = ev.target.files?.[0];
        if (!archivo) return;
        const lector = new FileReader();
        lector.onload = () => set("foto", lector.result);
        lector.readAsDataURL(archivo);
    }

    function quitarFoto() {
        set("foto", null);
    }

    function validar() {
        const e = {};
        if (!form.nombre) e.nombre = "Ingresa tu nombre.";
        if (!form.apellido) e.apellido = "Ingresa tu apellido.";
        if (!form.carnet) e.carnet = "Ingresa tu carnet o ID.";
        if (!OPCIONES_GENERO.some((opcion) => opcion.valor === form.genero)) e.genero = "Selecciona un género.";
        if (!form.direccion) e.direccion = "Ingresa tu dirección.";
        if (!form.telefono) e.telefono = "Ingresa tu teléfono.";
        if (!form.correo || !/^\S+@\S+\.\S+$/.test(form.correo))
        e.correo = "Ingresa un correo electrónico válido.";
        if (!validarPasswordFuerte(form.password))
        e.password = "Usa mínimo 8 caracteres, con mayúscula, minúscula y número, sin símbolos.";
        if (!form.confirmarPassword || form.password !== form.confirmarPassword)
        e.confirmarPassword = "Las contraseñas deben coincidir.";
        if (!form.fechaNacimiento) e.fechaNacimiento = "Ingresa tu fecha de nacimiento.";
        if (rol === "tutor") {
        if (!form.especialidad) e.especialidad = "Indica las materias que impartes.";
        else if (validarEspecialidades(form.especialidad)) e.especialidad = "No repitas materias iguales o con una variación de un carácter.";
        if (!form.numeroIdentificacion) e.numeroIdentificacion = "Ingresa tu número de identificación.";
        if (!OPCIONES_DIRECCION_TUTORIA.includes(form.direccionTutoria)) {
            e.direccionTutoria = "Selecciona Física u Online.";
        }
        if (!form.universidad) e.universidad = "Ingresa tu universidad de graduación.";
        if (!form.anioInicio) e.anioInicio = "Ingresa el año de inicio de tutorías.";
        }
        setErrores(e);
        return Object.keys(e).length === 0;
    }

    async function onSubmit(ev) {
        ev.preventDefault();
        setErrorGeneral("");
        if (!validar()) return;

        setCargando(true);
        try {
        if (rol === "estudiante") await registrarEstudiante(form);
        else await registrarTutor(form);

        mostrarToast(
            "Registro enviado. Tu cuenta será revisada por un administrador antes de poder iniciar sesión.",
            "exito"
        );
        router.push("/login");
        } catch (err) {
        setErrorGeneral(err.message);
        } finally {
        setCargando(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
        <div className="w-full max-w-xl overflow-hidden rounded-card bg-white shadow-soft">
            <div className="p-8">
            <h1 className="font-display text-2xl text-charcoal">Crear cuenta en EduConnect - G8</h1>
            <p className="mt-1 text-sm text-charcoal-light">
                Tu cuenta debe ser aprobada por un administrador antes de poder ingresar.
            </p>

            <div className="mt-5">
                <Tabs
                tabs={[
                    { valor: "estudiante", etiqueta: "Soy estudiante" },
                    { valor: "tutor", etiqueta: "Soy tutor" },
                ]}
                activo={rol}
                onCambiar={cambiarRol}
                />
            </div>

            {errorGeneral && (
                <div
                role="alert"
                className="mt-5 rounded-lg border border-crimson/30 bg-crimson-light/30 px-4 py-3 text-sm text-crimson-dark"
                >
                {errorGeneral}
                </div>
            )}

            <form onSubmit={onSubmit} noValidate className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-lg border border-dashed border-charcoal/20 p-4 sm:col-span-2">
                <Avatar
                    nombre={`${form.nombre} ${form.apellido}`.trim() || "Nuevo usuario"}
                    foto={form.foto}
                    size="h-16 w-16"
                    textSize="text-lg"
                />
                <div className="flex flex-col gap-1">
                    <label htmlFor="foto" className="text-sm font-medium text-charcoal">
                    Foto de perfil
                    </label>
                    <p className="text-xs text-charcoal-light">
                    Opcional. Si no subes una, se mostrarán tus iniciales.
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                    <label
                        htmlFor="foto"
                        className="cursor-pointer rounded-full border border-charcoal/20 px-4 py-1.5 text-xs font-semibold text-charcoal transition hover:bg-charcoal/5"
                    >
                        {form.foto ? "Cambiar foto" : "Subir foto"}
                    </label>
                    <input
                        id="foto"
                        name="foto"
                        type="file"
                        accept="image/*"
                        onChange={onFotoChange}
                        className="sr-only"
                    />
                    {form.foto && (
                        <button
                        type="button"
                        onClick={quitarFoto}
                        className="text-xs font-semibold text-crimson hover:underline"
                        >
                        Quitar
                        </button>
                    )}
                    </div>
                {errores.foto && <p role="alert" className="text-xs font-medium text-crimson">{errores.foto}</p>}
                </div>
                </div>

                <FormField label="Nombre" name="nombre" required error={errores.nombre}>
                <input
                    id="nombre"
                    value={form.nombre}
                    onChange={(e) => set("nombre", e.target.value)}
                    className={inputClass(!!errores.nombre)}
                />
                </FormField>
                <FormField label="Apellido" name="apellido" required error={errores.apellido}>
                <input
                    id="apellido"
                    value={form.apellido}
                    onChange={(e) => set("apellido", e.target.value)}
                    className={inputClass(!!errores.apellido)}
                />
                </FormField>
                <FormField
                label={rol === "estudiante" ? "Carnet" : "Carnet o ID"}
                name="carnet"
                required
                error={errores.carnet}
                >
                <input
                    id="carnet"
                    value={form.carnet}
                    onChange={(e) => set("carnet", e.target.value)}
                    className={inputClass(!!errores.carnet)}
                />
                </FormField>
                <FormField label="Género" name="genero" required error={errores.genero}>
                <select
                    id="genero"
                    value={form.genero}
                    onChange={(e) => set("genero", e.target.value)}
                    className={inputClass(!!errores.genero)}
                >
                    <option value="">Selecciona una opción</option>
                    {OPCIONES_GENERO.map((opcion) => (
                    <option key={opcion.valor} value={opcion.valor}>{opcion.etiqueta}</option>
                    ))}
                </select>
                </FormField>
                <FormField label="Dirección" name="direccion" required error={errores.direccion}>
                <input
                    id="direccion"
                    value={form.direccion}
                    onChange={(e) => set("direccion", e.target.value)}
                    className={inputClass(!!errores.direccion)}
                />
                </FormField>
                <FormField label="Teléfono" name="telefono" required error={errores.telefono}>
                <input
                    id="telefono"
                    value={form.telefono}
                    onChange={(e) => set("telefono", e.target.value)}
                    className={inputClass(!!errores.telefono)}
                />
                </FormField>
                <FormField
                label="Fecha de nacimiento"
                name="fechaNacimiento"
                required
                error={errores.fechaNacimiento}
                >
                <input
                    id="fechaNacimiento"
                    type="date"
                    value={form.fechaNacimiento}
                    onChange={(e) => set("fechaNacimiento", e.target.value)}
                    className={inputClass(!!errores.fechaNacimiento)}
                />
                </FormField>
                <FormField label="Correo electrónico" name="correo" required error={errores.correo}>
                <input
                    id="correo"
                    type="email"
                    value={form.correo}
                    onChange={(e) => set("correo", e.target.value)}
                    className={inputClass(!!errores.correo)}
                />
                </FormField>

                {rol === "tutor" && (
                <>
                    <FormField
                    label="Especialidad (materias)"
                    name="especialidad"
                    required
                    error={errores.especialidad}
                    ayuda="Sepáralas con coma, ej: Cálculo 1, Álgebra Lineal"
                    >
                    <input
                        id="especialidad"
                        value={form.especialidad}
                        onChange={(e) => set("especialidad", e.target.value)}
                        className={inputClass(!!errores.especialidad)}
                    />
                    </FormField>
                    <FormField
                    label="Número de identificación (DPI/ID)"
                    name="numeroIdentificacion"
                    required
                    error={errores.numeroIdentificacion}
                    >
                    <input
                        id="numeroIdentificacion"
                        value={form.numeroIdentificacion}
                        onChange={(e) => set("numeroIdentificacion", e.target.value)}
                        className={inputClass(!!errores.numeroIdentificacion)}
                    />
                    </FormField>
                    <FormField
                    label="Dirección de tutoría"
                    name="direccionTutoria"
                    required
                    error={errores.direccionTutoria}
                    ayuda="Selecciona si atiendes de forma física u online."
                    >
                    <select
                        id="direccionTutoria"
                        value={form.direccionTutoria}
                        onChange={(e) => set("direccionTutoria", e.target.value)}
                        className={inputClass(!!errores.direccionTutoria)}
                    >
                        <option value="">Selecciona una opción</option>
                        {OPCIONES_DIRECCION_TUTORIA.map((opcion) => (
                        <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                    </select>
                    </FormField>
                    <FormField label="Año de inicio de tutorías" name="anioInicio" required error={errores.anioInicio}>
                    <input
                        id="anioInicio"
                        type="number"
                        value={form.anioInicio}
                        onChange={(e) => set("anioInicio", e.target.value)}
                        className={inputClass(!!errores.anioInicio)}
                    />
                    </FormField>
                    <FormField
                    label="Universidad de graduación"
                    name="universidad"
                    required
                    error={errores.universidad}
                    >
                    <input
                        id="universidad"
                        value={form.universidad}
                        onChange={(e) => set("universidad", e.target.value)}
                        className={inputClass(!!errores.universidad)}
                    />
                    </FormField>
                </>
                )}

                <FormField
                label="Contraseña"
                name="password"
                required
                error={errores.password}
                ayuda="Mínimo 8 caracteres, con mayúscula, minúscula y número."
                >
                <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    className={inputClass(!!errores.password)}
                />
                </FormField>

                <FormField
                label="Confirmar contraseña"
                name="confirmarPassword"
                required
                error={errores.confirmarPassword}
                >
                <input
                    id="confirmarPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmarPassword}
                    onChange={(e) => set("confirmarPassword", e.target.value)}
                    className={inputClass(!!errores.confirmarPassword)}
                />
                </FormField>

                <div className="sm:col-span-2">
                <Button type="submit" cargando={cargando} className="mt-2 w-full">
                    Crear cuenta de {rol === "estudiante" ? "estudiante" : "tutor"}
                </Button>
                </div>
            </form>

            <p className="mt-6 text-center text-sm text-charcoal-light">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="font-semibold text-crimson hover:underline">
                Inicia sesión
                </Link>
            </p>
            </div>
        </div>
        </div>
    );
}
