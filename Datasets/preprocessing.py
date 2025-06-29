import pandas as pd
import numpy as np

from sklearn import preprocessing

invs15 = pd.read_csv('tij_pres_InVS15.csv')

lyonSchool = pd.read_csv('tij_pres_LyonSchool.csv',header = None)


#print(lyonSchool.head())

invs15 = invs15.groupby(['SRC','DEST']).size().reset_index().rename(columns={0:'FREQ'})
#print(invs15.head())

scaledfreq = pd.DataFrame(preprocessing.normalize([np.array(invs15['FREQ'])]))

scaledfreq = scaledfreq.transpose().rename(columns={0:"NormalizedFreq"})

#print(scaledfreq.head())

invs15['NormFreq'] = scaledfreq['NormalizedFreq']

#print(invs15)

#invs15.to_csv('InVS15.csv')

#lyonSchool.rename(columns= {1:"SRC", 2:"DEST"})
lyonSchool.columns = ['Id','SRC','DEST']

lyonSchool = lyonSchool.groupby(['SRC','DEST']).size().reset_index().rename(columns={0:'FREQ'})

lyonscaledfreq = pd.DataFrame(preprocessing.normalize([np.array(lyonSchool['FREQ'])]))

lyonscaledfreq = lyonscaledfreq.transpose().rename(columns = {0:'NormalizedFreq'})

lyonSchool['NormFreq']= lyonscaledfreq['NormalizedFreq']

print(lyonSchool)

lyonSchool.to_csv('LyonSchool.csv')
