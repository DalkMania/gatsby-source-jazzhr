# gatsby-source-jazzhr

Source plugin for pulling data into [Gatsby](https://github.com/gatsbyjs) from
[JazzHR](https://www.jazzhr.com).

## Install

Using NPM

```shell
npm install --save gatsby-source-jazzhr
```

Using Yarn

```shell
yarn add gatsby-source-jazzhr
```

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
    plugins: [
        {
            resolve: "gatsby-source-jazzhr",
            options: {
                apiKey: "YOUR_JAZZHR_API_KEY",
                verboseOutput: false,
                includeInDevelopment: false
            }
        }
    ]
};
```

Set verboseOutput to `true` to display a verbose output on `npm run develop` or `npm run build`. It can help you debug specific API Endpoints problems.

### GraphQL Query to get all jobs

```graphql

```
