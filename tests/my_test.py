import selenium
import time
import argparse

from selenium import webdriver
from selenium.webdriver.common.keys import Keys

def get_driver(driver_path):
    if 'gecko' in driver_path:
        return webdriver.Firefox(executable_path=driver_path)
        # return get_firefox_driver(driver_path)
    elif 'chrome' in driver_path:
        return webdriver.Chrome(driver_path)
        # return get_chrome_driver(driver_path)
    print('Unknown driver "{}"'.format(driver_path))
    return None

def get_chrome_driver(driver_path):
    return webdriver.Chrome(driver_path)

def get_firefox_driver(driver_path):
    return webdriver.Firefox(executable_path=driver_path)

def go_to_site(driver, url):
    print('Current url: {}'.format(driver.current_url))
    if driver.current_url != url:
        print('Changing url')
        driver.get(url)
        print(driver.current_url)
    print('Succeeded in getting to site' if driver.current_url == url else 'Failed to get to site')

def write_to_bar(driver, xpath, string_to_send):
    driver.find_element_by_xpath(xpath).send_keys(string_to_send)

def clear_bar(driver, xpath):
    driver.find_element_by_xpath(xpath).clear()

def click_button_xpath(driver, xpath):
    driver.find_element_by_xpath(xpath).click()

def click_button_css_selector(driver, selector):
    driver.find_element_by_css_selector(selector)

def click_tab(driver, tab_name):
    if tab_name == 'feed':
        click_button_xpath(driver, '//*[@id="tab-button-feed"]')
        # driver.find_element_by_xpath('//*[@id="tab-button-feed"]').click()
    elif tab_name == 'social':
        click_button_xpath(driver, '//*[@id="tab-button-social"]')
        # driver.find_element_by_xpath('//*[@id="tab-button-social"]').click()
    elif tab_name == 'settings':
        click_button_xpath(driver, '//*[@id="tab-button-settings"]')
        # driver.find_element_by_xpath('//*[@id="tab-button-settings"]').click()
    return driver.current_url

def login(driver, email, password):
    print('Logging in')
    write_to_bar(driver, '//*[@id="loginInputContainer"]/ion-item[1]/ion-input/input', email)
    write_to_bar(driver, '//*[@id="loginInputContainer"]/ion-item[2]/ion-input/input', password)
    click_button_xpath(driver, '/html/body/div/ion-app/ion-router-outlet/div/ion-content/div/ion-button')
    print('Finished login attempt')
    time.sleep(2)
    return '/main' in driver.current_url
    # finally:
    #     print('exiting login attempt')
    #     driver.close()

def logout():
    pass

def go_to_requests(driver):
    click_tab(driver, 'social')
    click_button_xpath(driver, '//*[@id="root"]/ion-app/ion-router-outlet/div[2]/ion-tabs/div/ion-router-outlet/div[2]/ion-header/ion-toolbar/ion-buttons[1]/ion-button')

def add_friend(driver, username):
    click_tab('social')
    click_button_xpath(driver, '//*[@id="root"]/ion-app/ion-router-outlet/div/ion-tabs/div/ion-router-outlet/div[2]/ion-header/ion-toolbar/ion-buttons[2]/ion-button//button)')
    click_button_xpath(driver, '//*[@id="ion-overlay-4"]/div[2]/div[2]/div/ion-content/ion-list/ion-item[1]')
    write_to_bar(driver, '//*[@id="addFriendSearch"]', username)
    click_button_xpath(driver, '//*[@id="addFriendButton"]//button')
    click_button_xpath(driver, '//*[@id="addFriendModalCloseButton"]//button')

    # try:
    #     driver.find_element_by_xpath('//*[@id="tab-button-social"]').click()
    #     driver.find_element_by_xpath('//*[@id="root"]/ion-app/ion-router-outlet/div/ion-tabs/div/ion-router-outlet/div[2]/ion-header/ion-toolbar/ion-buttons[2]/ion-button//button)').click()
    #     driver.find_element_by_xpath('//*[@id="ion-overlay-4"]/div[2]/div[2]/div/ion-content/ion-list/ion-item[1]').click()
    #     driver.find_element_by_xpath('//*[@id="addFriendSearch"]').send_keys(username)
    #     driver.find_element_by_xpath('//*[@id="addFriendButton"]//button').click()
    # finally:
    #     driver.close()

def remove_friend(driver, username):
    pass

