#! /usr/bin/env python
import time
import logging
import argparse
import ConfigParser
import json
import os
import re
import libnoise
from rendererimagenetwork import *
# Read config
parser = argparse.ArgumentParser(description='NoiseServer')

parser.add_argument("--network", type=str, help="The network config file to use", default="./network.conf", metavar="FILE")
parser.add_argument("--logfile", help="Logfile", type=str)

args,remaining_args = parser.parse_known_args()

defaults = {
}


	
parser.set_defaults(**defaults)


#args = parser.parse_args(remaining_args)

logfile = args.logfile

logging.basicConfig(filename=logfile, level=logging.INFO, format='%(asctime)-15s %(message)s')

network = json.load(open(args.network))


build_network = {}


special_setters = [
 "SourceModule",
 "DestNoiseMap",
 "SourceNoiseMap",
 "ControlModule",
 "Bounds",
 "DestSize",
 "GradientPoints",
 "ControlPoints",
 "Angles",
 "EnableLight",
 "EnableDistance",
 "XDisplaceModule",
 "YDisplaceModule",
 "ZDisplaceModule",
 "DisplaceModules"
]


def addtonetwork(id,data):
	if build_network.has_key(id):
		#print "Already build",id
		return
		
	print "Building",id,"with",data
	mod = None
	try:
		mod = getattr( libnoise, data["type"] )() 
	except:
		pass
	
	if data["type"] == "RendererImageNetwork":
		mod = RendererImageNetwork()

	if not mod:
		print "I do not know",data["type"]

	for key,value in data.items():
		# just treat generic setters
		if key in special_setters:
			if key == "SourceModule":
				if type(value) == type([]):
					c = 0
					for e in value:
						addtonetwork( e, network[e] )
						mod.SetSourceModule( c, build_network[e] )
						c += 1
				else:
					addtonetwork( value, network[value] )
					mod.SetSourceModule( build_network[value] )
			elif key == "Bounds":
				mod.SetBounds(*value)
			elif key == "Angles":
				mod.SetAngles(*value)
			elif key == "DestSize":
				mod.SetDestSize(*value)		
			elif key == "DestNoiseMap":
				addtonetwork( value, network[value] )
				mod.SetDestNoiseMap(build_network[value])	
			elif key == "SourceNoiseMap":
				addtonetwork( value, network[value] )

				mod.SetSourceNoiseMap(build_network[value])				
			elif key == "ControlModule":
				addtonetwork( value, network[value] )

				mod.SetControlModule(build_network[value])
			elif key == "GradientPoints":
				for gp in value:

					mod.AddGradientPoint( *gp )
			elif key == "ControlPoints":
				for gp in value:

					mod.AddControlPoint( *gp )
			elif key == "EnableLight":
				mod.EnableLight(value)
			elif key == "EnableDistance":
				mod.EnableDistance(value)
			elif key == "XDisplaceModule":
				addtonetwork( value, network[value] )
				mod.SetXDisplaceModule(build_network[value])
			elif key == "YDisplaceModule":
				addtonetwork( value, network[value] )
				mod.SetYDisplaceModule(build_network[value])
			elif key == "ZDisplaceModule":
				addtonetwork( value, network[value] )
				mod.SetZDisplaceModule(build_network[value])
			elif key == "DisplaceModules":
				addtonetwork( value[0], network[value[0]] )
				addtonetwork( value[1], network[value[1]] )
				addtonetwork( value[2], network[value[2]] )
				mod.SetDisplaceModules(build_network[value[0]],build_network[value[1]],build_network[value[2]])
			continue
			
		settermethod = getattr( mod, "Set"+key, None )
		if settermethod:
			settermethod( value )
		else:
			if key != "type":
				print "NO METHOD FOR",key

	build_network[id] = mod

# Build network

for id,data in network.items():
	addtonetwork(id,data)

for id,data in network.items():
	buildmethod = getattr( build_network[id], "Build", None )
	if buildmethod:
		buildmethod()
		
for id,data in network.items():
	writedestfilemethod = getattr( build_network[id], "WriteDestFile", None )
	if writedestfilemethod:
		writedestfilemethod()






		
