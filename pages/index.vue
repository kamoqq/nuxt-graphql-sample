<template>
  <div>
    <select v-model="type.selected" v-on:change="get">
      <option v-for="option in type.options" v-bind:key="option.value" v-bind:value="option.value">
        {{ option.text }}
      </option>
    </select>
    <select v-model="repo.selected" v-on:change="get">
      <option v-for="option in repo.options" v-bind:key="option.value" v-bind:value="option.value">
        {{ option.text }}
      </option>
    </select>
    <h1>{{ feed.title }}</h1>
    <ul>
      <li v-for="item in feed.items" v-bind:key="item.link">
        <a :href="item.link">{{ item.title}} - {{ item.pubDate }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import gql from 'graphql-tag'

const releasesGQL = gql`
  query($org: String!, $repo: String!) {
    releases(org: $org, repo: $repo) {
      title,
      link,
      items {
        title,
        link,
        pubDate
      }
    }
  }
`

const tagsGQL = gql`
  query($org: String!, $repo: String!) {
    tags(org: $org, repo: $repo) {
      title,
      link,
      items {
        title,
        link,
        pubDate
      }
    }
  }
`

export default {
  data() {
    return {
      type: {
        selected: 'releases',
        options: [
          { text: 'releases', value: 'releases' },
          { text: 'tags', value: 'tags' }
        ]
      },
      repo: {
        selected: 'vuejs/vue',
        options: [
          { text: 'vuejs/vue', value: 'vuejs/vue' },
          { text: 'angular/angular', value: 'angular/angular' },
          { text: 'facebook/react', value: 'facebook/react' }
        ]
      },
      feed: {
        title: '',
        link: '',
        items: []
      }
    }
  },
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const res  = await client.query({
      query: releasesGQL,
      variables: {
        org: 'vuejs',
        repo: 'vue'
      }
    })
    return {
      feed: res.data.releases
    }
  },
  methods: {
    async get() {
      const gql = this.type.selected === 'releases' ? releasesGQL : tagsGQL
      const res  = await this.$apollo.query({
        query: gql,
        variables: {
          org: this.repo.selected.split('/')[0],
          repo: this.repo.selected.split('/')[1]
        }
      })

      this.feed = this.type.selected === 'releases' ? res.data.releases : res.data.tags
    }
  }
}
</script>