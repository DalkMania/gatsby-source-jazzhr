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
        subDomain: "YOUR_JAZZHR_SUBDOMAIN", // https://company-name.applytojob.com
        verboseOutput: false,
      },
    },
  ],
}
```

Set verboseOutput to `true` to display a verbose output on `npm run develop` or `npm run build`. It can help you debug specific API Endpoints problems.

### GraphQL Query to get all open jobs

```graphql
query JazzHRJobsQuery {
  allJazzHr(filter: { status: { eq: "Open" } }) {
    totalCount
    nodes {
      id
      status
      title
      department
      description
      team_id
      city
      recruiter
      custom_apply_url
      apply_url
      board_code
      country_id
      hiring_lead
      jazzhr_id
      maximum_salary
      minimum_salary
      notes
      original_open_date
      questionnaire
      send_to_job_boards
      state
      type
      zip
    }
  }
}
```
