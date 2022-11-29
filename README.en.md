# Contribution Note

Since the Qt source code contains multiple Qt sub-libraries, following the requirements of community management, Qt For OpenHarmony contributes in the form of code patches and independent adaptation modules.

## Code Patch Genearate

Use the "git diff" command to generate a code patch, and submit the patch to the corresponding Patch directory.

> Each sub-module uses the naming method of "submodulename.patch" to manage sub-module adaptation code patches. For example, execute "git diff v5.12.12 > qtbase.patch" in the qtbase sub-submodule directory to generate the corresponding qtbase sub-module code patch , after generating the code patch, follow the requirements of the OpenHarmony community and submit it to the main repository branch.

# Version Support Information

Currently supports adaptation to Qt5.12.12 version, other versions are not yet available.

# Catalog Description

```
OpenHarmony - Qt
│
└───patch - Source patch folder
│   │   qtbase.patch - qtbase submodule patch
|   |   qtconnectivity.patch - qtconnectivity submodule patch
|	|   qtdeclarative.patch - qtdeclarative submodule patch
|	|   qtlocation.patch - qtlocation submodule patch
|	|   qtmultimedia.patch - qtmultimedia submodule patch
|	|	qtsensors.patch - qtsensors submodule patch
|	|	qtsystems.patch - qtsystems submodule patch
|	|   qtvirtualkeyboard.patch - qtvirtualkeyboard submodule patch
|	|   qtremoteobjects.patch - qtremoteobjects submodule patch
└───build.sh - Cross compile script
└───LICENSE.FDL - GNU Free Documentation License
└───LICENSE.GPLv2 - GNU GENERAL PUBLIC LICENSE Version 2
└───LICENSE.GPLv3 - GNU GENERAL PUBLIC LICENSE Version 3
└───LICENSE.LGPLv3 - GNU LESSER GENERAL PUBLIC LICENSE Version 3
└───LICENSE.LGPLv21 - GNU LESSER GENERAL PUBLIC LICENSE Version 2.1
└───LICENSE.QT-LICENSE-AGREEMENT - QT LICENSE AGREEMENT Agreement
└───README.md - Chinese readme
└───README.en.md - English readme
```

# Compile Configuration Instructions

## Precondition
1. Complete cross-compilation based on Ubuntu20.04 amd64 version, download link: https://releases.ubuntu.com/focal/ubuntu-20.04.5-desktop-amd64.iso
2. Install Git tools (sudo apt-get install git)
3. Install Curl tools (sudo apt-get install curl)

## Compilation Steps
1. Execute the build.sh script to complete the qt5 source code, OpenHarmony NDK and code patch application, compilation and installation
2. After the script is executed, the installation directory is generated as the bin directory of the current folder

# Qt5.12.12 Status
## Support Module

