import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/health/route";

describe("Health API Route", () => {
  it("returns operational status 200 with diagnostics", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe("healthy");
    expect(data.services.nextServer.status).toBe("operational");
    expect(data.services.clientFeatures.aiCoach).toBe("operational");
  });
});
