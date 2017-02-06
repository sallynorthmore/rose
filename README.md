# rose
Rose's portfolio web site (WordPress) theme

### Prereqs
- you first will need to run a local server (such as MAMP) and install Wordpress locally following Wordpress's instructions

## Install
- git clone / download files in the same root folder as your wordpress app
- once downloaded, make sure `src/` directory is next to your `wordpress/` directory
- run `npm install` to install all front end build tools
- run `npm run start` to start build & watch scripts
- In your wordpress admin dashboard, activate the "rose" theme
- go to http://localhost:3000 in your browser to view the site (Browsersync)

## Development
- all source css and js is in `src/`, all HTML/PHP are in theme files in `wordpress/wp-content/themes/rose/`
- once CSS/JS is edited, npm builds the new code into `wordpress/wp-content/themes/rose/`
- commit and push changes to the repo
- FTP `/themes/rose` files to update the live site
- All front end build tasks are in `package.json`
