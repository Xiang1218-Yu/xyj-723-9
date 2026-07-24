export { reporter } from './reporter';
export { errorMonitor } from './error';
export { perfMonitor } from './performance';

import { reporter } from './reporter';
import { errorMonitor } from './error';
import { perfMonitor } from './performance';
import { setPerformanceTracker, setErrorReporter } from '../services/request';

export function initMonitor(): void {
  errorMonitor.init();
  perfMonitor.init();
  reporter.start();

  setPerformanceTracker(perfMonitor);
  setErrorReporter({
    report: (err) => {
      errorMonitor.captureError(err, { page: err.url });
    },
  });
}

export function destroyMonitor(): void {
  reporter.stop();
  perfMonitor.flush();
}

export function wrapPage<T extends Record<string, unknown>>(options: T): T {
  const withPerf = perfMonitor.wrapPage(options);
  const withError = errorMonitor.wrapPage(withPerf);
  return withError;
}
