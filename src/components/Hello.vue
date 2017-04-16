<template>
  <div class="hello">
  <section>
    <a href="#" class="scroll-down" @click='scrollTop'></a>
    <div class="showAll">
      <a v-if="clicked" class="pagination__left" @click='showAll'>Показать все посты</a>
      <a v-if="!clicked" class="pagination__left" @click='filter'>Отфильтровать</a>
    </div>
  </section>
  <ul>
    <li v-for='public in publics_id'>
      <input type="text" class="form-control" @keyup.enter='savePublic' v-model='public.id' :value='"vk.com/public" + public.id'>
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
    <div v-if='post' class="panel-body">
      <span class="body__text" style="white-space: pre-wrap;word-wrap: word-break">{{ post.text }}</span> <br/>
      <div class="post__photo">
        <img @click='copy(post.photo)' v-if='post.photo' class="post__photo__item" :src='post.photo'>
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
      allPosts: [],
      clicked: true,
      publics_id: [
        {id:'71190418'},
        {id:'37466869'},
        {id:'52870150'},
        {id:'41032556'}
      ],
      perPage: 40,
      offset: 0,
      currentPage: 1
    }
  },
  methods: {
    fetchPosts: function(page) {
      if (!this.clicked) {
        this.clicked = true;
      }
      this.posts = []
      this.apiCall(0,page)
      this.apiCall(1,page)
      this.apiCall(2,page)
      this.apiCall(3,page)
  
      this.currentPage = page
    },
    mix: function(a) {
        var d,c,b = a.length;
         while (b) {
          c = Math.floor(Math.random() * b);
          d = a[--b];
          a[b] = a[c];
          a[c] = d
         }
         return a;
    },
    checkAdvert: function(str) {
      if (str.indexOf('club') != -1 || str.indexOf('vk.com') != -1  || str.indexOf('public') != -1  || str.indexOf('инстаграм') != -1 || str.indexOf('Инстаграм') != -1  || str.indexOf('подписывайся') != -1  || str.indexOf('подпишись') != -1  || str.indexOf('vk.cc') != -1 ) {
          return false;
      }else return true;
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
      myOption.owner_id = -_this.publics_id[p_id].id
      VK.api('wall.get', myOption, function(r) {
          arr = r.response.items;
          var __photo = '';
          for (var i = 0; i < arr.length; i++) {
            if (_this.checkAdvert(arr[i].text)) {
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
                public_id: arr[i].from_id * (-1),
                public_name: r.response.groups[0].name,
                public_photo: r.response.groups[0].photo_200
              })
            }
          }
          if (myOption.owner_id == -_this.publics_id[3].id) {
            _this.allPosts = _this.posts;
            setTimeout(function() {_this.sort()}, 400)
          }
       })
    },
    scrollTop: function() {
      window.scrollTo(0,0);
    },
    showAll: function() {
      this.posts = this.allPosts;
      this.mix(this.posts);
      this.clicked = !this.clicked;
    },
    filter: function() {
      this.clicked = !this.clicked;
      this.sort();
    },
    readCookie: function() {
     var result = document.cookie.match(new RegExp('pubs=([^;]+)'));
     result = decodeURIComponent(result[1]);
     result = result.split(':');
     for (var i = 0; i < result.length; i++) {
        this.publics_id[i].id = result[i];
     }
    },
    setCookie: function() {
      var value = this.publics_id[0].id + ":" + this.publics_id[1].id + ":" + this.publics_id[2].id + ":" + this.publics_id[3].id;
      var expires = "";
      var date = new Date();
      date.setTime(date.getTime() + (1000*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
      document.cookie = "pubs=" + value + expires + "; path=/";
    },
    sort: function() {
      var pub_1 = [],pub_2 = [],pub_3 = [],pub_4 = []
      for (var i = 0; i < this.posts.length; i++) {
        if (this.posts[i].public_id == this.publics_id[0].id) {
            pub_1.push(this.posts[i])
        }else if (this.posts[i].public_id == this.publics_id[1].id) {
          pub_2.push(this.posts[i])
        }else if (this.posts[i].public_id == this.publics_id[2].id) {
            pub_3.push(this.posts[i])
        }else if (this.posts[i].public_id == this.publics_id[3].id) {
          pub_4.push(this.posts[i])
        }
        }
        var pub_1_av = this.average(pub_1),
            pub_2_av = this.average(pub_2),
            pub_3_av = this.average(pub_3),
            pub_4_av = this.average(pub_4);

        var res = []
        for (var i = 0; i < this.posts.length; i++) {
          let post = this.posts[i]
          if (post.public_id == this.publics_id[0].id && post.likes > pub_1_av) {
              res.push(post)
          }else if (post.public_id == this.publics_id[1].id && post.likes > pub_2_av) {
              res.push(post)
          }else if (post.public_id == this.publics_id[2].id && post.likes > pub_3_av) {
              res.push(post)
          }else if (post.public_id == this.publics_id[3].id && post.likes > pub_4_av) {
              res.push(post)
          }
        }
        this.posts = res
        this.mix(this.posts)
    },
    average: function(arr) {
      var sum = 0;
        for (var i = 0; i < arr.length; i++ ) 
          sum += arr[i].likes;
        return sum == 0 ? sum : sum / arr.length;
    },
    copy: function(url) {
      if (window.clipboardData && window.clipboardData.setData) {
          // IE specific code path to prevent textarea being shown while dialog is visible.
          return clipboardData.setData("Text", url); 

      } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
          var textarea = document.createElement("textarea");
          textarea.textContent = url;
          textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
          document.body.appendChild(textarea);
          textarea.select();
          try {
              return document.execCommand("copy");  // Security exception may be thrown by some browsers.
          } catch (ex) {
              console.warn("Copy to clipboard failed.", ex);
              return false;
          } finally {
              document.body.removeChild(textarea);
          }
      }
    },
    savePublic: function() {
      this.setCookie();
      this.fetchPosts(1);
    }
  },
  created() {
    this.readCookie();
    this.fetchPosts(1);
    this.mix(this.posts);
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
  padding-left: 2%;
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
.showAll {
  position: fixed;
  height: 44px;
  display: flex;
  justify-content: space-between;
  margin: 30px auto 30px;
  padding: 0 15px;
  max-width: 1280px;
}

.pagination__left, .pagination__right {
  width: 20%;
}

.pagination__left {
  float: left;
  cursor: pointer;
}

.showAll a, .showAll span {
  display: block;
  text-align: center;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: 300;
  line-height: 42px;
  height: 44px;
  color: #999;
  font-size: 15px;
}

.showAll a {
  padding: 0 10px;
  width: 160px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ccc;
  text-decoration: none;
  margin: 0 41px;
  transition: all .2s ease-in-out;
}

.showAll a:hover, .showAll a.current {
  border-color: #ea4c89;
  color: #ea4c89;
}
a.show-all {
  position: fixed;
  color: black;
}
.show-all {
  position: absolute;
    bottom: 10%;
    left: 5%;
    display: block;
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
