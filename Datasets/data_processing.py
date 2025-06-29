import pandas as pd
import numpy as np
from sklearn import preprocessing


invs = pd.read_csv("tij_pres_InVS13.csv")

res = invs.groupby(['SRC','DEST']).size().reset_index().rename(columns={0:'FREQ'})

compressed = pd.DataFrame(res)

print(compressed.head())


scaledfreq = pd.DataFrame(preprocessing.normalize([np.array(compressed['FREQ'])]))
scaledfreq = scaledfreq.transpose().rename(columns={0:"NormalizedFreq"})
print(scaledfreq.head())

compressed['NormFreq'] = scaledfreq['NormalizedFreq']

print(compressed)

compressed.to_csv('InVS13.csv')
