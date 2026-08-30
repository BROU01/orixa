import { test, expect } from '@playwright/test';

/**
 * Tests de fumée — vérifient que les pages critiques du parcours d'achat
 * répondent réellement en production, pour attraper les régressions du
 * type de celle corrigée le 30 août 2026 (toutes les fiches produit
 * renvoyaient 404 à cause d'un `searchParams` non attendu).
 */

test('la page d’accueil répond', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/MAISON LA GRACE/);
});

test('la boutique liste des produits', async ({ page }) => {
  const response = await page.goto('/boutique');
  expect(response?.status()).toBe(200);
  const links = page.locator('a[href^="/produit/"]');
  await expect(links.first()).toBeVisible();
});

test('une fiche produit par slug répond 200', async ({ page }) => {
  const response = await page.goto('/produit/beurre-de-karite');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toContainText('Beurre de karité');
});

test('l’ancienne URL ?id= redirige vers la nouvelle URL par slug', async ({ page }) => {
  const response = await page.goto('/produit?id=karite');
  expect(response?.status()).toBe(200); // 200 après redirection suivie
  expect(page.url()).toContain('/produit/beurre-de-karite');
});

test('/produit sans id renvoie une 404', async ({ page }) => {
  const response = await page.goto('/produit');
  expect(response?.status()).toBe(404);
});

test('un slug produit inexistant renvoie une 404', async ({ page }) => {
  const response = await page.goto('/produit/ce-produit-n-existe-pas');
  expect(response?.status()).toBe(404);
});

test('la page contact affiche le formulaire', async ({ page }) => {
  const response = await page.goto('/contact');
  expect(response?.status()).toBe(200);
  await expect(page.locator('#contact-email')).toBeVisible();
});
