# Android SDK setup
## Setup for Linux 
### Install Java

```bash
$ sudo apt-get update
$ sudo dpkg --add-architecture i386
$ sudo apt-get install libbz2-1.0:i386
$ sudo apt-get install libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1
$ sudo apt-get install openjdk-8-jdk openjdk-8-jre
```

Add JAVA_HOME to path via ~/.bashrc

```bash
$ export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
```



### Install Android Studio
Download ZIP archive for Linux from: https://developer.android.com/studio/install.html
1. move the .zip to /opt
2. extract it
3. chown the folder to your name
4. chmod 777 studio.sh and run it for the installer

Now the android sdk is installed to ~/Android/Sdk
It's preferred to add ~/Android/Sdk folders to your path:

```bash
$ export PATH=${PATH}:~/Android/Sdk/tools
$ export PATH=${PATH}:~/Android/Sdk/platform-tools
```

Run `android`, install the images (atom, etc) and then navigate to Tools -> Manage AVDs and create a new image
Make sure to install the android-23 version and confirm it exists in ~/Android/Sdk/platforms/


## Setup for Windows
### Install Java

Install the most recent [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) (NOT just the JRE).

Next, create an environment variable for JAVA_HOME pointing to the root folder where the Java JDK was installed. So, if you installed the JDK into C:\Program Files\Java\jdk7, set JAVA_HOME to be this path. After that, add the JDK's bin directory to the PATH variable as well. Following the previous assumption, this should be either %JAVA_HOME%\bin or the full path C:\Program Files\Java\jdk7\bin

### Android SDK
Install [Android Studio](https://developer.android.com/studio/index.html). Detailed installation instructions are on Android's developer site.

Set the ANDROID_HOME (C:\Users\<username>\AppData\Local\Android\Sdk) environment variable to the location of your Android SDK installation
It is also recommended that you add the Android SDK's tools, tools/bin, and platform-tools directories to your PATH like this \
%ANDROID_HOME%\tools \
...



# Ionic setup

## Pre-requisties
* Node.js v6
* npm v3

# Install latest cordova and ionic from npm

```bash
$ npm install -g cordova ionic
```




# Ionic plugins

## DB Meter
    This plugin will be used to get decibel values from audio input

```bash
$ ionic cordova plugin add cordova-plugin-dbmeter
$ npm install --save @ionic-native/db-meter
```

## Geolocation
    This will be used to get location from users devices

```bash
$ ionic cordova plugin add cordova-plugin-geolocation
$ npm install --save @ionic-native/geolocation
```



# Running aplication
First of all please follow the instruction for setup environement on your pc and only after run the code bellow 

```bash
$ npm install 
$ ionic serve
```


