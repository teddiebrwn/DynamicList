# Test info

- Name: can delete a task
- Location: /Users/teddiebrwn/Documents/project/todo/tests/example.spec.ts:34:5

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).not.toBeVisible()

Locator: getByText('Delete me')
Expected: not visible
Received: visible
Call log:
  - expect.not.toBeVisible with timeout 5000ms
  - waiting for getByText('Delete me')
    9 × locator resolved to <span class="flex-1 cursor-pointer select-none font-medium transition-all duration-600 text-white/90">Delete me</span>
      - unexpected value "visible"

    at /Users/teddiebrwn/Documents/project/todo/tests/example.spec.ts:40:49
```

# Page snapshot

```yaml
- heading "Dynamic Island Todo List" [level=2]
- text: "1"
- textbox "Add a new task"
- button
- list:
  - button "Delete me edit delete":
    - text: Delete me
    - button "edit"
    - button "delete"
- status: Draggable item ae629111-3e31-43ed-b2ce-a36dcbd9fc65 was dropped over droppable area ae629111-3e31-43ed-b2ce-a36dcbd9fc65
- alert
- button "Open Next.js Dev Tools":
  - img
```

# Test source

```ts
   1 | import { test, expect } from "@playwright/test";
   2 |
   3 | test("homepage loads and shows title", async ({ page }) => {
   4 |   await page.goto("http://localhost:3000");
   5 |   await expect(page.getByText("Dynamic Island Todo List")).toBeVisible();
   6 | });
   7 |
   8 | test("can open modal and add a task", async ({ page }) => {
   9 |   await page.goto("http://localhost:3000");
  10 |   await page.getByText("Dynamic Island Todo List").click();
  11 |   await page.getByPlaceholder("Add a new task").fill("Playwright task");
  12 |   await page.locator("button:has(svg)").first().click();
  13 |   await expect(page.getByText("Playwright task")).toBeVisible();
  14 | });
  15 |
  16 | test("can edit, cancel, and save a task", async ({ page }) => {
  17 |   await page.goto("http://localhost:3000");
  18 |   await page.getByText("Dynamic Island Todo List").click();
  19 |   await page.getByPlaceholder("Add a new task").fill("Edit me");
  20 |   await page.locator("button:has(svg)").first().click();
  21 |   // Edit
  22 |   await page.locator('button[aria-label="edit"]').first().click();
  23 |   await page.getByPlaceholder("Edit task").fill("Edited task");
  24 |   // Cancel
  25 |   await page.locator('button[aria-label="cancel"]').first().click();
  26 |   await expect(page.getByText("Edit me")).toBeVisible();
  27 |   // Edit again and save
  28 |   await page.locator('button[aria-label="edit"]').first().click();
  29 |   await page.getByPlaceholder("Edit task").fill("Edited task");
  30 |   await page.locator('button[aria-label="save"]').first().click();
  31 |   await expect(page.getByText("Edited task")).toBeVisible();
  32 | });
  33 |
  34 | test("can delete a task", async ({ page }) => {
  35 |   await page.goto("http://localhost:3000");
  36 |   await page.getByText("Dynamic Island Todo List").click();
  37 |   await page.getByPlaceholder("Add a new task").fill("Delete me");
  38 |   await page.locator("button:has(svg)").first().click();
  39 |   await page.locator('button[aria-label="delete"]').first().click();
> 40 |   await expect(page.getByText("Delete me")).not.toBeVisible();
     |                                                 ^ Error: Timed out 5000ms waiting for expect(locator).not.toBeVisible()
  41 | });
  42 |
  43 | test("can reorder tasks by drag and drop", async ({ page, browserName }) => {
  44 |   await page.goto("http://localhost:3000");
  45 |   await page.getByText("Dynamic Island Todo List").click();
  46 |   await page.getByPlaceholder("Add a new task").fill("Task 1");
  47 |   await page.locator("button:has(svg)").first().click();
  48 |   await page.getByPlaceholder("Add a new task").fill("Task 2");
  49 |   await page.locator("button:has(svg)").first().click();
  50 |   // Drag Task 2 above Task 1
  51 |   const task2 = page.getByText("Task 2");
  52 |   const task1 = page.getByText("Task 1");
  53 |   // Only run drag-and-drop if not WebKit (not supported well)
  54 |   if (browserName !== "webkit") {
  55 |     await task2.hover();
  56 |     await page.mouse.down();
  57 |     await task1.hover();
  58 |     await page.mouse.up();
  59 |     // After reorder, Task 2 should be above Task 1
  60 |     const items = await page.locator("ul > li > span").allTextContents();
  61 |     expect(items[0]).toContain("Task 2");
  62 |     expect(items[1]).toContain("Task 1");
  63 |   }
  64 | });
  65 |
```