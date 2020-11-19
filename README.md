# Next.js Custom Auth0 Pages

This repo is an example on how to create a custom login page for Auth0 with Next.js

In the root you will find the `auth0` folder. This contains a `login.html` file, which is the default Custom Login Page provider by Auth0 with the form removed. The `login.tsx` is a basic react app with the form and contains the basic logic to log in and sign up. You can customize both to your needs.

## Build the template

In the `next.config.js` file the webpack config is extended. It adds the `login.tsx` to the webpack entries and adds the HtmlWebpackPlugin. The HtmlWebpackPlugin is configured to only be used for the `login.tsx` file. In the `login.html` file you'll notice that I loop through the generated files and parse them as a string. This is necessary because auth0 doesnt allow you to serve hosted assets, therefor we serve them inline.

**I noticed that react 17 has some problems when being served inline. Please use react 16**

When you run `yarn build` next will generate a `auth0-login.html` file in the `.next` folder. Copy the contents of this file to custom login page in the Auth0 admin dashboard. Congratulations you've now created a custom login page with Next.js
