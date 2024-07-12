import navbar from "./navbar.js";
export default {
  template:  `<div>
  <navbar />
    <h1>Lyrics</h1>
    <div>
       <p>{{ text }}</p>
    </div>
  </div>`,
    data() {
    return {
      text: '',
    };
  },
  created() {
    const id = this.$route.params.id;
    this.fetchLyrics(id);
  },
  components:{navbar },
  methods: {
    async fetchLyrics(id) {
      try {
        const response = await fetch(`/lyrics/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch lyircs');
        }
        this.text = await response.json();
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    }

}
}