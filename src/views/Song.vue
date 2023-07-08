<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="newSong(song)"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>

    <!-- Form -->
    <section class="container mx-auto mt-6" v-if="userLoggedIn">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comments ({{ song.comment_count }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="comment_show_Alert"
            :class="comment_alert_variant"
          >
            {{ comment_alert_message }}
          </div>
          <vee-form :validation-schema="schema" @submit="addComment">
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage name="comment" class="text-red-500"></ErrorMessage>

            <button
              :disabled="comment_in_Submission"
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto" id="comments">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.id"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>
            {{ comment.datePosted }}
          </time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { songCollections, auth, commentsCollections } from '../includes/firebase'
import useUserStore from '../stores/user'
import usePlayerStore from '../stores/player'

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      schema: {
        comment: 'required|min:10'
      },
      comment_in_Submission: false,
      comment_show_Alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Please wait! Your comment is being submitted',
      comments: [],
      sort: '1'
    }
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort == '1') {
          return new Date(b.datePosted) - new Date(a.datePosted)
        }
        return new Date(a.datePosted) - new Date(b.datePosted)
      })
    }
  },
  async created() {
    const docSnapshot = await songCollections.doc(this.$route.params.id).get()
    if (!docSnapshot.exists) {
      this.$router.push({ name: 'home' })
      return
    }
    const { sort } = this.$route.query
    this.sort = sort === '1' || sort === '2' ? sort : '1'
    this.song = docSnapshot.data()
    this.getComments()
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong']),
    async addComment(values, { resetForm }) {
      if (!this.userLoggedIn) {
        return
      }
      this.comment_show_Alert = true
      this.comment_in_Submission = true
      this.comment_alert_variant = 'bg-blue-500'
      this.comment_alert_message = 'Please wait! Your comment is being submitted'

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid
      }

      const commentRef = await commentsCollections.add(comment)
      const commentSnapshot = await commentRef.get()
      this.comments.push({ docId: commentSnapshot.id, ...commentSnapshot.data() })

      this.song.comment_count += 1
      await songCollections
        .doc(this.$route.params.id)
        .update({ comment_count: this.song.comment_count })
      this.comment_in_Submission = false
      this.comment_alert_variant = 'bg-green-500'
      this.comment_alert_message = 'Comment Added!'
      resetForm()
    },
    async getComments() {
      const snapshot = await commentsCollections.where('sid', '==', this.$route.params.id).get()
      this.comment = []
      snapshot.forEach((document) => {
        this.comments.push({ docId: document.id, ...document.data() })
      })
    }
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return
      }
      this.$router.push({
        query: {
          sort: newVal
        }
      })
      console.log('watcher', this.sort)
    }
  }
}
</script>
