<template>
  <div class="hello">
  <section>
    <a href="#" class="scroll-down" @click='scrollTop'></a>
    <div class="showAll">
      <a v-if="clicked" class="pagination__left" @click='showAll'>Показать все посты</a>
      <a v-if="!clicked" class="pagination__left" @click='filter'>Отфильтровать</a>
    </div>
     <div class="showAll filter">
      <a v-if="!filterChanged" class="pagination__left" @click='setDefaultFilter'>Отбор по лайкам</a>
      <a v-if="filterChanged" class="pagination__left" @click='changeFilter'>Отбор по охвату</a>
    </div>
  </section>
  <ul>
    <li>
      <input type="text" class="form-control" @keyup.enter='savePublic' v-model='publics_id.id' :value='"vk.com/public" + publics_id.id'>
    </li>
  </ul>
  <pagination 
      :offset="offset"
      :perPage="perPage" 
      :current="currentPage"
      @page-changed="fetchPosts"></pagination>
      <div class="top_menu_filter">
        <ul class="filter_list">
          <li><span>Сортировать по</span></li>
          <li class="filter_item" @click='sortBy("like")'>Лайкам</li>
          <li class="filter_item" @click='sortBy("views")'>Охвату</li>
          <!-- <li class="filter_item" @click='sortBy("date")'>Дате</li> -->
        </ul>
    </div>

    <i v-show="loading" class="fa fa-spinner fa-spin fa-3x"></i>
    <div v-if='post.text || post.photo' class="panel panel-default" v-for='post in posts'>
    <div class="panel-heading">
      <img :src='post.public_photo' width="25px" height="25px">
      <h3 class="panel-title">
        <span>{{ post.public_name }}</span>
        <a  :href="post.link_to_post" target="_blank">{{ post.date }}</a>
        </h3>
      <div class="counters">
        <span class="glyphicon glyphicon-heart likes"><span class="counter">{{ post.likes }}</span></span>
        <span class="glyphicon glyphicon-eye-open reposts"><span class="counter">{{ post.views }}</span></span>
      </div>
    </div>
    <div v-if='post' class="panel-body">
      <span class="body__text">{{ post.text }}</span> <br/>
      <div class="post__photo" v-if='post.photo.length == 1'>
        <img @click='copy(p)' v-for='p in post.photo' v-if='p' class="post__photo__item" :src='p'>
      </div>
      <div class="post__photo multiple" 
           v-if='post.photo.length != 1'
           :style="{ minHeight: post.photo_size + 'px'}">
        <img @click='copy(p)'
          v-for='(p,index) in post.photo'
          v-if='p' 
          v-bind:class="[index == 0 ? 'first' : '', 'post__photo__item','multiple_photo']"
          :src='p'
          :style='{
            left: index*1 + "%",
            top: index*1 + "%",
            zIndex: 20 - index
            }'
        />
      </div>
      <!-- <div class="post__photo">
        <img @click='copy(post.photo)' v-if='post.photo' class="post__photo__item" :src='post.photo'>
      </div> -->
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
      loading: false,
      posts: [],
      allPosts: [],
      clicked: true,
      filterChanged: true,
      publics_id: {
        id:'73899416'
      },
      perPage: 120,
      offset: 0,
      currentPage: 1,
      last_active: ''
    }
  },
  methods: {
    fetchPosts(page) {
      if (!this.clicked) {
        this.clicked = true;
      }
      this.posts = []
      this.loading = true;
      this.apiCall(page)
  
      this.currentPage = page
    },
    mix(a) {
        var d,c,b = a.length;
         while (b) {
          c = Math.floor(Math.random() * b);
          d = a[--b];
          a[b] = a[c];
          a[c] = d
         }
         return a;
    },
    checkAdvert(str,post) {
      if (post.is_pinned == 1 || str.indexOf('Али') != -1 || str.indexOf('club') != -1 || str.indexOf('vk.com') != -1  || str.indexOf('public') != -1  || str.indexOf('инстаграм') != -1 || str.indexOf('Инстаграм') != -1  || str.indexOf('подписывайся') != -1  || str.indexOf('подпишись') != -1  || str.indexOf('vk.cc') != -1 ) {
          return false;
      }else return true;
    },
    apiCall(page) {
      var arr = ''
      var buf = []
      var _this = this
      var myOption = {
          owner_id: '',
          count: this.perPage,
          offset: (page == 1) ? 0 : this.perPage*page,
          photo_sizes: 1,
          extended: 1,
          access_token: '44be9cbe44be9cbe449b81dd6544e615d3444be44be9cbe1c7596424c532a7cfb15cc00',
          v: '5.67'
      }
      myOption.owner_id = -_this.publics_id.id
      VK.api('wall.get', myOption, function(r) {
          arr = r.response.items;
          var __photo = [];
          for (var i = 0; i < arr.length; i++) {
             let size = ''
              if (_this.checkAdvert(arr[i].text,arr[i])) {
                if ( arr[i].attachments) {
                  for (var j = 0; j < arr[i].attachments.length; j++) {
                    if (arr[i].attachments[j].type == 'photo') {
                      __photo.push(
                          arr[i].attachments[j].photo.sizes[arr[i].attachments[j].photo.sizes.length - 1].src
                        )
                      let height = parseInt(arr[i].attachments[j].photo.sizes[arr[i].attachments[j].photo.sizes.length - 1].height)
                      let width = parseInt(arr[i].attachments[j].photo.sizes[arr[i].attachments[j].photo.sizes.length - 1].width)
                      size = Math.round(height/(width/553));
                      size = Math.round(size + (size/100)*10);
                    }
                  }
                }
                let view_count;
                if (arr[i].views) {
                  view_count = arr[i].views.count;
                }else {
                  view_count = 0;
                }
                //TODO: find the biggest size by cycle and put it into size
                  let date = new Date(arr[i].date*1000);
                  let post_date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                  _this.posts.push({
                    text: arr[i].text.replace(/\r?\n/g, '\n'),
                    photo: __photo,
                    date_to_sort: date,
                    date: post_date,
                    reposts: arr[i].reposts.count,
                    likes: arr[i].likes.count,
                    views: view_count,
                    link_to_post: 'https://vk.com/wall' + arr[i].from_id + '_' + arr[i].id,
                    public_id: arr[i].from_id * (-1),
                    public_name: r.response.groups[0].name,
                    public_photo: r.response.groups[0].photo_200,
                    photo_size: size
                  })
                  __photo = [];
                  size = '';
                }
               }
               _this.loading = false;
                _this.allPosts = _this.posts;
                setTimeout(() => {_this.sort()}, 400);
       })
    },
    scrollTop() {
      window.scrollTo(0,0);
    },
    showAll() {
      this.posts = this.allPosts;
      this.mix(this.posts);
      this.clicked = !this.clicked;
    },
    filter() {
      this.clicked = !this.clicked;
      this.sort();
      this.mix(this.posts);
    },
    changeFilter() {
      this.filterChanged = !this.filterChanged;
        var pub_1 = [];
        for (var i = 0; i < this.allPosts.length; i++) {
              pub_1.push(this.allPosts[i]);
        }
        var pub_1_av = this.average(pub_1);
        var res = [];
        for (var i = 0; i < this.allPosts.length; i++) {
          let post = this.allPosts[i];
          if (post.likes > pub_1_av) {
              res.push(post);
          }
        }
        this.posts = res;
        this.mix(this.posts);
      },
    setDefaultFilter() {
        this.filterChanged = !this.filterChanged;
        this.sort();
        this.mix(this.posts);
    },
    readCookie() {
     var result = document.cookie.match(new RegExp('one_pub=([^;]+)'));
     if (result == undefined || result == '') {
        console.log('set up cookie')
        this.setCookie();
        this.readCookie();
     }else {
        console.log('reading cookies')
        result = decodeURIComponent(result[1]);
        result = result.split(':');
        this.publics_id.id = result[0];
        this.fetchPosts(1);
    }
    },
    setCookie() {
      var value = this.publics_id.id;
      var expires = "";
      var date = new Date();
      date.setTime(date.getTime() + (1000*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
      document.cookie = "one_pub=" + value + expires + "; path=/";
      console.log('set up cookie')
    },
    sort() {
        var pub_1 = [];
        for (var i = 0; i < this.allPosts.length; i++) {
              pub_1.push(this.allPosts[i]);
        }
        var pub_1_av = this.average(pub_1);
        var res = [];
        for (var i = 0; i < this.allPosts.length; i++) {
          let post = this.allPosts[i];
          if (post.likes > pub_1_av) {
              res.push(post);
          }
        }
        this.posts = res;
        this.mix(this.posts);
    },
    average(arr) {
      var sum = 0;
        for (var i = 0; i < arr.length; i++ ) 
          sum += arr[i].likes;
        return sum == 0 ? sum : sum / arr.length;
    },
    copy(url) {
      if (event.target.className.indexOf('multiple_photo') != -1 && event.target.className.indexOf('first') != -1) {
          event.target.style.left = '-1000px';
          event.target.style.transition = 'all .7s ease-in-out';
          // event.target.classList.remove('first');
          // event.target.style.zIndex = '0';
          let next_element = event.target.nextSibling;
          if (next_element != null) {
            next_element.classList.add('first');
          }
      }
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
    savePublic() {
      this.setCookie();
      this.fetchPosts(this.currentPage);
    },
    sortBy(by_this) {
      if (this.last_active && this.last_active.classList.value.indexOf('active_item') !== -1 ) {
        this.last_active.classList.remove('active_item');
      }
      event.target.classList.add('active_item');
      this.last_active = event.target;
      switch(by_this){
        case 'like': 
          this.posts.sort((a,b) => (parseInt(b.likes) - parseInt(a.likes)));
          this.allPosts.sort((a,b) => (parseInt(b.likes) - parseInt(a.likes)));
          break;
        case 'repost':
          this.posts.sort((a,b) => (parseInt(b.reposts) - parseInt(a.reposts)));
          this.allPosts.sort((a,b) => (parseInt(b.reposts) - parseInt(a.reposts)));
          break;
       case 'views':
          this.posts.sort((a,b) => (parseInt(b.views) - parseInt(a.views)));
          this.allPosts.sort((a,b) => (parseInt(b.views) - parseInt(a.views)));
          break;
        default:
          break;
      }
    }
  },
  created() {
    this.readCookie();
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
.top_menu_filter {
  width: 57%; 
  margin-left: 22%;
}
.filter_list {
  margin-left: -40%;
  margin-top: 1%;
}
.filter_item {
  border: 1px solid #CCCCCC;
  border-radius: 8%;
  padding: 10px;
  font-size: 16px; 
  cursor:  pointer;
}
.filter_item:hover {
  border: 1px solid #EA4C89;
  color: #EA4C89;
}
.active_item {
  border-color: #EA4C89;
  color: #EA4C89;
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
  position: relative;
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
.body__text {
  white-space: pre-wrap;
  word-wrap: word-break;
}
.post__photo {
  position: relative;
  padding-top: 2%;
}
.post__photo__item {
  width: 75%
}
.multiple_photo {
  margin-top: 1.5em;
  position: absolute;
  box-shadow: 3px 0 3px -2px #6f6868;
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
.filter {
  margin-top: 6.3%;
}
@media (max-width: 799px) and (min-width: 300px) { 
  .showAll {
    display: none;
  }
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
