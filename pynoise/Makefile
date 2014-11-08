PYTHON_INCLUDE = `python -c 'from distutils import sysconfig; print sysconfig.get_python_inc()'`
PYTHON_DEST =`python -c 'from distutils import sysconfig; print sysconfig.get_python_lib()'`
LIBNOISE_INCLUDE = /usr/local/include/

CXX=g++
CXXFLAGS=$(cflags) -fPIC
INCLUDE=-I$(LIBNOISE_INCLUDE) -I$(PYTHON_INCLUDE)

libnoise: libnoise.o 
	$(CXX) -L/usr/local/lib `python-config --ldflags` -shared -o _libnoise.so libnoise_wrap.o noiseutils.o -lnoise

libnoise.o: libnoise.cxx
	$(CXX) $(CXXFLAGS) $(INCLUDE) -c libnoise_wrap.cxx 
	$(CXX) $(CXXFLAGS) $(INCLUDE) -c noiseutils.cpp 

libnoise.cxx:
	swig -Wall -c++ -python libnoise.i

test:
	python test.py

clean:
	rm -f *.o *.so *.cxx *.pyc libnoise.py libnoise.pyx test*.bmp

install:
	cp _libnoise.so libnoise.py $(PYTHON_DEST)

