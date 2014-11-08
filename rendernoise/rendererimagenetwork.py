from libnoise import *
import os
import sys

class RendererImageNetwork:

	
	
	def __init__(self):
		self.image = Image()
		self.myfilename = ""
		
		self.renderer = RendererImage()
		self.renderer.SetDestImage(self.image)
		self.renderer.ClearGradient()
		self.renderer.EnableLight()
		
		self.writer = WriterBMP()
		self.writer.SetSourceImage(self.image)
			
	def SetSourceNoiseMap( self, sourcemap ):
		print "HUA!",sourcemap.GetHeight(),sourcemap.GetWidth()
		self.renderer.SetSourceNoiseMap(sourcemap)
		
	def SetDestFilename( self, filename ):
		self.myfilename = filename
		self.writer.SetDestFilename(str(filename))
		
	def WriteDestFile(self):
		try:
			
			
			self.renderer.Render()
			self.writer.WriteDestFile()
		except:
			print sys.exc_info()

	def SetLightContrast(self, value ):
		self.renderer.SetLightContrast(value)

	def SetLightBrightness(self, value ):
		self.renderer.SetLightBrightness(value)	
		
	def SetLightIntensity(self, value ):
		self.renderer.SetLightIntensity(value)
			
	def SetLightElev(self, value ):
		self.renderer.SetLightElev(value)		
												
	def SetLightAzimuth(self, value ):
		self.renderer.SetLightAzimuth(value)
		
	def AddGradientPoint(self, v, r, g, b, a ):
		print "AddGradientPoint",v,r,g,b,a
		self.renderer.AddGradientPoint( v, Color( r, g, b, a ) )			
			
			
			
