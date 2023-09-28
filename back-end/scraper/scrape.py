from selenium import webdriver
from selenium.webdriver.common.by import By
import requests
import io
from PIL import Image
import time
import random
from proxyscrape import create_collector

# Create a proxy collector to obtain proxy servers
proxy_collector = create_collector('my-proxy-collector', 'http')

def get_proxy():
    # Get a random proxy server from the collector
    proxy = proxy_collector.get_proxy()
    return proxy.host + ':' + proxy.port

def get_images(wd, delay, max_images, use_proxy):
    def scroll_down(wd):
        wd.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(delay)

    url = "https://www.google.com/search?q=karipap&tbm=isch&ved=2ahUKEwj8q8WAqJiBAxUo3DgGHcmuCxMQ2-cCegQIABAA&oq=karipap&gs_lcp=CgNpbWcQAzIKCAAQigUQsQMQQzIHCAAQigUQQzIFCAAQgAQyBwgAEIoFEEMyBQgAEIAEMgUIABCABDIHCAAQigUQQzIFCAAQgAQyBwgAEIoFEEMyBwgAEIoFEEM6BAgjECc6BwgAEBgQgAQ6CAgAEIAEELEDOggIABCxAxCDAToECAAQA1C1CFi0DWCDD2gAcAB4AIABRIgBvQOSAQE4mAEAoAEBqgELZ3dzLXdpei1pbWfAAQE&sclient=img&ei=z6j5ZLyIA6i44-EPyd2umAE&bih=923&biw=1920&rlz=1C1VDKB_enMY1042MY1042"

    if use_proxy:
        # Get a proxy server
        proxy = get_proxy()
        print('Using proxy:', proxy)
        webdriver.DesiredCapabilities.CHROME['proxy'] = {
            "httpProxy": proxy,
            "ftpProxy": proxy,
            "sslProxy": proxy,
            "proxyType": "MANUAL",
        }

    wd.get(url)

    image_urls = set()
    skips = 0

    while len(image_urls) < max_images:
        thumbnails = wd.find_elements(By.CLASS_NAME, "Q4LuWd")
        total_thumbnails = len(thumbnails)

        for i in range(skips, total_thumbnails):
            thumbnail = thumbnails[i]
            try:
                thumbnail.click()
                time.sleep(delay)
            except:
                continue

            images = wd.find_elements(By.CLASS_NAME, "pT0Scc")
            for image in images:
                if image.get_attribute('src') in image_urls:
                    skips += 1
                    break

                if image.get_attribute('src') and 'http' in image.get_attribute('src'):
                    image_urls.add(image.get_attribute('src'))
                    print(f"Found {len(image_urls)} of {max_images}")

            if len(image_urls) >= max_images:
                break

        if len(image_urls) < max_images:
            scroll_down(wd)

    return list(image_urls)[:max_images]  # Convert set to list and trim to max_images count

def download_image(download_path, url, file_name):
    try:
        image_content = requests.get(url).content
        image_file = io.BytesIO(image_content)
        image = Image.open(image_file)
        file_path = download_path + file_name

        with open(file_path, "wb") as f:
            image.save(f, "JPEG")

        print("Success")
    except Exception as e:
        print('FAILED - ', e)
        return

wd = webdriver.Chrome(options=webdriver.ChromeOptions())

use_proxy = True  # Set this to True if you want to use proxy server rotation
urls = get_images(wd, 2, 300, use_proxy)

for i, url in enumerate(urls):
    download_image("../images_v2/original/karipap/", url, "karipap_" + str(i) + ".jpg")

wd.quit()

## https://www.youtube.com/watch?v=N03-uIovXZU&ab_channel=NaveenAutomationLabs --> Selenium 4.11.0 & Chrome 116