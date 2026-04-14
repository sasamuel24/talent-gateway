import { useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useConvocatoria } from "@/hooks/useConvocatorias";
import Layout from "@/components/Layout";
import { Upload, X, Plus, Trash2, CheckCircle, FileText, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ExperienceEntry {
  id: string;
  puesto: string;
  compania: string;
  fechaInicio: string;
  fechaFin: string;
  detalles: string;
}

interface EducacionEntry {
  id: string;
  grado: string;
  universidad: string;
  estudios: string;
  fechaTitulacion: string;
}

interface IdiomaEntry {
  id: string;
  habilidad: string;
  nivel: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2);

const PAISES = ["Colombia", "Ecuador", "Estados Unidos", "México", "Panamá", "Costa Rica"];
const GRADOS = ["Bachiller", "Técnico", "Tecnólogo", "Pregrado", "Especialización", "Maestría", "Doctorado"];
const IDIOMAS_OPTS = ["Español", "Inglés", "Francés", "Portugués", "Alemán", "Italiano"];
const NIVELES_IDIOMA = ["Básico", "Intermedio", "Avanzado", "Nativo / Bilingüe"];

const inputCls =
  "w-full border border-border rounded px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white transition-all duration-200";

const selectCls =
  "w-full border border-border rounded px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white appearance-none transition-all duration-200";

// ── Reusable field components (OUTSIDE Apply to avoid remount bug) ──────────────

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

const Field = ({ label, required, error, children, className = "" }: FieldProps) => (
  <div className={className}>
    <label className="block text-xs text-muted-foreground mb-1 font-body">
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (v: "si" | "no") => void;
  error?: string;
}

const RadioGroup = ({ name, value, onChange, error }: RadioGroupProps) => (
  <div className="mt-2 space-y-2">
    {(["si", "no"] as const).map((opt) => (
      <label key={opt} className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name={name}
          value={opt}
          checked={value === opt}
          onChange={() => onChange(opt)}
          className="accent-primary w-4 h-4"
        />
        <span className="text-sm font-body text-foreground capitalize">{opt === "si" ? "Sí" : "No"}</span>
      </label>
    ))}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

// ── Step indicator ─────────────────────────────────────────────────────────────

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => (
  <div className="flex items-center justify-center mb-8">
    {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
      <div key={n} className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading font-bold transition-all duration-200 ${
            n < currentStep
              ? "bg-primary text-white"
              : n === currentStep
              ? "bg-primary text-white ring-4 ring-primary/20"
              : "bg-muted text-muted-foreground border border-border"
          }`}
        >
          {n < currentStep ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            n
          )}
        </div>
        {n < totalSteps && (
          <div
            className={`h-0.5 w-8 sm:w-12 mx-1 transition-colors duration-200 ${
              n < currentStep ? "bg-primary" : "bg-border"
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

// ── Step 1 ─────────────────────────────────────────────────────────────────────

interface Step1Props {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  errors: Record<string, string>;
}

const Step1 = ({ firstName, setFirstName, lastName, setLastName, email, setEmail, errors }: Step1Props) => (
  <div className="space-y-6 animate-slide-up">
    {/* Información de contacto */}
    <div>
      <h2 className="text-base font-heading font-bold text-foreground mb-4">Información de contacto</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field label="First Name" required error={errors.firstName}>
          <input
            className={inputCls}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder=""
          />
        </Field>
        <Field label="Last Name" required error={errors.lastName}>
          <input
            className={inputCls}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder=""
          />
        </Field>
      </div>
      <Field label="Correo electrónico" required error={errors.email}>
        <input
          className={inputCls}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder=""
        />
      </Field>
    </div>

    {/* Bienvenida */}
    <div className="pt-2">
      <h2 className="text-base font-heading font-bold text-foreground mb-3">¡BIENVENIDO(A)!</h2>
      <div className="space-y-3 text-sm font-body">
        <p className="font-semibold text-foreground">
          Café Quindío agradece tu interés en ser parte de esta gran familia.
        </p>
        <p className="text-primary">
          Nos sentimos honrados de que consideres unirte a nuestro equipo y estamos emocionados de conocerte más a fondo.
        </p>
        <p className="text-primary leading-relaxed">
          Durante este proceso, tendrás la oportunidad de demostrar tus habilidades, compartir tus experiencias y
          aprender más sobre quiénes somos y lo que hacemos. Queremos asegurarnos de que te sientas cómodo/a y bien
          informado/a en cada paso del camino.
        </p>
        <p className="text-foreground font-semibold">
          Te recomendamos leer todas las instrucciones para completar correctamente la información que se te solicite
          en el proceso de selección.
        </p>
      </div>
    </div>
  </div>
);

// ── Step 2 ─────────────────────────────────────────────────────────────────────

interface Step2Props {
  privacidad: "si" | "no" | "";
  setPrivacidad: (v: "si" | "no") => void;
  error: string;
}

const Step2 = ({ privacidad, setPrivacidad, error }: Step2Props) => (
  <div className="animate-slide-up">
    <h2 className="text-sm font-heading font-bold uppercase tracking-wide text-foreground mb-1">
      AVISO DE PRIVACIDAD
    </h2>
    <p className="text-sm text-primary mb-4 font-body">
      Al continuar, aceptas que Café Quindío recopile y trate tus datos personales con el fin exclusivo de gestionar
      tu proceso de selección, de conformidad con la Ley 1581 de 2012 (Ley de Protección de Datos Personales de
      Colombia) y su Decreto Reglamentario 1377 de 2013. Tus datos serán almacenados de forma segura y no serán
      compartidos con terceros sin tu consentimiento expreso.
    </p>
    <RadioGroup
      name="privacidad"
      value={privacidad}
      onChange={setPrivacidad}
      error={error}
    />
  </div>
);

// ── Step 3 ─────────────────────────────────────────────────────────────────────

interface Step3Props {
  autorizado: "si" | "no" | "";
  setAutorizado: (v: "si" | "no") => void;
  exColaborador: "si" | "no" | "";
  setExColaborador: (v: "si" | "no") => void;
  errors: Record<string, string>;
}

const Step3 = ({ autorizado, setAutorizado, exColaborador, setExColaborador, errors }: Step3Props) => (
  <div className="space-y-6 animate-slide-up">
    <div>
      <p className="text-sm font-body text-primary font-medium leading-relaxed">
        ¿Se encuentra usted autorizado (a) para laborar legalmente en el país donde se encuentra la vacante de su interés?
      </p>
      <RadioGroup
        name="autorizado"
        value={autorizado}
        onChange={setAutorizado}
        error={errors.autorizado}
      />
    </div>
    <div>
      <p className="text-sm font-body text-primary font-medium">
        ¿Has sido Colaborador de Café Quindío?
      </p>
      <RadioGroup
        name="exColaborador"
        value={exColaborador}
        onChange={setExColaborador}
        error={errors.exColaborador}
      />
    </div>
  </div>
);

// ── Step 4 ─────────────────────────────────────────────────────────────────────

interface Step4Props {
  cvFile: File | null;
  setCvFile: (f: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatFileSize: (bytes: number) => string;
  direccion1: string;
  setDireccion1: (v: string) => void;
  direccion2: string;
  setDireccion2: (v: string) => void;
  ciudad: string;
  setCiudad: (v: string) => void;
  estado: string;
  setEstado: (v: string) => void;
  pais: string;
  setPais: (v: string) => void;
  codigoPostal: string;
  setCodigoPostal: (v: string) => void;
  telefono: string;
  setTelefono: (v: string) => void;
  errors: Record<string, string>;
  experiencias: ExperienceEntry[];
  addExperiencia: () => void;
  removeExperiencia: (id: string) => void;
  updateExperiencia: (id: string, field: keyof ExperienceEntry, value: string) => void;
  educaciones: EducacionEntry[];
  addEducacion: () => void;
  removeEducacion: (id: string) => void;
  updateEducacion: (id: string, field: keyof EducacionEntry, value: string) => void;
  idiomas: IdiomaEntry[];
  addIdioma: () => void;
  removeIdioma: (id: string) => void;
  updateIdioma: (id: string, field: keyof IdiomaEntry, value: string) => void;
}

const Step4 = ({
  cvFile, setCvFile, fileInputRef, handleFileChange, formatFileSize,
  direccion1, setDireccion1, direccion2, setDireccion2,
  ciudad, setCiudad, estado, setEstado, pais, setPais,
  codigoPostal, setCodigoPostal, telefono, setTelefono, errors,
  experiencias, addExperiencia, removeExperiencia, updateExperiencia,
  educaciones, addEducacion, removeEducacion, updateEducacion,
  idiomas, addIdioma, removeIdioma, updateIdioma,
}: Step4Props) => (
  <div className="space-y-8 animate-slide-up">
    {/* CV Upload — drag-and-drop visual */}
    <div>
      <h3 className="text-base font-heading font-bold text-foreground mb-1">
        Compártenos tu Hoja de Vida
        <span className="text-destructive ml-0.5">*</span>
      </h3>
      <p className="text-xs text-primary mb-3 font-body">
        Adjunta aquí tu Hoja de Vida. Recuerda actualizarlo antes de cargarlo.
      </p>

      {cvFile ? (
        <div className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 bg-white w-fit max-w-sm hover:border-primary/40 transition-colors duration-200">
          <FileText className="h-8 w-8 text-destructive shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-body font-medium text-foreground truncate">{cvFile.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(cvFile.size)}</p>
          </div>
          <button
            onClick={() => { setCvFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
            className="ml-2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group cursor-pointer border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-muted/30 hover:border-primary hover:bg-primary/5 transition-all duration-200 max-w-md"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-body font-semibold text-foreground">
              Arrastra tu CV aquí o{" "}
              <span className="text-primary underline underline-offset-2">selecciona un archivo</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF • Máximo 10 MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
      {errors.cv && <p className="text-xs text-destructive mt-2">{errors.cv}</p>}
    </div>

    {/* Detalles de contacto */}
    <div>
      <h3 className="text-base font-heading font-bold text-foreground mb-4">Detalles del contacto</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Línea de dirección 1">
            <input className={inputCls} value={direccion1} onChange={(e) => setDireccion1(e.target.value)} />
          </Field>
          <Field label="Línea de dirección 2">
            <input className={inputCls} value={direccion2} onChange={(e) => setDireccion2(e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Ciudad">
            <input className={inputCls} value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
          </Field>
          <Field label="Estado">
            <input className={inputCls} value={estado} onChange={(e) => setEstado(e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="País">
            <select className={selectCls} value={pais} onChange={(e) => setPais(e.target.value)}>
              <option value="">Seleccione</option>
              {PAISES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Código postal">
            <input className={inputCls} value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Teléfono" required error={errors.telefono}>
            <input className={inputCls} type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </Field>
        </div>
      </div>
    </div>

    {/* Experiencia */}
    <div>
      <h3 className="text-base font-heading font-bold text-foreground mb-1">
        Experiencia<span className="text-destructive ml-0.5">*</span>
      </h3>
      {errors.experiencias && <p className="text-xs text-destructive mb-2">{errors.experiencias}</p>}
      {experiencias.map((exp) => (
        <div key={exp.id} className="border border-border rounded-lg p-4 mb-4 bg-white space-y-4 hover:border-primary/40 transition-colors duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Puesto" required>
              <input className={inputCls} value={exp.puesto} onChange={(e) => updateExperiencia(exp.id, "puesto", e.target.value)} />
            </Field>
            <Field label="Compañía" required>
              <input className={inputCls} value={exp.compania} onChange={(e) => updateExperiencia(exp.id, "compania", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Fecha de inicio" required>
              <input type="date" className={inputCls} value={exp.fechaInicio} onChange={(e) => updateExperiencia(exp.id, "fechaInicio", e.target.value)} />
            </Field>
            <Field label="Fecha final">
              <input type="date" className={inputCls} value={exp.fechaFin} onChange={(e) => updateExperiencia(exp.id, "fechaFin", e.target.value)} />
            </Field>
          </div>
          <Field label="Detalles">
            <textarea rows={3} className={inputCls} value={exp.detalles} onChange={(e) => updateExperiencia(exp.id, "detalles", e.target.value)} />
          </Field>
          <div className="flex justify-end">
            <button onClick={() => removeExperiencia(exp.id)} className="text-xs text-destructive hover:underline font-body flex items-center gap-1">
              <Trash2 className="h-3.5 w-3.5" /> Eliminar Experiencia
            </button>
          </div>
        </div>
      ))}
      <button onClick={addExperiencia} className="text-sm text-primary hover:underline font-body font-medium flex items-center gap-1">
        <Plus className="h-4 w-4" /> Agregar Experiencia
      </button>
    </div>

    {/* Educación */}
    <div>
      <h3 className="text-base font-heading font-bold text-foreground mb-1">
        Educación<span className="text-destructive ml-0.5">*</span>
      </h3>
      {errors.educaciones && <p className="text-xs text-destructive mb-2">{errors.educaciones}</p>}
      {educaciones.map((edu) => (
        <div key={edu.id} className="border border-border rounded-lg p-4 mb-4 bg-white space-y-4 hover:border-primary/40 transition-colors duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Grado Académico" required>
              <select className={selectCls} value={edu.grado} onChange={(e) => updateEducacion(edu.id, "grado", e.target.value)}>
                <option value=""></option>
                {GRADOS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Universidad / Institución" required>
              <input className={inputCls} value={edu.universidad} onChange={(e) => updateEducacion(edu.id, "universidad", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Estudios / Profesión" required>
              <input className={inputCls} value={edu.estudios} onChange={(e) => updateEducacion(edu.id, "estudios", e.target.value)} />
            </Field>
            <Field label="Fecha de Titulación">
              <input type="date" className={inputCls} value={edu.fechaTitulacion} onChange={(e) => updateEducacion(edu.id, "fechaTitulacion", e.target.value)} />
            </Field>
          </div>
          <div className="flex justify-end">
            <button onClick={() => removeEducacion(edu.id)} className="text-xs text-destructive hover:underline font-body flex items-center gap-1">
              <Trash2 className="h-3.5 w-3.5" /> Eliminar Educación
            </button>
          </div>
        </div>
      ))}
      <button onClick={addEducacion} className="text-sm text-primary hover:underline font-body font-medium flex items-center gap-1">
        <Plus className="h-4 w-4" /> Agregar Educación
      </button>
    </div>

    {/* Idioma */}
    <div>
      <h3 className="text-base font-heading font-bold text-foreground mb-1">
        Idioma<span className="text-destructive ml-0.5">*</span>
      </h3>
      {errors.idiomas && <p className="text-xs text-destructive mb-2">{errors.idiomas}</p>}
      {idiomas.map((idioma) => (
        <div key={idioma.id} className="border border-border rounded-lg p-4 mb-4 bg-white space-y-4 hover:border-primary/40 transition-colors duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Habilidades" required>
              <select className={selectCls} value={idioma.habilidad} onChange={(e) => updateIdioma(idioma.id, "habilidad", e.target.value)}>
                <option value=""></option>
                {IDIOMAS_OPTS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Nivel de dominio" required>
              <select className={selectCls} value={idioma.nivel} onChange={(e) => updateIdioma(idioma.id, "nivel", e.target.value)}>
                <option value=""></option>
                {NIVELES_IDIOMA.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
          </div>
          <div className="flex justify-end">
            <button onClick={() => removeIdioma(idioma.id)} className="text-xs text-destructive hover:underline font-body flex items-center gap-1">
              <Trash2 className="h-3.5 w-3.5" /> Eliminar Idioma
            </button>
          </div>
        </div>
      ))}
      <button onClick={addIdioma} className="text-sm text-primary hover:underline font-body font-medium flex items-center gap-1">
        <Plus className="h-4 w-4" /> Agregar Idioma
      </button>
    </div>
  </div>
);

// ── Step 5 ─────────────────────────────────────────────────────────────────────

interface Step5Props {
  jobId: string;
  jobTitle: string;
  candidateName: string;
  navigate: (path: string) => void;
}

const Step5 = ({ jobId, jobTitle, candidateName, navigate }: Step5Props) => {
  const firstName = candidateName.split(' ')[0];

  return (
    <div className="animate-fade-in min-h-[520px] flex flex-col items-center px-4 pt-8 pb-12 text-center">

      {/* ── Icono animado ── */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Pulso exterior */}
        <div className="absolute w-32 h-32 rounded-full bg-primary/10 animate-ping-slow" />
        {/* Anillo medio */}
        <div className="absolute w-24 h-24 rounded-full bg-primary/15" />
        {/* Círculo sólido */}
        <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
          <CheckCircle className="h-10 w-10 text-white" strokeWidth={2.5} />
        </div>
        {/* Partícula decorativa — arriba derecha */}
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent/70" />
        {/* Partícula decorativa — abajo izquierda */}
        <div className="absolute -bottom-1 -left-2 w-3 h-3 rounded-full bg-primary/40" />
      </div>

      {/* ── Encabezado personalizado ── */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both', opacity: 0 }}>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground leading-tight mb-2">
          ¡Felicitaciones,<br className="sm:hidden" /> {firstName}!
        </h2>
        <p className="text-sm font-body text-muted-foreground">
          Tu solicitud fue enviada exitosamente
        </p>
      </div>

      {/* ── Badge de vacante ── */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-primary/20 mb-8 max-w-[280px] animate-slide-up"
        style={{ animationDelay: '0.2s', animationFillMode: 'both', opacity: 0 }}
      >
        <FileText className="h-4 w-4 text-primary shrink-0" />
        <span className="text-sm font-body font-medium text-primary truncate">{jobTitle}</span>
      </div>

      {/* ── Línea divisora con texto ── */}
      <div
        className="flex items-center gap-3 w-full max-w-sm mb-6 animate-slide-up"
        style={{ animationDelay: '0.3s', animationFillMode: 'both', opacity: 0 }}
      >
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
          ¿Qué sigue?
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* ── Pasos siguientes ── */}
      <div className="w-full max-w-sm space-y-4 mb-8 text-left">
        {[
          {
            num: '01',
            title: 'Revisamos tu perfil',
            desc: 'Nuestro equipo evaluará tu hoja de vida en las próximas 48 horas hábiles.',
            delay: '0.35s',
          },
          {
            num: '02',
            title: 'Te contactamos',
            desc: 'Si tu perfil es seleccionado, recibirás un correo con los próximos pasos.',
            delay: '0.45s',
          },
          {
            num: '03',
            title: 'Entrevista',
            desc: '¡Queremos conocer tu talento! Tendrás una entrevista con nuestro equipo.',
            delay: '0.55s',
          },
        ].map(({ num, title, desc, delay }) => (
          <div
            key={num}
            className="flex gap-4 items-start animate-slide-up"
            style={{ animationDelay: delay, animationFillMode: 'both', opacity: 0 }}
          >
            <div className="shrink-0 w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-xs font-heading font-bold text-primary">{num}</span>
            </div>
            <div className="pt-0.5">
              <p className="text-sm font-body font-semibold text-foreground leading-tight">{title}</p>
              <p className="text-xs font-body text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── CTAs ── */}
      <div
        className="w-full max-w-sm flex flex-col sm:flex-row gap-3 animate-slide-up"
        style={{ animationDelay: '0.65s', animationFillMode: 'both', opacity: 0 }}
      >
        <button
          onClick={() => navigate('/')}
          className="flex-1 px-5 py-3 rounded-full bg-primary text-white text-sm font-body font-bold hover:bg-primary/90 transition-all duration-200 active:scale-95 shadow-md shadow-primary/20"
        >
          Explorar más vacantes
        </button>
        <Link
          to={`/vacante/${jobId}`}
          className="flex-1 px-5 py-3 rounded-full border border-border text-sm font-body font-medium text-foreground hover:border-primary hover:text-primary transition-all duration-200 active:scale-95 text-center"
        >
          Ver la vacante
        </Link>
      </div>

      {/* ── Footer branding ── */}
      <p
        className="mt-8 text-xs font-body text-muted-foreground/60 animate-fade-in"
        style={{ animationDelay: '0.8s', animationFillMode: 'both', opacity: 0 }}
      >
        Café Quindío — Portal de Talento
      </p>
    </div>
  );
};

// ── Component ──────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

const Apply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: job, isLoading, isError } = useConvocatoria(id);

  // ── Step state ──
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 5;

  // ── Submit state ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ── Step 1 ──
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});

  // ── Step 2 ──
  const [privacidad, setPrivacidad] = useState<"si" | "no" | "">("");
  const [step2Error, setStep2Error] = useState("");

  // ── Step 3 ──
  const [autorizado, setAutorizado] = useState<"si" | "no" | "">("");
  const [exColaborador, setExColaborador] = useState<"si" | "no" | "">("");
  const [step3Errors, setStep3Errors] = useState<Record<string, string>>({});

  // ── Step 4 ──
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [direccion1, setDireccion1] = useState("");
  const [direccion2, setDireccion2] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [estado, setEstado] = useState("");
  const [pais, setPais] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [telefono, setTelefono] = useState("");
  const [step4Errors, setStep4Errors] = useState<Record<string, string>>({});

  const [experiencias, setExperiencias] = useState<ExperienceEntry[]>([]);
  const [educaciones, setEducaciones] = useState<EducacionEntry[]>([]);
  const [idiomas, setIdiomas] = useState<IdiomaEntry[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Validators ──────────────────────────────────────────────────────────────

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = "El nombre es requerido";
    if (!lastName.trim()) errors.lastName = "El apellido es requerido";
    if (!email.trim()) errors.email = "El correo es requerido";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Correo no válido";
    setStep1Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    if (!privacidad) {
      setStep2Error("Debes aceptar o rechazar el aviso de privacidad");
      return false;
    }
    if (privacidad === "no") {
      setStep2Error("Debes aceptar el aviso de privacidad para continuar");
      return false;
    }
    setStep2Error("");
    return true;
  };

  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    if (!autorizado) errors.autorizado = "Este campo es requerido";
    if (!exColaborador) errors.exColaborador = "Este campo es requerido";
    setStep3Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep4 = () => {
    const errors: Record<string, string> = {};
    if (!cvFile) errors.cv = "El CV es requerido";
    if (!telefono.trim()) errors.telefono = "El teléfono es requerido";
    if (experiencias.length === 0) errors.experiencias = "Debes agregar al menos una experiencia laboral";
    if (educaciones.length === 0) errors.educaciones = "Debes agregar al menos un nivel de educación";
    if (idiomas.length === 0) errors.idiomas = "Debes agregar al menos un idioma";
    setStep4Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Submit to backend ───────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!job) return;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      // a) Crear candidato sin cv_url primero (necesitamos el ID para subir el archivo)
      const cv_url: string | null = null;

      // b) Build location string and create candidate
      const locationParts = [ciudad, estado, pais].filter(Boolean);
      const location = locationParts.join(", ");
      const candidateRes = await fetch(`${BASE_URL}/api/v1/candidatos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone: telefono || undefined,
          location: location || undefined,
          cv_url: cv_url ?? null,
        }),
      });
      if (!candidateRes.ok) throw new Error(await candidateRes.text());
      const candidate = await candidateRes.json();
      const candidateId: string = candidate.id;

      // c) Subir PDF del CV a S3
      if (cvFile) {
        const formData = new FormData();
        formData.append("file", cvFile);
        const cvRes = await fetch(`${BASE_URL}/api/v1/candidatos/${candidateId}/cv`, {
          method: "POST",
          body: formData,
        });
        if (!cvRes.ok) {
          console.warn("CV upload falló:", await cvRes.text());
          // No bloqueamos el flujo si el CV falla — el candidato queda registrado igual
        }
      }

      // e-f) Add experience entries
      for (const exp of experiencias) {
        const expRes = await fetch(`${BASE_URL}/api/v1/candidatos/${candidateId}/experience`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            position: exp.puesto,
            company: exp.compania,
            start_date: exp.fechaInicio || null,
            end_date: exp.fechaFin || null,
            details: exp.detalles || null,
          }),
        });
        if (!expRes.ok) throw new Error(await expRes.text());
      }

      // g) Add education entries
      for (const edu of educaciones) {
        const eduRes = await fetch(`${BASE_URL}/api/v1/candidatos/${candidateId}/education`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            degree: edu.grado || null,
            institution: edu.universidad || null,
            field_of_study: edu.estudios || null,
            graduation_date: edu.fechaTitulacion || null,
          }),
        });
        if (!eduRes.ok) throw new Error(await eduRes.text());
      }

      // h) Add language entries
      for (const idioma of idiomas) {
        const langRes = await fetch(`${BASE_URL}/api/v1/candidatos/${candidateId}/languages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: idioma.habilidad,
            level: idioma.nivel,
          }),
        });
        if (!langRes.ok) throw new Error(await langRes.text());
      }

      // i) Create application
      const appRes = await fetch(`${BASE_URL}/api/v1/aplicaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidateId,
          job_id: job.id,
        }),
      });
      if (!appRes.ok) throw new Error(await appRes.text());

      // j) Move to success step
      setStep(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al enviar la solicitud. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Navigation ──────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    if (step === 4) {
      if (!validateStep4()) return;
      handleSubmit();
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Experience handlers ─────────────────────────────────────────────────────

  const addExperiencia = () =>
    setExperiencias((prev) => [
      ...prev,
      { id: uid(), puesto: "", compania: "", fechaInicio: "", fechaFin: "", detalles: "" },
    ]);

  const removeExperiencia = (id: string) =>
    setExperiencias((prev) => prev.filter((e) => e.id !== id));

  const updateExperiencia = (id: string, field: keyof ExperienceEntry, value: string) =>
    setExperiencias((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  // ── Education handlers ──────────────────────────────────────────────────────

  const addEducacion = () =>
    setEducaciones((prev) => [
      ...prev,
      { id: uid(), grado: "", universidad: "", estudios: "", fechaTitulacion: "" },
    ]);

  const removeEducacion = (id: string) =>
    setEducaciones((prev) => prev.filter((e) => e.id !== id));

  const updateEducacion = (id: string, field: keyof EducacionEntry, value: string) =>
    setEducaciones((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  // ── Idioma handlers ─────────────────────────────────────────────────────────

  const addIdioma = () =>
    setIdiomas((prev) => [...prev, { id: uid(), habilidad: "", nivel: "" }]);

  const removeIdioma = (id: string) =>
    setIdiomas((prev) => prev.filter((i) => i.id !== id));

  const updateIdioma = (id: string, field: keyof IdiomaEntry, value: string) =>
    setIdiomas((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  // ── CV Upload ───────────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setStep4Errors((prev) => ({ ...prev, cv: "Solo se permiten archivos PDF" }));
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setStep4Errors((prev) => ({ ...prev, cv: "El archivo no puede superar 10 MB" }));
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setCvFile(file);
      setStep4Errors((prev) => ({ ...prev, cv: "" }));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ── Not found / loading ─────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (isError || !job) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold uppercase tracking-brand text-foreground mb-2">
              Vacante no encontrada
            </h1>
            <Link to="/" className="text-primary hover:underline text-sm font-body">
              ← Regresar a la búsqueda
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Layout>
      {/* pb para compensar la barra fija del fondo */}
      <div className="bg-muted min-h-screen pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-primary leading-tight">
              {job.title}
            </h1>
            {step < TOTAL_STEPS && (
              <span className="text-sm font-body text-muted-foreground whitespace-nowrap ml-4 mt-1">
                Paso {step} de {TOTAL_STEPS - 1}
              </span>
            )}
          </div>

          {/* Step indicator */}
          {step < TOTAL_STEPS && (
            <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS - 1} />
          )}

          {/* Card */}
          <div className="bg-white border border-border rounded-lg p-6 sm:p-8 shadow-sm">
            {submitError && (
              <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive font-body">
                {submitError}
              </div>
            )}
            {step === 1 && (
              <Step1
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                errors={step1Errors}
              />
            )}
            {step === 2 && (
              <Step2
                privacidad={privacidad}
                setPrivacidad={setPrivacidad}
                error={step2Error}
              />
            )}
            {step === 3 && (
              <Step3
                autorizado={autorizado}
                setAutorizado={setAutorizado}
                exColaborador={exColaborador}
                setExColaborador={setExColaborador}
                errors={step3Errors}
              />
            )}
            {step === 4 && (
              <Step4
                cvFile={cvFile}
                setCvFile={setCvFile}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
                formatFileSize={formatFileSize}
                direccion1={direccion1}
                setDireccion1={setDireccion1}
                direccion2={direccion2}
                setDireccion2={setDireccion2}
                ciudad={ciudad}
                setCiudad={setCiudad}
                estado={estado}
                setEstado={setEstado}
                pais={pais}
                setPais={setPais}
                codigoPostal={codigoPostal}
                setCodigoPostal={setCodigoPostal}
                telefono={telefono}
                setTelefono={setTelefono}
                errors={step4Errors}
                experiencias={experiencias}
                addExperiencia={addExperiencia}
                removeExperiencia={removeExperiencia}
                updateExperiencia={updateExperiencia}
                educaciones={educaciones}
                addEducacion={addEducacion}
                removeEducacion={removeEducacion}
                updateEducacion={updateEducacion}
                idiomas={idiomas}
                addIdioma={addIdioma}
                removeIdioma={removeIdioma}
                updateIdioma={updateIdioma}
              />
            )}
            {step === 5 && (
              <Step5
                jobId={job.id}
                jobTitle={job.title}
                candidateName={`${firstName} ${lastName}`.trim()}
                navigate={navigate}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom action bar — solo en pasos 1-4 */}
      {step < TOTAL_STEPS && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4 bg-white/80 backdrop-blur-md border-t border-border shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          {/* Izquierda: Cancelar como link discreto */}
          <button
            onClick={() => navigate(`/vacante/${job.id}`)}
            className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1.5 group"
          >
            <X className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform duration-200" />
            Cancelar
          </button>

          {/* Centro: Progress dots — uno por paso */}
          <div className="hidden sm:flex items-center gap-2">
            {Array.from({ length: 4 }, (_, i) => i + 1).map((n) => (
              <div
                key={n}
                className={`rounded-full transition-all duration-300 ${
                  n === step
                    ? "w-6 h-2 bg-primary"
                    : n < step
                    ? "w-2 h-2 bg-primary/40"
                    : "w-2 h-2 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Derecha: Atrás + Siguiente */}
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-border text-sm font-body font-medium text-foreground hover:border-primary hover:text-primary transition-all duration-200 active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
                Atrás
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full bg-primary text-white text-sm font-body font-bold hover:bg-primary/90 transition-all duration-200 active:scale-95 shadow-sm shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Apply;
