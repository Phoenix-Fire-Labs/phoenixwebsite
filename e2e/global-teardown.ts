import { removePreviewEnv } from "./preview-env";

// trace:exempt reason=test-harness
export default function globalTeardown() {
  removePreviewEnv();
}
