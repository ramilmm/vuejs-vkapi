<template>
  <div class="hello">
  <section>
    <modal
      :show="showModal"
      :publics_id="publics_id"
      @close="showModal = false"
      @save="savePublic(publics_id)"
      ></modal>
    <a id="show-modal" @click="showModal = true" class="add_publics_btn">Обновить список пабликов</a>
    <a href="#" class="scroll-down" @click='scrollTop'></a>
    <div class="showAll">
      <a v-if="clicked" class="pagination__left" @click='showAll'>Показать все посты</a>
      <a v-if="!clicked" class="pagination__left" @click='filter'>Отфильтровать</a>
    </div>
    <div class="showAll filter">
      <a v-if="!filterChanged" class="pagination__left" @click='setDefaultFilter'>Отбор по лайкам</a>
      <a v-if="filterChanged" class="pagination__left" @click='changeFilter'>Отбор по охвату</a>
    </div>
    <div class="fitlerByPublic">
      <a class="pagination__left" @click='filterByPublic'>Отфильтровать по паблику</a>
      <a class="pagination__left" @click='returnSourceFilter'>Отмена</a>
    </div>
  </section>
  <!-- <ul>
    <li v-for='public in publics_id'>
      <input type="text" class="form-control" @keyup.enter='savePublic' v-model='public.id' :value='"vk.com/public" + public.id'>
    </li>
  </ul> -->
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
          <li class="filter_item" @click='sortBy("lpa")'>LPA</li>
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
        <!-- <span class="glyphicon glyphicon-eye-open reposts"><span class="counter">{{ post.like_per_average }}</span></span> -->
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
import Pagination from './Pagination.vue';
import Modal from './Modal.vue';

