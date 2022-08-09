import requests
import json
import pandas as pd
import schedule
import time
from urllib.request import urlopen

def safediv(x, y):
    try:
        return x / y
    except ZeroDivisionError:
        return 0
def func():

    #df = pd.read_excel('https://ossmedia.sos.state.mn.us/MediaInfo/Congressional-District-1-Special-Election-Results.xlsx',sheet_name = 'PrecinctResults')
    df = pd.read_excel(
        'Congressional-District-1-Special-Election-Results.xlsx',
        sheet_name='PrecinctResults')
    name=['County Name','County Code','Precinct name','Precinct Code','2022 Congressional','2020 Congressional','Legislative','McClellan - GLC','Reisdorf - LMN','Finstad - R','Ettinger - DFL','Write In']

    df =df.drop(index =[0])
    df.columns = name
    df =df.reset_index()
    

    df.insert(0, "ID",df['County Code'].astype(str).str.zfill(2)+ df['Precinct Code'].astype(str))
    df.insert(0, 'Total', df['McClellan - GLC'] + df['Reisdorf - LMN'] + df['Finstad - R'] + df['Ettinger - DFL'] + df['Write In'])

    df.insert(0,"Margin",safediv(df['Ettinger - DFL']-df['Finstad - R'],df['Total']))



    Counties = df.groupby(df['County Code'])[['McClellan - GLC','Reisdorf - LMN','Finstad - R','Ettinger - DFL','Write In']].sum().reset_index()

    Counties.insert(0, 'Total',Counties['McClellan - GLC']+Counties['Reisdorf - LMN']+Counties['Finstad - R']+Counties['Ettinger - DFL']+Counties['Write In'])
    Counties.insert(0,'Margin',safediv(Counties['Ettinger - DFL']-Counties['Finstad - R'], Counties['Total']))

    df.to_csv('Output.csv', index=False)
    Counties.to_csv('Topline.csv',index=False)

    file_name='MN_Precincts.geojson'
    df = df.dropna()
    #Counties = Counties.dropna()

    #with open(file_name, 'r', encoding='utf-8') as f:
    #    data = json.load(f)

    with urlopen("https://raw.githubusercontent.com/Napervillpol/MN-1st-District-Special/main/MN_Precincts.geojson") as response:
        source = response.read()

    data = json.loads(source)
    i = 0



    for features in data['features']:

    
        features['properties']['DEM_VOTES']= 0
        features['properties']['GOP_VOTES']= 0
        features['properties']['MARGIN']= 0
        features['properties']['TOTAL_VOTES']= 0

        for Precincts in df['ID']:

            if features['properties']['ID'] == Precincts:

                features['properties']['DEM_VOTES'] = int(df['Ettinger - DFL'][i])
                features['properties']['GOP_VOTES'] =int(df['Finstad - R'][i])
                features['properties']['TOTAL_VOTES'] = int(df['Total'][i])
                features['properties']['MARGIN'] = float(df['Margin'][i])
            i = i + 1


        i = 0;

    with open('Precincts_Output.geojson', 'w') as f:
        json.dump(data, f, indent=2)
        print("The Precinct json file is created")



    file_name = 'MN_Precincts.geojson'

    # with open(file_name, 'r', encoding='utf-8') as f:
    #    data = json.load(f)

    with urlopen(
            "https://raw.githubusercontent.com/Napervillpol/MN-1st-District-Special/main/MN_Counties.geojson") as response:
        source = response.read()

    data = json.loads(source)
    i = 0

    for features in data['features']:

        features['properties']['DEM_VOTES'] = 0
        features['properties']['GOP_VOTES'] = 0
        features['properties']['MARGIN'] = 0
        features['properties']['TOTAL_VOTES'] = 0

        for Precincts in Counties['County Code']:



            if features['properties']['COUN'] == Precincts:
                features['properties']['DEM_VOTES'] = int(Counties['Ettinger - DFL'][i])
                features['properties']['GOP_VOTES'] = int(Counties['Finstad - R'][i])
                features['properties']['TOTAL_VOTES'] = int(Counties['Total'][i])
                features['properties']['MARGIN'] = float(Counties['Margin'][i])

            i = i + 1

        i = 0;

    # json_data = json.dumps(data)

    with open('Counties_Output.geojson', 'w') as f:
        json.dump(data, f, indent=2)
        print("The County json file is created")

#schedule.every(1).minutes.do(func)

#while True:
    #schedule.run_pending()
    #time.sleep(1)
func()