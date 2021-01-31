import unittest
import my_test
import time

driver_path = './drivers/chromedriver.exe'
wait_time = 5


class Login_Test(unittest.TestCase):

    def setUp(self):
        super().setUp()
        self.driver = None
        self.driver = my_test.get_driver(driver_path, set_headless=True)
        self.driver.implicitly_wait(wait_time)
        self.email, self.password = 'test@email.com', 'TestPassword'
        self.url = 'http://localhost:8100'
        my_test.go_to_site(self.driver, self.url)
        # print(self.driver.current_url)

    def test_login(self):
        print('yes')
        self.assertTrue('/landing' in self.driver.current_url)
        my_test.login(self.driver, self.email, self.password)
        time.sleep(1)
        print(self.driver.current_url)
        self.assertTrue('/main' in self.driver.current_url)

    def test_invalid_email_login(self):
        self.assertTrue('/landing' in self.driver.current_url)
        my_test.login(self.driver, 'fake_'+self.email, self.password)
        self.assertTrue('/landing' in self.driver.current_url)

    def test_invalid_password_login(self):
        self.assertTrue('/landing' in self.driver.current_url)
        my_test.login(self.driver, self.email, 'wrong_'+self.password)
        self.assertTrue('/landing' in self.driver.current_url)

    def tearDown(self):
        super().tearDown()
        self.driver.close()
        del(self.driver)
        del(self.email)
        del(self.password)
        del(self.url)


class FrontEndTest(unittest.TestCase):

    def setUp(self):
        super().setUp()
        self.driver = None
        self.driver = my_test.get_driver(driver_path, set_headless=True)
        self.driver.implicitly_wait(wait_time)
        self.email, self.password = 'test@email.com', 'TestPassword'
        self.url = 'http://localhost:8100'
        my_test.go_to_site(self.driver, self.url)
        my_test.login(self.driver, self.email, self.password)

    def test_go_to_weather(self):
        my_test.go_to_weather(self.driver)
        self.assertTrue('/Weather' in self.driver.current_url)

    def test_add_weather_card(self):
        self.skipTest('Not complete')
        count = my_test.add_weather_card(self.driver, 'charleston, SC')
        self.assertEqual(count, 1)

    def test_remove_weather_card(self):
        self.skipTest('Not complete')

    def test_add_friend(self):
        self.skipTest('Not complete')

    def test_remove_friend(self):
        self.skipTest('Not complete')

    def test_create_group(self):
        self.skipTest('Not complete')

    def test_delete_group(self):
        self.skipTest('Not complete')

    def toggle_notifications(self):
        self.skipTest('Not complete')

    def add_content_filter(self):
        self.skipTest('Not complete')

    def remove_content_filter(self):
        self.skipTest('Not complete')

    def change_username(self):
        self.skipTest('Not complete')

    def change_profile_picture(self):
        self.skipTest('Not complete')

    def tearDown(self):
        super().tearDown()
        self.driver.close()
        del(self.driver)
        del(self.email)
        del(self.password)
        del(self.url)

if __name__ == '__main__':
    unittest.main()