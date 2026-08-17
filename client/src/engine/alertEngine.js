import { useVitalsStore } from "../store/vitalsStore";
import { readLatestVitals } from "../services/healthConnect";

let _engineRunning = false;
let _pollingInterval = null;

export async function startAlertEngine(userId) {
  if (_engineRunning) return;

  _engineRunning = true;

  try {
    useVitalsStore.getState().setUserId(userId);
    useVitalsStore.getState().connectWebSocket(userId);

    const poll = async () => {
      try {
        const vitals = await readLatestVitals(30);

        if (vitals) {
          useVitalsStore.getState().updateVitals(vitals);
        }
      } catch (e) {
        console.error(e);
      }
    };

    await poll();

    _pollingInterval = setInterval(poll, 30000);

    console.log("Engine running");
  } catch (e) {
    _engineRunning = false;
    throw e;
  }
}
export function stopAlertEngine() {
  if (_pollingInterval) {
    clearInterval(_pollingInterval);
    _pollingInterval = null;
  }

  useVitalsStore.getState().disconnectWebSocket();
  _engineRunning = false;

  console.log("[AlertEngine] Stopped");
}