from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.firefox import GeckoDriverManager
import time
import pandas as pd
def get_states_links_statut():
    """
    This function responsible for filling  the 'link' and 'statut' fields in the dictionaries within property_details_lst.
    """
    page_number=0
    property_details_lst=[]
    while True:
        try:
            page_number=page_number+1
            website = 'https://www.properstar.fr/tunisie/acheter/appartement-maison?p='+str(page_number)
            driver.get(website)
            print("Start scripting")
            print("Getting state links from page number ",page_number)
            # Open the website
            states = WebDriverWait(driver, 10).until(
                    EC.presence_of_all_elements_located((By.XPATH, '//article[@class="item-adaptive card-basic vendor-hidden"]'))
                )
            state_index=0
            for state in states:
                state_index=state_index+1
                print("getting state ",state_index," link.")
                property_details_dic={}
                property_details_dic['statut']='Vente'
                #getting the link of the state
                link_element = WebDriverWait(state, 20).until(
                        EC.presence_of_element_located((By.XPATH, './/a[@class="link"]'))
                    )
                property_details_dic['link'] = link_element.get_attribute('href')
                print(property_details_dic['link'])
                property_details_lst.append(property_details_dic)
        except:
            print("no page found")
            break
    return property_details_lst    
def get_states_details(property_details_lst):
    """
    This function responsible for filling other fields in the dictionaries within property_details_lst.
    """
    for c in range(len(property_details_lst)):
        driver.get(property_details_lst[c]['link'])
        print("Sraping state number ",c+1)
        print(property_details_lst[c]['link'])
        try:
            property_details_lst[c]['title']= driver.find_element(By.XPATH,'//div[@class="main-info"]/h1').text
        except:
            property_details_lst[c]['title']=""
        try:
            property_details_lst[c]['address']=driver.find_element(By.XPATH,'//span[@class="item-info-address-inner-address"]').text
        except:
            property_details_lst[c]['address']=""
        
        try:
            property_details_lst[c]['prix']= driver.find_element(By.XPATH,'//div[@class="listing-price-main"]/span').text
        except:
            property_details_lst[c]['prix']=0    
    
        details=driver.find_elements(By.XPATH,'//div[@class="feature-content"]')
        for detail in details:
            try:
                key=detail.find_element(By.XPATH,'.//span[@class="property-key"]').text
                value=detail.find_element(By.XPATH,'.//span[@class="property-value"]').text
                property_details_lst[c][key]=value
            except:
                key=detail.find_element(By.XPATH,'.//span[@class="property-value"]').text
                value=1
                property_details_lst[c][key]=key
                property_details_lst[c][value]=value
    return property_details_lst

#Main programme
# Set up Firefox options
options = Options()
options.headless = True  # Run Firefox in headless mode
options.add_argument("--disable-gpu")  # Disable GPU (fixes some headless issues)
options.add_argument("--no-sandbox")  # Avoid sandboxing issues
options.add_argument("--disable-dev-shm-usage")  # Improve performance in Docker/Linux

# Create a Service object with automatic driver management
service = Service(GeckoDriverManager().install())

# Initialize WebDriver correctly
driver = webdriver.Firefox(service=service, options=options)
driver.set_page_load_timeout(300)  # Increase timeout to 5 minutes

print("start scraping ")
# Open the website
property_details_lst=get_states_links_statut()
print("Number of states to scrape: ",len(property_details_lst))
property_details_lst=get_states_details(property_details_lst)
print(property_details_lst)
print("end of scraping")
#creating the dataframe and transform it into a csv file
df=pd.DataFrame(property_details_lst)
df.to_csv('properstar_vente.csv',index=False)
# Close the driver
driver.quit()