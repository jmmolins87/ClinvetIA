import { expect, test } from "@playwright/test"

test("home renders primary marketing actions", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("domcontentloaded")

  await expect(page).toHaveTitle(/Clinvet/i)
  await expect(page.locator('a[href="/demo"]').first()).toBeVisible({ timeout: 15000 })
  await expect(page.locator('a[href="/calculadora"]').first()).toBeVisible({ timeout: 15000 })
})

test("/solucion renders core value proposition", async ({ page }) => {
  await page.goto("/solucion")
  await page.waitForLoadState("domcontentloaded")

  await expect(page).toHaveURL(/\/solucion$/)
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 15000 })
  await expect(page.locator('a[href="/contacto"]').first()).toBeVisible({ timeout: 15000 })
})

test("/contacto renders contact flow", async ({ page }) => {
  await page.goto("/contacto")
  await page.waitForLoadState("domcontentloaded")

  await expect(page).toHaveURL(/\/contacto$/)
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 15000 })
  await expect(page.locator('input[name="nombre"]').first()).toBeVisible({ timeout: 15000 })
})

test("/admin/login renders admin access", async ({ page }) => {
  await page.goto("/admin/login")
  await page.waitForLoadState("domcontentloaded")

  await expect(page).toHaveURL(/\/admin\/login$/)
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 15000 })
  await expect(page.getByLabel(/email/i).first()).toBeVisible({ timeout: 15000 })
})
