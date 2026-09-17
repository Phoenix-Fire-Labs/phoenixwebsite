import { LLMS_TXT } from "@/lib/structured-data";

// trace:v1 id=impl.llms-txt work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-K2EA5BTM
export function GET() {
  return new Response(LLMS_TXT, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
