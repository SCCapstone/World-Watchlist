# selenium web driver
import time

from selenium import webdriver
from selenium.webdriver.common.keys import Keys

def get_driver(driver_path):
    if 'gecko' in driver_path:
        return get_firefox_driver(driver_path)
    elif 'chrome' in driver_path:
        return get_chrome_driver(driver_path)
    print('Unknown driver "{}"'.format(driver_path))
    return None

def get_chrome_driver(driver_path):
    return webdriver.Chrome(driver_path)

def get_firefox_driver(driver_path):
    return webdriver.Firefox(executable_path=driver_path)

def login(driver, email, password):
    try:
        # email_input = driver.find_element_by_name('ion-input-0')
        email_input = driver.find_element_by_xpath('//*[@id="loginInputContainer"]/ion-item[1]/ion-input/input')
        email_input.send_keys(email)
        password_input = driver.find_element_by_xpath('//*[@id="loginInputContainer"]/ion-item[2]/ion-input/input')
        password_input.send_keys(password)
        driver.find_element_by_xpath('/html/body/div/ion-app/ion-router-outlet/div/ion-content/div/ion-button').click()
        print('Finished login attempt')
        time.sleep(10)
    finally:
        print('exiting login attempt')
        driver.close()

if __name__=='__main__':
    # driver = webdriver.Chrome('/mnt/c/tools/chromedriver_win32/chromedriver.exe')
    print('Getting driver')
    driver = get_driver(input("enter driver name: "))
    # driver = get_firefox_driver('./geckodriver.exe')
    # driver = get_chrome_driver('./chromedriver.exe')
    print('Logging in')
    driver.get('http://localhost:8100/landing')
    login(driver, 'dzhymir@yahoo.com', 'Password')

