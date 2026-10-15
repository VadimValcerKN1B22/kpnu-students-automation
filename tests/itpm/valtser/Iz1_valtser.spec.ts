import { test, expect } from '@playwright/test';
import { fakerDataGenerator } from '@utils/helpers/fakerGeneratedData';
import dotenv from 'dotenv';

dotenv.config();

test.describe('ITPM Lab 10 - User Registration and Verification', () => {
  test('Action: Реєстрація нового користувача та Assertion: перевірка імені у header', async ({ page }) => {
    // 1. Генерація тестових даних за інструкцією до лабораторної
    const registrationData = fakerDataGenerator.generateNewUserData();
    registrationData.firstname = 'Vadym';
    registrationData.lastname = 'Valtser';

    const fullName = `${registrationData.firstname} ${registrationData.lastname}`;

    // 2. Action: перехід на сайт
    await page.goto(process.env.BASE_URL || 'https://automationexercise.com');

    // Клік по кнопці Signup / Login у навігаційному меню
    await page.getByRole('link', { name: /Signup \/ Login/i }).click();

    // Заповнення форми "New User Signup!"
    await page.locator('[data-qa="signup-name"]').fill(fullName);
    await page.locator('[data-qa="signup-email"]').fill(registrationData.email);
    await page.locator('[data-qa="signup-button"]').click();

    // Заповнення обов'язкових полів анкети реєстрації (якщо сайт перекидає на другий крок)
    const passwordInput = page.locator('[data-qa="password"]');
    if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await page.locator('#id_gender1').check(); // Обрати стать (Mr.)
      await passwordInput.fill('Test_12345');
      await page.locator('[data-qa="days"]').selectOption('1');
      await page.locator('[data-qa="months"]').selectOption('1');
      await page.locator('[data-qa="years"]').selectOption('2000');

      await page.locator('[data-qa="first_name"]').fill(registrationData.firstname);
      await page.locator('[data-qa="last_name"]').fill(registrationData.lastname);
      await page.locator('[data-qa="address"]').fill('Shevchenka Street 1');
      await page.locator('[data-qa="country"]').selectOption('Canada');
      await page.locator('[data-qa="state"]').fill('Ontario');
      await page.locator('[data-qa="city"]').fill('Toronto');
      await page.locator('[data-qa="zipcode"]').fill('12345');
      await page.locator('[data-qa="mobile_number"]').fill('+380671112233');

      // Натискання кнопки Create Account
      await page.locator('[data-qa="create-account"]').click();

      // Натискання кнопки Continue після створення акаунту
      await page.locator('[data-qa="continue-button"]').click();
    }

    // 3. Assertion: Перевірка наявності власного імені у верхньому меню (header)
    const headerGreeting = page.locator('header').getByText(/Logged in as Vadym|Welcome, Vadym/i);
    await expect(headerGreeting).toBeVisible();
  });
});