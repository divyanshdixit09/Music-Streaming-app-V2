export default {
  data() {
    return {
      userCount: 0,
      creatorCount: 0
    };
  },
  methods: {
    async fetchCounts() {
      try {
        const userResponse = await fetch('/user-count');
        const userData = await userResponse.json();
        this.userCount = userData.total_users;

        const creatorResponse = await fetch('/api/creator/count');
        const creatorData = await creatorResponse.json();
        this.creatorCount = creatorData;
      } catch (error) {
        console.error('Error fetching user and creator counts:', error);
      }
    },
    async logout() {
      if (confirm("Are you sure you want to log out?")) {
      const res = await fetch('/logout')
      if(!res.ok) throw new Error(await res.text());
      localStorage.removeItem( "auth-token")
      localStorage.removeItem("role")
      localStorage.removeItem("user-id")

      this.$router.push('/login')
      
    }
  }},
  mounted() {
    // Fetch user and creator counts when the component is mounted
    this.fetchCounts();
  },
  template: `
    <div class="navbar" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #333; color: #fff;">
      <!-- Microphone emoticon -->
      <div class="microphone" style="font-size: 30px; color: yellow;">🎙 Hi Admin</div>

      <!-- Display user and creator counts -->
      <div class="user-creator-count" style="font-size: 18px;">
        <span>Total Users: {{ userCount }}</span>
        <span style="margin-left: 20px;">Total Creators: {{ creatorCount }}</span>
      </div>

      <!-- Logout button -->
      <button class="logout-button" @click="logout" style="background-color: #c0392b; color: #fff; border: none; padding: 8px 15px; cursor: pointer;">
        <span style="font-size: 20px;">🚫</span> Logout
      </button>
    </div>
  `
};