def block_user(driver, username):
    pass

def create_group(driver, group_name):
    click_tab('social')
    click_button_xpath(driver, '//*[@id="root"]/ion-app/ion-router-outlet/div/ion-tabs/div/ion-router-outlet/div[2]/ion-header/ion-toolbar/ion-buttons[2]/ion-button//button)')
    click_button_xpath(driver, '//*[@id="ion-overlay-9"]/div[2]/div[2]/div/ion-content/ion-list/ion-item[2]')
    write_to_bar(driver, '//*[@id="ion-overlay-10"]/div[2]/div/ion-content/ion-input/input', group_name)
    click_button_xpath(driver, '//*[@id="createGroupButton"]//button')

def new_message(driver, message):
    click_tab('social')
    click_button_xpath(driver, '//*[@id="root"]/ion-app/ion-router-outlet/div/ion-tabs/div/ion-router-outlet/div[2]/ion-header/ion-toolbar/ion-buttons[2]/ion-button//button)')
    click_button_xpath(driver, '//*[@id="ion-overlay-9"]/div[2]/div[2]/div/ion-content/ion-list/ion-item[3]')

def get_incoming_outcoming(driver):
    go_to_requests(driver)
    incoming = driver.find_elements_by_css_selector('#ion-overlay-5 > div.modal-wrapper.ion-overlay-wrapper.sc-ion-modal-md > div > ion-content > ion-item')
    outcoming = driver.find_elements_by_css_selector('#ion-overlay-4 > div.modal-wrapper.ion-overlay-wrapper.sc-ion-modal-md > div > ion-content > ion-item')
    return incoming, outcoming

def go_to_weather(driver):
    click_tab(driver, 'feed')
    click_button_xpath(driver, '//*[@id="root"]/ion-app/ion-router-outlet/div/ion-tabs/div/ion-router-outlet/div/ion-header/ion-toolbar/ion-buttons/ion-button')
    # should be at url/Weather

def toggle_notifications(driver):
    pass

def add_content_filter(driver, filter):
    pass

def change_username(driver):
    pass

def change_profile_pic(driver):
    pass

def weather_test(driver):
    go_to_weather(driver)
    time.sleep(2)
    search_bar_xpath, search_submit_xpath = '//*[@id="root"]/ion-app/ion-router-outlet/div/ion-content/ion-searchbar/div/input', '//*[@id="searchButton"]'
    card_container_xpath = '//*[@id="children-pane"]'
    print(str(len(driver.find_element_by_xpath(card_container_xpath).find_elements_by_tag_name('ion-card'))))
    write_to_bar(driver, search_bar_xpath, 'charleston, SC')
    click_button_xpath(driver, search_submit_xpath)
    time.sleep(2)
    clear_bar(driver, search_bar_xpath)
    print(str(len(driver.find_element_by_xpath(card_container_xpath).find_elements_by_class_name('ion-card'))))
    write_to_bar(driver, search_bar_xpath, 'Seattle, Washington')
    click_button_xpath(driver, search_submit_xpath)
    time.sleep(2)
    print(str(len(driver.find_element_by_xpath(card_container_xpath).find_elements_by_class_name('ion-card'))))
    click_button_xpath(driver, '//*[@id="root"]/ion-app/ion-router-outlet/div/ion-header/ion-toolbar/ion-button')

def social_test(driver):
    add_friend(driver, 'TheGreatMagi#0')
    create_group(driver, 'Test1')
    # new_message(driver, 'New message')

def settings_test(driver):
    toggle_notifications()
    add_content_filter()
    change_username()
    change_profile_pic()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Selenium and web testing')
    parser.add_argument('driver_path', nargs=1, help='Path to driver for desired web browser')
    parser.add_argument('url', nargs=1, help="URL for website")
    parser.add_argument('email', nargs=1)
    parser.add_argument('password', nargs=1)

    args = parser.parse_args()
    driver, url = get_driver(args.driver_path[0]), args.url[0]
    email, password = args.email[0], args.password[0]

    # print('Driver worked: {}\nURL: {}'.format(driver is not None, url))
    # print('Email: {}, Password: {}'.format(email, '*' * len(password)))
    try:
        go_to_site(driver, url)
        print(driver.current_url)
        login(driver, email, password)
        main_page = driver.current_url
        weather_test(driver)
        # print(dir(driver))
        social_test(driver)
        settings_test(driver)
    finally:
        driver.close()
