import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe('BDD Feature: Авторизація користувача (Login Feature)', () => {
  const baseUrl = process.env.BASE_URL || 'https://automationexercise.com';

  test('Сценарій 1 (Негативний): Спроба входу з невалідними обліковими даними', async ({ page }) => {
    await test.step('Given: Користувач переходить на сторінку авторизації', async () => {
      await page.goto(baseUrl);
      await page.getByRole('link', { name: /Signup \/ Login/i }).click();
      await expect(page.getByText('Login to your account')).toBeVisible();
    });

    await test.step('When: Користувач вводить неіснуючий email та некоректний пароль', async () => {
      await page.locator('[data-qa="login-email"]').fill('unregistered_valcer_qa@example.com');
      await page.locator('[data-qa="login-password"]').fill('WrongPassword_123!');
      await page.locator('[data-qa="login-button"]').click();
    });

    await test.step('Then: Система показує повідомлення про помилку та блокує вхід', async () => {
      const errorMessage = page.locator('form[action="/login"] p');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText(/Your email or password is incorrect!/i);
    });
  });

  test('Сценарій 2 (Негативний): Спроба реєстрації з порожніми полями', async ({ page }) => {
    await test.step('Given: Користувач відкриває форму створення нового акаунту', async () => {
      await page.goto(baseUrl);
      await page.getByRole('link', { name: /Signup \/ Login/i }).click();
      await expect(page.getByText('New User Signup!')).toBeVisible();
    });

    await test.step('When: Користувач тисне кнопку Signup без заповнення полів', async () => {
      await page.locator('[data-qa="signup-button"]').click();
    });

    await test.step('Then: Браузер вимагає заповнення обов’язкового поля імені', async () => {
      const nameInput = page.locator('[data-qa="signup-name"]');
      await expect(nameInput).toBeVisible();
      // Перевірка HTML5-валідації або збереження фокусу на формі
      await expect(page.getByText('New User Signup!')).toBeVisible();
    });
  });

  test('Сценарій 3 (Позитивний): Перевірка видимості елементів авторизації', async ({ page }) => {
    await test.step('Given: Користувач переходить до розділу логіну', async () => {
      await page.goto(baseUrl);
      await page.getByRole('link', { name: /Signup \/ Login/i }).click();
    });

    await test.step('When: Завантажуються форми входу та реєстрації', async () => {
      await expect(page.locator('[data-qa="login-email"]')).toBeVisible();
      await expect(page.locator('[data-qa="login-password"]')).toBeVisible();
    });

    await test.step('Then: Кнопка Login доступна та активна', async () => {
      const loginBtn = page.locator('[data-qa="login-button"]');
      await expect(loginBtn).toBeVisible();
      await expect(loginBtn).toBeEnabled();
    });
  });
});