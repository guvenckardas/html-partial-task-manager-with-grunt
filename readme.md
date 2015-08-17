#Overview

Partial HTML task manager! Create your app with your partials, minify your assets,
prepare all things you need! For example, you create only one header and footer for your multi-page project,
also without php etc.

##Getting Started

If you don't have grunt:

At first, npm must be installed your computer. If you haven't install, please check links below:

[Node.js](http://nodejs.org/download/)

After npm is ready to use, you must run the command below on your terminal:

~~~
npm install -g grunt-cli
~~~

Now you are ready to use Grunt

> **Note:** For more info and personal project usage:

[Grunt.js](http://http://gruntjs.com/getting-started)


## How to Use

> Before start; go to your project on command line and load assets with command:
~~~
npm install
~~~

###Structure
* **config/route.json** : all css and javascript files must be describe in route.json. The example usage:
```sh
{
    "common":
    {
        "js":["dist/assets/js/common/common.js"],
        "css":["dist/assets/css/common/common.css"]
    },
    "routes": [
        {
            "route": "pages/index.html",
            "pageJs":[
                "dist/assets/js/pages/homepage/homepage.js"
            ],
            "pageCss":[
                "dist/assets/css/pages/homepage/homepage.css"]
        }
    ]
}

```
When you describe all file relations, you have to show where you need your assets. For example: (pages/index.html)
```sh
<!-- injector:css -->
<!-- endinjector -->
<!-- injector:js -->
<!-- endinjector -->

home page
```
output:
```sh
//common
 <!-- injector:css -->
    <link rel="stylesheet" href="app/assets/css/pages/30d3aca3ddbd02ee548c917dcf5666bc.min.css">
    <!-- endinjector -->
    <!-- injector:js -->
    <script src="app/assets/js/pages/30d3aca3ddbd02ee548c917dcf5666bc.min.js"></script>
    <!-- endinjector -->

//page-specific
<!-- injector:css -->
<link rel="stylesheet" href="app/assets/css/pages/30d3aca3ddbd02ee548c917dcf5666bc.min.css">
<!-- endinjector -->
<!-- injector:js -->
<script src="app/assets/js/pages/30d3aca3ddbd02ee548c917dcf5666bc.min.js"></script>
<!-- endinjector -->
home
```

* **dist/partial**:  Create your partials(like header, footer etc.) in this file. Also you can use partial management between partials. For example:

meta.html
```sh
<title></title>
```

header.html
```sh
<!DOCTYPE html>
<html>
<head>

    <!-- @import partials/meta.html -->

</head>
<body>


```

output:
```sh
<!DOCTYPE html>
<html>
<head>

   <title></title>

</head>
<body>

```


* **dist/page**:  Create all your page hierarchy. 

* **dist/assets**: You have to create your javascript, css and images in this file. If you don't, grunt tasks doesn't work. 
  
###Task

> Go to your project on command line and build project with command:
~~~
grunt build
~~~
