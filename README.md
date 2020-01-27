# Adhesion [![Build Status](https://travis-ci.org/atomicjolt/adhesion.svg?branch=master)](https://travis-ci.org/atomicjolt/adhesion)
-----------------------

Adhesion is the [Atomic Jolt](http://www.atomicjolt.com/) lti app suite.

**Attendance App**

**Proctor Tools**

**Quiz Converter**

**Survey Aggregation Tool**

## Running Adhesion
-----------

### With Foreman
Foreman makes it simple to startup all the services required to run the
application in development mode. To start the application using foreman simply
run:

```
$ foreman start -f Procfile.dev
```

Make sure you have the latest version of Foreman installed.

#### Environment
Foreman will automatically find and read the .env file.

### Without Foreman
If you need to run services individually or just don't like Foreman you can run
each service seperately:

```
$ rails server
$ npm run hot
```

## Setting up Adhesion
-----------

### File Modifications

#### Change bin/bootstrap
In bin/bootstrap change the following line to point to a dropbox folder
containing the correct config files for the project:
DROPBOX_FOLDER=aj-dev/adhesion

#### Change .env
Rename `.env.example` to `.env` and configure it to your liking.

Note: the App and Assets subdomains must be different.

#### Modify application name
1. Open application.rb and change `Adhesion ` to the name you choose.
2. Do a global search and replace for `adhesion` and change it to the
name you choose.
3. Do a global search and replace for `Adhesion ` (use only letters or
numbers for this name. Special characters like '_' will result in errors).

### Setup script
Run the setup script to configure your local nginx and to setup symlinks to your
configuration files (database.yml, etc)

```
$ ./bin/setup
```

## Assets
-----------
Any files added to the assets directory can be used by in code and assigned to a
variable. This allows for referring to assets using dynamically generated
strings. The assets will be built according to the rules specified in your
webpack configuration. Typically, this means that in production the names will
be changed to include a SHA.

First importing the assets:
  `import assets from '../libs/assets';`

Then assign the assest to a variable:
  `const img = assets("./images/atomicjolt.jpg");`

The value can then be used when rendering:
  `render(){
    const img = assets("./images/atomicjolt.jpg");
    return<div>
    <img src={img} />
    </div>;
  }`


## Static
-----------
Files added to the static directory will be copied directly into the build.
These files will not be renamed.

## Canvas API
-----------
The LTI Starter app makes working with the Canvas API simple. See
[Canvas](Canvas.md) for more information. Note that working with the Canvas API
will require a server side proxy that is not part of this project.

#Tests
-----------
Karma and Jasmine are used for testing. To run tests run:

#### Secrets file
Rename `config/secrets.example.yml` to `config/secrets.yml`. Open the file and
change each entry to values that are relevant for your application.

*This file should not be committed to your repository.*

You will need to [obtain a Developer ID and Key from an Account Admin for the
instance of Canvas the tool will be installed in](#canvas_developer_key).

You will also need to setup a default lti application and lti application
instance. See the [seeds](#seeds) section below for information on setting
up the default account.

### Project Dependencies

#### Requirements

This application requires:

-   Ruby
-   Rails
-   PostgreSQL
-   Antiword

Learn more about [Installing Rails](http://railsapps.github.io/installing-rails.html).

#### Webpack
Packs CommonJs/AMD modules for the browser.
```
$ npm install -g webpack
$ cd client && webpack
```

#### Install Javascript Libraries
To get started run:

```
$ npm install
```

or if you have yarn installed:

```
$ yarn
```


To find outdated modules run:

```
$ npm-check-updates
```

Updated packages by passing -u

```
$ npm-check-updates -u
```


#### React
Most LTI applications need to be single page applications in order to avoid a bug that prevents cookies from being written in some
browsers. The Adhesion uses React. During development run the [React Hot Loader](https://github.com/gaearon/react-hot-loader).


### <a name="seeds"></a>Setting up Database

If you have setup .env and the secrets.yml file then the seeds file shouldn't need to be changed. However,
if you need to customize the values in the database or add addition records to the database,
open db/seeds.rb and configuration a default account for development and production.
Here's a summary of the values and their purpose:

- **code:** Uniquely identifies the account. This is used for the subdomain when running
applications on a single domain. By default this will be set to APP_SUBDOMAIN from the .env file.
- **domain:** Custom domain name. By default this is set to application_url from the secrets.yml file.
- **name:** Name the account anything you'd like. By default this is set to application_name from the secrets.yml file.
- **lti_key:** A unique key for the LTI application you are building. This will be provided to Canvas. By default this will be set to APP_SUBDOMAIN from the .env file.
- **lti_secret:** The shared secret for your LTI application. This will be provided to Canvas
and will be used to sign the LTI request. Generate this value using `rake secret`. Alternatively if you leave this field empty an LTI secret will be automatically generated for the account.
- **canvas_uri:** The URI of the Canvas institution to be associated with a specific account.

#### Scorm Player
We have both the Scorm Cloud and the Scorm Engine setup to work with Adhesion. You will need to decide which one you will be using then in the seeds file go to the application named SCORM Player and change the default_config scorm_type to "cloud" or "engine". You can change this later in the database if needed.

Once you've setup your seeds file run it to setup database defaults:

```
$ rake db:setup
```
or

```
$ rake db:create
$ rake db:schema:load
$ rake db:seed
```


### <a name="canvas_developer_key"></a>Obtain a Canvas Developer Key

Only a Canvas Account Admin can create a developer key for your LTI Application. To create a key, go to
Accounts, Developer Keys and enter the info described below below. Be sure to replace `adhesion.atomicjolt.xyz` with your domain.
(atomicjolt.xyz will only work for AtomicJolt employees). Also, note that 'lti' is the subdomain specified in the .env file
You will need an ID and secret for development and for production. The development URI will use atomicjolt.xyz while the
production URI will use your domain (e.g. ltistarterapp.herokuapp.com).

**Oauth2 Redirect URI:**
https://adhesion.atomicjolt.xyz/auth/[provider]/callback
**Key Name:**
Can be anything you choose (e.g. Adhesion)

**Owner Email:***
Address that will receive email about technical issues related to the tool.

**Tool ID:**
Unique ID for the tool (e.g. Adhesion)

**Redirect URI:**
https://adhesion.atomicjolt.xyz/users/auth/canvas/callback
OR
https://ltistarterapp.herokuapp.com/users/auth/canvas/callback

**Icon URL:**
https://adhesion.atomicjolt.xyz/images/icon.png
OR
https://Adhesion.herokuapp.com/images/icon.png

Once you press Save Key, a Developer ID and Key will be generated and displayed in the Details column of the Developer Keys table when you mouse over the row. Add these credentials to your .env file or `config/secrets.yml` file under CANVAS_DEVELOPER_ID and CANVAS_DEVELOPER_KEY (in .env) or `canvas_developer_id` and `canvas_developer_key` (in secrets.yml).

## Canvas API
-----------
The LTI Starter app makes working with the Canvas API simple. See [Canvas](Canvas.md) for more information.



## Admin Page

There is an admin page where one can setup the tools located at `/admin`.
In the settings for an Application Instance, Visibility can be configured to affect who can see the tool when it gets installed.

## Development Details

#### Webpack
Webpack is used to build the client side application. Configure the client application in client/config/settings.js

#### React
The React Rails Starter App uses React. All client side code can be found in the "client" directory. This project contains the code required to launch a React application. index.html.erb contains the following code which will launch a React application whose entry point is 'app.jsx'

```
<% content_for :head do -%>
  <%= stylesheet_pack_tag 'styles' %>
<% end -%>

<%= render 'shared/default_client_settings' %>
<div id="main-app"></div>
<%= javascript_packs_with_chunks_tag "app, "data-turbolinks-track": "reload" %>
```

##### Custom Build Settings
-----------
Default build settings can be overridden by adding an options.json file to the application directory.

###### Options:
-----------
* outName - Change the output directory for an application by specifying "outName" which will override the default name
used when generating a path.
* port - Hard code a port for the application to run. Typically, you won't need to set this value as the build process
will calculate one for you.
* onlyPack - If true don't generate html files. Instead, only run the webpack process and output the resulting files.
* noClean - If true then don't delete files before starting a new build.
* rootOutput - Dump the application directly into the root directory.

Example options.json
`
{
  "outName": "hello_world",
  "port": 8080,
  "onlyPack": true,
  "noClean": false,
  "rootOutput": false,
  "codeSplittingOff": true, // Turn off code splitting
  "extractCssOff": true     // Turn off css extraction
}
`

By default app.jsx is used as the webpack entry point. This can be overriden in webpack.json. Change the buildSuffix,
filename, chunkFilename and other settings:

In webpack.json
`
{
  "file": "app.js",         // The webpack entry. Default is app.jsx
  "buildSuffix": ".js",     // Change the build suffix. Default is _bundle.js
  "filename": "[name]",     // Change the output file name. Default is based on production/development
  "chunkFilename": "[id]",  // Change the chunkFilename. Default is based on production/development
}
`

#### Assets
Any files added to the assets directory can be used by in code and assigned to a variable. This allows for referring to assets using dynamically generated strings. The assets will be built according to the rules specified in your webpack configuration. Typically, this means that in production the names will be changed to include a SHA.

First importing the assets:
  `import assets from '../libs/assets';`

Then assign the assest to a variable:
  `const img = assets("./images/atomicjolt.jpg");`

The value can then be used when rendering:
  `render(){
    const img = assets("./images/atomicjolt.jpg");
    return<div>
    <img src={img} />
    </div>;
  }`

#### Static
Files added to the static directory will be copied directly into the build. These files will not be renamed.

#### Check for updates
Inside the client directory run:
```
yarn upgrade-interactive
```


## Deployment

### Upload secrets to server:

  `cap production deploy:upload FILES=config/secrets.yml`

### Deploy

  `cap production deploy`

### Monitor logs

  `cap production logs:tail`

## Database

This application uses PostgreSQL with ActiveRecord.

## Tests

You may need to install chromedriver if you haven't already.

```
$ brew install chromedriver
```

To run tests:

```
$ rake spec
```

## TODO

If an admin changes the developer key and secret then existing authentications are invalid.
This will result in a 500 error. You will see the following in the log:
LMS::Canvas::InvalidRequestException (Status: 400 Error:  ....

To fix this remove all entries in the Authentications table. In the future we should detect an
invalid api token and then remove the db record forcing a new OAuth dance.