| module | description | support | status |
| :----: | :---- | :----: | :----: |
| Qt Core | Core non-graphical classes used by other modules. | :white_check_mark: |completed|
| Qt Gui | Base classes for graphical user interface (GUI) components. Includes OpenGL. | :white_large_square: |in-progress|
| Qt Multimedia | Classes for audio, video, radio and camera functionality. | :white_large_square: |schedule|
| Qt Multimedia Widgets | Widget-based classes for implementing multimedia functionality. | :white_large_square: |schedule|
| Qt Network | Classes to make network programming easier and more portable. | :white_check_mark: |completed|
| Qt QML | Classes for QML and JavaScript languages.                    | :white_large_square: |schedule|
| Qt Quick | A declarative framework for building highly dynamic applications with custom user interfaces. | :white_large_square: |schedule|
| Qt Quick Controls | Provides lightweight QML types for creating performant user interfaces for desktop, embedded, and mobile devices. These types employ a simple styling architecture and are very efficient. | :white_large_square: |schedule|
| Qt Quick Dialogs | Types for creating and interacting with system dialogs from a Qt Quick application. | :white_large_square: |schedule|
| Qt Quick Layouts | Layouts are items that are used to arrange Qt Quick 2 based items in the user interface. | :white_large_square: |schedule|
| Qt Quick Test | A unit test framework for QML applications, where the test cases are written as JavaScript functions. | :white_large_square: |schedule|
| Qt SQL | Classes for database integration using SQL. | :white_check_mark: |completed|
| Qt Test | Classes for unit testing Qt applications and libraries. | :white_check_mark: |completed|
| Qt Widgets | Classes to extend Qt GUI with C++ widgets. | :white_large_square: |schedule|
| Active Qt | Classes for applications which use ActiveX and COM | :white_large_square: |un-schedule|
| Qt 3D | Functionality for near-realtime simulation systems with support for 2D and 3D rendering. | :white_large_square: |schedule|
| Qt Android Extras | Provides platform-specific APIs for Android. | :white_large_square: |un-schedule|
| Qt Bluetooth | Provides access to Bluetooth hardware. | :white_large_square: |schedule|
| Qt Canvas 3D | Enables OpenGL-like 3D drawing calls from Qt Quick applications using JavaScript. | :white_large_square: |deprecated|
| Qt Concurrent | Classes for writing multi-threaded programs without using low-level threading primitives. | :white_large_square: |schedule|
| Qt D-Bus | Classes for inter-process communication over the D-Bus protocol. | :white_large_square: |un-schedule|
| Qt Gamepad | Enables Qt applications to support the use of gamepad hardware. | :white_large_square: |un-schedule|
| Qt Graphical Effects | Graphical effects for use with Qt Quick 2. | :white_large_square: | schedule|
| Qt Help | Classes for integrating documentation into applications, similar to Qt Assistant. | :white_large_square: | un-schedule |
| Qt Image Formats | Plugins for additional image formats: TIFF, MNG, TGA, WBMP. | :white_large_square: | schedule |
| Qt Location | Displays map, navigation, and place content in a QML application. | :white_large_square: | schedule |
| Qt Mac Extras | Provides platform-specific APIs for macOS. | :white_large_square: | un-schedule |
| Qt NFC | Provides access to Near-Field communication (NFC) hardware. |  :white_large_square: | schedule |
| Qt OpenGL | OpenGL support classes. Deprecated in favor of the QOpenGL * classes in the Qt GUI module.| :white_large_square: | deprecated |
| Qt Platform Headers | Provides classes that encapsulate platform-specific information, tied to a given runtime configuration of a platform plugin. | :white_large_square: | schedule |
| Qt Positioning | Provides access to position, satellite and area monitoring classes. | :white_large_square: | schedule |
| Qt Print Support | Classes to make printing easier and more portable. | :white_large_square: | schedule |
| Qt Purchasing | Enables in-app purchase of products in Qt applications. | :white_large_square: | un-schedule |
| Qt Quick Controls 1 | Reusable Qt Quick based UI controls to create classic desktop-style user interfaces. Deprecated in favor of Qt Quick Controls 2, which are better and easier to use. | :white_large_square: |  deprecated |
| Qt Quick Extras | Provides a specialized set of controls that can be used to build interfaces in Qt Quick. | :white_large_square: | schedule |
| Qt Quick Widgets | Provides a C++ widget class for displaying a Qt Quick user interface. | :white_large_square: | schedule |
| Qt Quick Widgets | Provides a C++ widget class for displaying a Qt Quick user interface. | :white_large_square: | schedule |
| Qt Remote Objects | Provides an easy to use mechanism for sharing a QObject's API (Properties/Signals/Slots) between processes or devices. | :white_check_mark: | completed |
| Qt Script | Classes for making Qt applications scriptable. Deprecated in favor of the QJS * classes in the Qt QML module. | :white_large_square: | deprecated |
| Qt SCXML | Provides classes and tools for creating state machines from SCXML files and embedding them in applications. | :white_large_square: | schedule |
| Qt Script Tools | Additional components for applications that use Qt Script. | :white_large_square: | deprecated |
| Qt Sensors | Provides access to sensor hardware and motion gesture recognition. | :white_large_square: | schedule |
| Qt Serial Bus | Provides access to serial industrial bus interface. Currently the module supports the CAN bus and Modbus protocols. | :white_large_square: | schedule |
| Qt Serial Port | Provides access to hardware and virtual serial ports. | :white_large_square: | schedule |
| Qt Speech | Provides support for accessibility features such as text-to-speech. | :white_large_square: | un-schedule |
| Qt SVG | Classes for displaying the contents of SVG files. Supports a subset of the SVG 1.2 Tiny standard. | :white_large_square: | schedule |
| Qt UI Tools | Classes for loading QWidget based forms created in * Qt Designer * dynamically, at runtime. | :white_large_square: | schedule |
| Qt WebChannel | Provides access to QObject or QML objects from HTML clients for seamless integration of Qt applications with HTML/JavaScript clients. | :white_large_square: | un-schedule |
| Qt WebEngine | Classes and functions for embedding web content in applications using the Chromium browser project. | :white_large_square: | un-schedule |
| Qt WebSockets | Provides WebSocket communication compliant with RFC 6455. | :white_large_square: | un-schedule |
| Qt WebView | Displays web content in a QML application by using APIs native to the platform, without the need to include a full web browser stack. | :white_large_square: | un-schedule |
| Qt Windows Extras | Provides platform-specific APIs for Windows. | :white_large_square: | un-schedule |
| Qt X11 Extras | Provides platform-specific APIs for X11. | :white_large_square: | un-schedule |
| Qt XML | C++ implementations of SAX and DOM. | :white_check_mark: | completed |
| Qt XML Patterns | Support for XPath, XQuery, XSLT and XML schema validation. | :white_large_square: | schedule |
| Qt Wayland Compositor | Provides a framework to develop a Wayland compositor. | :white_large_square: | un-schedule |
| Qt Charts | UI Components for displaying visually pleasing charts, driven by static or dynamic data models. | :white_large_square: | un-schedule |
| Qt Data Visualization | UI Components for creating stunning 3D data visualizations. | :white_large_square: | un-schedule |
| Qt Network Authorization | Provides support for OAuth-based authorization to online services. | :white_large_square: | un-schedule |
| Qt Virtual Keyboard | A framework for implementing different input methods as well as a QML virtual keyboard. Supports localized keyboard layouts and custom visual themes. | :white_large_square: | un-schedule |
| Qt Quick WebGL | Provides a platform plugin that allows streaming Qt Quick user interfaces over the network using WebGL™. | :white_large_square: | un-schedule |

