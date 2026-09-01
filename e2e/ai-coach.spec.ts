import { test, expect } from "@playwright/test";

test.describe("AI Coach Primary User Flow (E2E)", () => {
  test("submits a coaching prompt and renders streamed AI guidance", async ({ page }) => {
    // Intercept /api/chat route to return mock SSE/Text stream response cleanly
    await page.route("**/api/chat", async (route) => {
      const mockResponseBody = `### Strategic Leadership Guidance\n\n1. Anchor accomplishments with quantifiable impact metrics.\n2. Rehearse STAR behavioral scenarios.`;
      await route.fulfill({
        status: 200,
        contentType: "text/plain; charset=utf-8",
        body: mockResponseBody,
      });
    });

    // 1. Navigate to AI Coach page
    await page.goto("/ai-coach");

    // 2. Verify page header
    await expect(page.getByRole("heading", { name: "CareerForge AI Coach" })).toBeVisible();

    // 3. Select a starter prompt card
    const starterCard = page.getByRole("button", { name: /STAR Behavioral Interview/i });
    await expect(starterCard).toBeVisible();
    await starterCard.click();

    // 4. Verify input field populates
    const input = page.getByPlaceholder("Ask your career coach anything or practice interview questions...");
    await expect(input).toHaveValue(/mock behavioral interview/i);

    // 5. Submit the message via Send button
    const sendButton = page.getByTitle("Send message");
    await sendButton.click();

    // 6. Verify user message appears in chat
    await expect(page.getByText(/mock behavioral interview/i)).toBeVisible();

    // 7. Verify streamed assistant response renders in UI
    await expect(page.getByRole("heading", { name: "Strategic Leadership Guidance" })).toBeVisible();
    await expect(page.getByText("Anchor accomplishments with quantifiable impact metrics.")).toBeVisible();
  });
});
