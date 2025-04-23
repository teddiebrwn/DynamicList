import { test, expect } from "@playwright/test";

test("homepage loads and shows title", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.getByText("Dynamic Island Todo List")).toBeVisible();
});

test("can open modal and add a task", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByText("Dynamic Island Todo List").click();
  await page.getByPlaceholder("Add a new task").fill("Playwright task");
  await page.locator("button:has(svg)").first().click();
  await expect(page.getByText("Playwright task")).toBeVisible();
});

test("can edit, cancel, and save a task", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByText("Dynamic Island Todo List").click();
  await page.getByPlaceholder("Add a new task").fill("Edit me");
  await page.locator("button:has(svg)").first().click();
  // Edit
  await page.locator('button[aria-label="edit"]').first().click();
  await page.getByPlaceholder("Edit task").fill("Edited task");
  // Cancel
  await page.locator('button[aria-label="cancel"]').first().click();
  await expect(page.getByText("Edit me")).toBeVisible();
  // Edit again and save
  await page.locator('button[aria-label="edit"]').first().click();
  await page.getByPlaceholder("Edit task").fill("Edited task");
  await page.locator('button[aria-label="save"]').first().click();
  await expect(page.getByText("Edited task")).toBeVisible();
});

test("can delete a task", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByText("Dynamic Island Todo List").click();
  await page.getByPlaceholder("Add a new task").fill("Delete me");
  await page.locator("button:has(svg)").first().click();
  await page.locator('button[aria-label="delete"]').first().click();
  await expect(page.getByText("Delete me")).not.toBeVisible();
});

test("can reorder tasks by drag and drop", async ({ page, browserName }) => {
  await page.goto("http://localhost:3000");
  await page.getByText("Dynamic Island Todo List").click();
  await page.getByPlaceholder("Add a new task").fill("Task 1");
  await page.locator("button:has(svg)").first().click();
  await page.getByPlaceholder("Add a new task").fill("Task 2");
  await page.locator("button:has(svg)").first().click();
  // Drag Task 2 above Task 1
  const task2 = page.getByText("Task 2");
  const task1 = page.getByText("Task 1");
  // Only run drag-and-drop if not WebKit (not supported well)
  if (browserName !== "webkit") {
    await task2.hover();
    await page.mouse.down();
    await task1.hover();
    await page.mouse.up();
    // After reorder, Task 2 should be above Task 1
    const items = await page.locator("ul > li > span").allTextContents();
    expect(items[0]).toContain("Task 2");
    expect(items[1]).toContain("Task 1");
  }
});
