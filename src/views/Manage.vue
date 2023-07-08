<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <AppUpload ref="upload" :addSong="addSong" />
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <CompositionItem
              v-for="(song, i) in songs"
              :key="song.docId"
              :song="song"
              :updateSong="updateSong"
              :index="i"
              :removeSong="removeSong"
              :updateUnSavedFlag="updateUnSavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import AppUpload from '../components/Upload.vue'
import CompositionItem from '../components/CompositionItem.vue'

import { songCollections, auth } from '../includes/firebase'
export default {
  name: 'Manage',
  components: { AppUpload, CompositionItem },
  data() {
    return { songs: [], unsavedFlag: false }
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name
      this.songs[i].genre = values.genre
    },
    removeSong(i) {
      this.songs.splice(i, 1)
    },
    addSong(newRef) {
      const song = {
        ...newRef.data(),
        docId: newRef.id
      }
      this.songs.push(song)
    },
    updateUnSavedFlag(value) {
      this.unsavedFlag = value
    }
  },
  async created() {
    const snapshot = await songCollections.where('uid', '==', auth.currentUser.uid).get()
    snapshot.forEach(this.addSong)
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next()
    } else {
      const leave = confirm('YOu have unsaved changes. Are you sure you want to leave?')
      next(leave)
    }
  }

  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads()
  //   next()
  // }
}
</script>
