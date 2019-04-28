const Parser = require('rss-parser')
const parser = new Parser()

const resolvers = {
  Query: {
    releases: async (obj, args) => {
      const { org, repo } = args;
      const feed = await parser.parseURL(`https://github.com/${org}/${repo}/releases.atom`)
      return {
        title: feed.title,
        link: feed.link,
        items: feed.items.map(v => {
          return {
            title: v.title,
            link: v.link,
            pubDate: v.pubDate
          }
        })
      };
    },
    tags: async (obj, args) => {
      const { org, repo } = args;
      const feed = await parser.parseURL(`https://github.com/${org}/${repo}/tags.atom`)
      return {
        title: feed.title,
        link: feed.link,
        items: feed.items.map(v => {
          return {
            title: v.title,
            link: v.link,
            pubDate: v.pubDate
          }
        })
      };
    }
  }
}

module.exports = { resolvers }