# Getting Started

This application was built using yarn (1.22.4) and nodejs (12.16.3) as referenced in the .tool-versions file committed to this repo.

Please ensure you have the correct environment versions installed on your machine, either via asdf, nvm, or another tool.

If you are using asdf and have the node and yarn plugins installed, you can simply run `asdf install` to pull in the correct versions.

Next, pull in the required module dependecies by running `yarn install`.

The application makes use an an environment variable called `REACT_APP_GIPHY_API_KEY`.  Create a file called `.env.development.local` at the root of the project, and set your API key here.

Lastly, you can start the application by running `yarn start`.  The app should boot on port 3000 (unless being used by another process, or configured otherwise).
