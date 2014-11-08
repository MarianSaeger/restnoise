/*
    This file is part of pynoise

    pynoise is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    pynoise is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with pynoise; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

%define DOCSTRING
"libnoise - Python interface"
%enddef

%module(docstring=DOCSTRING) libnoise
%include "stl.i"
%{
#include <stdlib.h>
#include <noise.h>
#include "noiseutils.h"
#include <execinfo.h>
%}

%feature("autodoc","1");

%include "std_string.i"

%typemap(in) noise::NoiseQuality = unsigned int;

%exception {
	try {
		$action
	} catch(...) {
	    void *array[20];
		size_t size;
		size = backtrace(array,20);
		backtrace_symbols_fd(array,size, STDERR_FILENO);
		printf("foooooo");
		
		PyErr_SetString(PyExc_IndexError,"sth going wrong!");
		return NULL;
	}
}


namespace noise {
  namespace module {

    struct ControlPoint
    {
      double inputValue;
      double outputValue;
    }; 

    class Module {
      public:
        Module(int sourceModuleCount);
        virtual ~Module();
		virtual const Module& GetSourceModule (int index) const;
		virtual int GetSourceModuleCount () const = 0;
        virtual double GetValue(double x, double y, double z) const = 0;
		virtual void SetSourceModule (int index, const Module& sourceModule);
    };

    class Perlin: public Module {
      public:
        Perlin();
        double GetFrequency() const;
        double GetLacunarity() const;
        int GetOctaveCount() const;
        double GetPersistence() const;
        int GetSeed() const;
        virtual int GetSourceModuleCount() const;
        virtual double GetValue(double x, double y, double z) const;
        void SetFrequency(double frequency);
        void SetLacunarity(double lacunarity);
        void SetOctaveCount(int octaveCount);
        void SetPersistence(double persistence);
        void SetSeed(int seed);

    };

	class RidgedMulti: public Module {
	public:
	 RidgedMulti ();
	 double GetFrequency () const;
	 double GetLacunarity () const;
	 noise::NoiseQuality GetNoiseQuality () const;
	 int GetOctaveCount () const;
	 int GetSeed () const;
	 virtual int GetSourceModuleCount () const;
	 virtual double GetValue (double x, double y, double z) const;
	 void SetFrequency (double frequency);
	 void SetLacunarity (double lacunarity);
	 void SetNoiseQuality (noise::NoiseQuality noiseQuality);
	 void SetOctaveCount (int octaveCount);
	 void SetSeed (int seed);
	protected:
	 void CalcSpectralWeights ();
	 };

class Billow: public Module {
public:
Billow ();
double GetFrequency () const;
double GetLacunarity () const;
noise::NoiseQuality GetNoiseQuality () const;
int GetOctaveCount () const;
double GetPersistence () const;
int GetSeed () const;
virtual int GetSourceModuleCount () const;
virtual double GetValue (double x, double y, double z) const;
void SetFrequency (double frequency);
void SetLacunarity (double lacunarity);
void SetNoiseQuality (noise::NoiseQuality noiseQuality);
void SetOctaveCount (int octaveCount);
void SetPersistence (double persistence);
void SetSeed (int seed);

};
class ScaleBias: public Module {
public:
ScaleBias();
                                                              double GetBias () const;
                                                                double GetScale () const;
virtual int GetSourceModuleCount () const;
virtual double GetValue (double x, double y, double z) const;
                                                                void SetBias (double bias);
                                                                void SetScale (double scale);
};

    class Select: public Module {
      public:
        Select();
        const Module& GetControlModule () const;
        double GetEdgeFalloff () const;
		double GetLowerBound () const;
		virtual int GetSourceModuleCount () const;
		double GetUpperBound () const;
		virtual double GetValue (double x, double y, double z) const;
		void SetBounds (double lowerBound, double upperBound);
		void SetControlModule (const Module& controlModule);
		void SetEdgeFalloff (double edgeFalloff);
    };


    class Turbulence: public Module
    {

      public:

        Turbulence ();

        double GetFrequency () const;
        double GetPower () const;
        int GetRoughnessCount () const;

  
        int GetSeed () const;

        virtual int GetSourceModuleCount () const;

        virtual double GetValue (double x, double y, double z) const;

        void SetFrequency (double frequency);

   
        void SetPower (double power);

        void SetRoughness (int roughness);

        void SetSeed (int seed);


    };

    class Curve: public Module
    {

      public:
        Curve ();
        ~Curve ();

  
        void AddControlPoint (double inputValue, double outputValue);
        void ClearAllControlPoints ();
        const ControlPoint* GetControlPointArray () const;

        int GetControlPointCount () const;

        virtual int GetSourceModuleCount () const;

        virtual double GetValue (double x, double y, double z) const;



    };

    class Min: public Module
    {

      public:

        /// Constructor.
        Min ();

        virtual int GetSourceModuleCount () const;

        virtual double GetValue (double x, double y, double z) const;

    };

    class Clamp: public Module
    {

      public:

        Clamp ();

        double GetLowerBound () const;

        virtual int GetSourceModuleCount () const;

        double GetUpperBound () const;

        virtual double GetValue (double x, double y, double z) const;

        void SetBounds (double lowerBound, double upperBound);


    };

    class Cache: public Module
    {

      public:

        /// Constructor.
        Cache ();

        virtual int GetSourceModuleCount () const;

        virtual double GetValue (double x, double y, double z) const;

        virtual void SetSourceModule (int index, const Module& sourceModule);


    };

    class Terrace: public Module
    {

	    public:

	      Terrace ();

	      ~Terrace ();

	      void AddControlPoint (double value);

	      void ClearAllControlPoints ();

	      const double* GetControlPointArray () const;

	      int GetControlPointCount () const;

    	  virtual int GetSourceModuleCount () const;

	      void InvertTerraces (bool invert = true);

        bool IsTerracesInverted () const;

    	  virtual double GetValue (double x, double y, double z) const;

        void MakeControlPoints (int controlPointCount);

 

    };

    class Const: public Module
    {

      public:

   
        Const ();

        double GetConstValue () const;

        virtual int GetSourceModuleCount () const;

        virtual double GetValue (double x, double y, double z) const;

        void SetConstValue (double constValue);


    };

    class Blend: public Module
    {

      public:

        Blend ();

        const Module& GetControlModule () const;

        virtual int GetSourceModuleCount () const;

	      virtual double GetValue (double x, double y, double z) const;

    
        void SetControlModule (const Module& controlModule);

    };

    class Max: public Module
    {

      public:

        Max ();

        virtual int GetSourceModuleCount () const;

        virtual double GetValue (double x, double y, double z) const;

    };

    class Multiply: public Module
    {

      public:

        Multiply ();

        virtual int GetSourceModuleCount () const;

        virtual double GetValue (double x, double y, double z) const;

    };

    class Add: public Module
    {

      public:

        Add ();

        virtual int GetSourceModuleCount () const;

        virtual double GetValue (double x, double y, double z) const;

    };

   class Exponent: public Module
    {

      public:

        Exponent ();

        double GetExponent () const
        {
          return m_exponent;
        }

        virtual int GetSourceModuleCount () const
        {
          return 1;
        }

        virtual double GetValue (double x, double y, double z) const;

        void SetExponent (double exponent)
        {
          m_exponent = exponent;
        }

      protected:

        /// Exponent to apply to the output value from the source module.
        double m_exponent;

    };

    class Voronoi: public Module
    {

      public:

        /// Constructor.
        ///
        /// The default displacement value is set to
        /// noise::module::DEFAULT_VORONOI_DISPLACEMENT.
        ///
        /// The default frequency is set to
        /// noise::module::DEFAULT_VORONOI_FREQUENCY.
        ///
        /// The default seed value is set to
        /// noise::module::DEFAULT_VORONOI_SEED.
        Voronoi ();

        /// Enables or disables applying the distance from the nearest seed
        /// point to the output value.
        ///
        /// @param enable Specifies whether to apply the distance to the
        /// output value or not.
        ///
        /// Applying the distance from the nearest seed point to the output
        /// value causes the points in the Voronoi cells to increase in value
        /// the further away that point is from the nearest seed point.
        /// Setting this value to @a true (and setting the displacement to a
        /// near-zero value) causes this noise module to generate cracked mud
        /// formations.
        void EnableDistance (bool enable = true)
        {
          m_enableDistance = enable;
        }

        /// Returns the displacement value of the Voronoi cells.
        ///
        /// @returns The displacement value of the Voronoi cells.
        ///
        /// This noise module assigns each Voronoi cell with a random constant
        /// value from a coherent-noise function.  The <i>displacement
        /// value</i> controls the range of random values to assign to each
        /// cell.  The range of random values is +/- the displacement value.
        double GetDisplacement () const
        {
          return m_displacement;
        }

        /// Returns the frequency of the seed points.
        ///
        /// @returns The frequency of the seed points.
        ///
        /// The frequency determines the size of the Voronoi cells and the
        /// distance between these cells.
        double GetFrequency () const
        {
          return m_frequency;
        }

        virtual int GetSourceModuleCount () const
        {
          return 0;
        }

        /// Returns the seed value used by the Voronoi cells
        ///
        /// @returns The seed value.
        ///
        /// The positions of the seed values are calculated by a
        /// coherent-noise function.  By modifying the seed value, the output
        /// of that function changes.
        int GetSeed () const
        {
          return m_seed;
        }

        /// Determines if the distance from the nearest seed point is applied
        /// to the output value.
        ///
        /// @returns
        /// - @a true if the distance is applied to the output value.
        /// - @a false if not.
        ///
        /// Applying the distance from the nearest seed point to the output
        /// value causes the points in the Voronoi cells to increase in value
        /// the further away that point is from the nearest seed point.
        bool IsDistanceEnabled () const
        {
          return m_enableDistance;
        }

        virtual double GetValue (double x, double y, double z) const;

        /// Sets the displacement value of the Voronoi cells.
        ///
        /// @param displacement The displacement value of the Voronoi cells.
        ///
        /// This noise module assigns each Voronoi cell with a random constant
        /// value from a coherent-noise function.  The <i>displacement
        /// value</i> controls the range of random values to assign to each
        /// cell.  The range of random values is +/- the displacement value.
        void SetDisplacement (double displacement)
        {
          m_displacement = displacement;
        }

        /// Sets the frequency of the seed points.
        ///
        /// @param frequency The frequency of the seed points.
        ///
        /// The frequency determines the size of the Voronoi cells and the
        /// distance between these cells.
        void SetFrequency (double frequency)
        {
          m_frequency = frequency;
        }

        /// Sets the seed value used by the Voronoi cells
        ///
        /// @param seed The seed value.
        ///
        /// The positions of the seed values are calculated by a
        /// coherent-noise function.  By modifying the seed value, the output
        /// of that function changes.
        void SetSeed (int seed)
        {
          m_seed = seed;
        }

      protected:

        /// Scale of the random displacement to apply to each Voronoi cell.
        double m_displacement;

        /// Determines if the distance from the nearest seed point is applied to
        /// the output value.
        bool m_enableDistance;

        /// Frequency of the seed points.
        double m_frequency;

        /// Seed value used by the coherent-noise function to determine the
        /// positions of the seed points.
        int m_seed;

    };

  };
};

%typemap(in) noise::uint8 = unsigned int;

class Color {
  public:
    Color(noise::uint8 r, noise::uint8 g, noise::uint8 b, noise::uint8 a);
    noise::uint red;
    noise::uint green;
    noise::uint blue;
    noise::uint alpha;
};

class NoiseMap {
  public:
    NoiseMap();
    NoiseMap(int width, int height);
    NoiseMap(const NoiseMap &rhs);
    ~NoiseMap();
    void Clear(float value);
    float GetBorderValue() const;
    int GetHeight() const;
    int GetMemUsed() const;
    int GetStride() const;
    float GetValue(int x, int y) const;
    int GetWidth() const;
    void ReclaimMem();
    void SetBorderValue(float borderValue);
    void SetSize(int width, int height);
    void SetValue(int x, int y, float value);
    void TakeOwnership(NoiseMap &source);

    %pythoncode %{
      borderValue = property(GetBorderValue, SetBorderValue);
      height = property(GetHeight)
      memUsed = property(GetMemUsed)
      stride = property(GetStride)
      width = property(GetWidth)
    %}
};

class NoiseMapBuilder {
  public:
    NoiseMapBuilder();
    virtual void Build() = 0;
    double GetDestHeight() const;
    double GetDestWidth() const;
    void SetDestNoiseMap( NoiseMap &destNoiseMap);
    void SetSourceModule( noise::module::Module &sourceModule);
    void SetDestSize(int destWidth, int destHeight);

    %pythoncode %{
      destHeight = property(GetDestHeight)
      destWidth = property(GetDestWidth)
    %}
};

class NoiseMapBuilderCylinder: public NoiseMapBuilder {
  public:
    NoiseMapBuilderCylinder();
    virtual void Build();
    double GetLowerAngleBound() const;
    double GetLowerHeightBound() const;
    double GetUpperAngleBound() const;
    double GetUpperHeightBound() const;
    void SetBounds(double lowerAngleBound, double upperAngleBound,
                    double lowerHeightBound, double upperHeightBound);
                    
    %pythoncode %{
      lowerAngleBound = property(GetLowerAngleBound)
      lowerHeightBound = property(GetLowerHeightBound)
      upperAngleBound = property(GetUpperAngleBound)
      upperHeightBound = property(GetUpperHeightBound)
    %}
};

class NoiseMapBuilderPlane: public NoiseMapBuilder {
  public:
    NoiseMapBuilderPlane();
    virtual void Build();
    void EnableSeamless(bool enable = true);
    double GetLowerXBound() const;
    double GetLowerZBound() const;
    double GetUpperXBound() const;
    double GetUpperZBound() const;
    bool IsSeamlessEnabled() const;
    void SetBounds(double lowerXBound, double upperXBound, 
                    double lowerZBound, double upperZBound);

    %pythoncode %{
      lowerXBound = property(GetLowerXBound)
      lowerZBound = property(GetLowerZBound)
      upperXBound = property(GetUpperXBound)
      upperZBound = property(GetUpperZBound)
      seamless = property(IsSeamlessEnabled, EnableSeamless)
    %}
};

class NoiseMapBuilderSphere: public NoiseMapBuilder
{

  public:

    /// Constructor.
    NoiseMapBuilderSphere ();

    virtual void Build ();

    /// Returns the eastern boundary of the spherical noise map.
    ///
    /// @returns The eastern boundary of the noise map, in degrees.
    double GetEastLonBound () const
    {
      return m_eastLonBound;
    }

    /// Returns the northern boundary of the spherical noise map
    ///
    /// @returns The northern boundary of the noise map, in degrees.
    double GetNorthLatBound () const
    {
      return m_northLatBound;
    }

    /// Returns the southern boundary of the spherical noise map
    ///
    /// @returns The southern boundary of the noise map, in degrees.
    double GetSouthLatBound () const
    {
      return m_southLatBound;
    }

    /// Returns the western boundary of the spherical noise map
    ///
    /// @returns The western boundary of the noise map, in degrees.
    double GetWestLonBound () const
    {
      return m_westLonBound;
    }

    /// Sets the coordinate boundaries of the noise map.
    ///
    /// @param southLatBound The southern boundary of the noise map, in
    /// degrees.
    /// @param northLatBound The northern boundary of the noise map, in
    /// degrees.
    /// @param westLonBound The western boundary of the noise map, in
    /// degrees.
    /// @param eastLonBound The eastern boundary of the noise map, in
    /// degrees.
    ///
    /// @pre The southern boundary is less than the northern boundary.
    /// @pre The western boundary is less than the eastern boundary.
    ///
    /// @throw noise::ExceptionInvalidParam See the preconditions.
    void SetBounds (double southLatBound, double northLatBound,
      double westLonBound, double eastLonBound)
    {
      if (southLatBound >= northLatBound
        || westLonBound >= eastLonBound) {
        throw noise::ExceptionInvalidParam ();
      }

      m_southLatBound = southLatBound;
      m_northLatBound = northLatBound;
      m_westLonBound  = westLonBound ;
      m_eastLonBound  = eastLonBound ;
    }

  private:

    /// Eastern boundary of the spherical noise map, in degrees.
    double m_eastLonBound;

    /// Northern boundary of the spherical noise map, in degrees.
    double m_northLatBound;

    /// Southern boundary of the spherical noise map, in degrees.
    double m_southLatBound;

    /// Western boundary of the spherical noise map, in degrees.
    double m_westLonBound;

};

class Image {
  public:
    Image();
    Image(int width, int height);
    Image(const Image &rhs);
    void Clear(const Color &value);
    Color GetBorderValue() const;
    int GetHeight() const;
    int GetStride() const;
    int GetWidth() const;
    void ReclaimMem();
    void SetBorderValue(const Color &borderValue);
    void SetSize(int width, int height);
    void SetValue(int x, int y, const Color &value);

    %pythoncode %{
      borderValue = property(GetBorderValue, SetBorderValue)
      height = property(GetHeight)
      stride = property(GetStride)
      width = property(GetWidth)
    %}
};

class RendererImage {
  public:
    RendererImage();
    void AddGradientPoint(double gradientPost, const Color &gradientColor);
    void BuildGrayscaleGradient();
    void BuildTerrainGradient();
    void ClearGradient();
    void EnableLight(bool enable = true);
    void EnableWrap(bool enable = true);
    double GetLightAzimuth() const;
    double GetLightBrightness() const;
    Color GetLightColor() const;
    double GetLightContrast() const;
    double GetLightElev() const;
    double GetLightIntensity() const;
    bool IsLightEnabled() const;
    bool IsWrapEnabled() const;
    void Render();
    void SetBackgroundImage(const Image &backgroundImage);
    void SetDestImage(Image &destImage);
    void SetLightAzimuth(double lightAzimuth);
    void SetLightBrightness(double lightBrightness);
    void SetLightColor(const Color &lightColor);
    void SetLightContrast(double lightContrast);
    void SetLightElev(double lightElev);
    void SetLightIntensity(double lightIntensity);
    void SetSourceNoiseMap(const NoiseMap &sourceNoiseMap);

    %pythoncode %{
      light = property(IsLightEnabled, EnableLight)
      wrap = property(IsWrapEnabled, EnableWrap)
      lightAzimuth = property(GetLightAzimuth, SetLightAzimuth)
      lightBrightness = property(GetLightBrightness, SetLightBrightness)
      lightColor = property(GetLightColor, SetLightColor)
      lightContrast = property(GetLightContrast, SetLightContrast)
      lightElev = property(GetLightElev, SetLightElev)
      lightIntensity = property(GetLightIntensity, SetLightIntensity)
    %}
};

class RendererNormalMap {
  public:
    RendererNormalMap();
    void EnableWrap(bool enable = true);
    double GetBumpHeight() const;
    bool IsWrapEnabled() const;
    void Render();
    void SetBumpHeight( double bumpHeight);
    void SetDestImage(Image &destImage);
    void SetSourceNoiseMap(const NoiseMap &sourceNoiseMap);
};  

class WriterBMP {
  public:
    WriterBMP();
    std::string GetDestFilename() const;
    void SetDestFilename( std::string filename);
    void SetSourceImage(Image &sourceImage);
    void WriteDestFile();
};
