import unittest
import my_test

class FrontEndTest(unittest.TestCase):
    def setUp(self):
        self.driver = None
        self.driver = my_test.get_driver('./drivers/chromedriver.exe')
        

        return super().setUp()
    def login_test(self):
        pass

    def weather_test(self):
        # assuming you logged in
        my_test.go_to_weather(self.driver)
        self.assertEqual('')

if __name__ == '__main__':
    unittest.main()