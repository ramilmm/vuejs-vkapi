<template>
  <div class="hello">
  <section>
    <a href="#" class="scroll-down" @click='scrollTop'></a>
  </section>
  <ul>
    <li v-for='public in publics_id'>
      <input type="text" class="form-control" @keyup.enter='savePublic' data-pub='public' :value='"vk.com/public" + public'>
    </li>
  </ul>
  <pagination 
      :offset="offset"
      :perPage="perPage" 
      :current="currentPage"
      @page-changed="fetchPosts"></pagination>
    <div v-if='post.text || post.photo' class="panel panel-default" v-for='post in posts'>
    <div class="panel-heading">
      <img :src='post.public_photo' width="25px" height="25px">
      <h3 class="panel-title">
        <span>{{ post.public_name }}</span>
        <a  :href="post.link_to_post" target="_blank">{{ post.date }}</a>
        </h3>
      <div class="counters">
        <span class="glyphicon glyphicon-heart likes"><span class="counter">{{ post.likes }}</span></span>
        <span class="glyphicon glyphicon-retweet reposts"><span class="counter">{{ post.reposts }}</span></span>
      </div>
    </div>
    <div  class="panel-body">
      <span class="body__text" style="white-space: pre-wrap;word-wrap: word-break">{{ post.text }}</span> <br/>
      <div class="post__photo">
        <img v-if='post.photo' class="post__photo__item" :src='post.photo'>
      </div>
    </div>
  </div>
  <pagination 
      :offset="offset"
      :perPage="perPage" 
      :current="currentPage"
      @page-changed="fetchPosts"></pagination>
  </div>
</template>

<script>
import Pagination from './Pagination.vue'

VK.init({
    apiId:  5802349 // ID вашего приложения VK
});

export default {
  name: 'hello',
  data () {
    return {
      posts: [],
      publics_id: ['42045023','49439086','26808859','40070457'],
      perPage: 30,
      offset: 0,
      currentPage: 1
    }
  },
  methods: {
    fetchPosts: function(page) {
      this.apiCall(0,page)
      this.apiCall(1,page)
      this.apiCall(2,page)
      this.apiCall(3,page)

      function ArrayShuffle(a) {
        var d,
        c,
        b = a.length;
         while (b) {
          c = Math.floor(Math.random() * b);
          d = a[--b];
          a[b] = a[c];
          a[c] = d
         }
         return a;
      }
      ArrayShuffle(this.posts)
      this.currentPage = page
    },
    apiCall: function(p_id,page) {
      var arr = ''
      var buf = []
      var _this = this
      var myOption = {
          owner_id: '',
          count: this.perPage,
          offset: (page == 1) ? 0 : this.perPage*page,
          photo_sizes: 1,
          extended: 1,
          v: '5.62'
      }
      myOption.owner_id = -_this.publics_id[p_id]
      VK.api('wall.get', myOption, function(r) {
          arr = r.response.items;
          console.log('public: ' + myOption.owner_id)
          var __photo = '';
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].marked_as_ads == 0) {
              if(arr[i].attachments && arr[i].attachments[0].photo) {
                __photo = arr[i].attachments[0].photo.sizes[arr[i].attachments[0].photo.sizes.length - 1].src
              }else __photo = ''
              let date = new Date(arr[i].date*1000);
              let post_date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
              _this.posts.push({
                text: arr[i].text.replace(/\r?\n/g, '\n'),
                photo: __photo,
                date: post_date,
                reposts: arr[i].reposts.count,
                likes: arr[i].likes.count,
                link_to_post: 'https://vk.com/wall' + arr[i].from_id + '_' + arr[i].id,
                public_name: r.response.groups[0].name,
                public_photo: r.response.groups[0].photo_200
              })
            }
          }
       })
    },
    scrollTop: function() {
      window.scrollTo(0,0);
    },
    savePublic: function(e) {
      console.log('current value: ' + e.target.value)
      console.log('last value: ')
    },
    sort: function() {
      var pub_1 = [],pub_2 = [],pub_3 = [],pub_4 = []
      for (var i = 0; i < this.posts.length; i++) {
        console.log(this.posts[i])
        if (this.posts[i].from_id == '71190418') {
            pub_1.push(this.posts[i])
        }else if (this.posts[i].from_id == '37466869') {
          pub_2.push(this.posts[i])
        }else if (this.posts[i].from_id == '52870150') {
            pub_3.push(this.posts[i])
        }else if (this.posts[i].from_id == '41032556') {
          pub_4.push(this.posts[i])
        }
      }
      console.log('pub1: ' + pub_1)
      console.log('pub2: ' + pub_2)
      console.log('pub3: ' + pub_3)
      console.log('pub4: ' + pub_4)
    }
  },
  created() {
    this.fetchPosts(1);
  },
  components: {Pagination}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.panel {
    width: 57%;
    margin-left: 22%;
}
.panel-heading {
  display: flex;
}
.panel-heading small {
  padding-left: 25px;
}
.panel-title {
  padding-left: 1%;
  padding-top: 4px;
}
.panel-title a {
  margin-left: 10px;
}
.panel-body {
  text-align: left;
}
.counters {
  margin-left: 40%;
  padding-top: 4px;
}
.reposts {
  padding-left: 6px;
}
.counter {
  padding-left: 10px;
  font-size: 20px
}
.post__photo {
  padding-top: 20px;
}
.post__photo__item {
  width: 75%
}
.scroll-down {
  opacity: 1;
  -webkit-transition: all .5s ease-in 3s;
  transition: all .5s ease-in 3s;

}
a.scroll-down {
  position: fixed;
  z-index: 101;
}
.scroll-down {
  position: absolute;
    bottom: 30%;
    left: 10%;
    margin-left: -16px;
    display: block;
    width: 42px;
    height: 44px;
    border: 2px solid #000;
    background-size: 14px auto;
    border-radius: 50%;
    -webkit-animation: bounce 2s infinite 2s;
    animation: bounce 2s infinite 2s;
    -webkit-transition: all .2s ease-in;
    transition: all .2s ease-in;
}

.scroll-down:before {
    position: absolute;
    top: calc(50% - 3px);
    left: calc(50% - 6px);
    transform: rotate(135deg);
    display: block;
    width: 12px;
    height: 12px;
    content: "";
    border: 2px solid black;
    border-width: 0px 0 2px 2px;
}

@keyframes bounce {
  0%,
  100%,
  20%,
  50%,
  80% {
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
  }
  40% {
    -webkit-transform: translateY(-10px);
    -ms-transform: translateY(-10px);
    transform: translateY(-10px);
  }
  60% {
    -webkit-transform: translateY(-5px);
    -ms-transform: translateY(-5px);
    transform: translateY(-5px);
  }
}
</style>
