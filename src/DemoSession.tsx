import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import { createDemoScenario, demoScenarioReducer, type DemoAction, type DemoScenario } from "./demoScenario";

const DemoSessionContext = createContext<{ state: DemoScenario; dispatch: Dispatch<DemoAction> } | null>(null);

export function DemoSession({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoScenarioReducer, undefined, createDemoScenario);
  return <DemoSessionContext.Provider value={{ state, dispatch }}>{children}</DemoSessionContext.Provider>;
}

export function useDemoSession() {
  const session = useContext(DemoSessionContext);
  if (!session) throw new Error("La demostración necesita una sesión local.");
  return session;
}
