import { useDemoSession } from "./DemoSession";

export default function DemoControls({ compact = false }: { compact?: boolean }) {
  const { state, dispatch } = useDemoSession();
  return <div className={`demo-operation-settings${compact ? " compact" : ""}`}>
    <label>Modo de operación<select value={state.mode} onChange={(event) => dispatch({ type: "mode", mode: event.target.value as "simple" | "areas" })}>
      <option value="areas">Por áreas · controles separados</option><option value="simple">Simple · una persona completa el ciclo</option>
    </select></label>
    {!compact && <>
      <label className="demo-check"><input type="checkbox" checked={state.autoPrepare} onChange={(event) => dispatch({ type: "autoPrepare", enabled: event.target.checked })} />Al cancelar el saldo, dejar la producción lista automáticamente</label>
      <label>Aplicación de transferencias<select value={state.transferPolicy} onChange={(event) => dispatch({ type: "transferPolicy", policy: event.target.value as "verify" | "immediate" })}>
        <option value="verify">Después de verificar</option><option value="immediate">Inmediata al registrarla</option>
      </select></label>
      <p>Estas preferencias cambian solo el ejemplo. En el producto se configuran en Empresa y se aplican a las estaciones según sus permisos.</p>
    </>}
  </div>;
}