## Support Features(./configure -feature-list)

| feature | description | support | status |
| :----: | :---- | :----: | :----: |
| abstractbutton | Widgets: Abstract base class of button widgets, providing functionality common to buttons. | :white_large_square: | in-progress |
| abstractslider | Widgets: Common super class for widgets like QScrollBar, QSlider and QDial. | :white_large_square: | in-progress |
| accessibility | Utilities: Provides accessibility support.| :white_large_square: | schedule |
| action | Kernel: Provides widget actions.| :white_check_mark: | completed |
| animation | Utilities: Provides a framework for animations. | :white_check_mark: | completed |
| appstore-compliant | Disables code that is not allowed in platform app stores | :white_large_square: | un-schedule |
| bearermanagement |  Networking: Provides bearer management for the network stack. | :white_large_square: | schedule |
| big_codecs |  Internationalization: Supports big codecs, e.g. CJK. | :white_large_square: | un-schedule |
| buttongroup | Widgets: Supports organizing groups of button widgets. | :white_large_square: | in-progress |
| calendarwidget | Widgets: Provides a monthly based calendar widget allowing the user to select a date. | :white_large_square: | in-progress |
| checkbox | Widgets: Provides a checkbox with a text label. | :white_large_square: | in-progress |
| clipboard | Kernel: Provides cut and paste operations. | :white_large_square: | schedule |
| codecs | Internationalization: Supports non-unicode text conversions. | :white_large_square: | schedule |
| colordialog |  Dialogs: Provides a dialog widget for specifying colors. | :white_large_square: | in-progress |
| colornames |  Painting: Supports color names such as "red", used by QColor and by some HTML documents. | :white_large_square: | in-progress |
| columnview |  ItemViews: Provides a model/view implementation of a column view. | :white_large_square: | in-progress |
| combobox |  Widgets: Provides drop-down boxes presenting a list of options to the user. | :white_large_square: | in-progress |
| commandlineparser |  Utilities: Provides support for command line parsing.| :white_large_square: | in-progress |
| commandlinkbutton |  Widgets: Provides a Vista style command link button. | :white_large_square: | in-progress |
| completer |  Utilities: Provides completions based on an item model. | :white_large_square: | in-progress |
| concurrent |  Kernel: Provides a high-level multi-threading API.| :white_large_square: | schedule |
| contextmenu | Widgets: Adds pop-up menus on right mouse click to numerous widgets. | :white_large_square: | in-progress |
| cssparser | Kernel: Provides a parser for Cascading Style Sheets. | :white_large_square: | in-progress |
| cups | Painting: Provides support for the Common Unix Printing System. | :white_large_square: | schedule |
| cursor | Kernel: Provides mouse cursors. | :white_large_square: | in-progress |
| d3d12 |Qt Quick: Provides a Direct3D 12 backend for the scenegraph. | :white_large_square: | un-schedule |
| datawidgetmapper | ItemViews: Provides mapping between a section of a data model to widgets. | :white_large_square: | schedule |
| datestring | Data structures: Provides conversion between dates and strings. | :white_large_square: | schedule |
| datetimeedit | Widgets: Supports editing dates and times. | :white_large_square: | in-progress |
| datetimeparser | Utilities: Provides support for parsing date-time texts. | :white_large_square: | in-progress |
| desktopservices | Utilities: Provides methods for accessing common desktop services. | :white_large_square: | schedule |
| dial |  Widgets: Provides a rounded range control, e.g., like a speedometer. | :white_large_square: | in-progress |
| dialog |  Dialogs: Base class of dialog windows. | :white_large_square: | in-progress |
| dialogbuttonbox |  Dialogs: Presents buttons in a layout that is appropriate for the current widget style. | :white_large_square: | in-progress |
| dirmodel |  ItemViews: Provides a data model for the local filesystem. | :white_large_square: | in-progress |
| dnslookup |  Networking: Provides API for DNS lookups. | :white_large_square: | schedule |
| dockwidget | Widgets: Supports docking widgets inside a QMainWindow or floated as a top-level window on the desktop. | :white_large_square: | in-progress |
| dom | File I/O: Supports the Document Object Model. | :white_large_square: | in-progress |
| draganddrop | Kernel: Supports the drag and drop mechansim. | :white_large_square: | schedule |
| dtls | Networking: Provides a DTLS implementation | :white_large_square: | schedule |
| effects |  Kernel: Provides special widget effects (e.g. fading and scrolling). | :white_large_square: | schedule |
| errormessage |  Dialogs: Provides an error message display dialog. | :white_large_square: | schedule |
| filedialog |  Dialogs: Provides a dialog widget for selecting files or directories. | :white_large_square: | schedule |
| filesystemiterator |  File I/O: Provides fast file system iteration.| :white_large_square: | schedule |
| filesystemmodel |  File I/O: Provides a data model for the local filesystem. | :white_large_square: | schedule |
| filesystemwatcher | File I/O: Provides an interface for monitoring files and directories for modifications. | :white_large_square: | schedule |
| fontcombobox | Widgets: Provides a combobox that lets the user select a font family. | :white_large_square: | schedule |
| fontdialog | Dialogs: Provides a dialog widget for selecting fonts. | :white_large_square: | schedule |
| formlayout | Widgets: Manages forms of input widgets and their associated labels. | :white_large_square: | schedule |
| freetype | Fonts: Supports the FreeType 2 font engine (and its supported font formats). | :white_large_square: | schedule |
| fscompleter | Utilities: Provides file name completion in QFileDialog. | :white_large_square: | schedule |
| ftp | Networking: Provides support for the File Transfer Protocol in QNetworkAccessManager. | :white_large_square: | schedule |
| future | Kernel: Provides QFuture and related classes. | :white_large_square: | schedule |
| geoservices_esri | Location: Provides access to Esri geoservices | :white_large_square: | schedule |
| geoservices_here | Location: Provides access to HERE geoservices | :white_large_square: | schedule |
| geoservices_itemsoverlay | Location: Provides access to the itemsoverlay maps | :white_large_square: | schedule |
| geoservices_mapbox | Location: Provides access to Mapbox geoservices | :white_large_square: | schedule |
| geoservices_mapboxgl | Location: Provides access to the Mapbox vector maps| :white_large_square: | schedule |
| geoservices_osm | Location: Provides access to OpenStreetMap geoservices | :white_large_square: | schedule |
| gestures | Utilities: Provides a framework for gestures. | :white_large_square: | schedule |
| graphicseffect | Widgets: Provides various graphics effects. | :white_large_square: | schedule |
| graphicsview | Widgets: Provides a canvas/sprite framework. | :white_large_square: | schedule |
| groupbox | Widgets: Provides widget grouping boxes with frames. | :white_large_square: | schedule |
| highdpiscaling | Kernel: Provides automatic scaling of DPI-unaware applications on high-DPI displays. | :white_large_square: | schedule |
| http | Networking: Provides support for the Hypertext Transfer Protocol in QNetworkAccessManager. | :white_large_square: | schedule |
| iconv | Internationalization: Provides internationalization on Unix. | :white_large_square: | schedule |
| identityproxymodel |ItemViews: Supports proxying a source model unmodified. | :white_large_square: | schedule |
| im | Kernel: Provides complex input methods. | :white_large_square: | schedule |
| image_heuristic_mask | Images: Supports creating a 1-bpp heuristic mask for images. | :white_large_square: | schedule |
| image_text | Images: Supports image file text strings. | :white_large_square: | schedule |
| imageformat_bmp | Images: Supports Microsoft's Bitmap image file format. | :white_large_square: | schedule |
| imageformat_jpeg | Images: Supports the Joint Photographic Experts Group image file format. | :white_large_square: | schedule |
| imageformat_png | Images: Supports the Portable Network Graphics image file format. | :white_large_square: | schedule |
| imageformat_ppm | Images: Supports the Portable Pixmap image file format. | :white_large_square: | schedule |
| imageformat_xbm | Images: Supports the X11 Bitmap image file format. | :white_large_square: | schedule |
| imageformat_xpm | Images: Supports the X11 Pixmap image file format. | :white_large_square: | schedule |
| imageformatplugin | Images: Provides a base for writing a image format plugins. | :white_large_square: | schedule |
| inputdialog | Dialogs: Provides a simple convenience dialog to get a single value from the user. | :white_large_square: | schedule |
| itemmodel | ItemViews: Provides the item model for item views | :white_large_square: | schedule |
| itemmodeltester | Provides a utility to test item models. | :white_large_square: | schedule |
| itemviews | ItemViews: Provides the model/view architecture managing the relationship between data and the way it is presented to the user. | :white_large_square: | schedule |
| keysequenceedit | Widgets: Provides a widget for editing QKeySequences. | :white_large_square: | schedule |
| label | Widgets: Provides a text or image display. | :white_large_square: | schedule |
| lcdnumber | Widgets: Provides LCD-like digits. | :white_large_square: | schedule |
| library | File I/O: Provides a wrapper for dynamically loaded libraries. | :white_large_square: | schedule |
| lineedit | Widgets: Provides single-line edits. | :white_large_square: | schedule |
| listview | ItemViews: Provides a list or icon view onto a model. | :white_large_square: | schedule |
| listwidget | Widgets: Provides item-based list widgets. | :white_large_square: | schedule |
| localserver | Networking: Provides a local socket based server. | :white_large_square: | schedule |
| location-labs-plugin | Location: Provides experimental QtLocation QML types | :white_large_square: | schedule |
| mainwindow | Widgets: Provides main application windows. | :white_large_square: | schedule |
| mdiarea | Widgets: Provides an area in which MDI windows are displayed. | :white_large_square: | schedule |
| menu | Widgets: Provides popup-menus. | :white_large_square: | schedule |
| menubar | Widgets: Provides pull-down menu items. | :white_large_square: | schedule |
| messagebox | Dialogs: Provides message boxes displaying informative messages and simple questions. | :white_large_square: | schedule |
| mimetype | Utilities: Provides MIME type handling. | :white_large_square: | schedule |
| movie | Images: Supports animated images. | :white_large_square: | schedule |
| multiprocess | Utilities: Provides support for detecting the desktop environment, launching external processes and opening URLs. | :white_large_square: | schedule |
| networkdiskcache | Networking: Provides a disk cache for network resources. | :white_large_square: | schedule |
| networkinterface | Networking: Supports enumerating a host's IP addresses and network interfaces. | :white_large_square: | schedule |
| networkproxy | Networking: Provides network proxy support. | :white_large_square: | schedule |
| paint_debug | Painting: Enabled debugging painting with the environment variables QT_FLUSH_UPDATE and QT_FLUSH_PAINT. | :white_large_square: | schedule |
| pdf | Painting: Provides a PDF backend for QPainter. | :white_large_square: | schedule |
| picture | Painting: Supports recording and replaying QPainter commands. | :white_large_square: | schedule |
| printdialog | Dialogs: Provides a dialog widget for specifying printer configuration. | :white_large_square: | schedule |
| printer | Painting: Provides a printer backend of QPainter. | :white_large_square: | schedule |
| printpreviewdialog | Dialogs: Provides a dialog for previewing and configuring page layouts for printer output. | :white_large_square: | schedule |
| printpreviewwidget | Widgets: Provides a widget for previewing page layouts for printer output. | :white_large_square: | schedule |
| process | File I/O: Supports external process invocation. | :white_large_square: | schedule |
| processenvironment | File I/O: Provides a higher-level abstraction of environment variables. | :white_large_square: | schedule |
| progressbar | Widgets: Supports presentation of operation progress. | :white_large_square: | schedule |
| progressdialog | Dialogs: Provides feedback on the progress of a slow operation. | :white_large_square: | schedule |
| properties | Kernel: Supports scripting Qt-based applications. | :white_large_square: | schedule |
| proxymodel | ItemViews: Supports processing of data passed between another model and a view. | :white_large_square: | schedule |
| pushbutton | Widgets: Provides a command button. | :white_large_square: | schedule |
| qml-animation | QML: Provides support for animations and timers in QML. | :white_large_square: | schedule |
| qml-debug | QML: Provides infrastructure and plugins for debugging and profiling. | :white_large_square: | schedule |
| qml-delegate-model | QML: Provides the DelegateModel QML type. | :white_large_square: | schedule |
| qml-devtools | QML: Provides the QmlDevtools library and various utilities. | :white_large_square: | schedule |
| qml-list-model | QML: Provides the ListModel QML type. | :white_large_square: | schedule |
| qml-locale | QML: Provides support for locales in QML. | :white_large_square: | schedule |
| qml-network | QML: Provides network transparency. | :white_large_square: | schedule |
| qml-preview  | QML: Updates QML documents in your application live as you change them on disk | :white_large_square: | schedule |
| qml-profiler  | QML: Supports retrieving QML tracing data from an application. | :white_large_square: | schedule |
| qml-sequence-object   | QML: Supports mapping sequence types into QML. | :white_large_square: | schedule |
| qml-worker-script  | QML: Enables the use of threads in QML. | :white_large_square: | schedule |
| qml-xml-http-request  | QML: Provides support for sending XML http requests. | :white_large_square: | schedule |
| qt3d-animation  | Aspects: Use the 3D Animation Aspect library | :white_large_square: | schedule |
| qt3d-extras  | Aspects: Use the 3D Extra library | :white_large_square: | schedule |
| qt3d-input  | Aspects: Use the 3D Input Aspect library | :white_large_square: | schedule |
| qt3d-logic  | Aspects: Use the 3D Logic Aspect library | :white_large_square: | schedule |
| qt3d-opengl-renderer  | Qt 3D Renderers: Use the OpenGL renderer | :white_large_square: | schedule |
| qt3d-render | Aspects: Use the 3D Render Aspect library | :white_large_square: | schedule |
| qt3d-simd-avx2  | Use AVX2 SIMD instructions to accelerate matrix operations | :white_large_square: | schedule |
| qt3d-simd-sse2  | Use SSE2 SIMD instructions to accelerate matrix operations | :white_large_square: | schedule |
| quick-animatedimage  | Qt Quick: Provides the AnimatedImage item. | :white_large_square: | schedule |
| quick-canvas  | Qt Quick: Provides the Canvas item. | :white_large_square: | schedule |
| quick-designer | Qt Quick: Provides support for the Qt Quick Designer in Qt Creator. | :white_large_square: | schedule |
| quick-flipable | Qt Quick: Provides the Flipable item. | :white_large_square: | schedule |
| quick-gridview | Qt Quick: Provides the GridView item. | :white_large_square: | schedule |
| quick-listview | Qt Quick: Provides the ListView item. | :white_large_square: | schedule |
| quick-particles | Qt Quick: Provides a particle system. | :white_large_square: | schedule |
| quick-path  | Qt Quick: Provides Path elements. | :white_large_square: | schedule |
| quick-pathview  | Qt Quick: Provides the PathView item. | :white_large_square: | schedule |
| quick-positioners  | Qt Quick: Provides Positioner items. | :white_large_square: | schedule |
| quick-repeater  | Qt Quick: Provides the Repeater item. | :white_large_square: | schedule |
| quick-shadereffect  | Qt Quick: Provides Shader effects. | :white_large_square: | schedule |
| quick-sprite  | Qt Quick: Provides the Sprite item. | :white_large_square: | schedule |
| quick-tableview  | Qt Quick: Provides the TableView item. | :white_large_square: | schedule |
| quickcontrols2-fusion  | Quick Controls 2: Provides the platform agnostic desktop-oriented Fusion style. | :white_large_square: | schedule |
| quickcontrols2-imagine  |Quick Controls 2: Provides a style based on configurable image assets. | :white_large_square: | schedule |
| quickcontrols2-material  | Quick Controls 2: Provides a style based on the Material Design guidelines. | :white_large_square: | schedule |
| quickcontrols2-universal  | Quick Controls 2: Provides a style based on the Universal Design guidelines. | :white_large_square: | schedule |
| quicktemplates2-hover  | Quick Templates 2: Provides support for hover effects. | :white_large_square: | schedule |
| quicktemplates2-multitouch  | Quick Templates 2: Provides support for multi-touch. | :white_large_square: | schedule |
| radiobutton  |  Widgets: Provides a radio button with a text label. | :white_large_square: | schedule |
| regularexpression  | Kernel: Provides an API to Perl-compatible regular expressions. | :white_large_square: | schedule |
| resizehandler  | Widgets: Provides an internal resize handler for dock widgets. | :white_large_square: | schedule |
| rubberband  | Widgets: Supports using rubberbands to indicate selections and boundaries. | :white_large_square: | schedule |
| scrollarea  | Widgets: Supports scrolling views onto widgets. | :white_large_square: | schedule |
| scrollbar  | Widgets: Provides scrollbars allowing the user access parts of a document that is larger than the widget used to display it. | :white_large_square: | schedule |
| scroller  | Widgets: Enables kinetic scrolling for any scrolling widget or graphics item. | :white_large_square: | schedule |
| scxml-ecmascriptdatamodel  |SCXML: Enables the usage of ecmascript data models in SCXML state machines. | :white_large_square: | schedule |
| sessionmanager  | Kernel: Provides an interface to the windowing system's session management.| :white_large_square: | schedule |
| settings  | File I/O: Provides persistent application settings. | :white_large_square: | schedule |
| sha3-fast   | Utilities: Optimizes SHA3 for speed instead of size. | :white_large_square: | schedule |
| sharedmemory   | Kernel: Provides access to a shared memory segment. | :white_large_square: | schedule |
| shortcut   | Kernel: Provides keyboard accelerators and shortcuts. | :white_large_square: | schedule |
| sizegrip   | Widgets: Provides corner-grips for resizing top-level windows. | :white_large_square: | schedule |
| slider   | Widgets: Provides sliders controlling a bounded value. | :white_large_square: | schedule |
| socks5   | Networking: Provides SOCKS5 support in QNetworkProxy. | :white_large_square: | schedule |
| sortfilterproxymodel   | ItemViews: Supports sorting and filtering of data passed between another model and a view. | :white_large_square: | schedule |
| spinbox  | Widgets: Provides spin boxes handling integers and discrete sets of values. | :white_large_square: | schedule |
| splashscreen  | Widgets: Supports splash screens that can be shown during application startup. | :white_large_square: | schedule |
| splitter  | Widgets: Provides user controlled splitter widgets. | :white_large_square: | schedule |
| sqlmodel  |  Provides item model classes backed by SQL databases. | :white_large_square: | schedule |
| stackedwidget  |  Widgets: Provides stacked widgets. | :white_large_square: | schedule |
| standarditemmodel  |  ItemViews: Provides a generic model for storing custom data. | :white_large_square: | schedule |
| statemachine  |  Utilities: Provides hierarchical finite state machines. | :white_large_square: | schedule |
| statusbar  |  Widgets: Supports presentation of status information. | :white_large_square: | schedule |
| statustip  |  Widgets: Supports status tip functionality and events. | :white_large_square: | schedule |
| stringlistmodel  |  ItemViews: Provides a model that supplies strings to views. | :white_large_square: | schedule |
| style-stylesheet  | Styles: Provides a widget style which is configurable via CSS. | :white_large_square: | schedule |
| syntaxhighlighter | Widgets: Supports custom syntax highlighting. | :white_large_square: | schedule |
| systemsemaphore | Kernel: Provides a general counting system semaphore. | :white_large_square: | schedule |
| systemtrayicon | Utilities: Provides an icon for an application in the system tray.| :white_large_square: | schedule |
| tabbar | Widgets: Provides tab bars, e.g., for use in tabbed dialogs. | :white_large_square: | schedule |
| tabletevent | Kernel: Supports tablet events. | :white_large_square: | schedule |
| tableview | ItemViews: Provides a default model/view implementation of a table view. | :white_large_square: | schedule |
| tablewidget | Widgets: Provides item-based table views. | :white_large_square: | schedule |
| tabwidget | Widgets: Supports stacking tabbed widgets. | :white_large_square: | schedule |
| temporaryfile | File I/O: Provides an I/O device that operates on temporary files. | :white_large_square: | schedule |
| textbrowser | Widgets: Supports HTML document browsing. | :white_large_square: | schedule |
| textcodec | Internationalization: Supports conversions between text encodings. | :white_large_square: | schedule |
| textdate | Data structures: Supports month and day names in dates. | :white_large_square: | schedule |
| textedit | Widgets: Supports rich text editing. | :white_large_square: | schedule |
| texthtmlparser | Kernel: Provides a parser for HTML. | :white_large_square: | schedule |
| textodfwriter | Kernel: Provides an ODF writer. | :white_large_square: | schedule |
| thread | Kernel: Provides QThread and related classes. | :white_large_square: | schedule |
| timezone | Utilities: Provides support for time-zone handling. | :white_large_square: | schedule |
| toolbar | Widgets: Provides movable panels containing a set of controls. | :white_large_square: | schedule |
| toolbox | Widgets: Provides columns of tabbed widget items. | :white_large_square: | schedule |
| toolbutton | Widgets: Provides quick-access buttons to commands and options.| :white_large_square: | schedule |
| tooltip | Widgets: Supports presentation of tooltips. | :white_large_square: | schedule |
| topleveldomain | Utilities: Provides support for extracting the top level domain from URLs. | :white_large_square: | schedule |
| translation | Internationalization: Supports translations using QObject::tr(). | :white_large_square: | schedule |
| treeview | ItemViews: Provides a default model/view implementation of a tree view. | :white_large_square: | schedule |
| treewidget | Widgets: Provides views using tree models. | :white_large_square: | schedule |
| tuiotouch | Provides the TuioTouch input plugin. | :white_large_square: | schedule |
| udpsocket | Networking: Provides access to UDP sockets. | :white_large_square: | schedule |
| undocommand | Utilities: Applies (redo or) undo of a single change in a document. | :white_large_square: | schedule |
| undogroup | Utilities: Provides the ability to cluster QUndoCommands. | :white_large_square: | schedule |
| undostack | Utilities: Provides the ability to (redo or) undo a list of changes in a document. | :white_large_square: | schedule |
| undoview | Utilities: Provides a widget which shows the contents of an undo stack. | :white_large_square: | schedule |
| validator | Widgets: Supports validation of input text. | :white_large_square: | schedule |
| wayland-compositor-quick | Allows QtWayland compositor types to be used with QtQuick| :white_large_square: | un-schedule |
| webengine-embedded-build | WebEngine: Enables the embedded build configuration. | :white_large_square: | un-schedule |
| webengine-full-debug-info | Enables debug information for Blink and V8. | :white_large_square: | un-schedule |
| webengine-kerberos | WebEngine: Enables Kerberos Authentication Support | :white_large_square: | un-schedule |
| webengine-native-spellchecker | WebEngine: Use the system's native spellchecking engine. | :white_large_square: | un-schedule |
| webengine-pepper-plugins | WebEngine: Enables use of Pepper Flash plugins. | :white_large_square: | un-schedule |
| webengine-printing-and-pdf | WebEngine: Provides printing and output to PDF. | :white_large_square: | un-schedule |
| webengine-proprietary-codecs | WebEngine: Enables the use of proprietary codecs such as h.264/h.265 and MP3. | :white_large_square: | un-schedule |
| webengine-spellchecker |  WebEngine: Provides a spellchecker.| :white_large_square: | un-schedule |
| webengine-v8-snapshot | Enables the v8 snapshot, for fast v8 context creation | :white_large_square: | un-schedule |
| webengine-webchannel | WebEngine: Provides QtWebChannel integration. | :white_large_square: | un-schedule |
| webengine-webrtc | WebEngine: Provides WebRTC support. | :white_large_square: | un-schedule |
| whatsthis | Widget Support: Supports displaying "What's this" help. | :white_large_square: | schedule |
| wheelevent | Kernel: Supports wheel events. | :white_large_square: | schedule |
| widgettextcontrol | Widgets: Provides text control functionality to other widgets.| :white_large_square: | schedule |
| wizard | Dialogs: Provides a framework for multi-page click-through dialogs. | :white_large_square: | schedule |
| xml-schema | QtXmlPatterns: Provides XML schema validation. | :white_large_square: | schedule |
| xmlstream | Kernel: Provides a simple streaming API for XML. | :white_large_square: | schedule |
| xmlstreamreader | Kernel: Provides a well-formed XML parser with a simple streaming API. | :white_large_square: | schedule |
| xmlstreamwriter | Kernel: Provides a XML writer with a simple streaming API. | :white_large_square: | schedule |