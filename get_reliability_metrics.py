import os
import json
import re
from collections import OrderedDict
from pprint import pprint
from itertools import combinations


HULLS_DIR = '/Users/egossett/HULLS'
BINARY_DIR = HULLS_DIR + '/binaries'
TERNARY_DIR = HULLS_DIR + '/ternaries'

elements = [
  'Ag',
  'Al',
  'As',
  'Au',
  'B',
  'Ba',
  'Be',
  'Bi',
  'Br',
  'C',
  'Ca',
  'Cd',
  'Ce',
  'Cl',
  'Co',
  'Cr',
  'Cu',
  'Dy',
  'Er',
  'Eu',
  'F',
  'Fe',
  'Ga',
  'Gd',
  'Ge',
  'Hf',
  'Hg',
  'Ho',
  'I',
  'In',
  'Ir',
  'K',
  'La',
  'Li',
  'Lu',
  'Mg',
  'Mn',
  'Mo',
  'N',
  'Na',
  'Nb',
  'Nd',
  'Ni',
  'O',
  'Os',
  'P',
  'Pb',
  'Pd',
  'Pr',
  'Pt',
  'Re',
  'Rh',
  'Ru',
  'S',
  'Sb',
  'Sc',
  'Se',
  'Si',
  'Sm',
  'Sn',
  'Sr',
  'Ta',
  'Tb',
  'Tc',
  'Te',
  'Ti',
  'Tl',
  'Tm',
  'V',
  'W',
  'Y',
  'Yb',
  'Zn',
  'Zr',
  'H',
  'Cs',
  'Rb',
  'Kr',
  'Xe',
  'He',
  'Ne',
  'Pm',
  'Ar',
  'At',
  'Po',
  'Rn'
]


def getUnavailabile():
    unavailable = OrderedDict()
    unavailable['selected'] = 'unavailable'
    for el in elements:
        unavailable[el] = {
            'availability': False,
            'reliability': None
        }
    return unavailable


def getDefault():
    default = OrderedDict()
    default['selected'] = 'default'
    for el in elements:
        default[el] = {
            'availability': False,
            'reliability': None
        }

    found = []
    for root, dirs, files in os.walk(BINARY_DIR):
        for name in files:
            if name.endswith('.json'):
                hull_name = name.replace('_hull.json', '')
                hull_species = re.findall('[A-Z][^A-Z]*', hull_name)
                for h in hull_species:
                    found.append(h)

    for el in found:
        default[el]['availability'] = True

    return default


def getBinaryMetrics():
    binary_metrics = []
    for el in elements:
        hull_metric = OrderedDict()
        hull_metric['selected'] = el

        for possible_choices in elements:
            if possible_choices != el:
                hull_metric[possible_choices] = {
                    'availability': False,
                    'reliability': None
                }

        for root, dirs, files in os.walk(BINARY_DIR):
            for name in files:
                if name.endswith('.json'):
                    hull_name = name.replace('_hull.json', '')
                    hull_species = re.findall('[A-Z][^A-Z]*', hull_name)
                    if el in hull_species:
                        del hull_species[hull_species.index(el)]
                        hull_metric[hull_species[0]]['availability'] = True

                        file_path = root + '/' + name
                        with open(file_path, 'r') as f:
                            hull_json = json.load(f)
                            count = 0
                            for point in hull_json['points']:
                                if (point['composition'][0] > 0 and
                                        point['composition'][1] > 0):
                                    count += 1
                            hull_metric[hull_species[0]]['reliability'] = (
                                count
                            )
        binary_metrics.append(hull_metric)
    return binary_metrics


def getTernaryMetrics():
    ternary_metrics = []
    for combo in combinations(elements, 2):
        hull_metric = OrderedDict()
        hull_metric['selected'] = ''.join(combo)

        for possible_choices in elements:
            if possible_choices != combo[0] and possible_choices != combo[1]:
                hull_metric[possible_choices] = {
                    'availability': False,
                    'reliability': None
                }
        for root, dirs, files in os.walk(TERNARY_DIR):
            for name in files:
                if name.endswith('.json'):
                    hull_name = name.replace('_hull.json', '')
                    hull_species = re.findall('[A-Z][^A-Z]*', hull_name)
                    if (combo[0] in hull_species and
                            combo[1] in hull_species):
                        del hull_species[hull_species.index(combo[0])]
                        del hull_species[hull_species.index(combo[1])]
                        hull_metric[hull_species[0]]['availability'] = True

                        file_path = root + '/' + name
                        with open(file_path, 'r') as f:
                            hull_json = json.load(f)
                            count = 0
                            # count each binaries in ternary ABC -> 012
                            #        AB  AC  BC
                            #        01  02  12
                            count = [0, 0, 0]
                            for point in hull_json['points']:
                                if (point['composition'][0] > 0 and
                                        point['composition'][1] > 0):
                                    count[0] += 1
                                if (point['composition'][0] > 0 and
                                        point['composition'][2] > 0):
                                    count[1] += 1
                                if (point['composition'][1] > 0 and
                                        point['composition'][2] > 0):
                                    count[2] += 1
                            count.sort()
                            hull_metric[hull_species[0]]['reliability'] = (
                                count[0]
                            )
        ternary_metrics.append(hull_metric)
    return ternary_metrics


'''
def getTernaryMetrics():
    ternary_metrics = []
    for root, dirs, files in os.walk(TERNARY_DIR):
        for name in files:
            if name.endswith('.json'):
                file_path = root + '/' + name
                with open(file_path, 'r') as f:
                    hull_metric = {}
                    hull_json = json.load(f)
                    # count each binaries in ternary ABC -> 012
                    #        AB  AC  BC
                    #        01  02  12
                    count = [0, 0, 0]
                    for point in hull_json['points']:
                        if (point['composition'][0] > 0 and
                                point['composition'][1] > 0):
                            count[0] += 1
                        if (point['composition'][0] > 0 and
                                point['composition'][2] > 0):
                            count[1] += 1
                        if (point['composition'][1] > 0 and
                                point['composition'][2] > 0):
                            count[2] += 1
                    count.sort()
                    hull_metric['hull'] = hull_json['name']
                    hull_metric['reliability'] = count[0]
                ternary_metrics.append(hull_metric)
    return ternary_metrics

'''

'''
with open('default_metric.json', 'w') as outfile:
    json.dump(getDefault(), outfile, indent=2)
'''

'''
with open('binary_metrics.json', 'w') as outfile:
    json.dump(getBinaryMetrics(), outfile, indent=2)
'''

'''
with open('ternary_metrics.json', 'w') as outfile:
    json.dump(getTernaryMetrics(), outfile, indent=2)
'''

with open('unavailable_metric.json', 'w') as outfile:
    json.dump(getUnavailabile(), outfile, indent=2)