if (navigator.userAgent.toLowerCase().indexOf('iphone') != -1) {
  window.location.href = "http://vk-autopost.tk:8081";
}

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
      publics_id: [
        {name: 'Moréna.🍃',id:'71190418'},
        {name: 'Sabr.',id:'37466869'},
        {name: '365 new days',id:'52870150'},
        {name: 'mimishka...🌸',id:'41032556'},
      ],
      publics_info : [],
      mypublic_id: '71190418',
      perPage: 40,
      offset: 0,
      currentPage: 1,
      last_active: '',
      showModal: false
    }
  },
  methods: {
    fetchPosts(page) {
      this.getPublicInfo();
      if (!this.clicked) {
        this.clicked = true;
      }
      if (!this.filterChanged) {
        this.filterChanged = true;
      }
      this.executeQuery(page);
      this.currentPage = page;
      this.removeHighlight();

    },
    removeHighlight() {
      var elements = document.getElementsByClassName('filter_item');
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove('active_item');
      }
    },
    clear() {
      for (var i = 0; i < this.posts.length; i++) {
        for (var j = 0; j < this.posts.length; j++) {
          if (this.posts[i].id == this.posts[j].id) {
            this.posts[i].splice(j, 1);
            console.log('DELETED');
          }
        }
      }
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
    parseResponse(response) {
      var arr = response;
      var buf = [];
      var _this = this;
      _this.posts = [];
      _this.allPosts = [];
      var __photo = [];
      for (var i = 0; i < arr.length; i++) {
         let size = '';
          if (_this.checkAdvert(arr[i].text,arr[i])) {
            if ( arr[i].attachments) {
              for (var j = 0; j < arr[i].attachments.length; j++) {
                if (arr[i].attachments[j].type == 'photo') {
                  __photo.push(
                      arr[i].attachments[j].photo.sizes[arr[i].attachments[j].photo.sizes.length - 1].src
                    );
                  let height = parseInt(arr[i].attachments[j].photo.sizes[arr[i].attachments[j].photo.sizes.length - 1].height);
                  let width = parseInt(arr[i].attachments[j].photo.sizes[arr[i].attachments[j].photo.sizes.length - 1].width);
                  //TODO: EDIT THIS ALGORITHM 
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
              let date = new Date(arr[i].date*1000);
              let post_date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
              _this.posts.push({
                id: arr[i].id,
                text: arr[i].text.replace(/\r?\n/g, '\n'),
                photo: __photo,
                date_to_sort: date,
                date: post_date,
                reposts: arr[i].reposts.count,
                likes: arr[i].likes.count,
                views: view_count,
                link_to_post: 'https://vk.com/wall' + arr[i].from_id + '_' + arr[i].id,
                public_id: arr[i].from_id * (-1),
                public_name: _this.publics_info.find(o => o.id == (-1)*arr[i].from_id).name,
                public_photo: _this.publics_info.find(o => o.id == (-1)*arr[i].from_id).photo_200,
                photo_size: size,
                like_per_average: ''
              })
              __photo = [];
              size = '';
            }
          }
          _this.loading = false;
          _this.allPosts = _this.posts;
          _this.sort();
          console.log('prepared posts: ', _this.posts)    
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
          var buf = [],result = [];
        for (var i = 0; i < this.publics_id.length; i++) {
          for (var j = 0; j < this.allPosts.length; j++) {
            if (this.allPosts[j].public_id == this.publics_id[i].id) {
              buf.push(this.allPosts[j]);
            }
            if (j == this.allPosts.length - 1) {
              let average = this.average(buf,'views');
              for (var k = 0; k < this.allPosts.length; k++) {
                if (this.allPosts[k].public_id == this.publics_id[i].id && this.allPosts[k].views > average) {
                  result.push(this.allPosts[k]);
                }
              }
            }
          }
          buf = [];
        }
        this.posts = result;
        this.mix(this.posts);
      },
    setDefaultFilter() {
        this.filterChanged = !this.filterChanged;
        this.sort();
        this.mix(this.posts);
    },
    readCookie() {
     var result = document.cookie.match(new RegExp('pubs=([^;]+)'));
     if (result == undefined || result == '') {
        console.log('set up cookie')
        this.setCookie();
        this.readCookie();
     }else {
        console.log('reading cookies')
        result = decodeURIComponent(result[1]);
        result = result.split(':');
        for (var i = 0; i < result.length; i++) {
          if (i >= this.publics_id.length) {
            this.publics_id.push({ id: result[i] });
          }else { 
            this.publics_id[i].id = result[i];
          }
        }
        this.fetchPosts(1);
    }
    },
    setCookie() {
      var value = '';
      for (var i = 0; i <= this.publics_id.length - 1; i++) {
        value = value.concat(this.publics_id[i].id);
        if (i != this.publics_id.length - 1) {
          value = value.concat(":");
        }
      }
      var expires = "";
      var date = new Date();
      date.setTime(date.getTime() + (1000*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
      document.cookie = "pubs=" + value + expires + "; path=/";
      console.log('set up cookie')
    },
    sort() {
      var buf = [],result = [];
      for (var i = 0; i < this.publics_id.length; i++) {
        for (var j = 0; j < this.allPosts.length; j++) {
          if (this.allPosts[j].public_id == this.publics_id[i].id) {
            buf.push(this.allPosts[j]);
          }
          if (j == this.allPosts.length - 1) {
            let average = this.average(buf,'likes');
            for (var k = 0; k < this.allPosts.length; k++) {
              if (this.allPosts[k].public_id == this.publics_id[i].id && this.allPosts[k].likes > average) {
                this.allPosts[k].like_per_average = this.allPosts[k].likes/average;
                result.push(this.allPosts[k]);
              }
            }
          }
        }
        buf = [];
      }
        this.posts = result;
        this.mix(this.posts);
    },
    average(arr,type) {
      var sum = 0;
        for (var i = 0; i < arr.length; i++ ) 
          if (type === 'likes') {
            sum += arr[i].likes;
          }else sum += arr[i].views;
        return sum == 0 ? sum : sum / arr.length;
    },
    copy(url) {
      if (event.target.className.indexOf('multiple_photo') != -1 && event.target.className.indexOf('first') != -1) {
          // event.target.style.left = '-1000px';
          // event.target.style.transition = 'all .56s ease-in-out';
          event.target.classList.remove('first');
          event.target.style.zIndex = '0';
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
    savePublic(publics_id) {
      this.publics_id = publics_id;
      this.getPublicInfo();
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
        case 'lpa':
          this.posts.sort((a,b) => (parseFloat(b.like_per_average) - parseFloat(a.like_per_average)));
          this.allPosts.sort((a,b) => (parseFloat(b.like_per_average) - parseFloat(a.like_per_average)));
        default:
          break;
      }
    },
    executeQuery(page) {
      const _this = this;
      _this.posts = [];
      var publics = '';
        for (var i = 0; i <= this.publics_id.length - 1; i++) {
          publics = publics.concat(this.publics_id[i].id);
          if (i != this.publics_id.length - 1) {
            publics = publics.concat(":");
          }
        }
      let size = _this.publics_id.length;
      var myOption = {
            count: _this.perPage,
            offset: (page == 1) ? 0 : _this.perPage*page,
            photo_sizes: 1,
            extended: 1,
            access_token: '3192b4e8bce78bb9a9622b54941710405f8213557503c62a69110dabaee965eba5905113aa8c6996a62dd',
            v: '5.69'
        }
        let count = 1;
      var code =  'var posts = API.wall.get({"owner_id": ' + -_this.publics_id[0].id + ', "v":' + myOption.v + ', "extended":' + myOption.extended + ', "count":' + _this.perPage + ', "offset": ' + myOption.offset + ', "photo_sizes":' + myOption.photo_sizes + ', "access_token": ' + '\"' + myOption.access_token + '\"' + '}).items;'
              + 'var i = 1;'
              + 'var publics_id =\"' + publics + '\";'
              + 'while (i < ' + size + ') {'
                + 'posts = posts + API.wall.get({"owner_id": -publics_id.split(\":\")[i], "v":' + myOption.v + ', "extended":' + myOption.extended + ', "count":' + _this.perPage + ', "offset": ' + myOption.offset + ', "photo_sizes":' + myOption.photo_sizes + ', "access_token": ' + '\"' + myOption.access_token + '\"' + '}).items;'
              +   'i = i + 1;'
              + '};'
              + 'return posts;'; 
              _this.loading = true;
              VK.Api.call("execute", {code: code, access_token: myOption.access_token}, function(data) {
                console.log(data);
                if (data.response) {
                    _this.parseResponse(data.response);
                    console.log('Загрузка: ' + _this.allPosts.length + '/' + _this.publics_id.length*_this.perPage);
                } else {
                    alert(data.error.error_msg);
                }
            });
    },
    getPublicInfo() {
      var _this = this;
      var publics = '';
      for (var i = 0; i <= this.publics_id.length - 1; i++) {
        publics = publics.concat(this.publics_id[i].id);
        if (i != this.publics_id.length - 1) {
          publics = publics.concat(",");
        }
      }
      var myOption = {
          group_ids: publics,
          access_token: '44be9cbe44be9cbe449b81dd6544e615d3444be44be9cbe1c7596424c532a7cfb15cc00',
          v: '5.69',
          fields: 'id,name,photo_200'
      }
      VK.api("groups.getById", myOption, function(data) {
         _this.publics_info = data.response;
         _this.parsePubs();
      });
  
    },
    parsePubs() {
      for (var i = 0; i < this.publics_id.length; i++) {
        for (var k = 0; k < this.publics_info.length; k++) {
           if (parseInt(this.publics_id[i].id) == this.publics_info[k].id) {
              this.publics_id[i].name = this.publics_info[k].name;
           }
        }
      }
    },
    filterByPublic() {
      var _this = this;
      var myOption = {
            owner_id: -_this.mypublic_id,
            count: 675,
            offset: 0,
            access_token: '44be9cbe44be9cbe449b81dd6544e615d3444be44be9cbe1c7596424c532a7cfb15cc00',
            v: '5.69'
        }

        VK.api("wall.get", myOption, function(data) {
          console.log('response: ',data.response.items.length);
          for (var i = 0; i < _this.allPosts; i++) {
            for (var j = 0; j < data.response.items; j++) {
              if (_this.allPosts[i].text == data.response[j].items.text) {
                console.log('text: ',data.response[j].items.text);
              }
            }
          }
        });

    },
    returnSourceFilter() {
      console.log('return');
    },
  },
  created() {
    let _this = this;
    this.readCookie();
    setTimeout(function () { _this.fetchPosts(1) },500);
  },
  components: {Pagination, Modal}
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
.fitlerByPublic {
  margin-top: 12.3%;
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
.add_publics_btn {
  cursor: pointer;
  color: #999;
  padding: 0 20px;
  max-width: 160px;
  background-color: transparent;
  border-radius: 6px;
  border: 1px solid #ccc;
  text-decoration: none;
  margin: 0 6px;
  transition: all .2s ease-in-out;
  text-align: center;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: 300;
  line-height: 42px;
  height: 44px;
  font-size: 22px;
}
.add_publics_btn:hover {
  border-color: #ea4c89;
  color: #ea4c89;
}
</style>
