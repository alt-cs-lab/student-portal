# Guide to Client Sub Apps

The client is primarily made up of sub-apps, collections of pages bound to a router. This page will be a guide to the structure and contents of a sub-app, as well as how to integrate a completed sub-app into the program.

## Creating a Sub-App

A sub-app, broadly, has three parts: 2 in the client and 1 in the server. The client contains the pages and router for the sub-app, and the server contains the api routes.

### `client/src/sub-apps` Folder

The sub-apps folder in the client contains separate folders for each sub-app, which further contains the pages of the sub-app and the router, if the app has one. Within this specific app's folder (the professional-program-app, for example), you develop the app just like you would develop any other, and can create sub folders or otherwise organize how you wish. If your sub app has multiple pages, you should have a router file that establishes the relative routes between each page (look at the `professional-program-app/router.js` as an example). At this point, don't worry about the overall route that points to the sub-app, that will be determined when integrating the sub-app.

### Shared Components and Stores

If your sub-app uses any custom components or Pinia stores, place those outside of the sub-apps folder. For stores especially, it is possible new apps will use, or old apps will be improved with, custom components or stores that are first added by a different app.

### Server Files

For any server api calls made by your sub-app, collect them into a single route file (unless they are extremely closely coupled to the route of an exisiting sub-app) and place them in the server's routes folder. Overall, the server doesn't make any distinctions between sub-apps, so place any server side files you create in the respective folder, but otherwise don't worry about separating it out.

## Integrating a Sub-App

For your sub-app to be visible in the client and for its routes to work in the server, you will need to hook up the sub-app in a few places.

### Client Router

The first place is in the client's main router file, `src/router.js`. This is handled as Vue routers normally are, but if you have a router for your sub-app, then instead of pointing to any of your pages, the client router should point to your sub-app's router, which will then handle the request and direct to the correct page.

### Client Header

If you want your sub-app to be visible on the navbar in the header, you will need to add it manually as well. The header file (`components/layout/Header.vue`) has an array of objects created in the `setup()`, called `items`, which gets converted into RouterLinks by the HTML. You will add an object to this array, and this will contain links to your sub-app. If you want to have a dropdown menu with multiple options, then you cannot have the main option (the one that expands the dropdown) contain a link, as this causes issues with mobile browsers.

### Server Router

Finally, you will need to integrate your api routes into the server. Most routes in this program require a user to be logged in to access them; if your sub-app requires the user to be logged in, add it to the routes used in the `protectedRoutes.js` file. Otherwise, add it to `api.js`.